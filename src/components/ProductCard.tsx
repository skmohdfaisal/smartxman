"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ArrowRight, ShoppingBag, Eye, Percent, TrendingUp, Award, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: any }) {
  const supabase = createClient();
  const [isSaved, setIsSaved] = useState(false);
  const [freshnessWindow, setFreshnessWindow] = useState(7);
  const router = useRouter();

  useEffect(() => {
    checkIfSaved();
    fetchFreshness();
  }, [product.id]);

  const fetchFreshness = async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("price_freshness_window")
        .limit(1)
        .maybeSingle();
      if (data?.price_freshness_window) {
        setFreshnessWindow(data.price_freshness_window);
      }
    } catch (err) {
      console.warn("Failed to load price freshness window on public card, using 7 days", err);
    }
  };

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
    if (!product.price_is_fresh) return false;
    if (!product.last_price_checked_at) return false;
    
    const diffTime = Math.abs(new Date().getTime() - new Date(product.last_price_checked_at).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= freshnessWindow;
  };

  const showFreshPrice = isPriceFresh();
  let discountPercent = 0;
  if (showFreshPrice && product.old_price && product.current_price && product.old_price > product.current_price) {
    discountPercent = Math.round(((product.old_price - product.current_price) / product.old_price) * 100);
  }

  const currentCategory = product.category || "Tech";
  const budgetBadge = product.budgetRange?.[0] || product.budget_range?.[0] || "";

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
  const getSecondBadge = () => {
    if (product.isBestDeal || product.is_best_deal || (showFreshPrice && discountPercent > 0)) {
      return { label: discountPercent > 0 ? `${discountPercent}% OFF` : "Deal", type: "deal" };
    }
    if (product.isBudgetPick || product.is_budget_pick) {
      return { label: "Budget Pick", type: "budget" };
    }
    if (product.trending) {
      return { label: "Trending", type: "trending" };
    }
    if (product.featured) {
      return { label: "Featured", type: "featured" };
    }
    return null;
  };

  const secondBadge = getSecondBadge();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_12px_30px_-6px_rgba(59,130,246,0.08)] hover:border-slate-200 dark:hover:border-slate-700/80 transition-all duration-300 h-full"
    >
      {/* 1. Image Area with Aspect-Ratio & Wishlist */}
      <div className="relative aspect-[4/3] w-full bg-slate-50/50 dark:bg-slate-950/20 overflow-hidden border-b border-slate-50 dark:border-slate-800/60">
        {/* Badges Overlay (Max 2 badges) */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap gap-1.5 max-w-[80%]">
          <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm text-slate-500 dark:text-slate-400 rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-150/40 dark:border-slate-800/80">
            {currentCategory}
          </span>
          {secondBadge && (
            <span className={cn(
              "px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md shadow-sm",
              secondBadge.type === "deal" && "bg-amber-500 text-white shadow-amber-500/10",
              secondBadge.type === "budget" && "bg-emerald-500 text-white shadow-emerald-500/10",
              secondBadge.type === "trending" && "bg-indigo-500 text-white shadow-indigo-500/10",
              secondBadge.type === "featured" && "bg-blue-500 text-white shadow-blue-500/10"
            )}>
              {secondBadge.label}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={toggleSave}
          className="absolute top-3.5 right-3.5 z-10 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-white dark:hover:bg-slate-800 border border-slate-150/30 dark:border-slate-800/50 hover:scale-105 active:scale-95 transition-all"
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("w-3.5 h-3.5 transition-colors", isSaved ? "fill-red-500 text-red-500" : "text-slate-400 dark:text-slate-500")} />
        </button>

        {/* Centered Image Link */}
        <Link href={`/product/${product.slug}`} className="absolute inset-3 block">
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
              <span className="text-slate-350 dark:text-slate-600 text-xs font-bold uppercase tracking-wider">Coming Soon</span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Product Identity */}
        <div className="mb-2">
          {product.brand && (
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">
              {product.brand}
            </span>
          )}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-extrabold text-[15px] text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Clean, Clutter-Free Quick Verdict (Max 1-2 lines) */}
        {quickVerdict && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 font-medium italic mt-1.5 flex-grow">
            {quickVerdict.replace(/"/g, "")}
          </p>
        )}

        {/* 3. Compact Score Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4 border-t border-b border-slate-50 dark:border-slate-800/40 py-2.5">
          <div className="flex items-center gap-0.5 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800/30">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-black text-slate-800 dark:text-slate-200">{Number(product.rating || 0).toFixed(1)}</span>
          </div>
          
          {(product.smartScore || product.smart_score) && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100/10 text-brand-650 dark:text-brand-400 rounded-md text-[9px] font-black uppercase">
              Smart: {Number(product.smartScore || product.smart_score).toFixed(1)}
            </div>
          )}
          
          {(product.valueScore || product.value_score) && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/10 text-emerald-650 dark:text-emerald-400 rounded-md text-[9px] font-black uppercase">
              VFM: {Number(product.valueScore || product.value_score).toFixed(1)}
            </div>
          )}
        </div>

        {/* 4. Price & CTA Area */}
        <div className="mt-auto space-y-3.5">
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              {showFreshPrice ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black text-slate-900 dark:text-slate-100">
                    ₹{Number(product.current_price).toLocaleString('en-IN')}
                  </span>
                  {product.old_price && product.old_price > product.current_price && (
                    <span className="text-[11px] text-slate-400 line-through">
                      ₹{Number(product.old_price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {product.price || product.price_range || "Check Price"}
                </span>
              )}
            </div>

            {/* Secondary CTA: View Details */}
            <Link 
              href={`/product/${product.slug}`}
              className="text-[11px] font-extrabold uppercase tracking-wider text-slate-550 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5 group/link"
            >
              View Details <Eye className="w-3.5 h-3.5 group-hover/link:scale-110 transition-transform" />
            </Link>
          </div>

          {/* Primary CTA: Check Latest Price on Amazon */}
          <a 
            href={product.affiliateLink || product.affiliate_link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-black text-[11px] uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-sm shadow-brand-500/10 active:scale-[0.98]"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> 
            {showFreshPrice ? "Buy on Amazon" : "Check Latest Price on Amazon"}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
