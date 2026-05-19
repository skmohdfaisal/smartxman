"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, LogOut, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

import { FEATURED_PRODUCTS } from "@/lib/constants";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  // 1. Listen for auth changes once on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Fetch wishlist count and listen for manual updates when user changes
  useEffect(() => {
    if (user) {
      fetchWishlistCount(user.id);
    } else {
      setWishlistCount(0);
    }

    const handleWishlistUpdate = () => {
      if (user) {
        fetchWishlistCount(user.id);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, [user]);

  const fetchWishlistCount = async (userId: string) => {
    const { data: wishlistData, error: wishlistError } = await supabase
      .from("wishlist")
      .select("product_id")
      .eq("user_id", userId);
    
    if (!wishlistError && wishlistData) {
      const savedIds = Array.from(new Set(wishlistData.map(item => item.product_id)));
      
      if (savedIds.length === 0) {
        setWishlistCount(0);
        return;
      }

      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const dbIds = savedIds.filter(id => UUID_REGEX.test(id));
      const mockIds = savedIds.filter(id => !UUID_REGEX.test(id));

      let dbCount = 0;
      if (dbIds.length > 0) {
        const { count, error: productsError } = await supabase
          .from("products")
          .select("id", { count: 'exact', head: true })
          .in("id", dbIds);

        if (!productsError && count !== null) {
          dbCount = count;
        }
      }

      const mockCount = FEATURED_PRODUCTS.filter(p => mockIds.includes(p.id)).length;
      setWishlistCount(dbCount + mockCount);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image 
                src="/logo.png" 
                alt="smartXman Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
              smart<span className="text-brand-600">X</span>man
            </span>
          </Link>
          <nav className="hidden xl:flex gap-8 text-[13px] font-bold uppercase tracking-wider">
            <Link href="/products" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Products</Link>
            <Link href="/products?type=setup" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Build My Setup</Link>
            <Link href="/products?type=budget" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Budget Picks</Link>
            <Link href="/blog" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Guides</Link>
            <Link href="/products?type=deals" className="flex items-center gap-1.5 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
              Deals
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative group">
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-500 transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..." 
              className="pl-9 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64 transition-all focus:w-80"
            />
          </form>
          
          <button className="p-2 text-slate-600 hover:text-brand-600 dark:text-slate-300 transition-colors md:hidden">
            <Search className="w-5 h-5" />
          </button>
          
          <Link href="/wishlist" className="p-2 text-slate-600 hover:text-brand-600 dark:text-slate-300 transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className={`absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 transition-all duration-300 ${isAnimating ? 'scale-125 bg-brand-500' : 'scale-100 animate-in zoom-in'}`}>
                {wishlistCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 p-1.5 px-3 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium">
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">{user.user_metadata.full_name || user.email?.split('@')[0]}</span>
              </Link>
              <button 
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/auth" className="p-2 text-slate-600 hover:text-brand-600 dark:text-slate-300 transition-colors hidden md:block">
              <User className="w-5 h-5" />
            </Link>
          )}

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:text-brand-600 dark:text-slate-300 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl">
            <nav className="container mx-auto px-4 py-8 flex flex-col gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }}>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </form>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/category/tech" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">Tech</span>
                  <span className="text-xs text-slate-500">Accessories & Gadgets</span>
                </Link>
                <Link href="/category/setup" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">Setup</span>
                  <span className="text-xs text-slate-500">Desks & Keyboards</span>
                </Link>
                <Link href="/category/lifestyle" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">Lifestyle</span>
                  <span className="text-xs text-slate-500">Everyday Carry</span>
                </Link>
                <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">Guides</span>
                  <span className="text-xs text-slate-500">Buying Tips</span>
                </Link>
              </div>
              {!user && (
                <Link 
                  href="/auth" 
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-4 flex items-center justify-center gap-2 py-4 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20"
                >
                  <User className="w-5 h-5" /> Sign In / Register
                </Link>
              )}
              {user && (
                <button 
                  onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  className="mt-4 flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

