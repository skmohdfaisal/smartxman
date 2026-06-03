"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ArrowRight, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: any }) {
  const supabase = createClient();
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkIfSaved();
  }, [product.id]);

  const checkIfSaved = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .single();

    if (data) setIsSaved(true);
  };

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/auth");
      return;
    }

    if (isSaved) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);
      
      if (!error) {
        setIsSaved(false);
        window.dispatchEvent(new Event('wishlist-updated'));
      }
    } else {
      const { error } = await supabase
        .from("wishlist")
        .insert([{ user_id: user.id, product_id: product.id }]);
      
      if (!error) {
        setIsSaved(true);
        window.dispatchEvent(new Event('wishlist-updated'));
      }
    }
  };

  const isPriceFresh = () => {
    if (product.current_price === null || product.current_price === undefined) return false;
    if (product.price_is_fresh === true) return true;
    if (product.showFreshPrice === true) return true;
    
    // Default fallback check (7 days window)
    if (!product.last_price_checked_at) return false;
    const diffTime = Math.abs(new Date().getTime() - new Date(product.last_price_checked_at).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const showFreshPrice = isPriceFresh();
  let discountPercent = 0;
  if (showFreshPrice && product.old_price && product.current_price && product.old_price > product.current_price) {
    discountPercent = Math.round(((product.old_price - product.current_price) / product.old_price) * 100);
  }

  const currentCategory = product.category || "Tech";

  // Dynamic single quick verdict line from available description, best_for, or truncated expert_note
  const getQuickVerdict = () => {
    if (product.bestFor) return product.bestFor;
    if (product.best_for) return product.best_for;
    if (product.buyingVerdict) return product.buyingVerdict;
    if (product.expertNote) return product.expertNote;
    return product.description || "Top recommended product in its category.";
  };

  const quickVerdict = getQuickVerdict();

  // Define Badge System Color Rules
  const getSmartTag = () => {
    if (product.isBudgetPick || product.is_budget_pick) {
      return { label: "Budget Pick", type: "budget" };
    }
    if (product.isBestDeal || product.is_best_deal || (showFreshPrice && discountPercent > 0)) {
      return { label: "Best Value", type: "deal" };
    }
    if (product.trending) {
      return { label: "Trending", type: "trending" };
    }
    if (product.featured) {
      return { label: "Editor Pick", type: "featured" };
    }
    if (product.smartScore >= 8.8 || product.smart_score >= 8.8) {
      return { label: "Premium Choice", type: "premium" };
    }
    return null;
  };

  const smartTag = getSmartTag();

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-premium hover:shadow-premium-hover hover:border-brand-500/20 dark:hover:border-brand-400/20 transition-all duration-300 h-full">
      {/* 1. Image Area with Aspect-Ratio & Wishlist */}
      <div className="relative aspect-square w-full bg-slate-50/50 dark:bg-slate-950/20 overflow-hidden border-b border-slate-50 dark:border-slate-800/60 flex items-center justify-center">
        {/* Badges Overlay (Max 2 badges) */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap gap-1.5 max-w-[80%]">
          <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm text-slate-500 dark:text-slate-400 rounded-md shadow-sm border border-slate-150/40 dark:border-slate-800/80">
            {currentCategory}
          </span>
          {smartTag && (
            <span className={cn(
              "px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md shadow-sm",
              smartTag.type === "deal" && "bg-amber-500 text-white shadow-amber-500/10",
              smartTag.type === "budget" && "bg-emerald-500 text-white shadow-emerald-500/10",
              smartTag.type === "trending" && "bg-indigo-500 text-white shadow-indigo-500/10",
              smartTag.type === "featured" && "bg-blue-500 text-white shadow-blue-500/10",
              smartTag.type === "premium" && "bg-purple-500 text-white shadow-purple-500/10"
            )}>
              {smartTag.label}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={toggleSave}
          className="absolute top-3.5 right-3.5 z-10 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-800 border border-slate-150/30 dark:border-slate-800/50 hover:scale-105 active:scale-95 transition-all"
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("w-3.5 h-3.5 transition-colors", isSaved ? "fill-red-500 text-red-500" : "text-slate-450 dark:text-slate-500")} />
        </button>

        {/* Centered Image Link */}
        <Link href={`/product/${product.slug}`} className="absolute inset-4 block">
          {product.image || product.images?.[0] ? (
            <Image 
              src={product.image || product.images?.[0]} 
              alt={product.name} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
              style={{ objectFit: "contain" }}
              className="group-hover:scale-105 transition-transform duration-500 ease-out" 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-slate-350 dark:text-slate-655 text-xs font-bold uppercase tracking-wider">Coming Soon</span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Product Identity with locked height */}
        <div className="h-[52px] mb-2 flex flex-col justify-center">
          {product.brand ? (
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5 leading-none">
              {product.brand}
            </span>
          ) : (
            <span className="h-2.5 block mb-0.5"></span>
          )}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-extrabold text-[14px] text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* 1-line AI Quick Insight */}
        <div className="h-5 mb-4 mt-1.5 flex items-center">
          {quickVerdict && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal font-medium italic">
              ✦ {quickVerdict.replace(/"/g, "")}
            </p>
          )}
        </div>

        {/* 3. Compact Score System (⭐⭐ Rating, Smart Score, VFM Score) */}
        <div className="flex items-center gap-2 mb-4 border-t border-b border-slate-50 dark:border-slate-800/40 py-2.5 h-10 overflow-hidden flex-nowrap text-[9px] font-black uppercase">
          <div className="flex items-center gap-0.5 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded-md border border-slate-100/50 dark:border-slate-800/30 shrink-0 text-slate-800 dark:text-slate-200">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{Number(product.rating || 0).toFixed(1)}</span>
          </div>
          
          {(product.smartScore || product.smart_score) && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100/10 text-brand-650 dark:text-brand-400 rounded-md shrink-0">
              Smart: {Number(product.smartScore || product.smart_score).toFixed(1)}
            </div>
          )}
          
          {(product.valueScore || product.value_score) && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/10 text-emerald-650 dark:text-emerald-400 rounded-md shrink-0">
              VFM: {Number(product.valueScore || product.value_score).toFixed(1)}
            </div>
          )}
        </div>

        {/* 4. Price & CTA Area */}
        <div className="mt-auto space-y-3.5">
          <div className="flex items-baseline justify-between h-6">
            <div className="flex flex-col justify-center">
              {showFreshPrice ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black text-slate-900 dark:text-slate-100 leading-none">
                    ₹{Number(product.current_price).toLocaleString('en-IN')}
                  </span>
                  {product.old_price && product.old_price > product.current_price && (
                    <span className="text-[11px] text-slate-400 line-through leading-none">
                      ₹{Number(product.old_price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide leading-none">
                  {product.price && product.price !== "Check Price" ? product.price : "Check latest price"}
                </span>
              )}
            </div>

            {/* Secondary CTA: View Details */}
            <Link 
              href={`/product/${product.slug}`}
              className="text-[10px] font-black uppercase tracking-wider text-slate-450 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1 group/link"
            >
              View Details <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Primary CTA: Check Best Price (dominant button) */}
          <a 
            href={product.affiliateLink || product.affiliate_link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-black text-[11px] uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-2 h-10 shadow-sm shadow-brand-500/10 active:scale-[0.98]"
          >
            Check Best Price
          </a>
        </div>
      </div>
    </div>
  );
}

// 5. Product Card Skeleton Loader
export function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-premium h-full animate-pulse">
      {/* Aspect Square Image Area */}
      <div className="w-full aspect-square bg-slate-100/80 dark:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800/60"></div>
      
      {/* Card Content area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Identity space */}
        <div className="h-[52px] mb-2 flex flex-col justify-center space-y-2">
          <div className="h-3 w-1/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
          <div className="h-4 w-11/12 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        
        {/* Verdict space */}
        <div className="h-5 mb-4 mt-1.5 flex items-center">
          <div className="h-3.5 w-3/4 bg-slate-100 dark:bg-slate-850 rounded"></div>
        </div>
        
        {/* Scores row */}
        <div className="flex items-center gap-2 mb-4 border-t border-b border-slate-50 dark:border-slate-800/40 py-2.5 h-10">
          <div className="h-5 w-8 bg-slate-100 dark:bg-slate-850 rounded"></div>
          <div className="h-5 w-14 bg-slate-100 dark:bg-slate-850 rounded"></div>
          <div className="h-5 w-14 bg-slate-100 dark:bg-slate-850 rounded"></div>
        </div>
        
        {/* Price & CTA */}
        <div className="mt-auto space-y-3.5">
          <div className="flex items-center justify-between h-6">
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 w-20 bg-slate-100 dark:bg-slate-850 rounded"></div>
          </div>
          <div className="w-full h-10 bg-slate-250 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
