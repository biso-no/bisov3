"use client"

import { FormEvent, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCartStore, cartSelectors } from "@/lib/stores/cart"
import { startCartCheckout } from "@/app/actions/orders"

const NOK = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK" })

export function CheckoutPageClient() {
  const items = useCartStore((state) => state.items)
  const subtotal = useCartStore((state) => cartSelectors.subTotal(state))
  const clear = useCartStore((state) => state.clear)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required")
      return
    }

    startTransition(async () => {
      try {
        const payload = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          items: items.map((item) => ({
            productId: item.productId,
            slug: item.slug,
            quantity: item.quantity,
            variationId: item.variation?.id,
            customFields: item.customFieldResponses || {},
            customFieldLabels: item.customFields?.reduce<Record<string, string>>((acc, field) => {
              acc[field.id] = field.label
              return acc
            }, {})
          })),
        }

        const result = await startCartCheckout(payload)
        if (!result?.success || !result.paymentUrl) {
          toast.error(result?.error || "Could not start checkout")
          return
        }

        clear()
        window.location.href = result.paymentUrl
      } catch (error) {
        console.error("Checkout error", error)
        toast.error("Unable to start checkout. Please try again.")
      }
    })
  }

  if (items.length === 0) {
    return (
      <Card className="mx-auto max-w-2xl text-center">
        <CardHeader>
          <CardTitle>No items to checkout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Your cart is empty. Add items from the shop to continue.</p>
          <Button asChild>
            <Link href="/shop">Back to shop</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="checkout-name" className="text-sm font-medium">
                Full name
              </label>
              <Input
                id="checkout-name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="checkout-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="checkout-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="checkout-phone" className="text-sm font-medium">
                Phone (optional)
              </label>
              <Input
                id="checkout-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+47 9x xx xx xx"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Starting checkout..." : "Pay with Vipps or card"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{item.title}</div>
                    {item.variation?.name ? (
                      <div className="text-xs text-muted-foreground">{item.variation.name}</div>
                    ) : null}
                    {item.customFields && item.customFields.length > 0 ? (
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        {item.customFields.map((field) => (
                          <li key={field.id}>
                            <span className="font-medium text-foreground">{field.label}:</span> {field.value}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <div className="text-right text-sm">
                    <div>{NOK.format(item.unitPrice)}</div>
                    <div className="text-xs text-muted-foreground">Qty {item.quantity}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{NOK.format(subtotal)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Discounts and membership benefits will apply automatically if eligible. You will be redirected to Vipps to
            complete the payment.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild variant="outline" className="w-full">
            <Link href="/shop/cart">Back to cart</Link>
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
