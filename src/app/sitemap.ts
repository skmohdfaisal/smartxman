import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Map page_key to URL path
const pageKeyToPath: Record<string, string> = {
  homepage: '',
  products: '/products',
  categories: '/categories',
  'build-my-setup': '/build-my-setup',
  'budget-picks': '/budget-picks',
  deals: '/deals',
  blog: '/blog',
  about: '/about',
  'affiliate-disclosure': '/affiliate-disclosure',
  'privacy-policy': '/privacy',
  terms: '/terms',
  contact: '/contact',
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://smartxman.com'

  // ─── Fetch SEO settings for static pages ───
  let seoSettings: any[] = [];
  try {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('page_key, canonical_url, sitemap_priority, change_frequency, include_in_sitemap, noindex');
    
    if (!error && data) {
      seoSettings = data.filter(
        (row: any) => row.include_in_sitemap !== false && !row.noindex
      );
    }
  } catch (_) {
    // Supabase unavailable — use hardcoded fallback
  }

  // ─── Build static routes ───────────────────
  let staticRoutes: MetadataRoute.Sitemap = [];

  if (seoSettings.length > 0) {
    // Use DB settings
    for (const row of seoSettings) {
      const urlPath = pageKeyToPath[row.page_key];
      if (urlPath === undefined) continue; // Skip dynamic templates

      staticRoutes.push({
        url: row.canonical_url || `${baseUrl}${urlPath}`,
        lastModified: new Date(),
        changeFrequency: (row.change_frequency || 'weekly') as any,
        priority: row.sitemap_priority ?? 0.5,
      });
    }
  } else {
    // Hardcoded fallback
    staticRoutes = [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
      { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/deals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
      { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
      { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ];
  }

  // ─── Fetch dynamic routes ──────────────────

  // Products
  const { data: products } = await supabase
    .from('products')
    .select('slug, created_at, images')
    .order('created_at', { ascending: false });

  const productRoutes: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.created_at ? new Date(product.created_at) : new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
    images: product.images && product.images.length > 0 ? product.images : undefined,
  }));

  // Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug');

  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Blogs
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, updated_at, cover_image')
    .eq('status', 'published');

  const blogRoutes: MetadataRoute.Sitemap = (blogs || []).map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
    images: blog.cover_image ? [blog.cover_image] : undefined,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
