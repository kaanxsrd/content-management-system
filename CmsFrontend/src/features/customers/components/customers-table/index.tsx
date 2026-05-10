'use client'

import { useState } from 'react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { DataTable } from '@/components/ui/table/data-table'
import { useSuspenseQuery } from '@tanstack/react-query'
import { customersQueryOptions } from '../../api/queries'
import { columns } from './columns'
import { CustomerDetailSheet } from '../customer-detail-sheet'
import type { Customer } from '../../api/types'

export function CustomersTable() {
  const { data } = useSuspenseQuery(customersQueryOptions())
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const table = useReactTable({
    data: data.customers,
    columns: columns({ onRowClick: setSelectedCustomer }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } }
  })

  return (
    <>
      <DataTable table={table} />
      <CustomerDetailSheet
        customer={selectedCustomer}
        open={!!selectedCustomer}
        onOpenChange={(open) => { if (!open) setSelectedCustomer(null) }}
      />
    </>
  )
}
