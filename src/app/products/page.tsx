import ProductCard from "@/components/ProductCard";
import { type ProductProps } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft, ArrowRight, SearchX, Sparkles, Trophy } from "lucide-react";
import { ProductFilters } from "@/components/ProductFilters";
import { supabase } from "@/lib/supabase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | smartXman",
  description: "Explore our complete curated collection of the best tech, setup gear, and lifestyle products.",
  alternates: {
    canonical: "/products",
  },
};

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
    reviews: 840
  }));
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'recommended';
  const goal = typeof resolvedSearchParams.goal === 'string' ? resolvedSearchParams.goal : '';
  const budget = typeof resolvedSearchParams.budget === 'string' ? resolvedSearchParams.budget : '';

  // 1. Filter products based on search, goal, and budget
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

  // 2. Apply sorting
  if (sort === "price_asc") {
    displayProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sort === "price_desc") {
    displayProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  } else if (sort === "rating_desc") {
    displayProducts.sort((a, b) => b.rating - a.rating);
  } else {
    // Recommended / Default - can be randomized or based on a specific logic
    // For now, let's just keep it as is or prioritize higher reviews
    displayProducts.sort((a, b) => b.reviews - a.reviews);
  }

  // Logic for "Best Suggestions" (Random high-rated products)
  const topRatedProducts = ALL_PRODUCTS.filter(p => p.rating >= 4.8);
  const randomBestPick = topRatedProducts[Math.floor(Math.random() * topRatedProducts.length)];
  const suggestedPicks = [...topRatedProducts].sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <div className="bg-slate-50 dark:bg-slate-900/50 py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 font-medium mb-6 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900 dark:text-white">
            {search ? `Search results for "${search}"` : "All Products"}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            {search 
              ? `Showing products matching your search query.` 
              : `Explore our complete curated collection of the best tech, setup gear, and lifestyle products.`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
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
