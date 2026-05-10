'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { Order } from '../../api/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Pending: 'outline',
  Confirmed: 'secondary',
  Shipped: 'default',
  Delivered: 'default',
  Cancelled: 'destructive'
}

type ColumnsOptions = {
  onRowClick: (order: Order) => void
}

export function columns({ onRowClick }: ColumnsOptions): ColumnDef<Order>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Order ID',
      cell: ({ cell }) => (
        <div className='font-mono text-xs text-muted-foreground'>
          {(cell.getValue<string>()).slice(0, 8)}…
        </div>
      )
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <div className='font-medium text-sm'>{row.original.customerName || '—'}</div>
          <div className='text-muted-foreground text-xs'>{row.original.customerEmail}</div>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ cell }) => {
        const status = cell.getValue<string>()
        return (
          <Badge variant={STATUS_VARIANTS[status] ?? 'outline'} className='capitalize'>
            {status}
          </Badge>
        )
      }
    },
    {
      id: 'items',
      header: 'Items',
      accessorFn: (row) => row.items.length,
      cell: ({ cell }) => <div>{cell.getValue<number>()} item(s)</div>
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total',
      cell: ({ cell }) => (
        <div className='font-medium'>${cell.getValue<number>().toFixed(2)}</div>
      )
    },
    {
      accessorKey: 'createdAtUtc',
      header: 'Created',
      cell: ({ cell }) => (
        <div className='text-muted-foreground text-sm'>
          {new Date(cell.getValue<string>()).toLocaleDateString()}
        </div>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant='ghost'
          size='sm'
          onClick={(e) => {
            e.stopPropagation()
            onRowClick(row.original)
          }}
        >
          <Icons.chevronRight className='h-4 w-4' />
        </Button>
      )
    }
  ]
}
