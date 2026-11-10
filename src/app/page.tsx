import { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";
import { supabase } from "@/lib/supabase";
import { getHomepageSettings } from "@/lib/homepage-actions";
import { getBlogs } from "@/lib/blogs-actions";

// Homepage sections (ordered per Human-Centric Editorial Design Structure)
import { Hero } from "@/components/home/Hero";
import { ExploreByBudget } from "@/components/home/ExploreByBudget";
import { HandpickedPicks } from "@/components/home/HandpickedPicks";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { BuildYourSetup } from "@/components/home/BuildYourSetup";
import { ArticleGrid } from "@/components/home/ArticleGrid";
import { FounderStory } from "@/components/home/FounderStory";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("homepage", {
    title: "SmartXman | Good Tech. Better Choices.",
    description:
      "Useful gadgets, smarter setups, and products worth your money. Handpicked recommendations for students, creators, gamers, and everyday buyers.",
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

  // Fetch blogs
  const blogsRes = await getBlogs();
  const allBlogs = blogsRes.success && Array.isArray(blogsRes.data) ? blogsRes.data : [];
  const publishedBlogs = allBlogs.filter((b) => b.status === "published" || b.status === "Published");

  // Show strictly 3 latest published guides
  const latestGuides = publishedBlogs
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const guideProps = latestGuides.map((b: any) => ({
    title: b.title,
    tag: b.category,
    readTime: b.read_time,
    image: b.cover_image_url || b.cover_image || "/categories/tech.png",
    href: `/blog/${b.slug}`,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Section 1 — Editorial Hero */}
      <Hero settings={settings} featuredProducts={products} />

      {/* Section 2 — Explore by Budget (Interactive Discovery) */}
      <ExploreByBudget />

      {/* Section 3 — Handpicked Smart Picks (4–6 actual products) */}
      <HandpickedPicks products={products} />

      {/* Section 4 — Explore by Category (Clean visual directory) */}
      <ShopByCategory />

      {/* Section 5 — Build Your Setup */}
      <BuildYourSetup />

      {/* Section 6 — Smart Guides (3 latest articles) */}
      {guideProps.length > 0 && (
        <ArticleGrid
          title={
            <>
              Smart Guides <span className="text-brand-600 dark:text-brand-400">&amp; Buying Advice</span>
            </>
          }
          subtitle="In-depth research and comparisons so you don't have to waste hours on 50 Reddit threads."
          guides={guideProps}
          linkHref="/blog"
          linkText="Read All Guides"
          bgClass="bg-white dark:bg-slate-950"
        />
      )}

      {/* Section 7 — Founder Editorial Note */}
      <FounderStory />

      {/* Section 8 — Footer (Rendered automatically by RootLayout) */}
    </div>
  );
}
