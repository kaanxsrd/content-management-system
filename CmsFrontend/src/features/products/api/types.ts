export type Product = {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string | null
  isActive: boolean
  stock: number
}

export type ProductsResponse = {
  total_products: number
  products: Product[]
}

export type ProductByIdResponse = {
  product: Product | null
}

export type ProductMutationPayload = {
  name: string
  description: string
  price: number
  imageUrl?: string | null
  stock?: number
}
