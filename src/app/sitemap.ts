import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

// ISR — regenerate sitemap every hour, not on every request
export const revalidate = 3600

const BASE_URL = 'https://smartxman.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // ─── Static routes ───────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                              lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/products`,                lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/deals`,                   lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/blog`,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/about`,                   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terms`,                   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/affiliate-disclosure`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  // ─── Published products ───────────────────────────
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at, created_at, images')
      .eq('status', 'published')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    productRoutes = (products || []).map((p) => ({
      url: `${BASE_URL}/product/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(p.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (_) {}

  // ─── Categories ──────────────────────────────────
  let categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('slug')

    categoryRoutes = (categories || []).map((c) => ({
      url: `${BASE_URL}/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (_) {}

  // ─── Published blog posts ─────────────────────────
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, updated_at')
      .eq('status', 'published')

    blogRoutes = (blogs || []).map((b) => ({
      url: `${BASE_URL}/blog/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (_) {}

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...blogRoutes,
  ]
}
