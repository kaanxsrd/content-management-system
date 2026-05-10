'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { Customer } from '../../api/types'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

type ColumnsOptions = {
  onRowClick: (customer: Customer) => void
}

export function columns({ onRowClick }: ColumnsOptions): ColumnDef<Customer>[] {
  return [
    {
      accessorKey: 'fullName',
      header: 'Name',
      cell: ({ cell }) => <div className='font-medium'>{cell.getValue<string>()}</div>
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ cell }) => (
        <div className='text-muted-foreground'>{cell.getValue<string>()}</div>
      )
    },
    {
      id: 'city',
      header: 'City',
      accessorFn: (row) => row.address?.city ?? '-',
      cell: ({ cell }) => <div>{cell.getValue<string>()}</div>
    },
    {
      id: 'country',
      header: 'Country',
      accessorFn: (row) => row.address?.country ?? '-',
      cell: ({ cell }) => <div>{cell.getValue<string>()}</div>
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
