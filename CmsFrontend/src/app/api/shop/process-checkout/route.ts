import { stripe } from '@/lib/stripe'
import { cmsApi } from '@/lib/cms-api-client'
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'

type CustomerResponse = { id: string }
type AddressResponse = { id: string }

// In-memory dedup guard — prevents double-processing if webhook also fires
const processedSessions = new Set<string>()

async function findOrCreateCustomer(session: Stripe.Checkout.Session): Promise<string | null> {
  const email = session.customer_details?.email ?? session.metadata?.customerEmail
  const name = session.customer_details?.name ?? session.metadata?.customerName ?? ''

  if (!email) return null

  const [firstName, ...rest] = name.split(' ')
  const lastName = rest.join(' ') || 'Unknown'

  try {
    const existing = await cmsApi<CustomerResponse>(
      `/api/crm/customers/by-email?email=${encodeURIComponent(email)}`
    )
    return existing.id
  } catch {
    // not found — create
  }

  try {
    const billing = session.customer_details?.address
    const created = await cmsApi<CustomerResponse>('/api/crm/customers', {
      method: 'POST',
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        street: billing?.line1 ?? 'Unknown',
        city: billing?.city ?? 'Unknown',
        zipCode: billing?.postal_code ?? '00000',
        country: billing?.country ?? 'US'
      })
    })
    return created.id
  } catch (err) {
    console.error('[process-checkout] Failed to create customer:', String(err))
    return null
  }
}

async function createShippingAddress(session: Stripe.Checkout.Session): Promise<string | null> {
  const shipping =
    session.collected_information?.shipping_details?.address ??
    session.customer_details?.address

  try {
    const address = await cmsApi<AddressResponse>('/api/crm/addresses', {
      method: 'POST',
      body: JSON.stringify({
        street: shipping?.line1 ?? 'Unknown',
        city: shipping?.city ?? 'Unknown',
        zipCode: shipping?.postal_code ?? '00000',
        country: shipping?.country ?? 'US'
      })
    })
    return address.id
  } catch (err) {
    console.error('[process-checkout] Failed to create address:', String(err))
    return null
  }
}

async function createOrder(
  customerId: string,
  shippingAddressId: string,
  session: Stripe.Checkout.Session
): Promise<void> {
  const productIds = (session.metadata?.productIds ?? '').split(',').filter(Boolean)
  const lineItemsResp = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })

  const items = lineItemsResp.data
    .map((li, i) => ({
      productId: productIds[i] ?? productIds[0] ?? '',
      quantity: li.quantity ?? 1
    }))
    .filter((item) => item.productId)

  if (items.length === 0) {
    console.error('[process-checkout] No items to create order with')
    return
  }

  try {
    await cmsApi('/api/crm/orders', {
      method: 'POST',
      body: JSON.stringify({ customerId, shippingAddressId, items })
    })
  } catch (err) {
    console.error('[process-checkout] Failed to create order:', String(err))
  }
}

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json() as { sessionId: string }

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }

  if (processedSessions.has(sessionId)) {
    return NextResponse.json({ status: 'already_processed' })
  }

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (err) {
    console.error('[process-checkout] Failed to retrieve session:', String(err))
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
  }

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ status: 'not_paid' })
  }

  processedSessions.add(sessionId)

  const [customerId, shippingAddressId] = await Promise.all([
    findOrCreateCustomer(session),
    createShippingAddress(session)
  ])

  if (customerId && shippingAddressId) {
    await createOrder(customerId, shippingAddressId, session)
  } else {
    console.error('[process-checkout] Missing customerId or shippingAddressId')
  }

  return NextResponse.json({ status: 'ok' })
}
