'use server'

import { cmsApi } from '@/lib/cms-api-client'
import type { Customer, CustomersResponse, CreateCustomerPayload } from './types'

export async function getCustomers(): Promise<CustomersResponse> {
  const customers = await cmsApi<Customer[]>('/api/crm/customers')
  return { total_customers: customers.length, customers }
}

export async function getCustomerById(id: string): Promise<Customer> {
  return cmsApi<Customer>(`/api/crm/customers/${id}`)
}

export async function createCustomer(data: CreateCustomerPayload): Promise<Customer> {
  return cmsApi<Customer>('/api/crm/customers', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
