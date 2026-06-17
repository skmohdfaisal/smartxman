import ProductCard from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductFilters } from "@/components/ProductFilters";
import { supabase } from "@/lib/supabase";
import { Metadata } from "next";

export const revalidate = 3600;

// Pre-render all category pages at build time
export async function generateStaticParams() {
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('slug');

    return (categories || []).map((c) => ({ slug: c.slug }));
  } catch (_) {
    return [];
  }
}


// Helper to parse price string to number for sorting
const parsePrice = (priceStr: string | undefined | null) => {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
};

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  const { data: categoryData } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', slug.toLowerCase())
    .single();

  const categoryName = categoryData?.name || slug.replace('-', ' ');
  const title = `${categoryName} Gear & Accessories | smartXman`;
  const description = categoryData?.description || `Discover expertly curated ${categoryName.toLowerCase()} for your setup. Handpicked for performance, design, and value.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://smartxman.com/category/${slug}`,
    },
    alternates: {
      canonical: `https://smartxman.com/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'recommended';
  
  // 1. Fetch category id by slug
  const { data: categoryData } = await supabase
    .from('categories')
    .select('id, name')
    .eq('slug', slug.toLowerCase())
    .single();

  let products: any[] = [];

  if (categoryData) {
    // Fetch products belonging to this category from primary category column directly
    const { data: primaryProducts } = await supabase
      .from('products')
      .select('*')
      .eq('primary_category_id', categoryData.id)
      .eq('status', 'published');

    // Also fetch products belonging to this category from product_categories join table
    const { data: productCategories } = await supabase
      .from('product_categories')
      .select(`
        product_id,
        products (*)
      `)
      .eq('category_id', categoryData.id);

    const secondaryProducts = productCategories
      ? productCategories
          .map(pc => pc.products as any)
          .filter((p: any) => p !== null && p.status === 'published')
      : [];

    // Merge products and remove duplicates
    const allUniqueProducts = [...(primaryProducts || [])];
    secondaryProducts.forEach(p => {
      if (!allUniqueProducts.some(up => up.id === p.id)) {
        allUniqueProducts.push(p);
      }
    });

    products = allUniqueProducts;
  }

  // Format products for display with full rich recommendation metadata
  let displayProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price_range || "Check Price",
    rating: Number(p.rating) || 0,
    reviews: 840,
    image: p.images?.[0] || "/placeholder-product.png",
    images: p.images || [],
    category: categoryData?.name || slug.replace('-', ' '),
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
    current_price: p.current_price,
    old_price: p.old_price,
    price_is_fresh: p.price_is_fresh,
    last_price_checked_at: p.last_price_checked_at
  }));

  // 2. Apply sorting
  if (sort === "price_asc") {
    displayProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sort === "price_desc") {
    displayProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  } else if (sort === "rating_desc") {
    displayProducts.sort((a, b) => b.rating - a.rating);
  } else {
    // Recommended
    displayProducts.sort((a, b) => b.reviews - a.reviews);
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-slate-50/50 dark:bg-slate-900/10 py-8 border-b border-slate-100 dark:border-slate-900">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider mb-4 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-black mb-2 tracking-tight capitalize text-slate-900 dark:text-white">
            {categoryData?.name || slug.replace('-', ' ')} Gear
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 max-w-xl leading-relaxed">
            Our expertly curated selection of the absolute best products in the {categoryData?.name?.toLowerCase() || slug.replace('-', ' ')} category. 
            Handpicked for performance, durability, design, and value.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {displayProducts.length} Results
          </h2>
          <ProductFilters />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-slate-500">No published products found in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
