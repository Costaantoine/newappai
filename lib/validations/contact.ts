import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(200),
  email: z.string().email('Email invalide'),
  subject: z.string().min(1, 'Sujet requis').max(500),
  message: z.string().min(10, 'Message trop court (min 10 caractères)').max(5000),
})

export type ContactFormInput = z.infer<typeof ContactFormSchema>
