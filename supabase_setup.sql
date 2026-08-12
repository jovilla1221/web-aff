-- =====================================================
-- SUPABASE DATABASE SETUP FOR kazeera.id
-- Copy and paste this into Supabase SQL Editor & click Run!
-- =====================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    affiliate_url TEXT NOT NULL,
    category TEXT DEFAULT 'kawat_bulu',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS) & Allow Public Read / Authenticated Writes
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous public read access for visitors
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

-- Allow full access for anon/service key (used by server.js API)
CREATE POLICY "Public Insert Categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Public Delete Categories" ON public.categories FOR DELETE USING (true);

CREATE POLICY "Public Insert Products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public Delete Products" ON public.products FOR DELETE USING (true);

-- 4. Insert Default Seed Data
INSERT INTO public.categories (id, name, sort_order) VALUES
('kawat_bulu', 'Kawat Bulu', 1),
('fashion', 'Fashion', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, title, affiliate_url, category, sort_order, is_active) VALUES
('kb-001', 'Kawat Bulu Mercy Pastel / Pipe Cleaner DIY Craft (100 Pcs)', 'https://s.shopee.co.id/7Kz9X1mP8Q', 'kawat_bulu', 1, true),
('kb-002', 'Paket DIY Bunga Kawat Bulu Tulip Full Set + Pot & Solasi', 'https://s.shopee.co.id/8Ly0Y2nQ9R', 'kawat_bulu', 2, true),
('kb-003', 'Kawat Bulu Macaron Soft Color Premium (50 Pcs)', 'https://s.shopee.co.id/9Mz1Z3oR0S', 'kawat_bulu', 3, true),
('kb-004', 'Lem Tembak Mini Melt Gun Kerajinan Kawat Bulu', 'https://s.shopee.co.id/1Na2A4pS1T', 'kawat_bulu', 4, true),
('kb-005', 'Tang Potong Mini & Pinset DIY Kawat Bulu', 'https://s.shopee.co.id/2Ob3B5qT2U', 'kawat_bulu', 5, true)
ON CONFLICT (id) DO NOTHING;
