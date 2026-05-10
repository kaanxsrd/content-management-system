'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Product } from '@/features/products/api/types'
import { useCartStore } from '@/features/shop/store/cart'
import { useCustomerIdentityStore } from '@/features/shop/store/customer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Icons } from '@/components/icons'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

type Props = {
  products: Product[]
  shopSlug: string
}

function stockBadge(stock: number) {
  if (stock === 0) return null
  if (stock <= 5) return <Badge variant='destructive' className='text-xs'>Only {stock} left</Badge>
  return <Badge variant='outline' className='text-xs'>In Stock</Badge>
}

export function ShopProductGrid({ products, shopSlug }: Props) {
  return (
    <div className='space-y-6'>
      <CartDrawer shopSlug={shopSlug} />
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const outOfStock = product.stock > 0 && product.stock === 0

  function handleAddToCart() {
    addItem({ productId: product.id, name: product.name, price: product.price })
    toast.success(`${product.name} added to cart`)
  }

  return (
    <div className='bg-card border rounded-xl overflow-hidden flex flex-col transition-shadow hover:shadow-md'>
      <div className='relative h-48 bg-muted'>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <div className='text-center'>
              <Icons.product className='size-10 text-muted-foreground/40 mx-auto mb-1' />
              <span className='text-muted-foreground text-xs'>{product.name}</span>
            </div>
          </div>
        )}
      </div>

      <div className='flex flex-1 flex-col p-5 gap-3'>
        <div className='flex items-start justify-between gap-2'>
          <h4 className='font-semibold leading-snug'>{product.name}</h4>
          <div className='flex flex-col items-end gap-1'>
            <Badge variant='secondary' className='shrink-0 font-mono text-sm'>
              ${product.price.toFixed(2)}
            </Badge>
            {stockBadge(product.stock)}
          </div>
        </div>

        {product.description && (
          <p className='text-muted-foreground line-clamp-3 text-sm leading-relaxed'>
            {product.description}
          </p>
        )}

        <div className='mt-auto pt-2'>
          <Button onClick={handleAddToCart} className='w-full' size='sm' disabled={outOfStock}>
            <Icons.add className='mr-2 size-4' />
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  )
}

type CheckoutModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: (name: string, email: string) => void
  loading: boolean
}

function CheckoutModal({ open, onClose, onConfirm, loading }: CheckoutModalProps) {
  const identity = useCustomerIdentityStore()
  const [name, setName] = useState(identity.name)
  const [email, setEmail] = useState(identity.email)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    onConfirm(name.trim(), email.trim())
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Complete your order</DialogTitle>
          <DialogDescription>
            Enter your name and email to proceed to secure checkout. Shipping address is collected on the next page.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='checkout-name'>Full name</Label>
            <Input
              id='checkout-name'
              placeholder='Kaan Karahan'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='checkout-email'>Email address</Label>
            <Input
              id='checkout-email'
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <DialogFooter className='pt-2'>
            <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type='submit' disabled={loading || !name.trim() || !email.trim()}>
              {loading ? (
                <>
                  <Icons.spinner className='mr-2 size-4 animate-spin' />
                  Redirecting…
                </>
              ) : (
                <>
                  <Icons.arrowRight className='mr-2 size-4' />
                  Go to Checkout
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CartDrawer({ shopSlug }: { shopSlug: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const items = useCartStore((s) => s.items)
  const totalItems = useCartStore((s) => s.totalItems())
  const totalPrice = useCartStore((s) => s.totalPrice())
  const displayCount = mounted ? totalItems : 0
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart = useCartStore((s) => s.clearCart)
  const setIdentity = useCustomerIdentityStore((s) => s.setIdentity)

  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  async function handleCheckout(name: string, email: string) {
    if (items.length === 0) return
    setLoading(true)
    setIdentity(name, email)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shopSlug, customerName: name, customerEmail: email })
      })

      if (res.status === 503) {
        toast.error('Stripe is not configured yet. Add your Stripe keys to .env.local.')
        return
      }

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Checkout failed.')
        return
      }
      if (data.url) {
        clearCart()
        window.location.href = data.url
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setShowModal(false)
    }
  }

  return (
    <>
      <CheckoutModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleCheckout}
        loading={loading}
      />

      <div className='flex justify-end'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' className='relative'>
              <Icons.billing className='mr-2 size-4' />
              Cart
              {displayCount > 0 && (
                <Badge className='ml-2 h-5 min-w-5 px-1 text-xs'>{displayCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className='flex flex-col'>
            <SheetHeader>
              <SheetTitle>Your Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})</SheetTitle>
            </SheetHeader>

            <div className='flex-1 overflow-y-auto py-4 space-y-4'>
              {items.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-16 text-center gap-3'>
                  <Icons.product className='size-10 text-muted-foreground/40' />
                  <p className='text-muted-foreground text-sm'>Your cart is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className='flex items-center gap-3'>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-sm truncate'>{item.name}</p>
                      <p className='text-muted-foreground text-xs'>${item.price.toFixed(2)} each</p>
                    </div>

                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-7 w-7'
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Icons.minus className='size-3' />
                      </Button>
                      <span className='w-6 text-center text-sm tabular-nums'>{item.quantity}</span>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-7 w-7'
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Icons.add className='size-3' />
                      </Button>
                    </div>

                    <span className='text-sm font-medium w-16 text-right tabular-nums'>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-7 w-7 text-muted-foreground hover:text-destructive'
                      onClick={() => removeItem(item.productId)}
                    >
                      <Icons.trash className='size-3.5' />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className='border-t pt-4 space-y-4'>
                <Separator />
                <div className='flex justify-between font-semibold text-lg'>
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  className='w-full'
                  size='lg'
                  onClick={() => setShowModal(true)}
                  disabled={loading}
                >
                  Checkout with Stripe
                  <Icons.arrowRight className='ml-2 size-4' />
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
