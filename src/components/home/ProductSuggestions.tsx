"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Inbox } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";

interface SuggestionsProps {
  products: any[];
}

export function ProductSuggestions({ products = [] }: SuggestionsProps) {
  const [activeTab, setActiveTab] = useState("featured");

  const tabs = [
    { id: "featured", label: "Featured Products" },
    { id: "trending", label: "Trending Now" },
    { id: "budget", label: "Budget Picks" },
    { id: "desk-setup", label: "Desk Setup" },
    { id: "creator-gear", label: "Creator Gear" },
    { id: "student-essentials", label: "Student Essentials" },
    { id: "recent", label: "Recently Added" },
  ];

  // Curated premium fallback products if the database has no published items yet
  const defaultSuggestions = [
    {
      id: "suggestion-1",
      name: "Logitech MX Master 3S Wireless Mouse",
      slug: "logitech-mx-master-3s",
      image: "/products/logitech-mx-master-3s.png",
      images: ["/products/logitech-mx-master-3s.png"],
      price: "₹8,995",
      rating: 4.9,
      reviews: 1245,
      brand: "Logitech",
      category: "Desk Setup",
      expertNote: "Unmatched ergonomic comfort. The quiet clicks and gesture controls make it a productivity beast.",
      featured: true,
      trending: true,
      isBudgetPick: false,
      smartScore: 9.2,
      valueScore: 8.5,
      affiliateLink: "https://amazon.in"
    },
    {
      id: "suggestion-2",
      name: "Keychron K2 Wireless Mechanical Keyboard",
      slug: "keychron-k2-v2",
      image: "/products/keychron-k2.png",
      images: ["/products/keychron-k2.png"],
      price: "₹7,499",
      rating: 4.7,
      reviews: 856,
      brand: "Keychron",
      category: "Desk Setup",
      expertNote: "Superb typing experience, highly customizable, and compatible with both Mac & Windows natively.",
      featured: true,
      trending: false,
      isBudgetPick: false,
      smartScore: 8.8,
      valueScore: 8.7,
      affiliateLink: "https://amazon.in"
    },
    {
      id: "suggestion-3",
      name: "Sony WH-1000XM5 ANC Headphones",
      slug: "sony-wh-1000xm5",
      image: "/products/sony-wh-1000xm5.png",
      images: ["/products/sony-wh-1000xm5.png"],
      price: "₹29,990",
      rating: 4.8,
      reviews: 2130,
      brand: "Sony",
      category: "Tech Accessories",
      expertNote: "Sensational noise cancellation and extremely lightweight design. Perfect for focus in noisy workspaces.",
      featured: false,
      trending: true,
      isBudgetPick: false,
      smartScore: 9.5,
      valueScore: 8.0,
      affiliateLink: "https://amazon.in"
    },
    {
      id: "suggestion-4",
      name: "Zebronics NS1500 Laptop Stand",
      slug: "zebronics-ns1500-laptop-stand",
      image: "/placeholder-product.png",
      images: [],
      price: "₹899",
      rating: 4.3,
      reviews: 320,
      brand: "Zebronics",
      category: "Desk Setup",
      subCategory: "Laptop Stand",
      expertNote: "A practical budget laptop stand for students, creators, and work-from-home users who want better posture.",
      featured: false,
      trending: false,
      isBudgetPick: true,
      smartScore: 8.2,
      valueScore: 8.5,
      affiliateLink: "https://amazon.in"
    }
  ];

  const sourceProducts = products.length > 0 ? products : defaultSuggestions;

  const getFilteredProducts = () => {
    switch (activeTab) {
      case "featured":
        return sourceProducts.filter(p => p.featured || p.showOnHomepage);
      case "trending":
        return sourceProducts.filter(p => p.trending);
      case "budget":
        return sourceProducts.filter(p => p.isBudgetPick || (p.price && parseInt(p.price.replace(/[^0-9]/g, "")) < 3000));
      case "desk-setup":
        return sourceProducts.filter(
          p => p.category?.toLowerCase() === "desk setup" || 
               p.subCategory?.toLowerCase() === "laptop stand" ||
               p.tags?.some((t: string) => t.toLowerCase().includes("desk setup"))
        );
      case "creator-gear":
        return sourceProducts.filter(
          p => p.category?.toLowerCase() === "creator gear" || 
               p.category?.toLowerCase() === "creator setup" || 
               p.tags?.some((t: string) => t.toLowerCase().includes("creator"))
        );
      case "student-essentials":
        return sourceProducts.filter(
          p => p.category?.toLowerCase() === "student essentials" || 
               p.tags?.some((t: string) => t.toLowerCase().includes("student"))
        );
      case "recent":
      default:
        return sourceProducts;
    }
  };

  const filteredProducts = getFilteredProducts().slice(0, 4);

  return (
    <section id="suggestions" className="py-20 bg-slate-50/50 dark:bg-slate-900/10 border-y border-slate-100 dark:border-slate-900 scroll-mt-20">
      <div className="container mx-auto px-4">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Smart Recommendation Platform</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
              Top Smart Product Picks for 2026
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              We help you buy better, not more. Browse by expert scores and custom setups.
            </p>
          </div>
          <Link 
            href="/products" 
            className="mt-4 md:mt-0 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-600 hover:text-brand-700 transition-colors group"
          >
            Explore all items
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 scrollbar-thin select-none">
          <div className="flex gap-2.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider border transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-655 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content view wrapper with min-h to prevent layout collapsing */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/20 max-w-lg mx-auto flex flex-col items-center justify-center space-y-3">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 shadow-inner">
                    <Inbox className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">No products found</h3>
                  <p className="text-sm text-slate-550 dark:text-slate-400 max-w-xs mx-auto">
                    There are currently no published products under the "{tabs.find(t => t.id === activeTab)?.label}" visibility toggle.
                  </p>
                  <Link href="/admin/products/new" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm">
                    Add products now
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
