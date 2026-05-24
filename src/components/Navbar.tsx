"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, LogOut, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { User as SupabaseUser } from "@supabase/supabase-js";

import { FEATURED_PRODUCTS } from "@/lib/constants";

export default function Navbar() {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const adminUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : (process.env.NEXT_PUBLIC_ADMIN_URL || "https://smartxman-admin.vercel.app");
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMenuOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isMenuOpen]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

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

  // 3. Fetch profile details (name and avatar) from public.users and listen to live updates
  useEffect(() => {
    if (user) {
      fetchProfileDetails(user);
    } else {
      setDisplayName("");
      setAvatarUrl("");
    }

    const handleProfileUpdate = () => {
      if (user) {
        fetchProfileDetails(user);
      }
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [user]);

  const fetchProfileDetails = async (currentUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("name, avatar")
        .eq("id", currentUser.id)
        .single();
      
      const googleAvatar = currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture;
      
      if (!error && data) {
        setDisplayName(data.name || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || "Member");
        setAvatarUrl(data.avatar || googleAvatar || "");
      } else {
        setDisplayName(currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || "Member");
        setAvatarUrl(googleAvatar || "");
      }
    } catch (err) {
      console.error("Error fetching navbar profile:", err);
    }
  };

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
          <nav className="hidden xl:flex gap-8 text-[13px] font-bold uppercase tracking-wider relative group/nav">
            {/* Categories Dropdown Container */}
            <div className="relative group/categories h-16 flex items-center">
              <button className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors flex items-center gap-1">
                Categories
              </button>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/categories:opacity-100 group-hover/categories:visible transition-all duration-300 ease-out z-50">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 w-[400px] grid grid-cols-2 gap-x-6 gap-y-4">
                  <Link href="/products" className="col-span-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors font-black flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    All Products
                  </Link>
                  <Link href="/category/tech-accessories" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Tech Accessories</Link>
                  <Link href="/category/creator-setup" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Creator Setup</Link>
                  <Link href="/category/gaming-setup" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Gaming Setup</Link>
                  <Link href="/category/student-essentials" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Student Essentials</Link>
                  <Link href="/category/desk-setup" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Desk Setup</Link>
                  <Link href="/category/budget-finds" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Budget Finds</Link>
                  <Link href="/category/productivity" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Productivity</Link>
                  <Link href="/category/smart-gadgets" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Smart Gadgets</Link>
                </div>
              </div>
            </div>
            
            <Link href="/products?type=setup" className="flex items-center text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Build My Setup</Link>
            <Link href="/products?type=budget" className="flex items-center text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Budget Picks</Link>
            <Link href="/blog" className="flex items-center text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Guides</Link>
            <Link href="/products?type=deals" className="flex items-center gap-1.5 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
              Deals
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative group">
            <button 
              type="submit" 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-500 transition-colors"
              suppressHydrationWarning
            >
              <Search className="w-4 h-4" />
            </button>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..." 
              className="pl-9 pr-10 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64 transition-all focus:w-80"
              suppressHydrationWarning
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
          
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-slate-600 hover:text-brand-600 dark:text-slate-300 transition-colors md:hidden"
            aria-label="Open search"
          >
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
              {user.email?.toLowerCase() === "skmohdfaisal07@gmail.com" && (
                <a 
                  href={adminUrl} 
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/30 dark:hover:bg-brand-900/40 text-brand-600 dark:text-brand-400 border border-brand-200/30 dark:border-brand-800/30 rounded-full text-xs font-black uppercase tracking-wider transition-all"
                >
                  Admin Panel
                </a>
              )}
              <Link href="/profile" className="flex items-center gap-2 p-1.5 px-3 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="hidden lg:inline">{displayName || user.user_metadata.full_name || user.email?.split('@')[0]}</span>
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
                <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="w-full">
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..." 
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    suppressHydrationWarning
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/products" onClick={() => setIsMenuOpen(false)} className="col-span-2 flex flex-col gap-1 p-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors">
                  <span className="font-bold text-brand-700 dark:text-brand-400">All Products</span>
                </Link>
                <Link href="/category/tech-accessories" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">Tech Accessories</span>
                </Link>
                <Link href="/category/creator-setup" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">Creator Setup</span>
                </Link>
                <Link href="/category/gaming-setup" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">Gaming Setup</span>
                </Link>
                <Link href="/category/student-essentials" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">Student Essentials</span>
                </Link>
                <Link href="/category/desk-setup" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">Desk Setup</span>
                </Link>
                <Link href="/category/budget-finds" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">Budget Finds</span>
                </Link>
                <Link href="/category/productivity" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">Productivity</span>
                </Link>
                <Link href="/category/smart-gadgets" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">Smart Gadgets</span>
                </Link>
                <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="col-span-2 flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors text-center">
                  <span className="font-bold text-slate-900 dark:text-white">Guides & Reviews</span>
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
                <div className="flex flex-col gap-2.5">
                  {user.email?.toLowerCase() === "skmohdfaisal07@gmail.com" && (
                    <a 
                      href={adminUrl} 
                      onClick={() => setIsMenuOpen(false)}
                      className="mt-4 flex items-center justify-center gap-2 py-4 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 text-center"
                    >
                      Admin Panel
                    </a>
                  )}
                  <button 
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    className={`${user.email?.toLowerCase() === "skmohdfaisal07@gmail.com" ? "mt-0" : "mt-4"} flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold`}
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

