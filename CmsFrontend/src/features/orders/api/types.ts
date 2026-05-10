export type OrderItem = {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export type Order = {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  shippingAddressId: string
  shippingAddress: string
  status: string
  totalAmount: number
  createdAtUtc: string
  items: OrderItem[]
}

export type OrdersResponse = {
  total_orders: number
  orders: Order[]
}
