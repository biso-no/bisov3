import { getOrder } from '@/app/actions/orders'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order: any = await getOrder(id)
  if (!order) return notFound()

  const items = (() => { try { return JSON.parse(order.items_json || '[]') } catch { return [] } })() as any[]

  return (
    <div className="p-4 grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Order {order.$id}</CardTitle>
          <CardDescription>Placed {new Date(order.$createdAt).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge>{order.status}</Badge>
          </div>
          <div className="text-sm">
            <div>Buyer: {order.buyer_name || 'Guest'}</div>
            <div>Email: {order.buyer_email || '-'}</div>
            <div>Phone: {order.buyer_phone || '-'}</div>
          </div>
          <div className="text-sm">
            <div>Subtotal: {Number(order.subtotal || 0).toFixed(2)} NOK</div>
            <div>Discount: {Number(order.discount_total || 0).toFixed(2)} NOK</div>
            <div className="font-medium">Total: {Number(order.total || 0).toFixed(2)} NOK</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((it) => (
            <div key={it.product_id} className="flex justify-between text-sm">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-muted-foreground">x{it.quantity}</div>
              </div>
              <div>{Number(it.unit_price).toFixed(2)} NOK</div>
            </div>
          ))}
          {items.length === 0 ? <div className="text-sm text-muted-foreground">No items</div> : null}
        </CardContent>
      </Card>
    </div>
  )
}


