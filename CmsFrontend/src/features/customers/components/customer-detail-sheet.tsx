'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ordersByCustomerOptions } from '@/features/orders/api/queries'
import type { Customer } from '../api/types'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Pending: 'outline',
  Confirmed: 'secondary',
  Shipped: 'default',
  Delivered: 'default',
  Cancelled: 'destructive'
}

function CustomerOrders({ customerId }: { customerId: string }) {
  const { data: orders } = useSuspenseQuery(ordersByCustomerOptions(customerId))

  if (orders.length === 0) {
    return <p className='text-muted-foreground text-sm'>No orders yet.</p>
  }

  return (
    <div className='space-y-2'>
      {orders.map((order) => (
        <div key={order.id} className='flex items-center justify-between rounded-lg border px-3 py-2 text-sm'>
          <div>
            <p className='font-mono text-xs text-muted-foreground'>{order.id.slice(0, 8)}…</p>
            <p className='text-xs'>
          {order.items.map((i) => i.productName || 'Product').join(', ').slice(0, 40)}
          {order.items.length > 1 ? ` (${order.items.length})` : ''} · ${order.totalAmount.toFixed(2)}
        </p>
          </div>
          <Badge variant={STATUS_VARIANTS[order.status] ?? 'outline'} className='text-xs'>
            {order.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}

type Props = {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDetailSheet({ customer, open, onOpenChange }: Props) {
  if (!customer) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='sm:max-w-md overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>{customer.fullName}</SheetTitle>
          <SheetDescription>{customer.email}</SheetDescription>
        </SheetHeader>

        <div className='mt-6 space-y-6'>
          <div className='space-y-2 text-sm'>
            <h3 className='font-semibold'>Address</h3>
            {customer.address ? (
              <div className='text-muted-foreground'>
                <p>{customer.address.street}</p>
                <p>{customer.address.city}, {customer.address.zipCode}</p>
                <p>{customer.address.country}</p>
              </div>
            ) : (
              <p className='text-muted-foreground'>No address on file.</p>
            )}
          </div>

          <Separator />

          <div className='space-y-3'>
            <h3 className='font-semibold text-sm'>Orders</h3>
            <Suspense fallback={<Skeleton className='h-16 w-full' />}>
              <CustomerOrders customerId={customer.id} />
            </Suspense>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
