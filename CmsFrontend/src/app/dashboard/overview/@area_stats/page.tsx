import { cmsApi } from '@/lib/cms-api-client'
import type { Order } from '@/features/orders/api/types'
import { RevenueAreaGraph } from '@/features/overview/components/revenue-area-graph'

export default async function AreaStats() {
  const orders = await cmsApi<Order[]>('/api/crm/orders').catch(() => [] as Order[])

  const monthlyMap: Record<string, { revenue: number; count: number }> = {}

  for (const order of orders) {
    const date = new Date(order.createdAtUtc)
    const key = date.toLocaleString('default', { month: 'short', year: '2-digit' })
    if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, count: 0 }
    monthlyMap[key].revenue += order.totalAmount
    monthlyMap[key].count += 1
  }

  const data = Object.entries(monthlyMap)
    .map(([month, v]) => ({ month, ...v }))
    .sort((a, b) => {
      const parse = (m: string) => new Date(`1 ${m}`)
      return parse(a.month).getTime() - parse(b.month).getTime()
    })

  return <RevenueAreaGraph data={data} />
}
