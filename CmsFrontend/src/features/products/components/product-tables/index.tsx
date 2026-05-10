'use client'

import { useState } from 'react'
import { useSuspenseQuery, useMutation } from '@tanstack/react-query'
import { productsQueryOptions } from '../../api/queries'
import { deactivateProductMutation } from '../../api/mutations'
import { productKeys } from '../../api/queries'
import { getQueryClient } from '@/lib/query-client'
import { ProductEditSheet } from '../product-edit-sheet'
import type { Product } from '../../api/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/icons'
import Image from 'next/image'
import { toast } from 'sonner'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

const PAGE_SIZES = [10, 20, 50]

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant='outline' className='text-xs'>Unlimited</Badge>
  if (stock <= 5) return <Badge variant='destructive' className='text-xs'>{stock} left</Badge>
  return <Badge variant='secondary' className='text-xs'>{stock} in stock</Badge>
}

function ProductImage({ url, name }: { url?: string | null; name: string }) {
  if (!url) {
    return (
      <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground'>
        <Icons.product className='h-4 w-4' />
      </div>
    )
  }
  return (
    <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted'>
      <Image src={url} alt={name} fill className='object-cover' unoptimized />
    </div>
  )
}

export function ProductTable() {
  const { data } = useSuspenseQuery(productsQueryOptions())

  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const deactivate = useMutation({
    ...deactivateProductMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: productKeys.all })
      toast.success(`"${deactivateTarget?.name}" deactivated`)
      setDeactivateTarget(null)
    },
    onError: () => toast.error('Failed to deactivate product')
  })

  const filtered = data.products
    .filter((p) => {
      if (statusFilter === 'active') return p.isActive
      if (statusFilter === 'inactive') return !p.isActive
      return true
    })
    .filter((p) => {
      if (!search) return true
      const q = search.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const rows = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize)

  const activeCount = data.products.filter((p) => p.isActive).length
  const inactiveCount = data.products.filter((p) => !p.isActive).length

  return (
    <>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-3'>
        <div className='relative flex-1 min-w-48 max-w-sm'>
          <Icons.search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search products…'
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            className='pl-9'
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0) }}>
          <SelectTrigger className='w-40'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All ({data.products.length})</SelectItem>
            <SelectItem value='active'>Active ({activeCount})</SelectItem>
            <SelectItem value='inactive'>Inactive ({inactiveCount})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className='rounded-lg border overflow-hidden'>
        <Table>
          <TableHeader className='bg-muted/50'>
            <TableRow>
              <TableHead className='w-14' />
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='h-32 text-center text-muted-foreground'>
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((product) => (
                <TableRow key={product.id} className='group hover:bg-muted/40 transition-colors'>
                  <TableCell>
                    <ProductImage url={product.imageUrl} name={product.name} />
                  </TableCell>

                  <TableCell>
                    <p className='font-medium text-sm'>{product.name}</p>
                    <p className='text-xs text-muted-foreground line-clamp-1 max-w-xs'>
                      {product.description}
                    </p>
                  </TableCell>

                  <TableCell className='font-semibold tabular-nums'>
                    ${product.price.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    <StockBadge stock={product.stock} />
                  </TableCell>

                  <TableCell>
                    {product.isActive ? (
                      <Badge variant='default' className='text-xs bg-green-600 hover:bg-green-600'>Active</Badge>
                    ) : (
                      <Badge variant='outline' className='text-xs text-muted-foreground'>Inactive</Badge>
                    )}
                  </TableCell>

                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 gap-1.5'
                        onClick={() => setEditProduct(product)}
                      >
                        <Icons.edit className='h-3.5 w-3.5' />
                        Edit
                      </Button>
                      {product.isActive && (
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10'
                          onClick={() => setDeactivateTarget(product)}
                          disabled={deactivate.isPending && deactivateTarget?.id === product.id}
                        >
                          <Icons.trash className='h-3.5 w-3.5' />
                          Deactivate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between text-sm text-muted-foreground'>
        <span>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-xs'>Rows per page</span>
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(0) }}>
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
            <Button variant='outline' size='icon' className='h-8 w-8' onClick={() => setPage(0)} disabled={safePage === 0}>
              <Icons.chevronsLeft className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='icon' className='h-8 w-8' onClick={() => setPage(safePage - 1)} disabled={safePage === 0}>
              <Icons.chevronLeft className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='icon' className='h-8 w-8' onClick={() => setPage(safePage + 1)} disabled={safePage >= totalPages - 1}>
              <Icons.chevronRight className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='icon' className='h-8 w-8' onClick={() => setPage(totalPages - 1)} disabled={safePage >= totalPages - 1}>
              <Icons.chevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit sheet */}
      <ProductEditSheet
        product={editProduct}
        open={!!editProduct}
        onOpenChange={(open) => { if (!open) setEditProduct(null) }}
      />

      {/* Deactivate confirm */}
      <AlertDialog open={!!deactivateTarget} onOpenChange={(open) => { if (!open) setDeactivateTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate product?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deactivateTarget?.name}&rdquo; will be hidden from your storefront immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deactivate.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              disabled={deactivate.isPending}
              onClick={() => deactivateTarget && deactivate.mutate(deactivateTarget.id)}
            >
              {deactivate.isPending && (
                <span className='mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent' />
              )}
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
