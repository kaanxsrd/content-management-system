'use client'

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateProductMutation } from '../api/mutations'
import { getQueryClient } from '@/lib/query-client'
import { productKeys } from '../api/queries'
import type { Product } from '../api/types'
import Image from 'next/image'

type Props = {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductEditSheet({ product, open, onOpenChange }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [stock, setStock] = useState('')

  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description)
      setPrice(String(product.price))
      setImageUrl(product.imageUrl ?? '')
      setStock(String(product.stock ?? 0))
    }
  }, [product])

  const update = useMutation({
    ...updateProductMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: productKeys.all })
      toast.success('Product updated')
      onOpenChange(false)
    },
    onError: () => toast.error('Failed to update product')
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return
    const priceNum = parseFloat(price)
    const stockNum = parseInt(stock, 10)
    if (!name.trim() || !description.trim() || isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please fill in all required fields correctly')
      return
    }
    update.mutate({
      id: product.id,
      values: {
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        imageUrl: imageUrl.trim() || null,
        stock: isNaN(stockNum) ? 0 : Math.max(0, stockNum)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='sm:max-w-lg overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Edit Product</SheetTitle>
          <SheetDescription className='text-xs font-mono'>{product?.id}</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className='mt-6 space-y-5'>
          {/* Image preview */}
          {imageUrl && (
            <div className='rounded-lg overflow-hidden border w-full h-40 relative bg-muted'>
              <Image
                src={imageUrl}
                alt={name}
                fill
                className='object-contain'
                unoptimized
              />
            </div>
          )}

          <div className='space-y-1.5'>
            <Label htmlFor='edit-name'>Product Name <span className='text-destructive'>*</span></Label>
            <Input
              id='edit-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter product name'
              required
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='edit-description'>Description <span className='text-destructive'>*</span></Label>
            <Textarea
              id='edit-description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter product description'
              rows={3}
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='edit-price'>Price ($) <span className='text-destructive'>*</span></Label>
              <Input
                id='edit-price'
                type='number'
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder='0.00'
                required
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='edit-stock'>Stock <span className='text-muted-foreground text-xs'>(0 = unlimited)</span></Label>
              <Input
                id='edit-stock'
                type='number'
                min={0}
                step={1}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder='0'
              />
            </div>
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='edit-image'>Image URL</Label>
            <Input
              id='edit-image'
              type='url'
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder='https://example.com/image.jpg'
            />
          </div>

          <div className='flex gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              className='flex-1'
              onClick={() => onOpenChange(false)}
              disabled={update.isPending}
            >
              Cancel
            </Button>
            <Button type='submit' className='flex-1' disabled={update.isPending}>
              {update.isPending && (
                <span className='mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent' />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
