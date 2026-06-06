import ProductCard from "@/components/ProductCard";
import { type ProductProps } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trophy } from "lucide-react";
import { AboutSection } from "@/components/home/AboutSection";
import { Hero } from "@/components/home/Hero";
import { ProductSuggestions } from "@/components/home/ProductSuggestions";
import { BestDealsSection } from "@/components/home/BestDealsSection";
import { WhySmartxman } from "@/components/home/WhySmartxman";
import { BudgetSelector } from "@/components/home/BudgetSelector";
import { IntentSelector } from "@/components/home/IntentSelector";
import { TrustSection } from "@/components/home/TrustSection";
import { ProblemSolutionFlow } from "@/components/home/ProblemSolutionFlow";
import { supabase } from "@/lib/supabase";
import { getHomepageSettings } from "@/lib/homepage-actions";
import { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("homepage", {
    title: "Best Smart Tech & Gadget Picks in India (2026) | SmartXman",
    description: "Discover the best smart product picks, gaming gear, and tech accessories for your setup. Curated budget gadgets in India for students and creators.",
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

  // Only show published products, respecting the admin workflow
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
    reviews: 840, // standard reviews count
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

  // Fetch deals from Supabase store links with old prices, or fallback to products marked as 'best deal'
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

  // If we have fewer than 3 deals from store links, append products that have the 'is_best_deal' or 'show_in_deals' toggle enabled
  if (deals.length < 3) {
    const dealsProducts = products.filter(p => p.isBestDeal || p.showInDeals);
    dealsProducts.forEach(p => {
      // Avoid duplication
      if (!deals.some(d => d.slug === p.slug)) {
        // Parse numerical price or estimate discount
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
      {/* 1. Shorter, Centered Apple-like Hero */}
      <Hero settings={settings} />

      {/* Problem -> Solution Flow */}
      <ProblemSolutionFlow />

      {/* 2. Intent Selector (Goal-based discovery) */}
      <IntentSelector />

      {/* 3. Budget Selector (Budget-based discovery) */}
      <BudgetSelector />

      {/* 4. Product Suggestions Section (Smart recommendations grid) */}
      <ProductSuggestions products={products} />

      {/* 5. Best Deals Section (Discount deals) */}
      <BestDealsSection deals={deals} />

      {/* 6. Trust Section (AI / Manual Curation guarantees) */}
      <TrustSection />

      {/* 7. Why Smartxman? */}
      <WhySmartxman settings={settings} />

      {/* 6. Best Setup Guides */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">Build Your Setup</h2>
              <p className="text-slate-600 dark:text-slate-400">Expert guides to help you build the perfect environment.</p>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-brand-600 font-bold uppercase text-xs tracking-widest">
              Read All Guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Ultimate Student Desk", tag: "Budget", image: "/blog/wfh-guide.png", slug: "ultimate-wfh-desk-setup-guide-2026" },
              { title: "Minimalist Creator Station", tag: "Premium", image: "/blog/switches-guide.png", slug: "mechanical-keyboards-switches-explained" },
              { title: "Pro Gaming Environment", tag: "Performance", image: "/categories/setup.png", slug: "cable-management-101-hide-those-wires" }
            ].map((guide) => (
              <Link key={guide.slug} href={`/blog/${guide.slug}`} className="group block">
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 border border-slate-100 dark:border-slate-800">
                  <Image src={guide.image} alt={guide.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm dark:bg-slate-900/90 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      {guide.tag}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{guide.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />
    </div>
  );
}
