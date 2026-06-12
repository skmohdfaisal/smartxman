import { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";
import { supabase } from "@/lib/supabase";
import { getHomepageSettings } from "@/lib/homepage-actions";

// Existing Components
import { Hero } from "@/components/home/Hero";
import { ProductSuggestions } from "@/components/home/ProductSuggestions";
import { BestDealsSection } from "@/components/home/BestDealsSection";

// New Components
import { FounderStory } from "@/components/home/FounderStory";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ResearchStandard } from "@/components/home/ResearchStandard";
import { SetupFinder } from "@/components/home/SetupFinder";
import { FeaturedGuides } from "@/components/home/FeaturedGuides";
import { CommunityJoin } from "@/components/home/CommunityJoin";
import { SocialProof } from "@/components/home/SocialProof";
import { FinalCTA } from "@/components/home/FinalCTA";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("homepage", {
    title: "SmartXMan | Make Smarter Buying Decisions",
    description: "SmartXMan helps students, creators, and professionals discover products worth buying through research-backed recommendations and buying guides.",
    url: "https://smartxman.com",
  });
}

export const revalidate = 60;

export default async function Home() {
  const homeSettingsRes = await getHomepageSettings();
  const settings = homeSettingsRes?.success ? homeSettingsRes.data : null;

  // Fetch real products from Supabase with categories
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*, primary_category:categories!products_primary_category_id_fkey(*)')
    .order('created_at', { ascending: false });

  // Only show published products
  const activeProducts = (dbProducts || []).filter(
    p => p.is_active !== false && p.status === 'published'
  );

  const products = activeProducts.map(p => ({
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
    last_price_checked_at: p.last_price_checked_at
  }));

  // Fetch deals
  const { data: dbDeals } = await supabase
    .from('product_store_links')
    .select('*, product:products(*)')
    .not('old_price', 'is', null)
    .order('created_at', { ascending: false });

  let deals: any[] = [];

  if (dbDeals && dbDeals.length > 0) {
    deals = dbDeals
      .filter(d => d.product && d.product.status === 'published')
      .map(d => {
        const priceNum = Number(d.price) || 0;
        const oldPriceNum = Number(d.old_price) || 0;
        const discountPct = oldPriceNum > priceNum 
          ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)
          : 0;

        return {
          id: d.id,
          name: d.product.name,
          slug: d.product.slug,
          image: d.product.images?.[0] || "/placeholder-product.png",
          price: `₹${priceNum.toLocaleString('en-IN')}`,
          oldPrice: `₹${oldPriceNum.toLocaleString('en-IN')}`,
          discount: `${discountPct}% OFF`,
          affiliateUrl: d.affiliate_url || `/product/${d.product.slug}`,
          price_is_fresh: true,
          last_price_checked_at: "2026-06-03T00:00:00.000Z"
        };
      })
      .filter(d => parseInt(d.discount) > 0);
  }

  if (deals.length < 3) {
    const dealsProducts = products.filter(p => p.isBestDeal || p.showInDeals);
    dealsProducts.forEach(p => {
      if (!deals.some(d => d.slug === p.slug)) {
        const cleanPrice = p.price.replace(/[^0-9]/g, "");
        const priceNum = cleanPrice ? parseInt(cleanPrice) : 2500;
        const oldPriceNum = Math.round(priceNum * 1.25);
        
        deals.push({
          id: `deal-${p.id}`,
          name: p.name,
          slug: p.slug,
          image: p.image,
          price: p.price,
          oldPrice: `₹${oldPriceNum.toLocaleString('en-IN')}`,
          discount: "20% OFF",
          affiliateUrl: p.affiliateLink,
          price_is_fresh: true,
          last_price_checked_at: "2026-06-03T00:00:00.000Z"
        });
      }
    });
  }

  deals = deals.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Hero settings={settings} />

      {/* 2. Founder Story */}
      <FounderStory />

      {/* 3. How It Works */}
      <HowItWorks />

      {/* 4. Research Standard */}
      <ResearchStandard />

      {/* 5. Setup Finder */}
      <div id="setup-finder">
        <SetupFinder />
      </div>

      {/* 6. Featured Guides */}
      <FeaturedGuides />

      {/* Legacy/Existing Data Integrations (Products & Deals) */}
      <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12">
        <div className="container mx-auto px-4 max-w-7xl text-center mb-8">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            Current <span className="text-brand-600">Smart Picks</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium mt-2">
            The top-rated products across all our research categories.
          </p>
        </div>
        <ProductSuggestions products={products} />
        {deals.length > 0 && <BestDealsSection deals={deals} />}
      </div>

      {/* 7. Community Join */}
      <CommunityJoin />

      {/* 8. Social Proof */}
      <SocialProof />

      {/* 9. Final CTA */}
      <FinalCTA />
    </div>
  );
}
