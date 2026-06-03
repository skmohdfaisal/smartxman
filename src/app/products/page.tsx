import ProductCard from "@/components/ProductCard";
import { type ProductProps } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft, ArrowRight, SearchX, Sparkles, Trophy } from "lucide-react";
import { ProductFilters } from "@/components/ProductFilters";
import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("products", {
    title: "Smart Product Recommendations for Tech, Setup & Lifestyle | smartXman",
    description: "Explore curated product picks, budget finds, setup gear, creator tools, gaming accessories, and smart gadgets with clear buying guidance.",
    url: "https://smartxman.vercel.app/products",
  });
}

// Helper to parse price string to number for sorting
const parsePrice = (priceStr: string) => {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Fetch real products from Supabase with categories relation
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*, primary_category:categories!products_primary_category_id_fkey(*)')
    .order('created_at', { ascending: false });

  // Only show published active products, respecting the visibility admin filters
  const activeDbProducts = (dbProducts || []).filter(
    p => p.is_active !== false && p.status === 'published'
  );

  const ALL_PRODUCTS = activeDbProducts.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price_range || "Check Price",
    rating: Number(p.rating) || 0,
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
    reviews: 840,
    current_price: p.current_price,
    old_price: p.old_price,
    price_is_fresh: p.price_is_fresh,
    last_price_checked_at: p.last_price_checked_at
  }));
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'recommended';
  const goal = typeof resolvedSearchParams.goal === 'string' ? resolvedSearchParams.goal : '';
  const budget = typeof resolvedSearchParams.budget === 'string' ? resolvedSearchParams.budget : '';
  const typeParam = typeof resolvedSearchParams.type === 'string' ? resolvedSearchParams.type : '';

  // 1. Filter products based on search, goal, budget, and type
  let displayProducts = [...ALL_PRODUCTS];

  if (search) {
    const s = search.toLowerCase();
    displayProducts = displayProducts.filter(product => {
      const matchName = product.name.toLowerCase().includes(s);
      const matchCategory = product.category.toLowerCase().includes(s);
      const matchSubCategory = product.subCategory.toLowerCase().includes(s);
      const matchBrand = product.brand.toLowerCase().includes(s);
      const matchDescription = product.description.toLowerCase().includes(s);
      const matchNote = product.expertNote.toLowerCase().includes(s);
      const matchVerdict = product.buyingVerdict.toLowerCase().includes(s);
      const matchWhoShouldBuy = product.whoShouldBuy.toLowerCase().includes(s);
      const matchWhoShouldAvoid = product.whoShouldAvoid.toLowerCase().includes(s);
      const matchTags = product.tags.some((t: string) => t.toLowerCase().includes(s));
      const matchAudience = product.audience.some((a: string) => a.toLowerCase().includes(s));
      const matchUseCase = product.useCase.some((u: string) => u.toLowerCase().includes(s));
      const matchBudget = product.budgetRange.some((b: string) => b.toLowerCase().includes(s));
      const matchPros = product.pros.some((p: string) => p.toLowerCase().includes(s));
      const matchCons = product.cons.some((c: string) => c.toLowerCase().includes(s));

      return (
        matchName || 
        matchCategory || 
        matchSubCategory ||
        matchBrand ||
        matchDescription ||
        matchNote || 
        matchVerdict ||
        matchWhoShouldBuy ||
        matchWhoShouldAvoid ||
        matchTags || 
        matchAudience || 
        matchUseCase || 
        matchBudget ||
        matchPros ||
        matchCons
      );
    });
  }

  if (goal) {
    // Map setup target goal to our specific redesigned 10 main categories
    const goalMap: { [key: string]: string[] } = {
      "student-setup": ["Student Essentials", "Desk Setup", "Productivity Tools", "Tech Accessories"],
      "creator-setup": ["Creator Gear", "Desk Setup", "Tech Accessories"],
      "gaming-setup": ["Gaming Accessories", "Desk Setup", "Tech Accessories"],
      "desk-setup": ["Desk Setup", "Work From Home", "Productivity Tools", "Tech Accessories"]
    };
    const targetCategories = goalMap[goal] || [];
    if (targetCategories.length > 0) {
      displayProducts = displayProducts.filter(product => 
        targetCategories.includes(product.category)
      );
    }
  }

  if (budget) {
    const budgetLimit = parseInt(budget);
    if (!isNaN(budgetLimit)) {
      displayProducts = displayProducts.filter(product => {
        const price = parsePrice(product.price);
        return price <= budgetLimit;
      });
    }
  }

  if (typeParam) {
    if (typeParam === "deals") {
      displayProducts = displayProducts.filter(p => 
        p.isBestDeal || (p.price_is_fresh && p.old_price && p.current_price && p.old_price > p.current_price)
      );
    } else if (typeParam === "budget") {
      displayProducts = displayProducts.filter(p => 
        p.isBudgetPick || parsePrice(p.price) <= 3000 || p.tags.some((t: string) => t.toLowerCase().includes("budget"))
      );
    } else if (typeParam === "setup") {
      displayProducts = displayProducts.filter(p => 
        p.category.toLowerCase().includes("setup") || 
        p.subCategory.toLowerCase().includes("setup") || 
        p.tags.some((t: string) => t.toLowerCase().includes("setup"))
      );
    }
  }

  // 2. Apply sorting
  if (sort === "price_asc") {
    displayProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sort === "price_desc") {
    displayProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  } else if (sort === "rating_desc") {
    displayProducts.sort((a, b) => b.rating - a.rating);
  } else {
    // Recommended / Default - sort by rating, then by reviews count
    displayProducts.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
  }

  // Logic for "Best Suggestions" (Deterministic high-rated products to avoid hydration mismatch)
  const topRatedProducts = ALL_PRODUCTS.filter(p => p.rating >= 4.8);
  const randomBestPick = topRatedProducts.length > 0 ? topRatedProducts[0] : null;
  const suggestedPicks = topRatedProducts.slice(1, 4).length > 0 ? topRatedProducts.slice(1, 4) : topRatedProducts.slice(0, 3);

  let pageTitle = search ? `Search results for "${search}"` : "All Products";
  if (!search && typeParam) {
    if (typeParam === "deals") pageTitle = "Best Deals Today";
    else if (typeParam === "budget") pageTitle = "Budget Picks";
    else if (typeParam === "setup") pageTitle = "Setup Upgrades & Gear";
  }

  let pageDesc = search 
    ? `Showing curated products matching your query. Handpicked by experts based on value, rating, and utility.` 
    : `Browse our complete curated catalog of the finest tech upgrades, creator essentials, gaming setups, and smart lifestyle finds.`;
  if (!search && typeParam) {
    if (typeParam === "deals") pageDesc = "Verified discounts, price drops, and high score recommendations.";
    else if (typeParam === "budget") pageDesc = "Excellent tech upgrades and desk accessories under ₹3,000 that offer maximum utility.";
    else if (typeParam === "setup") pageDesc = "Premium gear, ergonomic stands, cables, and lighting to build the ultimate desktop setup.";
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <div className="bg-slate-50/50 dark:bg-slate-900/10 py-8 border-b border-slate-100 dark:border-slate-900">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider mb-4 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-black mb-2 tracking-tight text-slate-900 dark:text-white">
            {pageTitle}
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 max-w-xl leading-relaxed">
            {pageDesc}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Random Best Suggestion Feature */}
        {search && displayProducts.length > 0 && randomBestPick && (
          <div className="mb-10 p-4 md:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-brand-100 dark:border-brand-900/30 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">smartXman Pick</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Need a quick suggestion?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-lg">
                  The <span className="font-semibold text-brand-600 dark:text-brand-400">{randomBestPick.name}</span> is one of our top-rated {randomBestPick.category.toLowerCase()} items.
                </p>
                <Link 
                  href={`/product/${randomBestPick.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors group-hover:translate-x-1 duration-200"
                >
                  View Expert Note <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="w-full md:w-32 h-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                 <span className="text-slate-300 dark:text-slate-600 text-[10px] italic">Product Image</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {displayProducts.length} Results
          </h2>
          <div className="flex items-center gap-4">
            <ProductFilters />
          </div>
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No exact matches found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                We couldn't find any products matching "{search}". But don't worry, here are some of our community's favorite picks!
              </p>
            </div>

            {/* Suggested Picks when no results found */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <Trophy className="w-6 h-6 text-brand-500" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Best Suggestions</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {suggestedPicks.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link href="/products" className="px-8 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-full font-medium transition-colors">
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
