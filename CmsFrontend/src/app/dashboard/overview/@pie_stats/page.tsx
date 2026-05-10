import { cmsApi } from '@/lib/cms-api-client'
import type { Order } from '@/features/orders/api/types'
import { OrderStatusPie } from '@/features/overview/components/order-status-pie'

export default async function Stats() {
  const orders = await cmsApi<Order[]>('/api/crm/orders').catch(() => [] as Order[])

  const statusMap: Record<string, number> = {}
  for (const order of orders) {
    statusMap[order.status] = (statusMap[order.status] ?? 0) + 1
  }

  const data = Object.entries(statusMap).map(([status, count]) => ({ status, count }))

  return <OrderStatusPie data={data} total={orders.length} />
}
