"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import { type ProductProps } from "@/lib/constants";

export default function ProductCard({ product }: { product: ProductProps }) {
  const [isHovered, setIsHovered] = useState(false);
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-800 dark:text-slate-200 rounded-full shadow-sm">
          {product.category}
        </span>
      </div>
      
      <button 
        onClick={toggleSave}
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-colors"
        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={isSaved}
      >
        <Heart className={cn("w-4 h-4 transition-colors", isSaved ? "fill-red-500 text-red-500" : "text-slate-400")} />
      </button>

      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
        {product.image ? (
          <Image 
            src={product.image} 
            alt={`Photo of ${product.name}`} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <div className="w-full h-full bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900 dark:to-accent-900 opacity-20"></div>
            <span className="text-slate-400 font-medium">Image Coming Soon</span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviews})</span>
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
          <span className="font-medium text-brand-600 dark:text-brand-400">Expert Note: </span>
          {product.expertNote}
        </p>

        <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {product.priceIsFresh && product.price ? (
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{product.price}</span>
              ) : (
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Check Amazon for Price</span>
              )}
            </div>
            <Link 
              href={`/product/${product.slug}`}
              className="flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors shrink-0"
            >
              View Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
             Smartxman may earn a commission when you buy through our links.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
