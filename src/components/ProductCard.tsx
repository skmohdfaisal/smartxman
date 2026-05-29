"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ArrowRight, ShoppingBag, Award } from "lucide-react";
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Category Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-800 dark:text-slate-200 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
          {currentCategory}
        </span>
        {budgetBadge && (
          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white rounded-lg shadow-sm">
            {budgetBadge}
          </span>
        )}
        {showFreshPrice && discountPercent > 0 && (
          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white rounded-lg shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
      </div>
      
      {/* Wishlist Icon */}
      <button 
        onClick={toggleSave}
        className="absolute top-4 right-4 z-10 p-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-colors"
        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={cn("w-4 h-4 transition-colors", isSaved ? "fill-red-500 text-red-500" : "text-slate-400")} />
      </button>

      {/* Product Image Link */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/80">
        {product.image || product.images?.[0] ? (
          <Image 
            src={product.image || product.images?.[0]} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain p-6 group-hover:scale-103 transition-transform duration-500" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <span className="text-slate-400 font-medium">Image Coming Soon</span>
          </div>
        )}
      </Link>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col flex-1">
        {/* Rating and Scores */}
        <div className="flex flex-wrap items-center gap-3 mb-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{Number(product.rating || 0).toFixed(1)}</span>
          </div>
          
          {(product.smartScore || product.smart_score) && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-brand-50/80 dark:bg-brand-950/20 border border-brand-100/10 text-brand-650 dark:text-brand-400 rounded-md text-[10px] font-black uppercase">
              Smart: {Number(product.smartScore || product.smart_score).toFixed(1)}
            </div>
          )}
          
          {(product.valueScore || product.value_score) && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100/10 text-emerald-650 dark:text-emerald-400 rounded-md text-[10px] font-black uppercase">
              VFM: {Number(product.valueScore || product.value_score).toFixed(1)}
            </div>
          )}
        </div>

        {/* Brand Label */}
        {product.brand && (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
            {product.brand}
          </span>
        )}

        {/* Product Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-snug mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Short Buying Advice */}
        {product.expertNote ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-3 mb-6 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-100/40 dark:border-slate-800 flex-1 leading-relaxed">
            "{product.expertNote}"
          </p>
        ) : (
          <div className="flex-1"></div>
        )}

        {/* Price & CTA Button */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-150 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {showFreshPrice ? (
                <>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Verified Price</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-lg font-black text-slate-950 dark:text-slate-100">
                      ₹{Number(product.current_price).toLocaleString('en-IN')}
                    </span>
                    {product.old_price && product.old_price > product.current_price && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{Number(product.old_price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-[8px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">
                    Checked {new Date(product.last_price_checked_at).toLocaleDateString()}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Amazon Price</span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider mt-1">Check Price</span>
                </>
              )}
            </div>
            
            <Link 
              href={`/product/${product.slug}`}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white rounded-xl transition-all shadow-sm"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <a 
            href={product.affiliateLink || product.affiliate_link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> {showFreshPrice ? "Buy on Amazon" : "Check Latest Price on Amazon"}
          </a>

          {/* Affiliate Disclosure statement */}
          <p className="text-[8px] text-slate-400 dark:text-slate-500 leading-normal text-center mt-0.5">
            smartXman may earn a small commission when you buy through this link. Our recommendations are based on usefulness, value, and practical needs.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
