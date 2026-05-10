'use client'

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  confirmOrderMutation,
  shipOrderMutation,
  deliverOrderMutation,
  cancelOrderMutation
} from '../api/mutations'
import type { Order } from '../api/types'

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Pending: 'outline',
  Confirmed: 'secondary',
  Shipped: 'default',
  Delivered: 'default',
  Cancelled: 'destructive'
}

const STATUS_NEXT: Record<string, string> = {
  confirm: 'Confirmed',
  ship: 'Shipped',
  deliver: 'Delivered',
  cancel: 'Cancelled'
}

const TRANSITIONS: Record<string, { label: string; action: string; variant?: 'destructive' | 'default' | 'outline' }[]> = {
  Pending: [
    { label: 'Confirm Order', action: 'confirm' },
    { label: 'Cancel', action: 'cancel', variant: 'destructive' }
  ],
  Confirmed: [
    { label: 'Mark as Shipped', action: 'ship' },
    { label: 'Cancel', action: 'cancel', variant: 'destructive' }
  ],
  Shipped: [{ label: 'Mark Delivered', action: 'deliver' }],
  Delivered: [],
  Cancelled: []
}

type Props = {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailSheet({ order, open, onOpenChange }: Props) {
  const [liveStatus, setLiveStatus] = useState(order?.status ?? '')

  useEffect(() => {
    if (order) setLiveStatus(order.status)
  }, [order])

  function onActionSuccess(action: string, msg: string) {
    setLiveStatus(STATUS_NEXT[action] ?? liveStatus)
    toast.success(msg)
  }

  const confirm = useMutation({
    ...confirmOrderMutation,
    onSuccess: () => onActionSuccess('confirm', 'Order confirmed')
  })
  const ship = useMutation({
    ...shipOrderMutation,
    onSuccess: () => onActionSuccess('ship', 'Order marked as shipped')
  })
  const deliver = useMutation({
    ...deliverOrderMutation,
    onSuccess: () => onActionSuccess('deliver', 'Order delivered')
  })
  const cancel = useMutation({
    ...cancelOrderMutation,
    onSuccess: () => onActionSuccess('cancel', 'Order cancelled'),
    onError: () => toast.error('Cannot cancel this order')
  })

  if (!order) return null

  const transitions = TRANSITIONS[liveStatus] ?? []
  const isPending = confirm.isPending || ship.isPending || deliver.isPending || cancel.isPending

  function handleAction(action: string) {
    const id = order!.id
    if (action === 'confirm') confirm.mutate(id)
    else if (action === 'ship') ship.mutate(id)
    else if (action === 'deliver') deliver.mutate(id)
    else if (action === 'cancel') cancel.mutate(id)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='sm:max-w-lg overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription className='font-mono text-xs'>
            #{order.id.slice(0, 8).toUpperCase()}
          </SheetDescription>
        </SheetHeader>

        <div className='mt-6 space-y-6'>
          {/* Status + date */}
          <div className='flex items-center justify-between'>
            <Badge variant={STATUS_VARIANTS[liveStatus] ?? 'outline'} className='text-sm px-3 py-1'>
              {liveStatus}
            </Badge>
            <p className='text-muted-foreground text-sm'>
              {new Date(order.createdAtUtc).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>

          {/* Transition actions */}
          {transitions.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {transitions.map((t) => (
                <Button
                  key={t.action}
                  size='sm'
                  variant={t.variant ?? 'default'}
                  disabled={isPending}
                  onClick={() => handleAction(t.action)}
                >
                  {isPending && <span className='mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent' />}
                  {t.label}
                </Button>
              ))}
            </div>
          )}

          <Separator />

          {/* Customer */}
          <div className='space-y-1 text-sm'>
            <h3 className='font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2'>Customer</h3>
            <p className='font-medium'>{order.customerName || '—'}</p>
            <p className='text-muted-foreground'>{order.customerEmail || '—'}</p>
          </div>

          {/* Shipping */}
          {order.shippingAddress && (
            <>
              <Separator />
              <div className='space-y-1 text-sm'>
                <h3 className='font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2'>Shipping Address</h3>
                <p className='text-muted-foreground'>{order.shippingAddress}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Items */}
          <div>
            <h3 className='font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-3'>Order Items</h3>
            <div className='space-y-2'>
              {order.items.map((item, i) => (
                <div key={i} className='flex items-center justify-between text-sm'>
                  <div className='min-w-0'>
                    <span className='font-medium'>{item.productName || 'Unknown product'}</span>
                    <span className='text-muted-foreground ml-2 text-xs'>×{item.quantity}</span>
                  </div>
                  <span className='font-medium tabular-nums ml-4 shrink-0'>${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className='my-3' />
            <div className='flex justify-between font-semibold'>
              <span>Total</span>
              <span className='tabular-nums'>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
