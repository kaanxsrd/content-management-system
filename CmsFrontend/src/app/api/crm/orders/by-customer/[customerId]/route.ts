import { cmsApi } from '@/lib/cms-api-client'
import { NextRequest, NextResponse } from 'next/server'
import type { Order } from '@/features/orders/api/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await params
  try {
    const orders = await cmsApi<Order[]>(`/api/crm/orders/by-customer/${customerId}`)
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
