-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  category TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id),
  customer_email TEXT,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for products (public read, admin write)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (active = true);

CREATE POLICY "Products are writable by service role" ON products
  FOR ALL USING (auth.role() = 'service_role');

-- Policies for orders (admin only)
CREATE POLICY "Orders are writable by service role" ON orders
  FOR ALL USING (auth.role() = 'service_role');

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for public read
CREATE POLICY "Product images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Storage policy for service role upload
CREATE POLICY "Service role can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'service_role');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Site Settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
  hero_opacity INTEGER DEFAULT 100,
  hero_brightness INTEGER DEFAULT 110,
  hero_overlay_opacity INTEGER DEFAULT 50,
  hero_title TEXT,
  hero_subtitle1 TEXT,
  hero_subtitle2 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy for site_settings
CREATE POLICY "Site settings are readable by everyone" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Site settings are writable by service role" ON site_settings
  FOR ALL USING (auth.role() = 'service_role');

-- Apply trigger to site_settings
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO site_settings (hero_image_url, hero_opacity, hero_brightness, hero_overlay_opacity)
VALUES ('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80', 100, 110, 50)
ON CONFLICT DO NOTHING;

-- Sound Settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS bg_music_url TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS bg_music_volume INTEGER DEFAULT 30;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS bg_music_enabled BOOLEAN DEFAULT false;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS sound_hover_enabled BOOLEAN DEFAULT true;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS sound_click_enabled BOOLEAN DEFAULT true;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS sound_hover_url TEXT DEFAULT 'https://cdn.freesound.org/previews/256/256113_4097033-lq.mp3';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS sound_click_url TEXT DEFAULT 'https://cdn.freesound.org/previews/316/316847_4939433-lq.mp3';
