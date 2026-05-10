import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'

type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_key_here') {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 })
  }

  const body = await req.json()
  const { items, shopSlug, customerName, customerEmail }: {
    items: CartItem[]
    shopSlug: string
    customerName?: string
    customerEmail?: string
  } = body

  if (!items?.length || !shopSlug) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.name,
          metadata: { productId: item.productId }
        }
      }
    })),
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'FI', 'JP', 'SG']
    },
    ...(customerEmail ? { customer_email: customerEmail } : {}),
    metadata: {
      shopSlug,
      customerName: customerName ?? '',
      customerEmail: customerEmail ?? '',
      productIds: items.map((i) => i.productId).join(',')
    },
    success_url: `${baseUrl}/shop/${shopSlug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/shop/${shopSlug}/cancel`
  })

  return NextResponse.json({ url: session.url })
}
