import { mutationOptions } from '@tanstack/react-query'
import { createProduct, updateProduct, deactivateProduct } from './service'
import type { ProductMutationPayload } from './types'

export const createProductMutation = mutationOptions({
  mutationFn: (data: ProductMutationPayload) => createProduct(data)
})

export const updateProductMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: string; values: ProductMutationPayload }) =>
    updateProduct(id, values)
})

export const deactivateProductMutation = mutationOptions({
  mutationFn: (id: string) => deactivateProduct(id)
})
