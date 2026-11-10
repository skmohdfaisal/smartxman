"use client";

import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface TrendingPicksSectionProps {
  products: Record<string, any>[];
}

export function TrendingPicksSection({ products = [] }: TrendingPicksSectionProps) {
  const displayed = products.length > 0
    ? products
    : [];

  return (
    <section
      id="trending-picks"
      className="py-16 md:py-20 lg:py-24 bg-white dark:bg-slate-950 border-t border-slate-200/70 dark:border-slate-800/60 scroll-mt-20"
    >
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50/80 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-[11px] font-bold uppercase tracking-wider mb-3 border border-brand-200/60 dark:border-brand-800/50">
              Curated Weekly
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-2">
              Popular Right Now
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
              Products people are actually checking out this week.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 bg-brand-50/50 hover:bg-brand-50 dark:bg-brand-950/30 dark:hover:bg-brand-950/60 border border-brand-200/50 dark:border-brand-800/40 font-bold text-xs uppercase tracking-wider transition-all duration-200 shrink-0 group self-start md:self-auto"
          >
            See all picks <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {displayed.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400">
              <Inbox className="w-7 h-7" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              No trending products yet — check back soon.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
