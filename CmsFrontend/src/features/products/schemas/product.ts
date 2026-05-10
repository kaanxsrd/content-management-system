import * as z from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.number({ message: 'Price is required' }).positive('Price must be positive'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  stock: z.number().int().min(0, 'Stock cannot be negative').optional()
})

export type ProductFormValues = {
  name: string
  description: string
  price: number | undefined
  imageUrl?: string
  stock?: number
}
