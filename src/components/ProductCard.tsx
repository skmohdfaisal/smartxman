"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ArrowRight, Eye, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: any }) {
  const supabase = createClient();
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setCurrentImageIndex(0);
    checkIfSaved();
  }, [product.id]);

  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : [];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const getDisplayPriceInfo = () => {
    if (product.current_price !== null && product.current_price !== undefined) {
      return {
        value: `₹${Number(product.current_price).toLocaleString('en-IN')}`,
        hasOldPrice: !!(product.old_price && product.old_price > product.current_price),
        oldPrice: product.old_price ? `₹${Number(product.old_price).toLocaleString('en-IN')}` : null,
      };
    }
    
    if (product.price && product.price !== "Check Price" && product.price !== "Check latest price") {
      const numericVal = parseInt(product.price.toString().replace(/[^0-9]/g, ""));
      if (!isNaN(numericVal) && numericVal > 0) {
        return {
          value: `₹${numericVal.toLocaleString('en-IN')}`,
          hasOldPrice: false,
          oldPrice: null,
        };
      }
      return {
        value: product.price,
        hasOldPrice: false,
        oldPrice: null,
      };
    }

    return {
      value: "Check Price",
      hasOldPrice: false,
      oldPrice: null,
    };
  };

  const displayPriceInfo = getDisplayPriceInfo();

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

  const [showFreshPrice, setShowFreshPrice] = useState(false);

  useEffect(() => {
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
    setShowFreshPrice(isPriceFresh());
  }, [product]);

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
  const isAmazon = (product.affiliateLink || product.affiliate_link || "").toLowerCase().includes('amazon');

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
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-premium hover:shadow-2xl hover:-translate-y-1 hover:border-brand-400/50 hover:ring-4 hover:ring-brand-500/10 transition-all duration-300 h-full">
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
          {images.length > 0 ? (
            images.map((img: string, idx: number) => (
              <Image 
                key={idx}
                src={img} 
                alt={product.name} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                style={{ objectFit: "contain" }}
                className={cn(
                  "transition-all duration-500 ease-out absolute inset-0",
                  idx === currentImageIndex 
                    ? "opacity-100 scale-100 group-hover:scale-105" 
                    : "opacity-0 scale-95 pointer-events-none"
                )} 
              />
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-slate-350 dark:text-slate-655 text-xs font-bold uppercase tracking-wider">Coming Soon</span>
            </div>
          )}
        </Link>

        {/* Left Arrow Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrevImage}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 active:scale-95 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right Arrow Button */}
        {images.length > 1 && (
          <button
            onClick={handleNextImage}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 active:scale-95 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Slide Indicator Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            {images.map((_: string, idx: number) => (
              <button
                key={idx}
                onClick={(e) => handleDotClick(idx, e)}
                className={cn(
                  "h-1 rounded-full transition-all duration-300 cursor-pointer",
                  idx === currentImageIndex 
                    ? "bg-brand-600 dark:bg-brand-500 w-3.5" 
                    : "bg-slate-350 dark:bg-slate-700 hover:bg-slate-450 dark:hover:bg-slate-600 w-1"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
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
            <h3 className="font-extrabold text-[15px] text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Visual Star Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 4.8) ? 'fill-yellow-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'}`} />
            ))}
          </div>
          <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">{Number(product.rating || 4.8).toFixed(1)}</span>
          <span className="text-[10px] font-bold text-slate-400">({product.reviews || "800+"})</span>
        </div>

        {/* Psychological Element: Why we picked this */}
        <div className="mb-4 flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">Why we recommend this</span>
            {quickVerdict ? (
              <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2 leading-snug font-medium">
                {quickVerdict.replace(/"/g, "")}
              </p>
            ) : (
              <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2 leading-snug font-medium">
                Expert tested and verified for optimal performance and value.
              </p>
            )}
          </div>
        </div>

        {/* Smart & Value Scores */}
        <div className="flex items-center gap-2 mb-4 h-6 overflow-hidden flex-nowrap text-[9px] font-black uppercase">
          {(product.smartScore || product.smart_score) && (
            <div className="flex items-center gap-1 px-2 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 rounded-md shrink-0">
              Smart Score: {Number(product.smartScore || product.smart_score).toFixed(1)}/10
            </div>
          )}
          
          {(product.valueScore || product.value_score) && (
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-md shrink-0">
              Value: {Number(product.valueScore || product.value_score).toFixed(1)}/10
            </div>
          )}
        </div>

        {/* 4. Price & CTA Area */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-end justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Current Price</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900 dark:text-slate-100 leading-none">
                  {displayPriceInfo.value}
                </span>
                {displayPriceInfo.hasOldPrice && (
                  <span className="text-[11px] font-bold text-slate-400 line-through leading-none">
                    {displayPriceInfo.oldPrice}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-500 flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            </div>
          </div>

          {/* Primary CTA: Dominant Button */}
          <div className="space-y-2">
            <a 
              href={product.affiliateLink || product.affiliate_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-[11px] uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-[0.98] group/btn overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {isAmazon ? "Check Live Price on Amazon" : "Check Live Price"} <ExternalLink className="w-3.5 h-3.5" />
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
            </a>
            
            {/* Secondary CTA */}
            <Link 
              href={`/product/${product.slug}`}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-colors text-center flex items-center justify-center gap-1"
            >
              See Detailed Review <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
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
