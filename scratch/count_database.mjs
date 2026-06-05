import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function countData() {
  console.log("--- Supabase Database SEO & Count Status Check ---");

  // 1. Check products
  const { data: products, error: pErr } = await supabase
    .from('products')
    .select('id, name, slug, status, is_active');
  if (pErr) console.error("Error fetching products:", pErr);
  else {
    console.log(`Total products: ${products.length}`);
    const published = products.filter(p => p.status === 'published' && p.is_active !== false);
    console.log(`Published/Active products: ${published.length}`);
    console.log("Sample published products:", published.map(p => ({ name: p.name, slug: p.slug })));
  }

  // 2. Check categories
  const { data: categories, error: cErr } = await supabase
    .from('categories')
    .select('id, name, slug');
  if (cErr) console.error("Error fetching categories:", cErr);
  else {
    console.log(`Total categories: ${categories.length}`);
    console.log("Categories:", categories.map(c => ({ name: c.name, slug: c.slug })));
  }

  // 3. Check SEO settings
  const { data: seoSettings, error: sErr } = await supabase
    .from('seo_settings')
    .select('*');
  if (sErr) console.error("Error fetching seo_settings:", sErr);
  else {
    console.log(`Total SEO settings rows: ${seoSettings.length}`);
    console.log("SEO settings page keys:", seoSettings.map(s => s.page_key));
  }
}

countData();
