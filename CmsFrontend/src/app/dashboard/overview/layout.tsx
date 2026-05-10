import PageContainer from '@/components/layout/page-container'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card'
import { Icons } from '@/components/icons'
import React from 'react'
import Image from 'next/image'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { cmsApi } from '@/lib/cms-api-client'
import type { Product } from '@/features/products/api/types'
import type { Customer } from '@/features/customers/api/types'
import type { Order } from '@/features/orders/api/types'

async function getOrgInfo() {
  try {
    const { orgId } = await auth()
    if (!orgId) return null
    const client = await clerkClient()
    const org = await client.organizations.getOrganization({ organizationId: orgId })
    return { name: org.name, imageUrl: org.hasImage ? org.imageUrl : null }
  } catch {
    return null
  }
}

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode
  pie_stats: React.ReactNode
  bar_stats: React.ReactNode
  area_stats: React.ReactNode
}) {
  const [products, customers, orders, orgInfo] = await Promise.all([
    cmsApi<Product[]>('/api/crm/products').catch(() => [] as Product[]),
    cmsApi<Customer[]>('/api/crm/customers').catch(() => [] as Customer[]),
    cmsApi<Order[]>('/api/crm/orders').catch(() => [] as Order[]),
    getOrgInfo()
  ])

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {orgInfo?.imageUrl && (
              <Image
                src={orgInfo.imageUrl}
                alt={orgInfo.name}
                width={40}
                height={40}
                className='rounded-lg object-cover'
              />
            )}
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {orgInfo?.name ? `${orgInfo.name} Overview` : 'CMS Overview'}
              </h2>
              <p className='text-muted-foreground text-sm'>Your store at a glance</p>
            </div>
          </div>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Products</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {products.length}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <Icons.product />
                  Catalog
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>Product catalog</div>
              <div className='text-muted-foreground'>Active listings in store</div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Customers</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {customers.length}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <Icons.teams />
                  CRM
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>Registered customers</div>
              <div className='text-muted-foreground'>In your database</div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Orders</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {orders.length}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <Icons.billing />
                  {pendingOrders} pending
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>All orders placed</div>
              <div className='text-muted-foreground'>
                {deliveredOrders} delivered · {pendingOrders} pending
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <Icons.trendingUp />
                  All time
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Across all orders <Icons.trendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>Including all statuses</div>
            </CardFooter>
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>{sales}</div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 min-h-0 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  )
}
