import { cmsApi } from '@/lib/cms-api-client'
import type { Order } from '@/features/orders/api/types'
import { RecentOrdersCard } from '@/features/overview/components/recent-orders-card'

export default async function Sales() {
  const orders = await cmsApi<Order[]>('/api/crm/orders').catch(() => [] as Order[])

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime())
    .slice(0, 6)

  return <RecentOrdersCard orders={recentOrders} />
}
