import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

// ISR — regenerate sitemap every hour
export const revalidate = 3600;

const BASE_URL = 'https://www.smartxman.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use a fixed site update timestamp for core static pages, rather than new Date() every request
  const staticLastMod = new Date('2026-11-17T00:00:00.000Z');

  // ─── Core Static Routes ───────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                              lastModified: staticLastMod, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/products`,                lastModified: staticLastMod, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/blog`,                    lastModified: staticLastMod, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/about`,                   lastModified: staticLastMod, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`,                 lastModified: staticLastMod, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`,                 lastModified: staticLastMod, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terms`,                   lastModified: staticLastMod, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/affiliate-disclosure`,    lastModified: staticLastMod, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // ─── Published Products ───────────────────────────
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .neq('is_active', false)
      .order('created_at', { ascending: false });

    productRoutes = (products || [])
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${BASE_URL}/product/${p.slug}`,
        lastModified: p.updated_at
          ? new Date(p.updated_at)
          : (p.created_at ? new Date(p.created_at) : staticLastMod),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (err) {
    console.error('Failed to fetch products for sitemap:', err);
  }

  // ─── Categories ──────────────────────────────────
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, created_at');

    categoryRoutes = (categories || [])
      .filter((c) => c.slug)
      .map((c) => ({
        url: `${BASE_URL}/category/${c.slug}`,
        lastModified: c.created_at ? new Date(c.created_at) : staticLastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch (err) {
    console.error('Failed to fetch categories for sitemap:', err);
  }

  // ─── Published Blog Posts ─────────────────────────
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, updated_at, created_at, published_at, noindex')
      .eq('status', 'published');

    blogRoutes = (blogs || [])
      .filter((b) => b.slug && !b.noindex)
      .map((b) => ({
        url: `${BASE_URL}/blog/${b.slug}`,
        lastModified: b.updated_at
          ? new Date(b.updated_at)
          : (b.published_at
              ? new Date(b.published_at)
              : (b.created_at ? new Date(b.created_at) : staticLastMod)),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch (err) {
    console.error('Failed to fetch blogs for sitemap:', err);
  }

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...blogRoutes,
  ];
}
