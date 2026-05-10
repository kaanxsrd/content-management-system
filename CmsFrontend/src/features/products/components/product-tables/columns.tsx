'use client'

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header'
import type { Product } from '../../api/types'
import type { Column, ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'

export const columns: ColumnDef<Product>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div className='font-medium'>{cell.getValue<string>()}</div>
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ cell }) => (
      <div className='text-muted-foreground max-w-sm truncate'>{cell.getValue<string>()}</div>
    )
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ cell }) => (
      <div className='font-medium'>
        ${cell.getValue<number>().toFixed(2)}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
