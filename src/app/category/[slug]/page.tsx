import ProductCard from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductFilters } from "@/components/ProductFilters";
import { FEATURED_PRODUCTS } from "@/lib/constants";

const ALL_PRODUCTS = [...FEATURED_PRODUCTS];

// Helper to parse price string to number for sorting
const parsePrice = (priceStr: string) => {
  return parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
};

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
  
  // 1. Filter by category
  let displayProducts = ALL_PRODUCTS.filter(
    (product) => product.category.toLowerCase() === slug.toLowerCase()
  );
  
  // Fallback to top products if category is empty
  if (displayProducts.length === 0) {
    displayProducts = [...ALL_PRODUCTS.slice(0, 4)];
  }

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
      <div className="bg-slate-50 dark:bg-slate-900/50 py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 font-medium mb-6 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize tracking-tight text-slate-900 dark:text-white">
            {slug} Gear
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Our expertly curated selection of the best products in the {slug} category. 
            Handpicked for performance, design, and value.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {displayProducts.length} Results
          </h2>
          <ProductFilters />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
