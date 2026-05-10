import { mutationOptions } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/query-client'
import { createCustomer } from './service'
import { customerKeys } from './queries'
import type { CreateCustomerPayload } from './types'

export const createCustomerMutation = mutationOptions({
  mutationFn: (data: CreateCustomerPayload) => createCustomer(data),
  onSuccess: () => getQueryClient().invalidateQueries({ queryKey: customerKeys.all })
})
