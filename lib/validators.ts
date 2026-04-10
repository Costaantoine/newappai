import { z } from 'zod'

// ─── Products ────────────────────────────────────────────────────────────────

export const CreateProductSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  description: z.string().max(2000).optional().default(''),
  price: z.number('Le prix est requis').int().min(0, 'Le prix doit être positif'),
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

// ─── Texts ───────────────────────────────────────────────────────────────────

export const CreateTextSchema = z.object({
  key: z.string().min(1, 'La clé est requise').max(100).regex(/^[a-z0-9_]+$/, 'La clé doit être en minuscules (lettres, chiffres, underscores)'),
  fr: z.string().min(1, 'Le texte FR est requis').max(5000),
  en: z.string().max(5000).optional().default(''),
  pt: z.string().max(5000).optional().default(''),
  es: z.string().max(5000).optional().default(''),
  section: z.string().max(100).optional().default(''),
})

export const UpdateTextSchema = z.object({
  key: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/).optional(),
  fr: z.string().min(1).max(5000).optional(),
  en: z.string().max(5000).optional(),
  pt: z.string().max(5000).optional(),
  es: z.string().max(5000).optional(),
  section: z.string().max(100).optional(),
})

// ─── Zones ───────────────────────────────────────────────────────────────────

const VALID_COLORS = ['sky', 'purple', 'emerald', 'orange', 'rose', 'indigo', 'amber', 'teal', 'cyan', 'violet'] as const

export const CreateZoneSchema = z.object({
  key: z.string().min(1, 'La clé est requise').max(100),
  title_key: z.string().min(1, 'title_key est requis').max(100),
  subtitle_key: z.string().max(100).optional().default(''),
  badge: z.string().max(50).optional().default(''),
  color: z.enum(VALID_COLORS).optional().default('sky'),
  url: z.string().max(500).optional().default(''),
  cta_key: z.string().max(100).optional().default(''),
  newtab_key: z.string().max(100).optional().default(''),
  order: z.number().int().min(0).optional().default(0),
  active: z.boolean().optional().default(true),
})

export const UpdateZoneSchema = CreateZoneSchema.partial()

// ─── ZoneCards ────────────────────────────────────────────────────────────────

export const CreateZoneCardSchema = z.object({
  zone_id: z.string().uuid('zone_id doit être un UUID valide'),
  title_key: z.string().min(1, 'title_key est requis').max(100),
  description_key: z.string().max(100).optional().default(''),
  badge_key: z.string().max(100).optional().default(''),
  image_url: z.string().max(500).optional().default(''),
  order: z.number().int().min(0).optional().default(0),
  active: z.boolean().optional().default(true),
})

export const UpdateZoneCardSchema = CreateZoneCardSchema.partial()

// ─── Solutions ────────────────────────────────────────────────────────────────

export const CreateSolutionSchema = z.object({
  key: z.string().min(1, 'La clé est requise').max(100),
  fr: z.string().min(1, 'Le texte FR est requis').max(5000),
  en: z.string().max(5000).optional().default(''),
  pt: z.string().max(5000).optional().default(''),
  es: z.string().max(5000).optional().default(''),
  section: z.string().max(100).optional().default('solutions'),
  type: z.string().max(50).optional().default('description'),
  category: z.string().max(100).optional().default('general'),
})

export const UpdateSolutionSchema = CreateSolutionSchema.partial()

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  password: z.string().min(1, 'Le mot de passe est requis').max(200),
})

// ─── Contact ──────────────────────────────────────────────────────────────────

export const ContactSchema = z.object({
  name: z.string().min(2, 'Le nom est requis (min 2 caractères)').max(100),
  email: z.string().email('Email invalide').max(200),
  subject: z.string().min(1, 'Le sujet est requis').max(200),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(5000),
})

// ─── Settings ────────────────────────────────────────────────────────────────

export const UpdateSettingsSchema = z.object({
  hero_image_url: z.string().max(500).optional(),
  hero_opacity: z.number().min(0).max(1).optional(),
  hero_brightness: z.number().min(0).max(2).optional(),
  hero_overlay_opacity: z.number().min(0).max(1).optional(),
  hero_title: z.string().max(200).optional(),
  hero_subtitle1: z.string().max(300).optional(),
  hero_subtitle2: z.string().max(300).optional(),
}).passthrough()

// ─── Helper ───────────────────────────────────────────────────────────────────

export function formatZodError(error: z.ZodError): string {
  // Zod v4 uses .issues; v3 uses .errors (kept for compat)
  const issues = (error.issues ?? (error as unknown as { errors: z.ZodIssue[] }).errors) ?? []
  return issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ')
}
