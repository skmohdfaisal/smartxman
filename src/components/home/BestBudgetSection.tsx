"use client";

import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface BestBudgetSectionProps {
  products: any[];
}

export function BestBudgetSection({ products = [] }: BestBudgetSectionProps) {
  const displayed = products.length > 0
    ? products
    : [];

  return (
    <section
      id="budget-picks"
      className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/60 scroll-mt-20"
    >
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
              Best Value Finds
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Useful products that offer great value without overspending.
            </p>
          </div>
          <Link
            href="/products?filter=budget"
            className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold text-sm hover:opacity-80 transition-opacity shrink-0 group"
          >
            More budget picks <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              No budget picks yet — check back soon.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
