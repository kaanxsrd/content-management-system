'use server'

import { cmsApi } from '@/lib/cms-api-client'
import type { Order, OrdersResponse } from './types'

export async function getOrders(): Promise<OrdersResponse> {
  const orders = await cmsApi<Order[]>('/api/crm/orders')
  return { total_orders: orders.length, orders }
}

export async function getOrderById(id: string): Promise<Order> {
  return cmsApi<Order>(`/api/crm/orders/${id}`)
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  return cmsApi<Order[]>(`/api/crm/orders/by-customer/${customerId}`)
}

export async function confirmOrder(id: string): Promise<void> {
  await cmsApi(`/api/crm/orders/${id}/confirm`, { method: 'PUT' })
}

export async function shipOrder(id: string): Promise<void> {
  await cmsApi(`/api/crm/orders/${id}/ship`, { method: 'PUT' })
}

export async function deliverOrder(id: string): Promise<void> {
  await cmsApi(`/api/crm/orders/${id}/deliver`, { method: 'PUT' })
}

export async function cancelOrder(id: string): Promise<void> {
  await cmsApi(`/api/crm/orders/${id}/cancel`, { method: 'PUT' })
}
