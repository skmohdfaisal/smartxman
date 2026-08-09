"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Zap, History, Star, CornerDownLeft } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { expandSearchTerm, fuzzyMatchScore } from "@/lib/search-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: string;
  image: string;
  rating: number;
  score: number;
}

interface IntentGroup {
  label: string;
  link: string;
}

const RECENT_SEARCHES_KEY = "smartxman_recent_searches";

export default function SmartSearchBar({ mobile = false }: { mobile?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    loadIndex();
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch(e) {}
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mobile) {
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          inputRef.current?.focus();
        }
      };
      window.addEventListener("keydown", handleGlobalKeyDown);
      return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }
  }, [mobile]);

  const loadIndex = async () => {
    const cached = localStorage.getItem("smartxman_search_index");
    const cacheTime = localStorage.getItem("smartxman_search_time");
    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          return;
        }
      } catch (e) {
        // Cache is corrupted, continue to fetch
      }
    }
    setIsLoading(true);
    try {
      // Try with category join first
      let data: any[] | null = null;
      const res = await supabase
        .from("products")
        .select("id, name, slug, brand, price_range, rating, images, tags, primary_category:categories!products_primary_category_id_fkey(name)")
        .eq("status", "published");
      
      if (res.error || !res.data || res.data.length === 0) {
        console.warn("Search index: primary query failed or empty, trying without join", res.error?.message);
        // Fallback: fetch without category join
        const fallback = await supabase
          .from("products")
          .select("id, name, slug, brand, price_range, rating, images, tags")
          .eq("status", "published");
        data = fallback.data;
        if (fallback.error) {
          console.error("Search index: fallback also failed", fallback.error.message);
        }
      } else {
        data = res.data;
      }

      if (data && data.length > 0) {
        const index = data.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          brand: p.brand || "",
          price: p.price_range || "Check Price",
          rating: p.rating || 0,
          image: p.images?.[0] || "/placeholder-product.png",
          tags: p.tags || [],
          category: (p.primary_category
            ? (Array.isArray(p.primary_category)
              ? p.primary_category[0]?.name
              : (p.primary_category as any)?.name)
            : null) || "Tech"
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

  const getResults = () => {
    if (!query.trim()) return { items: [], brands: [], categories: [], intents: [] };
    const searchTerms = query.trim().split(/\s+/).filter(Boolean);
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
          const fuzzy = fuzzyMatchScore(t, p.name.toLowerCase());
          if (fuzzy > 0) highestTermScore = Math.max(highestTermScore, fuzzy * 40);
        }
        score += highestTermScore;
        return highestTermScore > 0;
      });
      return { ...p, score: matchesAll ? score : 0 };
    }).filter(p => p.score > 0).sort((a, b) => b.score - a.score || b.rating - a.rating).slice(0, 5);

    const lowerQuery = query.toLowerCase().trim();
    const intents: IntentGroup[] = [];
    if (lowerQuery.length >= 3) {
      if (!isNaN(parseInt(lowerQuery))) {
        intents.push({ label: `Picks under ₹${lowerQuery}`, link: `/products?budget=${lowerQuery}` });
      } else {
        intents.push({ label: `Budget ${lowerQuery}`, link: `/products?search=${encodeURIComponent(query)}&type=budget` });
        intents.push({ label: `Premium ${lowerQuery}`, link: `/products?search=${encodeURIComponent(query)}&sort=price_desc` });
      }
    }
    const brands = Array.from(new Set(scoredProducts.map(p => p.brand))).filter(Boolean).slice(0, 3);
    const categories = Array.from(new Set(scoredProducts.map(p => p.category))).filter(Boolean).slice(0, 3);
    return { items: scoredProducts, brands, categories, intents };
  };

  const results = getResults();
  const selectableItems: { type: string, index: number, link: string }[] = [];
  if (query.trim()) {
    results.brands.forEach((brand) => selectableItems.push({ type: 'brand', index: selectableItems.length, link: `/products?search=${encodeURIComponent(brand)}` }));
    results.categories.forEach((cat) => selectableItems.push({ type: 'cat', index: selectableItems.length, link: `/category/${cat.toLowerCase().replace(" ", "-")}` }));
    results.intents.forEach((intent) => selectableItems.push({ type: 'intent', index: selectableItems.length, link: intent.link }));
    results.items.forEach((item) => selectableItems.push({ type: 'product', index: selectableItems.length, link: `/product/${item.slug}` }));
  }

  const closeSearch = () => {
    setIsOpen(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      router.push(`/products?search=${encodeURIComponent(query)}`);
      closeSearch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (!query.trim()) return;
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
        handleSearchSubmit();
      }
    }
  };

  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const terms = query.trim().split(/\s+/).filter(Boolean);
    let result = text;
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

  return (
    <div className={`relative w-full ${!mobile ? "w-60 lg:w-72" : ""}`} ref={containerRef}>
      <form 
        onSubmit={handleSearchSubmit}
        className="relative flex items-center w-full"
      >
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 transition-colors" />
        <input
          ref={inputRef}
          type="text"
          placeholder={mobile ? "Search products..." : "Search products, setups..."}
          value={query}
          onFocus={() => {
            setIsOpen(true);
            // Retry loading index if it's empty (handles initial load failure)
            if (products.length === 0 && !isLoading) {
              loadIndex();
            }
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full bg-slate-100 dark:bg-slate-900/60 border border-transparent focus:border-brand-500/20 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
            mobile ? "pl-10 pr-10 py-3 rounded-2xl text-sm" : "pl-9 pr-12 py-2 rounded-full text-xs"
          }`}
          autoComplete="off"
          spellCheck="false"
        />
        {isLoading && (
          <div className={`absolute ${mobile ? "right-10" : "right-8"} w-3 h-3 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin`} />
        )}
        {query && (
          <button 
            type="button" 
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className={`absolute ${mobile ? "right-3" : "right-7"} p-1 text-slate-400 hover:text-slate-600 transition-colors`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {!mobile && !query && (
          <div className="absolute right-1.5 flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800/70 text-[9px] font-mono text-slate-500 uppercase shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 pointer-events-none">
            Ctrl K
          </div>
        )}
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute top-full ${mobile ? "left-0 right-0" : "right-0"} mt-2 bg-white dark:bg-slate-950 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] sm:max-h-[60vh] flex flex-col ${!mobile ? "w-[400px]" : "w-full"}`}>
          <div className="flex-1 overflow-y-auto p-2 scroll-smooth">
            {!query.trim() ? (
              <div className="p-3">
                {recentSearches.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <History className="w-3.5 h-3.5" /> Recent Searches
                      </h3>
                      <button onClick={clearRecent} className="text-[10px] font-bold text-slate-400 hover:text-brand-600">Clear</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((s, i) => (
                        <button 
                          key={i}
                          onClick={() => { setQuery(s); inputRef.current?.focus(); }}
                          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-semibold hover:bg-slate-100 hover:text-brand-600 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400">
                    <Search className="w-6 h-6 mx-auto mb-2 opacity-20" />
                    <p className="text-xs font-medium">Search for products, brands...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {results.items.length === 0 && results.brands.length === 0 && results.categories.length === 0 && (
                  <div className="text-center py-6 space-y-3">
                    {isLoading || products.length === 0 ? (
                      <>
                        <div className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-slate-400 font-medium">Loading product index...</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold">No exact match found.</p>
                        <Link 
                          href={`/products?search=${encodeURIComponent(query)}`} 
                          onClick={closeSearch}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                        >
                          <Search className="w-3.5 h-3.5" /> Search all products for &quot;{query}&quot;
                        </Link>
                      </>
                    )}
                  </div>
                )}

                {(results.brands.length > 0 || results.categories.length > 0 || results.intents.length > 0) && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-2">Suggestions</h3>
                    <div className="flex flex-col gap-0.5">
                      {results.brands.map((brand, i) => {
                        const itemIndex = selectableItems.findIndex(it => it.type === 'brand' && it.link.includes(encodeURIComponent(brand)));
                        return (
                          <Link 
                            key={`brand-${i}`} href={`/products?search=${encodeURIComponent(brand)}`} onClick={closeSearch}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${activeIndex === itemIndex ? "bg-brand-50 text-brand-700" : "hover:bg-slate-100 dark:hover:bg-slate-900"}`}
                          >
                            <Star className="w-3.5 h-3.5 opacity-60" />
                            <span className="font-semibold">Brand: {highlightMatch(brand)}</span>
                          </Link>
                        )
                      })}
                      {results.categories.map((cat, i) => {
                        const itemIndex = selectableItems.findIndex(it => it.type === 'cat' && it.link.includes(cat.toLowerCase().replace(" ", "-")));
                        return (
                          <Link 
                            key={`cat-${i}`} href={`/category/${cat.toLowerCase().replace(" ", "-")}`} onClick={closeSearch}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${activeIndex === itemIndex ? "bg-brand-50 text-brand-700" : "hover:bg-slate-100 dark:hover:bg-slate-900"}`}
                          >
                            <Zap className="w-3.5 h-3.5 opacity-60" />
                            <span className="font-semibold">Category: {highlightMatch(cat)}</span>
                          </Link>
                        )
                      })}
                      {results.intents.map((intent, i) => {
                         const itemIndex = selectableItems.findIndex(it => it.type === 'intent' && it.link === intent.link);
                         return (
                          <Link 
                            key={`intent-${i}`} href={intent.link} onClick={closeSearch}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${activeIndex === itemIndex ? "bg-brand-50 text-brand-700" : "hover:bg-slate-100 dark:hover:bg-slate-900"}`}
                          >
                            <Search className="w-3.5 h-3.5 opacity-60" />
                            <span className="font-semibold">{highlightMatch(intent.label)}</span>
                          </Link>
                         )
                      })}
                    </div>
                  </div>
                )}

                {results.items.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-2">Products</h3>
                    <div className="flex flex-col gap-1">
                      {results.items.map((product) => {
                        const itemIndex = selectableItems.findIndex(it => it.type === 'product' && it.link.includes(product.slug));
                        return (
                          <Link 
                            key={product.id} href={`/product/${product.slug}`} onClick={closeSearch}
                            className={`flex items-center gap-3 p-2 rounded-xl ${activeIndex === itemIndex ? "bg-slate-100 dark:bg-slate-900" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"}`}
                          >
                            <div className="relative w-10 h-10 bg-white rounded-lg border border-slate-200 overflow-hidden shrink-0">
                              <Image src={product.image} alt={product.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold truncate">{highlightMatch(product.name)}</h4>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
                                <span>{product.brand}</span>
                                <span>•</span>
                                <span>{product.price}</span>
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
        </div>
      )}
    </div>
  );
}
