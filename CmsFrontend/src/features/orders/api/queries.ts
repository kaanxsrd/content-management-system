import { queryOptions } from '@tanstack/react-query'
import { getOrders, getOrderById } from './service'
import type { Order } from './types'

export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
  byCustomer: (customerId: string) => [...orderKeys.all, 'by-customer', customerId] as const
}

export const ordersQueryOptions = () =>
  queryOptions({
    queryKey: orderKeys.list(),
    queryFn: () => getOrders()
  })

export const orderByIdOptions = (id: string) =>
  queryOptions({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrderById(id)
  })

export const ordersByCustomerOptions = (customerId: string) =>
  queryOptions({
    queryKey: orderKeys.byCustomer(customerId),
    queryFn: async (): Promise<Order[]> => {
      const res = await fetch(`/api/crm/orders/by-customer/${customerId}`)
      if (!res.ok) return []
      return res.json()
    }
  })
