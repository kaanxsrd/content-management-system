'use client'

import { useOrganization, useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/icons'
import Link from 'next/link'

export function ShopManagementView() {
  const { organization } = useOrganization()
  const { user } = useUser()

  const shopSlug = organization?.slug ?? user?.username ?? 'my-shop'
  const shopName = organization?.name ?? user?.fullName ?? 'My Shop'
  const shopUrl = `/shop/${shopSlug}`

  return (
    <div className='space-y-6'>
      {/* Shop URL card */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-xl'>{shopName}</CardTitle>
              <CardDescription>Your public storefront is live and ready to share.</CardDescription>
            </div>
            <Badge variant='default' className='bg-green-600 text-white hover:bg-green-700'>
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='bg-muted flex items-center gap-3 rounded-lg px-4 py-3'>
            <Icons.externalLink className='text-muted-foreground size-4 shrink-0' />
            <code className='flex-1 text-sm font-mono'>
              localhost:3000{shopUrl}
            </code>
            <Button size='sm' asChild>
              <Link href={shopUrl} target='_blank' rel='noopener noreferrer'>
                Open Shop
              </Link>
            </Button>
          </div>

          <p className='text-muted-foreground text-sm'>
            Share this URL with customers so they can browse and purchase your products. Payments
            are processed securely via Stripe.
          </p>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <Card className='hover:bg-muted/50 transition-colors'>
          <CardHeader className='pb-3'>
            <div className='bg-primary/10 mb-3 flex h-10 w-10 items-center justify-center rounded-lg'>
              <Icons.product className='text-primary size-5' />
            </div>
            <CardTitle className='text-base'>Manage Products</CardTitle>
            <CardDescription className='text-sm'>
              Add, edit and remove products from your catalog.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant='outline' size='sm' asChild className='w-full'>
              <Link href='/dashboard/product'>
                <Icons.edit className='mr-2 size-4' />
                Go to Products
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className='hover:bg-muted/50 transition-colors'>
          <CardHeader className='pb-3'>
            <div className='bg-primary/10 mb-3 flex h-10 w-10 items-center justify-center rounded-lg'>
              <Icons.teams className='text-primary size-5' />
            </div>
            <CardTitle className='text-base'>View Customers</CardTitle>
            <CardDescription className='text-sm'>
              See all customers who have signed up or ordered.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant='outline' size='sm' asChild className='w-full'>
              <Link href='/dashboard/customers'>
                <Icons.teams className='mr-2 size-4' />
                Go to Customers
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className='hover:bg-muted/50 transition-colors'>
          <CardHeader className='pb-3'>
            <div className='bg-primary/10 mb-3 flex h-10 w-10 items-center justify-center rounded-lg'>
              <Icons.billing className='text-primary size-5' />
            </div>
            <CardTitle className='text-base'>Track Orders</CardTitle>
            <CardDescription className='text-sm'>
              View and manage all customer orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant='outline' size='sm' asChild className='w-full'>
              <Link href='/dashboard/orders'>
                <Icons.billing className='mr-2 size-4' />
                Go to Orders
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
