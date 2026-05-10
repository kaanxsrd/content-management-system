import { cmsApi } from '@/lib/cms-api-client'
import type { Order } from '@/features/orders/api/types'
import { OrdersStatusChart } from '@/features/overview/components/orders-status-chart'

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export default async function BarStats() {
  const orders = await cmsApi<Order[]>('/api/crm/orders').catch(() => [] as Order[])

  const data = STATUSES.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length
  }))

  return <OrdersStatusChart data={data} total={orders.length} />
}
