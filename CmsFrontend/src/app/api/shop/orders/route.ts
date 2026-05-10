import { cmsApi } from '@/lib/cms-api-client'
import { NextRequest, NextResponse } from 'next/server'
import type { Order } from '@/features/orders/api/types'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json([], { status: 200 })

  try {
    const orders = await cmsApi<Order[]>(`/api/crm/orders/by-email?email=${encodeURIComponent(email)}`)
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
