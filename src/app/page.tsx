import { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";
import { supabase } from "@/lib/supabase";
import { getHomepageSettings } from "@/lib/homepage-actions";
import { getBlogs } from "@/lib/blogs-actions";

// Homepage sections (ordered)
import { Hero } from "@/components/home/Hero";
import { TrendingPicksSection } from "@/components/home/TrendingPicksSection";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { BestBudgetSection } from "@/components/home/BestBudgetSection";
import { SetupFinder } from "@/components/home/SetupFinder";
import { ArticleGrid } from "@/components/home/ArticleGrid";
import { FinalCTA } from "@/components/home/FinalCTA";
import { FounderStory } from "@/components/home/FounderStory";
import { CommunityJoin } from "@/components/home/CommunityJoin";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("homepage", {
    title: "SmartXman | Find Products Worth Buying",
    description:
      "SmartXman helps students, creators, gamers and everyday buyers find useful products without wasting hours comparing reviews, videos and specifications.",
    url: "https://smartxman.com",
  });
}

export const revalidate = 60;

export default async function Home() {
  const homeSettingsRes = await getHomepageSettings();
  const settings = homeSettingsRes?.success ? homeSettingsRes.data : null;

  // Fetch published products
  const { data: dbProducts } = await supabase
    .from("products")
    .select("*, primary_category:categories!products_primary_category_id_fkey(*)")
    .order("created_at", { ascending: false });

  const activeProducts = (dbProducts || []).filter(
    (p) => p.is_active !== false && p.status === "published"
  );

  const products = activeProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price_range || "Check Price",
    rating: Number(p.rating) || 0,
    reviews: 840,
    image: p.images?.[0] || "/placeholder-product.png",
    images: p.images || [],
    category: p.primary_category?.name || "Tech Accessories",
    subCategory: p.sub_category || "",
    brand: p.brand || "",
    affiliateLink: p.affiliate_link || p.affiliate_url || "#",
    expertNote: p.expert_note || "",
    featured: p.featured || false,
    trending: p.trending || false,
    isBudgetPick: p.is_budget_pick || false,
    isBestDeal: p.is_best_deal || false,
    showOnHomepage: p.show_on_homepage || false,
    showInDeals: p.show_in_deals || false,
    smartScore: Number(p.smart_score) || 8.0,
    valueScore: Number(p.value_score) || 8.0,
    pros: p.pros || [],
    cons: p.cons || [],
    bestFor: p.best_for || "",
    whoShouldBuy: p.who_should_buy || "",
    whoShouldAvoid: p.who_should_avoid || "",
    buyingVerdict: p.buying_verdict || "",
    audience: p.audience || [],
    useCase: p.use_case || [],
    budgetRange: p.budget_range || [],
    tags: p.tags || [],
    current_price: p.current_price,
    old_price: p.old_price,
    price_is_fresh: p.price_is_fresh,
    last_price_checked_at: p.last_price_checked_at,
  }));

  // Split products by type
  const trendingProducts = products.filter((p) => p.trending).slice(0, 6);
  const trendingDisplay = trendingProducts.length > 0 ? trendingProducts : products.slice(0, 6);

  const budgetProducts = products.filter((p) => p.isBudgetPick).slice(0, 6);
  const budgetDisplay = budgetProducts.length > 0
      ? budgetProducts
      : [...products]
          .sort((a, b) => {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, "") || "0");
            const priceB = parseInt(b.price.replace(/[^0-9]/g, "") || "0");
            return priceA - priceB;
          })
          .slice(0, 6);

  // Fetch blogs
  const blogsRes = await getBlogs();
  const allBlogs = blogsRes.success && Array.isArray(blogsRes.data) ? blogsRes.data : [];
  const publishedBlogs = allBlogs.filter((b) => b.status === "published" || b.status === "Published");

  // 1. Latest Guides: Max 3, sorted by date. Must be published. 
  // Optionally filter by show_on_homepage if you want strict editorial control, 
  // but if none found, fallback to latest 3.
  let latestGuides = publishedBlogs
    .filter((b) => b.show_on_homepage)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);
  
  if (latestGuides.length === 0) {
    latestGuides = publishedBlogs
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
  }

  // 2. Popular Guides: Max 3. Ranked by is_popular flag, fallback to view_count, fallback to older ones.
  // Must not overlap with latestGuides if possible.
  const latestGuidesIds = new Set(latestGuides.map(g => g.id));
  
  let popularGuides = publishedBlogs
    .filter((b) => b.is_popular && !latestGuidesIds.has(b.id))
    .slice(0, 3);
    
  if (popularGuides.length < 3) {
    const fallbackPopular = publishedBlogs
      .filter((b) => !latestGuidesIds.has(b.id) && !popularGuides.some(p => p.id === b.id))
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 3 - popularGuides.length);
    popularGuides = [...popularGuides, ...fallbackPopular];
  }

  // Map to Guide interface
  const mapBlogToGuide = (b: any) => ({
    title: b.title,
    tag: b.category,
    readTime: b.read_time,
    image: b.cover_image_url || b.cover_image || "/categories/tech.png",
    href: `/blog/${b.slug}`
  });

  const latestGuideProps = latestGuides.map(mapBlogToGuide);
  const popularGuideProps = popularGuides.map(mapBlogToGuide);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero */}
      <Hero settings={settings} />

      {/* 2. Popular / Featured Products */}
      <TrendingPicksSection products={trendingDisplay} />

      {/* 3. Browse By Category */}
      <ShopByCategory />

      {/* 4. Best Budget Picks */}
      <BestBudgetSection products={budgetDisplay} />

      {/* 5. Setup / Use-case discovery */}
      <SetupFinder />

      {/* 6. Latest Smart Guides */}
      {latestGuideProps.length > 0 && (
        <ArticleGrid 
          title={
            <>
              Latest <span className="text-brand-600">Smart Guides</span>
            </>
          }
          subtitle="In-depth research and comparisons so you don't have to read 50 Reddit threads."
          guides={latestGuideProps}
          linkHref="/blog"
          linkText="Read All Guides"
          bgClass="bg-white dark:bg-slate-950"
        />
      )}

      {/* 7. Popular Guides */}
      {popularGuideProps.length > 0 && (
        <ArticleGrid 
          title={
            <>
              Popular <span className="text-brand-600">Guides</span>
            </>
          }
          subtitle="The most read setups and product reviews from our community."
          guides={popularGuideProps}
          bgClass="bg-slate-50 dark:bg-slate-900/30"
        />
      )}

      {/* 8. Explore Products CTA */}
      <FinalCTA />

      {/* 9. Trust / Why SmartXman */}
      <FounderStory />

      {/* 10. Newsletter */}
      <CommunityJoin />
    </div>
  );
}
