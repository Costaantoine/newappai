import { z } from 'zod'

export const CreateProductSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  description: z.string().max(2000).optional().default(''),
  price: z.number().int().min(0, 'Le prix doit être positif'),
  images: z.array(z.string().url('URL image invalide')).optional().default([]),
  category: z.string().max(100).optional().default(''),
  active: z.boolean().optional().default(true),
})

export const UpdateProductSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  price: z.number().int().min(0).optional(),
  images: z.array(z.string().url()).optional(),
  category: z.string().max(100).optional(),
  active: z.boolean().optional(),
})

export type CreateProductInput = z.infer<typeof CreateProductSchema>
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>
