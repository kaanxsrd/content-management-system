'use client'

import { useAppForm, useFormFields } from '@/components/ui/tanstack-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createProductMutation, updateProductMutation } from '../api/mutations'
import type { Product } from '../api/types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import * as z from 'zod'
import type { ProductFormValues } from '@/features/products/schemas/product'
import { getQueryClient } from '@/lib/query-client'
import { productKeys } from '../api/queries'

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null
  pageTitle: string
}) {
  const router = useRouter()
  const isEdit = !!initialData

  const createMutation = useMutation({
    ...createProductMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: productKeys.all })
      toast.success('Product created successfully')
      router.push('/dashboard/product')
    },
    onError: () => toast.error('Failed to create product')
  })

  const updateMutation = useMutation({
    ...updateProductMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: productKeys.all })
      toast.success('Product updated successfully')
      router.push('/dashboard/product')
    },
    onError: () => toast.error('Failed to update product')
  })

  const form = useAppForm({
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price,
      imageUrl: initialData?.imageUrl ?? '',
      stock: initialData?.stock ?? 0
    } as ProductFormValues,
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name,
        description: value.description,
        price: value.price!,
        imageUrl: value.imageUrl || null,
        stock: value.stock ?? 0
      }

      if (isEdit) {
        updateMutation.mutate({ id: initialData.id, values: payload })
      } else {
        createMutation.mutate(payload)
      }
    }
  })

  const { FormTextField, FormTextareaField } = useFormFields<ProductFormValues>()

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form.Form className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormTextField
                name='name'
                label='Product Name'
                required
                placeholder='Enter product name'
                validators={{
                  onBlur: z.string().min(2, 'Product name must be at least 2 characters.')
                }}
              />

              <FormTextField
                name='price'
                label='Price'
                required
                type='number'
                min={0}
                step={0.01}
                placeholder='Enter price'
                validators={{
                  onBlur: z.number({ message: 'Price is required' })
                }}
              />
            </div>

            <FormTextareaField
              name='description'
              label='Description'
              required
              placeholder='Enter product description'
              maxLength={500}
              rows={4}
              validators={{
                onBlur: z.string().min(10, 'Description must be at least 10 characters.')
              }}
            />

            <FormTextField
              name='imageUrl'
              label='Image URL'
              placeholder='https://example.com/image.jpg (optional)'
              validators={{
                onBlur: z.string().url('Must be a valid URL').optional().or(z.literal(''))
              }}
            />

            <FormTextField
              name='stock'
              label='Stock (0 = unlimited)'
              type='number'
              min={0}
              step={1}
              placeholder='0'
              validators={{
                onBlur: z.number().int().min(0).optional()
              }}
            />

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Back
              </Button>
              <form.SubmitButton>{isEdit ? 'Update Product' : 'Add Product'}</form.SubmitButton>
            </div>
          </form.Form>
        </form.AppForm>
      </CardContent>
    </Card>
  )
}
