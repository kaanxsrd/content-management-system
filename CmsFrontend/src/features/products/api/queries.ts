import { queryOptions } from '@tanstack/react-query'
import { getProducts, getProductById } from './service'
import type { Product } from './types'

export type { Product }

export const productKeys = {
  all: ['products'] as const,
  list: () => [...productKeys.all, 'list'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const
}

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: productKeys.list(),
    queryFn: () => getProducts()
  })

export const productByIdOptions = (id: string) =>
  queryOptions({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id)
  })
