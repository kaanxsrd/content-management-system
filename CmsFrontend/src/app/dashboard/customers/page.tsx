import PageContainer from '@/components/layout/page-container'
import CustomerListingPage from '@/features/customers/components/customer-listing'
import { CreateCustomerSheet } from '@/features/customers/components/create-customer-sheet'
import { Suspense } from 'react'

export const metadata = {
  title: 'Dashboard: Customers'
}

export default function Page() {
  return (
    <PageContainer
      pageTitle='Customers'
      pageDescription='View and manage your customer base'
      pageHeaderAction={<CreateCustomerSheet />}
    >
      <Suspense>
        <CustomerListingPage />
      </Suspense>
    </PageContainer>
  )
}
