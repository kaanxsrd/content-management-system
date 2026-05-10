import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/query-client'
import { productsQueryOptions } from '../api/queries'
import { ProductTable } from './product-tables'

export default function ProductListingPage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(productsQueryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductTable />
    </HydrationBoundary>
  )
}
