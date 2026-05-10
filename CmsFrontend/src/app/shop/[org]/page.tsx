import { clerkClient } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import { cmsApi } from '@/lib/cms-api-client'
import type { Product } from '@/features/products/api/types'
import { ShopProductGrid } from './shop-product-grid'

type Props = { params: Promise<{ org: string }> }
type OrgInfo = { name: string; imageUrl: string | null }

async function getOrgInfo(slug: string): Promise<OrgInfo> {
  try {
    const client = await clerkClient()
    const org = await client.organizations.getOrganization({ slug })
    return { name: org.name, imageUrl: org.hasImage ? org.imageUrl : null }
  } catch {
    const name = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    return { name, imageUrl: null }
  }
}

export async function generateMetadata({ params }: Props) {
  const { org } = await params
  const { name } = await getOrgInfo(org)
  return { title: `${name} — Shop` }
}

export default async function ShopPage({ params }: Props) {
  const { org } = await params
  const { name: shopName, imageUrl: orgImageUrl } = await getOrgInfo(org)

  const products = await cmsApi<Product[]>('/api/crm/products').catch(() => [] as Product[])

  return (
    <div className='flex min-h-screen flex-col'>
      {/* Header */}
      <header className='border-b'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
          <div className='flex items-center gap-3'>
            {orgImageUrl ? (
              <Image
                src={orgImageUrl}
                alt={shopName}
                width={36}
                height={36}
                className='rounded-lg object-cover'
              />
            ) : (
              <div className='bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg font-bold text-lg'>
                {shopName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className='font-semibold text-lg leading-tight'>{shopName}</h1>
              <p className='text-muted-foreground text-xs'>Official Store</p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-muted-foreground text-sm'>
              {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
            <Link
              href={`/shop/${org}/orders`}
              className='text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline'
            >
              My Orders
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className='border-b bg-gradient-to-br from-primary/5 via-background to-background px-6 py-16 text-center'>
        <div className='mx-auto max-w-2xl'>
          <p className='text-primary mb-2 text-sm font-medium uppercase tracking-wider'>
            Welcome to
          </p>
          <h2 className='mb-4 text-4xl font-bold tracking-tight'>{shopName}</h2>
          <p className='text-muted-foreground text-lg'>
            Browse our collection and shop securely with Stripe.
          </p>
        </div>
      </section>

      {/* Products */}
      <main className='mx-auto w-full max-w-6xl flex-1 px-6 py-12'>
        <div className='mb-8'>
          <h3 className='text-2xl font-semibold'>Products</h3>
          <p className='text-muted-foreground mt-1 text-sm'>
            Secure checkout powered by Stripe
          </p>
        </div>

        {products.length === 0 ? (
          <div className='border-muted flex flex-col items-center gap-4 rounded-xl border-2 border-dashed py-24 text-center'>
            <div className='text-5xl'>📦</div>
            <div>
              <p className='text-lg font-medium'>No products yet</p>
              <p className='text-muted-foreground text-sm'>
                Products added from the dashboard will appear here.
              </p>
            </div>
          </div>
        ) : (
          <ShopProductGrid products={products} shopSlug={org} />
        )}
      </main>

      {/* Footer */}
      <footer className='border-t py-8'>
        <div className='text-muted-foreground mx-auto max-w-6xl px-6 text-center text-sm'>
          <p>
            &copy; {new Date().getFullYear()} {shopName} &middot; Secure payments by Stripe
          </p>
        </div>
      </footer>
    </div>
  )
}
