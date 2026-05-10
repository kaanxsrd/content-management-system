import { queryOptions } from '@tanstack/react-query'
import { getCustomers, getCustomerById } from './service'

export const customerKeys = {
  all: ['customers'] as const,
  list: () => [...customerKeys.all, 'list'] as const,
  detail: (id: string) => [...customerKeys.all, 'detail', id] as const
}

export const customersQueryOptions = () =>
  queryOptions({
    queryKey: customerKeys.list(),
    queryFn: () => getCustomers()
  })

export const customerByIdOptions = (id: string) =>
  queryOptions({
    queryKey: customerKeys.detail(id),
    queryFn: () => getCustomerById(id)
  })
