import { getProductBySlug } from '@/app/actions/products'
import { notFound } from 'next/navigation'
import { getLocale } from '@/app/actions/locale'
import { startCheckout } from '@/app/actions/orders'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

async function handleCheckout(slug: string, formData: FormData) {
  'use server'
  const name = String(formData.get('name') || '')
  const email = String(formData.get('email') || '')
  const phone = String(formData.get('phone') || '')
  const quantity = Math.max(1, Number(formData.get('quantity') || 1))
  
  await startCheckout({
    slug,
    name,
    email,
    phone,
    quantity,
  })
}

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug, await getLocale())
  if (!product) return notFound()

  const unitPrice = Number(product.price || 0)
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-muted-foreground">Complete your purchase securely with Vipps or card.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Contact details</CardTitle>
            <CardDescription>We’ll send your receipt to this email.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleCheckout.bind(null, slug)} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required placeholder="Your name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+47 9x xx xx xx" />
              </div>
              <div className="grid gap-2 max-w-32">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min={1} defaultValue={1} />
              </div>
              <CardFooter className="px-0">
                <Button type="submit" className="w-full">Pay with Vipps or Card</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
            <CardDescription>Review your product before paying.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {product.image || product.images?.[0] ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                  <Image src={product.image || product.images![0]} alt={product.title || product.slug} fill className="object-cover" />
                </div>
              ) : null}
              <div className="min-w-0">
                <div className="truncate font-medium">{product.title || product.slug}</div>
                <div className="text-sm text-muted-foreground">Unit price: {unitPrice.toFixed(2)} NOK</div>
              </div>
            </div>
            <div className="border-t pt-4 text-sm text-muted-foreground">
              Pickup only. No shipping available.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


