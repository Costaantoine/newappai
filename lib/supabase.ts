import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase credentials manquantes - auth et storage désactivés')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function uploadToSupabase(
  file: File,
  bucket: string = 'media',
  path?: string
): Promise<string | null> {
  if (!supabaseAdmin) {
    console.error('Supabase admin non configuré')
    return null
  }

  const filePath = path || `${Date.now()}-${file.name}`
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Erreur upload Supabase:', error)
    return null
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return urlData?.publicUrl || null
}

export async function deleteFromSupabase(path: string, bucket: string = 'media'): Promise<boolean> {
  if (!supabaseAdmin) return false
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path])
  return !error
}
