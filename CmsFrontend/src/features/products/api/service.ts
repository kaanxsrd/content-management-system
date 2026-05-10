'use server'

import { cmsApi } from '@/lib/cms-api-client'
import type { Product, ProductByIdResponse, ProductMutationPayload, ProductsResponse } from './types'

export async function getProducts(): Promise<ProductsResponse> {
  const products = await cmsApi<Product[]>('/api/crm/products')
  return { total_products: products.length, products }
}

export async function getProductById(id: string): Promise<ProductByIdResponse> {
  try {
    const product = await cmsApi<Product>(`/api/crm/products/${id}`)
    return { product }
  } catch {
    return { product: null }
  }
}

export async function createProduct(data: ProductMutationPayload): Promise<Product> {
  return cmsApi<Product>('/api/crm/products', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function updateProduct(id: string, data: ProductMutationPayload): Promise<void> {
  await cmsApi(`/api/crm/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export async function deactivateProduct(id: string): Promise<void> {
  await cmsApi(`/api/crm/products/${id}/deactivate`, { method: 'PATCH' })
}
