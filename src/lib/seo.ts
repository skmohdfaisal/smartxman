import { supabase } from "./supabase";
import type { Metadata } from "next";

// ──────────────────────────────────────────────
// SEO Settings Helper — Public Site
// ──────────────────────────────────────────────
// Fetches SEO metadata from the seo_settings table
// in Supabase and returns a Next.js Metadata object.
// Falls back to provided defaults if fetch fails.

interface SeoRow {
  page_key: string;
  page_name?: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  og_image_alt?: string;
  noindex?: boolean;
  include_in_sitemap?: boolean;
  sitemap_priority?: number;
  change_frequency?: string;
}

export async function getSeoMetadata(
  pageKey: string,
  fallback: {
    title: string;
    description: string;
    url?: string;
  }
): Promise<Metadata> {
  let seo: SeoRow | null = null;

  try {
    const { data, error } = await supabase
      .from("seo_settings")
      .select("*")
      .eq("page_key", pageKey)
      .single();

    if (!error && data) {
      seo = data;
    }
  } catch (_) {
    // Supabase unavailable — fall through to defaults
  }

  const title = seo?.meta_title || fallback.title;
  const description = seo?.meta_description || fallback.description;
  const canonicalUrl = seo?.canonical_url || fallback.url || "https://www.smartxman.com";
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;
  const ogImage = seo?.og_image_url || "/og-image.png";
  const ogImageAlt = seo?.og_image_alt || "smartXman";
  const noindex = seo?.noindex ?? false;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "smartXman",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    robots: {
      index: !noindex,
      follow: true,
    },
  };
}

// Helper to get raw sitemap data for all pages
export async function getSitemapSettings(): Promise<
  Array<{
    page_key: string;
    canonical_url: string;
    sitemap_priority: number;
    change_frequency: string;
  }>
> {
  try {
    const { data, error } = await supabase
      .from("seo_settings")
      .select("page_key, canonical_url, sitemap_priority, change_frequency, include_in_sitemap, noindex")
      .eq("include_in_sitemap", true)
      .eq("noindex", false);

    if (!error && data) {
      return data.map((row: any) => ({
        page_key: row.page_key,
        canonical_url: row.canonical_url || "",
        sitemap_priority: row.sitemap_priority ?? 0.5,
        change_frequency: row.change_frequency || "weekly",
      }));
    }
  } catch (_) {}

  return [];
}
