import { stripe } from '@/lib/stripe'
import { cmsApi } from '@/lib/cms-api-client'
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'

type CustomerResponse = { id: string; address: { id: string } | null }
type AddressResponse = { id: string }

async function findOrCreateCustomer(
  session: Stripe.Checkout.Session
): Promise<string | null> {
  const email = session.customer_details?.email ?? session.metadata?.customerEmail
  const nameFromMeta = session.metadata?.customerName
  const name = session.customer_details?.name ?? nameFromMeta ?? ''
  const billingAddr = session.customer_details?.address

  if (!email) {
    console.error('[webhook] No email found in session', session.id)
    return null
  }

  console.log('[webhook] Looking up customer by email:', email)

  const [firstName, ...rest] = name.split(' ')
  const lastName = rest.join(' ') || 'Unknown'

  // Try by-email lookup first
  try {
    const existing = await cmsApi<CustomerResponse>(
      `/api/crm/customers/by-email?email=${encodeURIComponent(email)}`
    )
    console.log('[webhook] Found existing customer:', existing.id)
    return existing.id
  } catch (err) {
    console.log('[webhook] Customer not found (will create):', String(err))
  }

  // Create new customer
  try {
    const payload = {
      firstName,
      lastName,
      email,
      street: billingAddr?.line1 ?? 'Unknown',
      city: billingAddr?.city ?? 'Unknown',
      zipCode: billingAddr?.postal_code ?? '00000',
      country: billingAddr?.country ?? 'US'
    }
    console.log('[webhook] Creating customer:', JSON.stringify(payload))
    const created = await cmsApi<CustomerResponse>('/api/crm/customers', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    console.log('[webhook] Created customer:', created.id)
    return created.id
  } catch (err) {
    console.error('[webhook] Failed to create customer:', String(err))
    return null
  }
}

async function createShippingAddress(
  session: Stripe.Checkout.Session
): Promise<string | null> {
  const shipping =
    session.collected_information?.shipping_details?.address ??
    session.customer_details?.address

  const addr = {
    street: shipping?.line1 ?? 'Unknown',
    city: shipping?.city ?? 'Unknown',
    zipCode: shipping?.postal_code ?? '00000',
    country: shipping?.country ?? 'US'
  }

  console.log('[webhook] Creating shipping address:', JSON.stringify(addr))

  try {
    const address = await cmsApi<AddressResponse>('/api/crm/addresses', {
      method: 'POST',
      body: JSON.stringify(addr)
    })
    console.log('[webhook] Created address:', address.id)
    return address.id
  } catch (err) {
    console.error('[webhook] Failed to create address:', String(err))
    return null
  }
}

async function createOrder(
  customerId: string,
  shippingAddressId: string,
  session: Stripe.Checkout.Session
): Promise<void> {
  const productIds = (session.metadata?.productIds ?? '').split(',').filter(Boolean)
  console.log('[webhook] Product IDs from metadata:', productIds)

  const lineItemsResp = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
  console.log('[webhook] Line items count:', lineItemsResp.data.length)

  const items = lineItemsResp.data.map((li, i) => ({
    productId: productIds[i] ?? productIds[0] ?? '',
    quantity: li.quantity ?? 1
  })).filter((item) => item.productId)

  console.log('[webhook] Order items:', JSON.stringify(items))

  if (items.length === 0) {
    console.error('[webhook] No items to create order with')
    return
  }

  try {
    const payload = { customerId, shippingAddressId, items }
    console.log('[webhook] Creating order:', JSON.stringify(payload))
    await cmsApi('/api/crm/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    console.log('[webhook] Order created successfully')
  } catch (err) {
    console.error('[webhook] Failed to create order:', String(err))
  }
}

export async function POST(req: NextRequest) {
  console.log('[webhook] Received POST request')

  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    console.error('[webhook] Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
    console.log('[webhook] Event verified:', event.type)
  } catch (err) {
    console.error('[webhook] Signature verification failed:', String(err))
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('[webhook] Session:', session.id, '| payment_status:', session.payment_status)

    if (session.payment_status === 'paid') {
      const [customerId, shippingAddressId] = await Promise.all([
        findOrCreateCustomer(session),
        createShippingAddress(session)
      ])

      console.log('[webhook] customerId:', customerId, '| shippingAddressId:', shippingAddressId)

      if (customerId && shippingAddressId) {
        await createOrder(customerId, shippingAddressId, session)
      } else {
        console.error('[webhook] Missing customerId or shippingAddressId — order not created')
      }
    } else {
      console.log('[webhook] Skipping — payment_status is not paid:', session.payment_status)
    }
  }

  return NextResponse.json({ received: true })
}
