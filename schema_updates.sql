-- Schema updates for smartXman multiple categories & discovery features
-- Run this script in your Supabase SQL Editor

-- 1. Create product_categories many-to-many table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(product_id, category_id)
);

-- Enable RLS for product_categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Policies for product_categories
CREATE POLICY "Product categories are viewable by everyone" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Admin can insert product_categories" ON public.product_categories FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.uid() AND public.users.role = 'admin'));
CREATE POLICY "Admin can update product_categories" ON public.product_categories FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.uid() AND public.users.role = 'admin'));
CREATE POLICY "Admin can delete product_categories" ON public.product_categories FOR DELETE USING (EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.uid() AND public.users.role = 'admin'));

-- 2. Add discovery columns to products table
-- We use arrays so one product can have multiple audiences/budgets/use cases
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS audience TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS budget_range TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS use_case TEXT[] DEFAULT '{}';
-- Add primary_category_id to keep backward compatibility or identify the main category
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS primary_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- 3. Add management columns to categories table
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS category_type TEXT DEFAULT 'Main Category';
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 4. Initial Migration (Optional)
-- This copies the current products.category_id into the new product_categories table
INSERT INTO public.product_categories (product_id, category_id)
SELECT id, category_id FROM public.products WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- This copies the current products.category_id to products.primary_category_id
UPDATE public.products SET primary_category_id = category_id WHERE primary_category_id IS NULL AND category_id IS NOT NULL;
