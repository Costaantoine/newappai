import { z } from 'zod'

export const CreateOrderSchema = z.object({
  productId: z.string().uuid('ID produit invalide'),
  quantity: z.number().int().min(1, 'Quantité minimale: 1').default(1),
  customerEmail: z.string().email('Email invalide'),
  customerName: z.string().min(1, 'Nom requis').max(200),
  metadata: z.record(z.string(), z.string()).optional().default({}),
})

export const UpdateOrderSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'completed', 'cancelled', 'refunded']).optional(),
  quantity: z.number().int().min(1).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
})

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>
