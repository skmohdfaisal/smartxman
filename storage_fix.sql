-- Run this in your Supabase SQL Editor to bypass authentication issues

-- 1. Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;

-- 3. Create permissive policies that don't require authentication

-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- Allow ANYONE to upload images (fixes issues where auth token is missing)
CREATE POLICY "Public Insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'products' );
