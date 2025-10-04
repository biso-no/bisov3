import { Models } from 'node-appwrite'

export type OrderStatus = 'pending' | 'authorized' | 'paid' | 'cancelled' | 'failed' | 'refunded'

export interface OrderItem {
  product_id: string
  product_slug?: string
  title?: string
  unit_price: number
  quantity: number
}

export interface Order extends Models.Document {
  status: OrderStatus
  userId?: string
  buyer_name?: string
  buyer_email?: string
  buyer_phone?: string
  currency: 'NOK'
  subtotal: number
  discount_total?: number
  total: number
  items?: OrderItem[]
  items_json?: string
  campus_id?: string
  membership_applied?: boolean
  member_discount_percent?: number
  vipps_session_id?: string
  vipps_order_id?: string
  vipps_payment_link?: string
  vipps_receipt_url?: string
}


