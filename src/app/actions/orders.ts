"use server"
import { createSessionClient, createAdminClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { createVippsCheckout } from "@/lib/vipps";
import { getProductBySlug } from "@/app/actions/products";
import { getLocale } from "@/app/actions/locale";
import { redirect } from "next/navigation";
import { OrderItem } from "@/lib/types/order";


export async function getOrders({
    limit = 100,
    userId = '',
    status = '',
    path = '/admin/shop/orders',
  }: {
    limit?: number;
    offset?: number;
    search?: string;
    userId?: string;
    status?: string;
    path?: string;
  }) {
    const { db } = await createSessionClient();
    try {
        let query = [Query.limit(limit)];
        if (userId) {
            query.push(Query.equal('userId', userId));
        }
        if (status) {
            query.push(Query.equal('status', status));
        }
        query.push(Query.orderDesc('$createdAt'));
        const orders = await db.listDocuments(
            'app',
            'orders',
            query
        );
        return orders.documents;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

export async function getOrder(id: string) {
    const { db } = await createSessionClient();
    try {
        const order = await db.getDocument('app', 'orders', id)
        return order
    } catch (error) {
        console.error('Error fetching order:', error);
        return null
    }
}

async function getMemberDiscountIfAny(product: any) {
    try {
        if (!product?.member_discount_enabled || !product?.member_discount_percent) return { applied: false, percent: 0 }
        const { account, db, functions } = await createSessionClient()
        const user = await account.get().catch(() => null)
        if (!user?.$id) return { applied: false, percent: 0 }
        const profile = await db.getDocument('app', 'user', user.$id).catch(() => null)
        const studentId = profile?.student_id
        if (!studentId) return { applied: false, percent: 0 }
        const exec = await functions.createExecution('verify_biso_membership', String(studentId), false)
        const res = JSON.parse((exec as any).responseBody || '{}')
        const isActive = !!res?.membership?.status
        if (!isActive) return { applied: false, percent: 0 }
        return { applied: true, percent: Number(product.member_discount_percent) || 0 }
    } catch {
        return { applied: false, percent: 0 }
    }
}

export interface CheckoutData {
    slug: string
    name: string
    email: string
    phone?: string
    quantity?: number
}

export async function createCheckoutSession(data: CheckoutData) {
    try {
        const { slug, name, email, phone, quantity = 1 } = data
        const locale = await getLocale()
        const product = await getProductBySlug(slug, locale)
        
        if (!product || !product.price) {
            throw new Error('Product not found')
        }

        const qty = Math.max(1, Number(quantity || 1))
        const discount = await getMemberDiscountIfAny(product)
        const unitPrice = Number(product.price)
        const discountedUnit = discount.applied ? Math.max(0, unitPrice * (1 - discount.percent / 100)) : unitPrice
        const subtotal = discountedUnit * qty
        const total = subtotal

        // Create pending order
        const { db } = await createAdminClient()
        const orderData: any = {
            status: 'pending',
            currency: 'NOK',
            subtotal,
            discount_total: discount.applied ? unitPrice * qty - subtotal : 0,
            total,
            buyer_name: name || 'Guest',
            buyer_email: email || '',
            buyer_phone: phone || '',
            membership_applied: discount.applied,
            member_discount_percent: discount.applied ? discount.percent : 0,
            items_json: JSON.stringify([
                {
                    product_id: product.$id,
                    product_slug: product.slug,
                    title: product.title || product.slug,
                    unit_price: discountedUnit,
                    quantity: qty,
                } as OrderItem,
            ]),
            campus_id: product.campus_id,
        }
        
        const order = await db.createDocument('app', 'orders', 'unique()', orderData)

        // Create Vipps checkout using the SDK
        const vippsCheckout = await createVippsCheckout({
            amount: Math.round(total * 100),
            reference: order.$id,
            paymentDescription: `${product.title || product.slug} x ${qty}`,
            email: email,
            firstName: name.split(' ')[0] || name,
            lastName: name.split(' ').slice(1).join(' ') || '',
            phoneNumber: phone || '',
            orderId: order.$id,
        })

        if (vippsCheckout.ok) {
            // Update order with Vipps session info
            await db.updateDocument('app', 'orders', order.$id, {
                vipps_session_id: vippsCheckout.data.token,
                vipps_payment_link: vippsCheckout.data.checkoutFrontendUrl
            })

            return {
                success: true,
                paymentUrl: vippsCheckout.data.checkoutFrontendUrl,
                orderId: order.$id,
            }
        } else {
            // Handle Vipps checkout failure
            console.error('Vipps checkout failed:', vippsCheckout)
            return {
                success: false,
                error: 'Failed to create Vipps checkout session',
            }
        }

    } catch (error) {
        console.error('Checkout session error', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Internal error',
        }
    }
}

export async function startCheckout(data: CheckoutData) {
    const result = await createCheckoutSession(data)
    console.log("Result", JSON.stringify(result, null, 2))
    
    if (!result) {
        console.log("Error: createCheckoutSession returned undefined")
        throw new Error('Failed to create checkout session - no result returned')
    }
    
    if (result.error) {
        console.log("Error creating checkout session", JSON.stringify(result, null, 2))
        throw new Error(result.error || 'Failed to create checkout session')
    }
    
    if (!result.paymentUrl) {
        console.log("Error: No payment URL in result", JSON.stringify(result, null, 2))
        throw new Error('No payment URL received from checkout session')
    }
    
    redirect(result.paymentUrl)
}

export async function getCheckoutStatus(orderId: string) {
    try {
        const { db } = await createAdminClient()
        const order = await db.getDocument('app', 'orders', orderId)
        
        if (!order.vipps_session_id) {
            return { success: false, error: 'No Vipps session found' }
        }

        const { getVippsCheckout } = await import('@/lib/vipps')
        const vippsStatus = await getVippsCheckout(orderId)
        
        return {
            success: true,
            order,
            vippsStatus,
        }
    } catch (error) {
        console.error('Error getting checkout status:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get checkout status',
        }
    }
}