'use client'

import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ordersQueryOptions } from '../../api/queries'
import { OrderDetailSheet } from '../order-detail-sheet'
import type { Order } from '../../api/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Pending: 'outline',
  Confirmed: 'secondary',
  Shipped: 'default',
  Delivered: 'default',
  Cancelled: 'destructive'
}

const STATUSES = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']
const PAGE_SIZES = [10, 20, 50]

function itemsSummary(order: Order): string {
  if (order.items.length === 0) return '—'
  if (order.items.length === 1) {
    const i = order.items[0]
    return `${i.productName || 'Product'}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`
  }
  const first = order.items[0]
  return `${first.productName || 'Product'}${first.quantity > 1 ? ` ×${first.quantity}` : ''} +${order.items.length - 1} more`
}

function initials(name: string) {
  const parts = (name || '').trim().split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function OrdersTable() {
  const { data } = useSuspenseQuery(ordersQueryOptions())
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const statusCounts = STATUSES.slice(1).reduce<Record<string, number>>((acc, s) => {
    acc[s] = data.orders.filter((o) => o.status === s).length
    return acc
  }, {})

  const filtered = data.orders
    .filter((o) => statusFilter === 'All' || o.status === statusFilter)
    .filter((o) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        o.customerName?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.items.some((i) => i.productName?.toLowerCase().includes(q))
      )
    })
    .sort((a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime())

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const rows = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize)

  return (
    <div className='space-y-4'>
      {/* Status chips */}
      <div className='flex flex-wrap gap-2'>
        {STATUSES.map((s) => {
          const count = s === 'All' ? data.orders.length : (statusCounts[s] ?? 0)
          const active = statusFilter === s
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0) }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-muted border-border text-muted-foreground'
              }`}
            >
              {s}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-foreground'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className='relative max-w-sm'>
        <Icons.search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search customer, product, order ID…'
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          className='pl-9'
        />
      </div>

      {/* Table */}
      <div className='rounded-lg border overflow-hidden'>
        <Table>
          <TableHeader className='bg-muted/50'>
            <TableRow>
              <TableHead className='w-28'>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items ordered</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='w-10' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((order) => (
                <TableRow
                  key={order.id}
                  className='cursor-pointer hover:bg-muted/40 transition-colors'
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell>
                    <span className='font-mono text-xs font-medium text-muted-foreground'>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <div className='bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold'>
                        {initials(order.customerName || order.customerEmail)}
                      </div>
                      <div className='min-w-0'>
                        <p className='text-sm font-medium truncate max-w-[140px]'>
                          {order.customerName || '—'}
                        </p>
                        <p className='text-xs text-muted-foreground truncate max-w-[140px]'>
                          {order.customerEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className='text-sm truncate max-w-[200px]'>{itemsSummary(order)}</p>
                    {order.items.length > 1 && (
                      <p className='text-xs text-muted-foreground'>{order.items.length} items total</p>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[order.status] ?? 'outline'} className='text-xs'>
                      {order.status}
                    </Badge>
                  </TableCell>

                  <TableCell className='text-right font-semibold tabular-nums'>
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>

                  <TableCell className='text-muted-foreground text-sm whitespace-nowrap'>
                    {new Date(order.createdAtUtc).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-7 w-7'
                      onClick={(e) => { e.stopPropagation(); setSelectedOrder(order) }}
                    >
                      <Icons.chevronRight className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between text-sm text-muted-foreground'>
        <span>{filtered.length} order{filtered.length !== 1 ? 's' : ''}{statusFilter !== 'All' ? ` · ${statusFilter}` : ''}</span>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-xs'>Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => { setPageSize(Number(v)); setPage(0) }}
            >
              <SelectTrigger className='h-8 w-16'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((s) => (
                  <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className='text-xs'>Page {safePage + 1} of {totalPages}</span>
          <div className='flex items-center gap-1'>
            <Button variant='outline' size='icon' className='h-8 w-8'
              onClick={() => setPage(0)} disabled={safePage === 0}>
              <Icons.chevronsLeft className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='icon' className='h-8 w-8'
              onClick={() => setPage(safePage - 1)} disabled={safePage === 0}>
              <Icons.chevronLeft className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='icon' className='h-8 w-8'
              onClick={() => setPage(safePage + 1)} disabled={safePage >= totalPages - 1}>
              <Icons.chevronRight className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='icon' className='h-8 w-8'
              onClick={() => setPage(totalPages - 1)} disabled={safePage >= totalPages - 1}>
              <Icons.chevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      <OrderDetailSheet
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => { if (!open) setSelectedOrder(null) }}
      />
    </div>
  )
}
