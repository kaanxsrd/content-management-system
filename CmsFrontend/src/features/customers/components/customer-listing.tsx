import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/query-client'
import { customersQueryOptions } from '../api/queries'
import { CustomersTable } from './customers-table'

export default function CustomerListingPage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(customersQueryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomersTable />
    </HydrationBoundary>
  )
}
