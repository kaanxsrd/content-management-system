import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Order } from '@/features/orders/api/types'

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Pending: 'outline',
  Confirmed: 'secondary',
  Shipped: 'default',
  Delivered: 'default',
  Cancelled: 'destructive'
}

function initials(name: string) {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function itemsSummary(order: Order): string {
  if (order.items.length === 0) return 'No items'
  if (order.items.length === 1) {
    const i = order.items[0]
    return `${i.productName || 'Product'}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`
  }
  const first = order.items[0]
  return `${first.productName || 'Product'}${first.quantity > 1 ? ` ×${first.quantity}` : ''} +${order.items.length - 1} more`
}

type Props = { orders: Order[] }

export function RecentOrdersCard({ orders }: Props) {
  return (
    <Card className='h-full'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription className='mt-1'>
            {orders.length > 0 ? `${orders.length} latest orders` : 'No orders yet'}
          </CardDescription>
        </div>
        <Link
          href='/dashboard/orders'
          className='text-xs text-muted-foreground hover:text-foreground transition-colors'
        >
          View all →
        </Link>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className='text-muted-foreground py-8 text-center text-sm'>No orders found.</p>
        ) : (
          <div className='space-y-3'>
            {orders.map((order) => (
              <div key={order.id} className='flex items-center gap-3 rounded-lg p-2 -mx-2 hover:bg-muted/50 transition-colors'>
                {/* Avatar */}
                <div className='bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
                  {initials(order.customerName || order.customerEmail || '?')}
                </div>

                {/* Info */}
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    <p className='truncate text-sm font-medium leading-none'>
                      {order.customerName || order.customerEmail || 'Unknown'}
                    </p>
                    <Badge variant={STATUS_VARIANTS[order.status] ?? 'outline'} className='shrink-0 text-[10px] px-1.5 py-0'>
                      {order.status}
                    </Badge>
                  </div>
                  <p className='text-muted-foreground text-xs mt-0.5 truncate'>{itemsSummary(order)}</p>
                  <p className='text-muted-foreground text-[10px] mt-0.5'>
                    {new Date(order.createdAtUtc).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Amount */}
                <div className='shrink-0 text-sm font-semibold tabular-nums'>
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
