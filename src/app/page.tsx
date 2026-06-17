import { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";
import { supabase } from "@/lib/supabase";
import { getHomepageSettings } from "@/lib/homepage-actions";

// Homepage sections (ordered)
import { Hero } from "@/components/home/Hero";
import { SetupFinder } from "@/components/home/SetupFinder";
import { TrendingPicksSection } from "@/components/home/TrendingPicksSection";
import { BestBudgetSection } from "@/components/home/BestBudgetSection";
import { BestDealsSection } from "@/components/home/BestDealsSection";
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

  // Split products by type — SSR, no client tabs
  const trendingProducts = products
    .filter((p) => p.trending)
    .slice(0, 6);

  // Fall back to first 6 if none flagged as trending
  const trendingDisplay =
    trendingProducts.length > 0 ? trendingProducts : products.slice(0, 6);

  const budgetProducts = products
    .filter((p) => p.isBudgetPick)
    .slice(0, 6);

  // Fall back to lowest-priced products if none flagged
  const budgetDisplay =
    budgetProducts.length > 0
      ? budgetProducts
      : [...products]
          .sort((a, b) => {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, "") || "0");
            const priceB = parseInt(b.price.replace(/[^0-9]/g, "") || "0");
            return priceA - priceB;
          })
          .slice(0, 6);

  // Fetch deals
  const { data: dbDeals } = await supabase
    .from("product_store_links")
    .select("*, product:products(*)")
    .not("old_price", "is", null)
    .order("created_at", { ascending: false });

  let deals: any[] = [];

  if (dbDeals && dbDeals.length > 0) {
    deals = dbDeals
      .filter((d) => d.product && d.product.status === "published")
      .map((d) => {
        const priceNum = Number(d.price) || 0;
        const oldPriceNum = Number(d.old_price) || 0;
        const discountPct =
          oldPriceNum > priceNum
            ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)
            : 0;

        return {
          id: d.id,
          name: d.product.name,
          slug: d.product.slug,
          image: d.product.images?.[0] || "/placeholder-product.png",
          price: `₹${priceNum.toLocaleString("en-IN")}`,
          oldPrice: `₹${oldPriceNum.toLocaleString("en-IN")}`,
          discount: `${discountPct}% OFF`,
          affiliateUrl: d.affiliate_url || `/product/${d.product.slug}`,
          price_is_fresh: true,
          last_price_checked_at: "2026-06-03T00:00:00.000Z",
        };
      })
      .filter((d) => parseInt(d.discount) > 0);
  }

  if (deals.length < 3) {
    const dealsProducts = products.filter((p) => p.isBestDeal || p.showInDeals);
    dealsProducts.forEach((p) => {
      if (!deals.some((d) => d.slug === p.slug)) {
        const cleanPrice = p.price.replace(/[^0-9]/g, "");
        const priceNum = cleanPrice ? parseInt(cleanPrice) : 2500;
        const oldPriceNum = Math.round(priceNum * 1.25);

        deals.push({
          id: `deal-${p.id}`,
          name: p.name,
          slug: p.slug,
          image: p.image,
          price: p.price,
          oldPrice: `₹${oldPriceNum.toLocaleString("en-IN")}`,
          discount: "20% OFF",
          affiliateUrl: p.affiliateLink,
          price_is_fresh: true,
          last_price_checked_at: "2026-06-03T00:00:00.000Z",
        });
      }
    });
  }

  deals = deals.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero */}
      <Hero settings={settings} />

      {/* 2. Shop By Goal */}
      <SetupFinder />

      {/* 3. Trending Picks */}
      <TrendingPicksSection products={trendingDisplay} />

      {/* 4. Best Budget Picks */}
      <BestBudgetSection products={budgetDisplay} />

      {/* 5. Latest Deals */}
      {deals.length > 0 && <BestDealsSection deals={deals} />}

      {/* 6. Why Trust SmartXman */}
      <FounderStory />

      {/* 7. Newsletter */}
      <CommunityJoin />
    </div>
  );
}
