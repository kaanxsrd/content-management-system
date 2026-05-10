'use client'

import { useState, useTransition, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Icons } from '@/components/icons'
import { useCustomerIdentityStore } from '@/features/shop/store/customer'
import type { Order } from '@/features/orders/api/types'

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Pending: 'outline',
  Confirmed: 'secondary',
  Shipped: 'default',
  Delivered: 'default',
  Cancelled: 'destructive'
}

const STATUS_ORDER = ['Pending', 'Confirmed', 'Shipped', 'Delivered']

const STATUS_META: Record<string, { label: string; description: string }> = {
  Pending: { label: 'Order Placed', description: 'We received your order' },
  Confirmed: { label: 'Confirmed', description: 'Your order is being prepared' },
  Shipped: { label: 'Shipped', description: 'On its way to you' },
  Delivered: { label: 'Delivered', description: 'Enjoy your purchase!' }
}

export default function ShopOrdersPage() {
  return (
    <Suspense>
      <ShopOrders />
    </Suspense>
  )
}

function ShopOrders() {
  const params = useParams<{ org: string }>()
  const searchParams = useSearchParams()
  const org = params.org
  const storedEmail = useCustomerIdentityStore((s) => s.email)

  const initialEmail = searchParams.get('email') ?? storedEmail ?? ''
  const [email, setEmail] = useState(initialEmail)
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [isPending, startTransition] = useTransition()

  async function fetchOrders(lookupEmail: string) {
    const res = await fetch(`/api/shop/orders?email=${encodeURIComponent(lookupEmail)}`)
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
  }

  // Auto-lookup on mount if we have an email
  useEffect(() => {
    if (initialEmail) {
      startTransition(() => fetchOrders(initialEmail))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    startTransition(() => fetchOrders(email.trim()))
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <header className='border-b'>
        <div className='mx-auto flex max-w-4xl items-center justify-between px-6 py-4'>
          <Link
            href={`/shop/${org}`}
            className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <Icons.chevronLeft className='size-4' />
            Back to shop
          </Link>
          <h1 className='font-semibold'>My Orders</h1>
          <div className='w-24' />
        </div>
      </header>

      <main className='mx-auto w-full max-w-4xl flex-1 px-6 py-12'>
        <Card className='mb-10'>
          <CardHeader>
            <CardTitle className='text-lg'>Look up your orders</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLookup} className='flex gap-3 items-end'>
              <div className='flex-1 space-y-1.5'>
                <Label htmlFor='email'>Email address used at checkout</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type='submit' disabled={isPending}>
                {isPending ? (
                  <Icons.spinner className='mr-2 size-4 animate-spin' />
                ) : (
                  <Icons.search className='mr-2 size-4' />
                )}
                Find orders
              </Button>
            </form>
          </CardContent>
        </Card>

        {orders === null ? null : orders.length === 0 ? (
          <div className='flex flex-col items-center gap-4 rounded-xl border-2 border-dashed py-20 text-center'>
            <Icons.billing className='size-10 text-muted-foreground/40' />
            <div>
              <p className='font-medium'>No orders found</p>
              <p className='text-muted-foreground text-sm mt-1'>
                No orders are associated with <strong>{email}</strong>.
              </p>
            </div>
            <Button variant='outline' asChild>
              <Link href={`/shop/${org}`}>Browse the shop</Link>
            </Button>
          </div>
        ) : (
          <div className='space-y-6'>
            <p className='text-muted-foreground text-sm'>
              Found <strong>{orders.length}</strong> order{orders.length !== 1 ? 's' : ''} for{' '}
              <strong>{email}</strong>
            </p>

            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>

      <footer className='border-t py-8'>
        <div className='mx-auto max-w-4xl px-6 text-center text-sm text-muted-foreground'>
          &copy; {new Date().getFullYear()} {org} &middot; Secure payments by Stripe
        </div>
      </footer>
    </div>
  )
}

function OrderTimeline({ status }: { status: string }) {
  if (status === 'Cancelled') {
    return (
      <div className='flex items-center gap-2 text-destructive text-sm'>
        <Icons.close className='size-4' />
        Order cancelled
      </div>
    )
  }

  const currentIdx = STATUS_ORDER.indexOf(status)

  return (
    <div className='flex items-center gap-0 overflow-x-auto pb-1'>
      {STATUS_ORDER.map((step, idx) => {
        const done = idx <= currentIdx
        const active = idx === currentIdx
        const meta = STATUS_META[step]
        return (
          <div key={step} className='flex items-center min-w-0'>
            <div className='flex flex-col items-center gap-1 px-2 min-w-[72px]'>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                  done
                    ? active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-primary bg-primary/10 text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground/40'
                }`}
              >
                {done && !active ? <Icons.check className='size-3.5' /> : idx + 1}
              </div>
              <div className='text-center'>
                <p className={`text-[10px] font-semibold leading-tight ${done ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                  {meta.label}
                </p>
                <p className={`text-[9px] leading-tight ${active ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                  {meta.description}
                </p>
              </div>
            </div>
            {idx < STATUS_ORDER.length - 1 && (
              <div className={`h-0.5 w-6 shrink-0 rounded transition-colors ${idx < currentIdx ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardContent className='pt-5 space-y-4'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='font-mono text-xs text-muted-foreground mb-1'>
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className='text-sm text-muted-foreground'>
              {new Date(order.createdAtUtc).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <Badge variant={STATUS_VARIANTS[order.status] ?? 'outline'}>
            {order.status}
          </Badge>
        </div>

        <OrderTimeline status={order.status} />

        <Separator />

        <div className='space-y-2'>
          {order.items.map((item, i) => (
            <div key={i} className='flex justify-between text-sm'>
              <div className='flex gap-2'>
                <span className='font-medium'>{item.productName || 'Product'}</span>
                <span className='text-muted-foreground'>×{item.quantity}</span>
              </div>
              <span className='tabular-nums font-medium'>${item.totalPrice.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className='flex justify-between font-semibold'>
          <span>Total</span>
          <span className='tabular-nums'>${order.totalAmount.toFixed(2)}</span>
        </div>

        {order.shippingAddress && (
          <p className='text-muted-foreground text-xs pt-1'>
            Shipped to: {order.shippingAddress}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
