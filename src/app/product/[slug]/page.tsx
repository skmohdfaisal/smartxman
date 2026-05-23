"use client";

import { ShoppingBag, Star, Heart, ArrowLeft, Loader2, Trophy, AlertCircle, ShieldAlert, Sparkles, Tag, Check, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FEATURED_PRODUCTS } from "@/lib/constants";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, primary_category:categories!products_primary_category_id_fkey(*)')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        // Fallback to constants if not in DB
        const mockProduct = FEATURED_PRODUCTS.find(p => p.slug === slug);
        if (mockProduct) {
          setProduct({
            ...mockProduct,
            smartScore: mockProduct.smartScore || 8.5,
            valueScore: mockProduct.valueScore || 8.0,
            buyingVerdict: mockProduct.buyingVerdict || mockProduct.expertNote,
            bestFor: "Productivity",
            whoShouldBuy: "Working professionals and students looking for high quality desk setup tools.",
            whoShouldAvoid: "Casual buyers with tight budget limits.",
            pros: mockProduct.pros || ["Solid build quality", "Premium finish"],
            cons: mockProduct.cons || ["Slightly expensive"],
            subCategory: "Setup Upgrades",
            tags: ["tech", "minimalist", "setup"]
          });
        } else {
          setProduct(null);
        }
      } else {
        const mappedProduct = {
          id: data.id,
          name: data.name,
          slug: data.slug,
          brand: data.brand || "",
          description: data.description,
          price: data.price_range || "Check Amazon",
          rating: data.rating || 0,
          image: data.images?.[0] || "/placeholder-product.png",
          images: data.images || [],
          category: data.primary_category?.name || "Tech Accessories",
          subCategory: data.sub_category || "",
          affiliateLink: data.affiliate_link || data.affiliate_url || "#",
          expertNote: data.expert_note || "",
          bestFor: data.best_for || "",
          whoShouldBuy: data.who_should_buy || "",
          whoShouldAvoid: data.who_should_avoid || "",
          pros: data.pros || [],
          cons: data.cons || [],
          buyingVerdict: data.buying_verdict || "",
          testedByUs: data.tested_by_us || false,
          priceIsFresh: data.price_is_fresh || false,
          smartScore: data.smart_score || 8.0,
          valueScore: data.value_score || 8.0,
          tags: data.tags || [],
          reviews: 840 // Dummy reviews
        };
        setProduct(mappedProduct);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      checkIfSaved();
    }
  }, [product]);

  const checkIfSaved = async () => {
    if (!product || !product.id) return;
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

  const toggleSave = async () => {
    if (!product) return;
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-slate-500 font-bold">Synchronizing product analysis details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products" className="text-brand-600 font-medium hover:underline">
          Back to all products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Link href="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Explore
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Left Side: Product Gallery */}
        <div className="w-full lg:w-1/2 space-y-6 sticky top-24">
          <div className="aspect-square bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl relative overflow-hidden group shadow-inner flex items-center justify-center p-8">
             <Image 
                src={product.images?.[activeImageIndex] || product.image} 
                alt={product.name} 
                fill 
                priority
                className="object-contain p-6 group-hover:scale-102 transition-transform duration-500" 
             />
             
             {/* Dynamic score overlays */}
             <div className="absolute bottom-4 left-4 flex gap-2">
                <div className="bg-white/95 dark:bg-slate-900/90 text-brand-650 dark:text-brand-400 border border-slate-150/40 dark:border-slate-800 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md text-xs font-black uppercase flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-brand-500" /> Smart Score: {Number(product.smartScore).toFixed(1)}
                </div>
                <div className="bg-white/95 dark:bg-slate-900/90 text-emerald-650 dark:text-emerald-400 border border-slate-150/40 dark:border-slate-800 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md text-xs font-black uppercase flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500" /> VFM Score: {Number(product.valueScore).toFixed(1)}
                </div>
             </div>
          </div>
          
          {/* Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    "relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 bg-slate-50 dark:bg-slate-850 transition-all",
                    activeImageIndex === idx 
                      ? "border-brand-500 ring-4 ring-brand-500/10" 
                      : "border-transparent hover:border-slate-350 dark:hover:border-slate-700"
                  )}
                >
                  <Image 
                    src={img} 
                    alt={`${product.name} thumbnail ${idx + 1}`} 
                    fill 
                    className="object-contain p-2" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Right Side: Primary Meta Data */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-650 dark:text-brand-400 rounded-full text-xs font-black uppercase tracking-wider border border-brand-100/10">
                {product.category}
              </span>
              {product.subCategory && (
                <span className="px-3.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 rounded-full text-xs font-bold uppercase border border-transparent">
                  {product.subCategory}
                </span>
              )}
            </div>
            
            {product.brand && (
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black leading-none mb-1">
                {product.brand}
              </p>
            )}

            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-extrabold text-slate-850 dark:text-slate-200">{Number(product.rating || 0).toFixed(1)} Rating</span>
              </div>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <span className="text-slate-500 dark:text-slate-400">{product.reviews.toLocaleString()} Reviews</span>
            </div>
          </div>
          
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShoppingBag className="w-16 h-16" />
            </div>
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              Short Buying Advice
            </h3>
            <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed text-sm">
              "{product.expertNote || "A stellar choice for standard daily requirements with optimal cost-effectiveness."}"
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-450 uppercase font-black tracking-wider">Current Market Pricing</p>
            <div className="text-3xl font-black text-slate-950 dark:text-white">
              {product.price}
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-655 dark:text-slate-300 text-base leading-relaxed">
              {product.description || "Our complete in-depth review on this product is currently active. Scroll down to see full Pros, Cons, and buying verdict recommendations."}
            </p>
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col gap-2">
              <a 
                href={product.affiliateLink} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" /> Check Latest Price on Amazon
              </a>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-tight">
                SmartXMan may earn a small commission when you buy through this link.
              </p>
            </div>
            
            <button 
              onClick={toggleSave}
              className={cn(
                "px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border flex items-center justify-center gap-2",
                isSaved 
                  ? "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-650 dark:text-red-400" 
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-slate-350"
              )}
            >
              <Heart className={cn("w-4 h-4 transition-colors", isSaved && "fill-red-500 text-red-500")} />
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="mt-20 border-t border-slate-100 dark:border-slate-850 pt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recommended Lists */}
        {(product.whoShouldBuy || product.whoShouldAvoid || product.bestFor) && (
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            {product.bestFor && (
              <div className="space-y-2 border-b border-slate-50 dark:border-slate-850 pb-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Best Used For</span>
                <p className="text-slate-900 dark:text-white font-extrabold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-500" /> {product.bestFor}
                </p>
              </div>
            )}
            
            {product.whoShouldBuy && (
              <div className="space-y-2">
                <h4 className="font-black text-slate-900 dark:text-white text-base text-emerald-650 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" /> Recommended For
                </h4>
                <p className="text-slate-600 dark:text-slate-450 leading-relaxed text-sm">{product.whoShouldBuy}</p>
              </div>
            )}
            
            {product.whoShouldAvoid && (
              <div className="space-y-2 pt-2">
                <h4 className="font-black text-slate-900 dark:text-white text-base text-rose-500 dark:text-rose-455 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 shrink-0" /> Not Recommended For
                </h4>
                <p className="text-slate-650 dark:text-slate-450 leading-relaxed text-sm">{product.whoShouldAvoid}</p>
              </div>
            )}
          </div>
        )}

        {/* Pros and Cons Checklist */}
        {(product.pros?.length > 0 || product.cons?.length > 0) && (
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-8">
            {product.pros?.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-1.5 text-emerald-650">Pros (+)</h4>
                <ul className="space-y-3">
                  {product.pros.map((pro: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-450 text-sm font-semibold">
                      <span className="text-emerald-500 font-extrabold mt-0.5">+</span> <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {product.cons?.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-1.5 text-red-500">Cons (-)</h4>
                <ul className="space-y-3">
                  {product.cons.map((con: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-450 text-sm font-semibold">
                      <span className="text-red-500 font-extrabold mt-0.5">-</span> <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Final Buying Verdict */}
      {product.buyingVerdict && (
        <div className="mt-8 p-8 rounded-[2.5rem] bg-brand-50/50 dark:bg-brand-950/10 border border-brand-100/10 dark:border-brand-950/20 shadow-sm space-y-3">
          <h4 className="font-black text-slate-900 dark:text-white text-lg flex items-center gap-2">
            <Trophy className="w-5.5 h-5.5 text-brand-500" /> Final Buying Recommendation
          </h4>
          <p className="text-slate-700 dark:text-slate-350 leading-relaxed text-base">
            {product.buyingVerdict}
          </p>
        </div>
      )}

      {/* Meta Tags Row */}
      {product.tags && product.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-slate-850 pt-8">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Discovery Tags:
          </span>
          {product.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-150/50 dark:border-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-400 rounded-lg">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
