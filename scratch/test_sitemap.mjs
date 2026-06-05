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

async function testSitemap() {
  const baseUrl = 'https://www.smartxman.com';
  
  // Static Fallback Routes
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/deals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Products
  const { data: products, error: pErr } = await supabase
    .from('products')
    .select('slug, updated_at, images')
    .order('updated_at', { ascending: false });

  if (pErr) {
    console.error("Products error:", pErr);
  }
  
  const productRoutes = (products || []).map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Categories
  const { data: categories, error: cErr } = await supabase
    .from('categories')
    .select('slug');

  if (cErr) {
    console.error("Categories error:", cErr);
  }

  const categoryRoutes = (categories || []).map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const allRoutes = [...staticRoutes, ...categoryRoutes, ...productRoutes];
  console.log(`Generated Sitemap successfully with ${allRoutes.length} entries!`);
  console.log("--- Fallbacks (First 3) ---");
  console.log(staticRoutes.slice(0, 3));
  console.log("--- Categories (First 3) ---");
  console.log(categoryRoutes.slice(0, 3));
  console.log("--- Products (First 3) ---");
  console.log(productRoutes.slice(0, 3));
}

testSitemap();
