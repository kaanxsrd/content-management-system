import PageContainer from '@/components/layout/page-container'
import OrderListingPage from '@/features/orders/components/order-listing'
import { Suspense } from 'react'

export const metadata = {
  title: 'Dashboard: Orders'
}

export default function Page() {
  return (
    <PageContainer
      pageTitle='Orders'
      pageDescription='Track and manage customer orders'
    >
      <Suspense>
        <OrderListingPage />
      </Suspense>
    </PageContainer>
  )
}
