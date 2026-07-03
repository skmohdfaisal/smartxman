"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, TrendingUp, Monitor, Gamepad2, Briefcase, Zap, History, Star, ArrowRight, CornerDownLeft } from "lucide-react";
import { useSmartSearch } from "./SmartSearchProvider";
import { createClient } from "@/lib/supabase-client";
import { expandSearchTerm, fuzzyMatchScore } from "@/lib/search-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Types
interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: string;
  image: string;
  rating: number;
  score: number; // For relevance sorting
}

interface IntentGroup {
  label: string;
  link: string;
}

const TRENDING_SEARCHES = [
  "Mechanical Keyboard", "Laptop Stand", "Monitor Arm", "Power Bank", "Desk Lamp"
];

const RECENT_SEARCHES_KEY = "smartxman_recent_searches";

export default function SmartSearchOverlay() {
  const { isOpen, closeSearch } = useSmartSearch();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Load index & recent on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      loadIndex();
      
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch(e) {}
      }
    } else {
      setQuery("");
      setActiveIndex(-1);
    }
  }, [isOpen]);

  const loadIndex = async () => {
    // Basic caching
    const cached = localStorage.getItem("smartxman_search_index");
    const cacheTime = localStorage.getItem("smartxman_search_time");
    
    // Cache for 1 hour
    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
      setProducts(JSON.parse(cached));
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, brand, price_range, rating, images, tags, primary_category:categories(name)")
        .eq("status", "published");

      if (data) {
        const index = data.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          brand: p.brand || "",
          price: p.price_range || "Check Price",
          rating: p.rating || 0,
          image: p.images?.[0] || "/placeholder-product.png",
          tags: p.tags || [],
          category: (Array.isArray(p.primary_category)
            ? p.primary_category[0]?.name
            : (p.primary_category as any)?.name) || "Tech"
        }));
        setProducts(index);
        localStorage.setItem("smartxman_search_index", JSON.stringify(index));
        localStorage.setItem("smartxman_search_time", Date.now().toString());
      }
    } catch (e) {
      console.error("Failed to load search index", e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const clearRecent = (e: React.MouseEvent) => {
    e.preventDefault();
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // -------------------------
  // Search Logic (Real-time)
  // -------------------------
  
  const getResults = () => {
    if (!query.trim()) return { items: [], brands: [], categories: [], intents: [] };

    const searchTerms = query.trim().split(/\s+/).filter(Boolean);
    
    // 1. Products
    const scoredProducts = products.map(p => {
      let score = 0;
      const searchableText = [p.name, p.brand, p.category, ...(p.tags || [])].join(" ").toLowerCase();
      
      const matchesAll = searchTerms.every(term => {
        const termsToCheck = expandSearchTerm(term);
        let highestTermScore = 0;
        
        for (const t of termsToCheck) {
          if (p.brand.toLowerCase() === t) highestTermScore = Math.max(highestTermScore, 100);
          else if (p.brand.toLowerCase().includes(t)) highestTermScore = Math.max(highestTermScore, 80);
          else if (p.name.toLowerCase().includes(t)) highestTermScore = Math.max(highestTermScore, 50);
          else if (p.category.toLowerCase().includes(t)) highestTermScore = Math.max(highestTermScore, 30);
          else if (searchableText.includes(t)) highestTermScore = Math.max(highestTermScore, 10);
          
          // Fuzzy match fallback
          const fuzzy = fuzzyMatchScore(t, p.name.toLowerCase());
          if (fuzzy > 0) highestTermScore = Math.max(highestTermScore, fuzzy * 40);
        }
        
        score += highestTermScore;
        return highestTermScore > 0;
      });

      return { ...p, score: matchesAll ? score : 0 };
    }).filter(p => p.score > 0).sort((a, b) => b.score - a.score || b.rating - a.rating).slice(0, 5);

    // 2. Intents
    const lowerQuery = query.toLowerCase().trim();
    const formattedQuery = lowerQuery.charAt(0).toUpperCase() + lowerQuery.slice(1);
    const intents: IntentGroup[] = [];
    
    if (lowerQuery.length >= 3) {
      if (!isNaN(parseInt(lowerQuery))) {
        intents.push({ label: `Picks under ₹${lowerQuery}`, link: `/products?budget=${lowerQuery}` });
      } else {
        intents.push({ label: `Budget ${lowerQuery}`, link: `/products?search=${encodeURIComponent(query)}&type=budget` });
        intents.push({ label: `Premium ${lowerQuery}`, link: `/products?search=${encodeURIComponent(query)}&sort=price_desc` });
      }
    }

    // 3. Brands (extracted dynamically from matches)
    const brands = Array.from(new Set(scoredProducts.map(p => p.brand))).filter(Boolean).slice(0, 3);
    
    // 4. Categories
    const categories = Array.from(new Set(scoredProducts.map(p => p.category))).filter(Boolean).slice(0, 3);

    return { items: scoredProducts, brands, categories, intents };
  };

  const results = getResults();
  
  // Flatten everything into one array for keyboard navigation
  const selectableItems: { type: string, index: number, link: string }[] = [];
  
  if (query.trim()) {
    results.brands.forEach((brand, i) => selectableItems.push({ type: 'brand', index: selectableItems.length, link: `/products?search=${encodeURIComponent(brand)}` }));
    results.categories.forEach((cat, i) => selectableItems.push({ type: 'cat', index: selectableItems.length, link: `/category/${cat.toLowerCase().replace(" ", "-")}` }));
    results.intents.forEach((intent, i) => selectableItems.push({ type: 'intent', index: selectableItems.length, link: intent.link }));
    results.items.forEach((item, i) => selectableItems.push({ type: 'product', index: selectableItems.length, link: `/product/${item.slug}` }));
  }

  // Handle Keyboard Nav
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !query.trim()) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(prev => (prev < selectableItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : selectableItems.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < selectableItems.length) {
          saveRecentSearch(query);
          router.push(selectableItems[activeIndex].link);
          closeSearch();
        } else {
          saveRecentSearch(query);
          router.push(`/products?search=${encodeURIComponent(query)}`);
          closeSearch();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, query, activeIndex, selectableItems, router, closeSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      router.push(`/products?search=${encodeURIComponent(query)}`);
      closeSearch();
    }
  };

  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const terms = query.trim().split(/\s+/).filter(Boolean);
    let result = text;
    // Simplistic highlight
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      result = result.replace(regex, '||$1||');
    });
    
    return result.split('||').map((part, i) => 
      part.toLowerCase() === query.trim().toLowerCase() || terms.some(t => t.toLowerCase() === part.toLowerCase()) 
        ? <mark key={i} className="bg-brand-500/20 text-brand-700 dark:text-brand-400 rounded-sm px-0.5 font-bold">{part}</mark>
        : part
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[5vh] sm:pt-[10vh] px-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" 
        onClick={closeSearch}
      />

      {/* Main Search Modal */}
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 flex flex-col max-h-[85vh] sm:max-h-[80vh] animate-in zoom-in-95 slide-in-from-top-4 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-brand-500 shrink-0 ml-1" />
          <form onSubmit={handleSearchSubmit} className="flex-1 ml-3">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
              }}
              placeholder="Search products, brands..."
              className="w-full bg-transparent border-none outline-none text-lg md:text-xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
          
          {isLoading && (
            <div className="w-4 h-4 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin shrink-0 mx-2" />
          )}

          <div className="flex items-center gap-2 shrink-0">
            {query && (
              <button onClick={() => setQuery("")} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
              ESC
            </kbd>
          </div>
        </div>

        {/* Search Body */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-2 scroll-smooth">
          
          {/* EMPTY STATE */}
          {!query.trim() && (
            <div className="p-4 space-y-4 fade-in animate-in">
              {recentSearches.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-3 px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                      <History className="w-3.5 h-3.5" /> Recent Searches
                    </h3>
                    <button onClick={clearRecent} className="text-[10px] font-bold text-slate-400 hover:text-brand-600 transition-colors">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s, i) => (
                      <button 
                        key={i}
                        onClick={() => { setQuery(s); inputRef.current?.focus(); }}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                 <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                   <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
                   <p className="text-sm font-medium">Type something to start searching...</p>
                 </div>
              )}
            </div>
          )}

          {/* ACTIVE SEARCH STATE */}
          {query.trim() && (
            <div className="py-2 space-y-6">
              
              {/* No Results Fallback */}
              {results.items.length === 0 && results.brands.length === 0 && results.categories.length === 0 && (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No exact match found.</h3>
                  <p className="text-sm text-slate-500 mb-6">But don't stop exploring. Check out our curated lists:</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/products?type=budget" onClick={closeSearch} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600 transition-colors">Budget Picks</Link>
                    <Link href="/products?type=setup" onClick={closeSearch} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600 transition-colors">Setup Gear</Link>
                  </div>
                </div>
              )}

              {/* Brands & Categories (Grouped together for quick access) */}
              {(results.brands.length > 0 || results.categories.length > 0 || results.intents.length > 0) && (
                <div className="px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-2">Suggestions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    
                    {results.brands.map((brand, i) => {
                      const itemIndex = selectableItems.findIndex(it => it.type === 'brand' && it.link.includes(encodeURIComponent(brand)));
                      return (
                        <Link 
                          key={`brand-${i}`}
                          href={`/products?search=${encodeURIComponent(brand)}`}
                          onClick={closeSearch}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            activeIndex === itemIndex ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" : "hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className={`p-1.5 rounded-md ${activeIndex === itemIndex ? "bg-brand-100 dark:bg-brand-900/50" : "bg-slate-200 dark:bg-slate-800"}`}>
                            <Star className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-sm">Brand: {highlightMatch(brand)}</span>
                          {activeIndex === itemIndex && <CornerDownLeft className="w-3.5 h-3.5 ml-auto opacity-50" />}
                        </Link>
                      )
                    })}

                    {results.categories.map((cat, i) => {
                      const itemIndex = selectableItems.findIndex(it => it.type === 'cat' && it.link.includes(cat.toLowerCase().replace(" ", "-")));
                      return (
                        <Link 
                          key={`cat-${i}`}
                          href={`/category/${cat.toLowerCase().replace(" ", "-")}`}
                          onClick={closeSearch}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            activeIndex === itemIndex ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" : "hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className={`p-1.5 rounded-md ${activeIndex === itemIndex ? "bg-brand-100 dark:bg-brand-900/50" : "bg-slate-200 dark:bg-slate-800"}`}>
                            <Zap className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-sm">Category: {highlightMatch(cat)}</span>
                          {activeIndex === itemIndex && <CornerDownLeft className="w-3.5 h-3.5 ml-auto opacity-50" />}
                        </Link>
                      )
                    })}

                    {results.intents.map((intent, i) => {
                       const itemIndex = selectableItems.findIndex(it => it.type === 'intent' && it.link === intent.link);
                       return (
                        <Link 
                          key={`intent-${i}`}
                          href={intent.link}
                          onClick={closeSearch}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            activeIndex === itemIndex ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" : "hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className={`p-1.5 rounded-md ${activeIndex === itemIndex ? "bg-brand-100 dark:bg-brand-900/50" : "bg-slate-200 dark:bg-slate-800"}`}>
                            <Search className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-sm">{highlightMatch(intent.label)}</span>
                          {activeIndex === itemIndex && <CornerDownLeft className="w-3.5 h-3.5 ml-auto opacity-50" />}
                        </Link>
                       )
                    })}

                  </div>
                </div>
              )}

              {/* Products List */}
              {results.items.length > 0 && (
                <div className="px-2 pb-4">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Products</h3>
                    <button 
                      onClick={handleSearchSubmit}
                      className="text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      See all matches
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    {results.items.map((product, i) => {
                      const itemIndex = selectableItems.findIndex(it => it.type === 'product' && it.link.includes(product.slug));
                      return (
                        <Link 
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={closeSearch}
                          className={`flex items-center gap-4 p-2 rounded-xl transition-all group ${
                            activeIndex === itemIndex ? "bg-slate-100 dark:bg-slate-900" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
                          }`}
                        >
                          <div className="relative w-14 h-14 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {highlightMatch(product.name)}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {product.brand && (
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                  {highlightMatch(product.brand)}
                                </span>
                              )}
                              {product.brand && <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>}
                              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                {product.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0 pr-2">
                            <span className="text-sm font-black text-brand-600 dark:text-brand-400">
                              {product.price}
                            </span>
                            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-slate-500">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {product.rating}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1.5"><kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">↵</kbd> Select</span>
          </div>
          <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-500">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>smartXman AI</span>
          </div>
        </div>

      </div>
    </div>
  );
}
