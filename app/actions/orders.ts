"use server"
import { createSessionClient } from "@/lib/appwrite";
import { ID, Models, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
        revalidatePath(path);
        return orders.documents;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}