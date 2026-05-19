"use client";

import { ShoppingBag, Star, Heart, ArrowLeft, Loader2 } from "lucide-react";
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
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        // Try falling back to mock data if not in DB for now (optional)
        const mockProduct = FEATURED_PRODUCTS.find(p => p.slug === slug);
        if (mockProduct) {
          setProduct(mockProduct);
        } else {
          setProduct(null);
        }
      } else {
        const mappedProduct = {
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price_range || "N/A",
          rating: data.rating || 0,
          image: data.images?.[0] || "/placeholder-product.png",
          images: data.images || [],
          category: "Tech",
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
          smartScore: data.smart_score,
          reviews: 1240 // Dummy reviews as it's not in DB yet
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
      <Link href="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Explore
      </Link>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        <div className="w-full md:w-1/2 space-y-6">
          <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-3xl relative overflow-hidden group shadow-inner">
             <Image 
                src={product.images?.[activeImageIndex] || product.image} 
                alt={product.name} 
                fill 
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
          </div>
          
          {/* Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    "relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all",
                    activeImageIndex === idx 
                      ? "border-brand-500 ring-2 ring-brand-500/20" 
                      : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  <Image 
                    src={img} 
                    alt={`${product.name} thumbnail ${idx + 1}`} 
                    fill 
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/2 space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full text-sm font-medium border border-brand-100 dark:border-brand-800/50">
              Highly Recommended in {product.category}
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">{product.rating}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">{product.reviews.toLocaleString()} Reviews</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-brand-600 dark:text-brand-400 font-semibold">{product.category}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Current Best Price</p>
            <div className="text-4xl font-black text-slate-900 dark:text-white">
              {product.priceIsFresh && product.price !== "N/A" ? product.price : (
                <span className="text-2xl text-slate-500">Check latest price on Amazon</span>
              )}
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              This is an incredible {product.category.toLowerCase()} tool that we highly recommend for your workspace. 
              We've curated this specifically for its durability, performance, and aesthetic appeal.
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShoppingBag className="w-16 h-16" />
            </div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-500 rounded-full"></span>
              Expert Note:
            </h3>
            <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">
              "{product.expertNote}"
            </p>
          </div>
          
          <div className="pt-6 flex flex-col sm:flex-row gap-4 relative">
            <div className="flex-1 flex flex-col gap-2">
              <Link 
                href={product.affiliateLink} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold transition-all text-center flex items-center justify-center gap-3 shadow-lg shadow-brand-500/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShoppingBag className="w-5 h-5" /> Check Latest Price on Amazon
              </Link>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-tight mt-1">
                Smartxman may earn a small commission when you buy through this link. Our recommendations are based on usefulness, value, and practical needs.
              </p>
            </div>
            <button 
              onClick={toggleSave}
              disabled={loading}
              className={cn(
                "px-8 py-4 rounded-2xl font-bold transition-all border flex items-center justify-center gap-2",
                isSaved 
                  ? "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400" 
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600"
              )}
            >
              <Heart className={cn("w-5 h-5 transition-colors", isSaved && "fill-red-500")} />
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {(product.whoShouldBuy || product.whoShouldAvoid) && (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            {product.whoShouldBuy && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-lg text-green-600 dark:text-green-400">Who Should Buy It</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{product.whoShouldBuy}</p>
              </div>
            )}
            {product.whoShouldAvoid && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-lg text-red-500 dark:text-red-400">Who Should Avoid It</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{product.whoShouldAvoid}</p>
              </div>
            )}
          </div>
        )}

        {(product.pros?.length > 0 || product.cons?.length > 0) && (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {product.pros?.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Pros</h4>
                <ul className="space-y-2">
                  {product.pros.map((pro: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <span className="text-green-500 mt-1">+</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.cons?.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Cons</h4>
                <ul className="space-y-2">
                  {product.cons.map((con: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <span className="text-red-500 mt-1">-</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {product.buyingVerdict && (
        <div className="mt-8 p-8 rounded-3xl bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30">
          <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xl">Buying Verdict</h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{product.buyingVerdict}</p>
        </div>
      )}
    </div>
  );
}
