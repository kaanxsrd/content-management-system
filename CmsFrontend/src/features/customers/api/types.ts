export type Address = {
  id: string
  street: string
  city: string
  zipCode: string
  country: string
}

export type Customer = {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  address: Address
}

export type CustomersResponse = {
  total_customers: number
  customers: Customer[]
}

export type CreateCustomerPayload = {
  firstName: string
  lastName: string
  email: string
  street: string
  city: string
  zipCode: string
  country: string
}
