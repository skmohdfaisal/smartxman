"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Heart, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { type ProductProps } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SuggestionsProps {
  products: ProductProps[];
}

export function ProductSuggestions({ products }: SuggestionsProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});

  // Fallback high-quality curated suggestions if dynamic products array is empty
  const defaultSuggestions: ProductProps[] = [
    {
      id: "suggestion-1",
      name: "Logitech MX Master 3S Wireless Mouse",
      slug: "logitech-mx-master-3s",
      image: "/products/logitech-mx-master-3s.png",
      images: ["/products/logitech-mx-master-3s.png"],
      price: "₹8,995",
      rating: 4.9,
      reviews: 1245,
      category: "Productivity",
      expertNote: "Unmatched ergonomic comfort. The quiet clicks and gesture controls make it a productivity beast.",
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
      category: "Desk Setup",
      expertNote: "Superb typing experience, highly customizable, and compatible with both Mac & Windows natively.",
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
      category: "Tech",
      expertNote: "Sensational noise cancellation and extremely lightweight design. Perfect for focus in noisy workspaces.",
    },
    {
      id: "suggestion-4",
      name: "OnePlus Nord Buds 2r Wireless Earbuds",
      slug: "oneplus-nord-buds-2r",
      image: "/placeholder-product.png",
      images: [],
      price: "₹1,999",
      rating: 4.5,
      reviews: 320,
      category: "Tech Accessories",
      expertNote: "Deep bass, excellent battery life, and high durability. Hard to beat at this budget.",
    }
  ];

  const displayProducts = products && products.length > 0 ? products.slice(0, 4) : defaultSuggestions;

  useEffect(() => {
    checkAllWishlists();
  }, [displayProducts]);

  const checkAllWishlists = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("wishlist")
      .select("product_id")
      .eq("user_id", user.id);

    if (data) {
      const wishlistMap: Record<string, boolean> = {};
      data.forEach((item) => {
        wishlistMap[item.product_id] = true;
      });
      setWishlisted(wishlistMap);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/auth");
      return;
    }

    const isSaved = wishlisted[productId];

    if (isSaved) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      
      if (!error) {
        setWishlisted(prev => ({ ...prev, [productId]: false }));
        window.dispatchEvent(new Event('wishlist-updated'));
      }
    } else {
      const { error } = await supabase
        .from("wishlist")
        .insert([{ user_id: user.id, product_id: productId }]);
      
      if (!error) {
        setWishlisted(prev => ({ ...prev, [productId]: true }));
        window.dispatchEvent(new Event('wishlist-updated'));
      }
    }
  };

  // Helper to map curated visual labels based on pricing and index
  const getPillTag = (item: ProductProps, index: number) => {
    if (item.id === "suggestion-4" || (item.price && parseInt(item.price.replace(/[^0-9]/g, "")) < 3000)) {
      return { text: "Budget Pick", bg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30" };
    }
    if (index === 0) {
      return { text: "Best for Productivity", bg: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30" };
    }
    if (index === 1) {
      return { text: "Trending Pick", bg: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/30" };
    }
    return { text: "Students Choice", bg: "bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 border-brand-100 dark:border-brand-800/30" };
  };

  return (
    <section className="py-20 bg-slate-50/50 dark:bg-slate-900/10 border-y border-slate-100 dark:border-slate-900">
      <div className="container mx-auto px-4">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Curated Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
              Smart suggestions for you
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Popular picks based on what people are actually looking for.
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

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product, index) => {
            const tag = getPillTag(product, index);
            const isWishlisted = !!wishlisted[product.id];
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] hover:border-slate-200 dark:hover:border-slate-700/50 transition-all duration-300 relative"
              >
                {/* Save Heart Button */}
                <button
                  onClick={(e) => toggleWishlist(e, product.id)}
                  className="absolute top-4 right-4 z-10 p-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={cn("w-4 h-4 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-slate-400")} />
                </button>

                {/* Category & Custom Tags */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                  <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-slate-900/90 text-white dark:bg-white dark:text-slate-900 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>

                {/* Product Image Wrapper */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-950 overflow-hidden border-b border-slate-100 dark:border-slate-800"
                >
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                </Link>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  
                  {/* Rating & Custom Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={cn("px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border", tag.bg)}>
                      {tag.text}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 line-clamp-2 mb-2.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Expert Note */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-5 leading-relaxed flex-1">
                    <span className="font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-widest text-[9px] block mb-0.5">
                      Expert Note
                    </span>
                    "{product.expertNote}"
                  </p>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                    <span className="text-base font-black text-slate-900 dark:text-slate-50">
                      {product.price || "Check Price"}
                    </span>
                    <Link
                      href={`/product/${product.slug}`}
                      className="px-4 py-2 text-xs font-black bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-1"
                    >
                      View Product
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
