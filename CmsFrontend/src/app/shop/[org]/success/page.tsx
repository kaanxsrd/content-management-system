import { clerkClient } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SaveEmail } from './save-email'
import { SaveOrderNotification } from './save-order-notification'
import { headers } from 'next/headers'

type Props = {
  params: Promise<{ org: string }>
  searchParams: Promise<{ session_id?: string }>
}

async function getOrgName(slug: string): Promise<string> {
  try {
    const client = await clerkClient()
    const org = await client.organizations.getOrganization({ slug })
    return org.name
  } catch {
    return slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }
}

async function processCheckout(sessionId: string): Promise<void> {
  try {
    const hdrs = await headers()
    const host = hdrs.get('host') ?? 'localhost:3000'
    const proto = host.startsWith('localhost') ? 'http' : 'https'
    await fetch(`${proto}://${host}/api/shop/process-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    })
  } catch (err) {
    console.error('[success] processCheckout failed:', String(err))
  }
}

export default async function SuccessPage({ params, searchParams }: Props) {
  const { org } = await params
  const { session_id } = await searchParams

  const [shopName, session] = await Promise.all([
    getOrgName(org),
    session_id
      ? stripe.checkout.sessions.retrieve(session_id, { expand: ['line_items'] }).catch(() => null)
      : null
  ])

  if (session_id) {
    await processCheckout(session_id)
  }

  const customerEmail = session?.customer_details?.email ?? null
  const customerName = session?.customer_details?.name ?? null
  const amountPaid = session?.amount_total != null
    ? `$${(session.amount_total / 100).toFixed(2)}`
    : null

  const lineItems = session?.line_items?.data ?? []
  const itemSummary = lineItems.length === 0
    ? 'Order'
    : lineItems.length === 1
      ? `${lineItems[0].description ?? 'Product'}${(lineItems[0].quantity ?? 1) > 1 ? ` ×${lineItems[0].quantity}` : ''}`
      : `${lineItems[0].description ?? 'Product'} +${lineItems.length - 1} more`

  const ordersHref = customerEmail
    ? `/shop/${org}/orders?email=${encodeURIComponent(customerEmail)}`
    : `/shop/${org}/orders`

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center'>
      {customerEmail && <SaveEmail email={customerEmail} name={customerName ?? undefined} />}
      {session_id && (
        <SaveOrderNotification
          sessionId={session_id}
          customerName={customerName}
          itemSummary={itemSummary}
          totalAmount={amountPaid ?? ''}
        />
      )}
      <div className='flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl dark:bg-green-900/30'>
        ✅
      </div>
      <div>
        <h1 className='text-3xl font-bold'>Order Confirmed!</h1>
        <p className='text-muted-foreground mt-2 text-lg'>
          Thank you for your purchase from{' '}
          <span className='font-semibold text-foreground'>{shopName}</span>.
        </p>
        {amountPaid && (
          <p className='text-muted-foreground mt-1 text-sm'>
            Total paid: <span className='font-medium text-foreground'>{amountPaid}</span>
          </p>
        )}
        {customerEmail && (
          <p className='text-muted-foreground mt-1 text-sm'>
            Order confirmation sent to <strong>{customerEmail}</strong>
          </p>
        )}
      </div>
      <div className='flex flex-col sm:flex-row gap-3'>
        <Button asChild>
          <Link href={`/shop/${org}`}>Continue Shopping</Link>
        </Button>
        <Button variant='outline' asChild>
          <Link href={ordersHref}>View My Orders</Link>
        </Button>
      </div>
    </div>
  )
}
