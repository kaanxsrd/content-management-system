import { mutationOptions } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/query-client'
import { confirmOrder, shipOrder, deliverOrder, cancelOrder } from './service'
import { orderKeys } from './queries'

export const confirmOrderMutation = mutationOptions({
  mutationFn: (id: string) => confirmOrder(id),
  onSuccess: () => getQueryClient().invalidateQueries({ queryKey: orderKeys.all })
})

export const shipOrderMutation = mutationOptions({
  mutationFn: (id: string) => shipOrder(id),
  onSuccess: () => getQueryClient().invalidateQueries({ queryKey: orderKeys.all })
})

export const deliverOrderMutation = mutationOptions({
  mutationFn: (id: string) => deliverOrder(id),
  onSuccess: () => getQueryClient().invalidateQueries({ queryKey: orderKeys.all })
})

export const cancelOrderMutation = mutationOptions({
  mutationFn: (id: string) => cancelOrder(id),
  onSuccess: () => getQueryClient().invalidateQueries({ queryKey: orderKeys.all })
})
