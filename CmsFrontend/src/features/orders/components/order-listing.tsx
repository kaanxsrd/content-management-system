import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/query-client'
import { ordersQueryOptions } from '../api/queries'
import { OrdersTable } from './orders-table'

export default function OrderListingPage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(ordersQueryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersTable />
    </HydrationBoundary>
  )
}
