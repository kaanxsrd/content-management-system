import PageContainer from '@/components/layout/page-container'
import { ShopManagementView } from './shop-management-view'

export const metadata = { title: 'Dashboard: My Shop' }

export default function Page() {
  return (
    <PageContainer pageTitle='My Shop' pageDescription='Manage your public storefront'>
      <ShopManagementView />
    </PageContainer>
  )
}
