import PageContainer from '@/components/layout/page-container'
import { buttonVariants } from '@/components/ui/button'
import ProductListingPage from '@/features/products/components/product-listing'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard: Products'
}

export default function Page() {
  return (
    <PageContainer
      pageTitle='Products'
      pageDescription='Manage your product catalog'
      pageHeaderAction={
        <Link href='/dashboard/product/new' className={cn(buttonVariants(), 'text-xs md:text-sm')}>
          <Icons.add className='mr-2 h-4 w-4' /> Add Product
        </Link>
      }
    >
      <ProductListingPage />
    </PageContainer>
  )
}
