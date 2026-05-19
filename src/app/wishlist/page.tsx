"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import { FEATURED_PRODUCTS } from "@/lib/constants";
import { Heart, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    setUser(user);

    // 1. Get all product IDs in the user's wishlist
    const { data: wishlistData, error: wishlistError } = await supabase
      .from("wishlist")
      .select("product_id")
      .eq("user_id", user.id);

    if (wishlistData && !wishlistError) {
      const savedIds = wishlistData.map(item => item.product_id);
      
      if (savedIds.length > 0) {
        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const dbIds = savedIds.filter(id => UUID_REGEX.test(id));
        const mockIds = savedIds.filter(id => !UUID_REGEX.test(id));

        let dbProductsMapped: any[] = [];
        let mockProductsMapped: any[] = [];

        // 2. Fetch database products from Supabase
        if (dbIds.length > 0) {
          const { data: productsData, error: productsError } = await supabase
            .from("products")
            .select("*")
            .in("id", dbIds);

          if (productsData && !productsError) {
            dbProductsMapped = productsData.map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              description: p.description,
              price: p.price_range || "N/A",
              rating: p.rating || 0,
              image: p.images?.[0] || "/placeholder-product.png",
              images: p.images || [],
              category: "Tech",
              affiliateLink: p.affiliate_link || "#",
              expertNote: p.expert_note || "",
              reviews: 1240
            }));
          }
        }

        // 3. Get mock products from FEATURED_PRODUCTS constants
        if (mockIds.length > 0) {
          mockProductsMapped = FEATURED_PRODUCTS.filter(p => mockIds.includes(p.id));
        }

        setItems([...dbProductsMapped, ...mockProductsMapped]);
      } else {
        setItems([]);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Please sign in to see the products you've saved for later.
        </p>
        <Link href="/auth" className="block w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all">
          Sign In / Create Account
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">My Wishlist</h1>
          <p className="text-slate-500 dark:text-slate-400">You have {items.length} items saved.</p>
        </div>
        <Link href="/products" className="hidden sm:flex items-center gap-2 text-brand-600 font-bold hover:text-brand-700 transition-colors">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your wishlist is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">Start exploring our curated products and save your favorites!</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-full font-bold hover:bg-brand-700 transition-all">
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
}
