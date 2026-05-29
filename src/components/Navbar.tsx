"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, LogOut, X, ChevronDown, Award } from "lucide-react";
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
  
  // Custom states for premium UX
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [shortcutText, setShortcutText] = useState("Ctrl K");

  const router = useRouter();
  const pathname = usePathname();
  const [typeParam, setTypeParam] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setTypeParam(params.get("type") || "");
    }
  }, [pathname]);

  const adminUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : (process.env.NEXT_PUBLIC_ADMIN_URL || "https://smartxman-admin.vercel.app");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 1. Detect scroll position for scroll-adaptive glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Detect OS for search placeholder keyboard shortcut hint
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      setShortcutText(isMac ? "⌘K" : "Ctrl K");
    }
  }, []);

  // 3. Global keyboard listener for Ctrl + K/Cmd + K shortcut search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 4. Autofocus search input when mobile menu is opened
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

  // 5. Auth listener
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

  // 6. Wishlist updates
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

    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, [user]);

  // 7. Profile details loading
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

    window.addEventListener("profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
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
        setDisplayName(data.name || currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "Member");
        setAvatarUrl(data.avatar || googleAvatar || "");
      } else {
        setDisplayName(currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "Member");
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
          .select("id", { count: "exact", head: true })
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

  const isActive = (path: string, queryParam?: string) => {
    if (queryParam) {
      return pathname === path && typeParam === queryParam;
    }
    return pathname === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/85 dark:bg-slate-950/85 backdrop-blur-lg border-b border-slate-200/40 dark:border-slate-800/40 shadow-sm py-2" 
          : "bg-white dark:bg-slate-950 border-b border-transparent py-4.5"
      }`}
    >
      <div className="container mx-auto px-4 h-11 flex items-center justify-between">
        
        {/* Left Section: Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="smartXman Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white transition-colors group-hover:text-brand-600">
              smart<span className="text-brand-600">X</span>man
            </span>
          </Link>
          
          {/* Desktop Center Navigation Links */}
          <nav className="hidden xl:flex gap-1.5 text-sm font-semibold relative">
            
            {/* Categories Dropdown Trigger */}
            <div className="relative group/categories h-11 flex items-center">
              <button 
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-semibold ${
                  pathname.startsWith("/category")
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/15"
                    : "text-slate-655 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                }`}
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover/categories:rotate-180" />
              </button>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-0 -translate-x-12 pt-3 opacity-0 invisible group-hover/categories:opacity-100 group-hover/categories:visible transition-all duration-300 ease-out z-50">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-200/50 dark:border-slate-800/80 p-8 w-[760px] grid grid-cols-3 gap-8">
                  
                  {/* Column 1: Shop by Category */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-550">Shop by Category</h4>
                    <div className="flex flex-col gap-2.5">
                      <Link href="/category/tech-accessories" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Tech Accessories
                      </Link>
                      <Link href="/category/creator-setup" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Creator Setup
                      </Link>
                      <Link href="/category/gaming-setup" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Gaming Setup
                      </Link>
                      <Link href="/category/student-essentials" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Student Essentials
                      </Link>
                      <Link href="/category/desk-setup" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Desk Setup
                      </Link>
                      <Link href="/category/productivity" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Productivity
                      </Link>
                      <Link href="/category/smart-gadgets" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Smart Gadgets
                      </Link>
                      <Link href="/category/home-decor" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Home Decor
                      </Link>
                    </div>
                  </div>

                  {/* Column 2: Shop by Budget */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-550">Shop by Budget</h4>
                    <div className="flex flex-col gap-2.5">
                      <Link href="/products?budget=500" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Under ₹500
                      </Link>
                      <Link href="/products?budget=1000" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Under ₹1000
                      </Link>
                      <Link href="/products?budget=3000" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Under ₹3000
                      </Link>
                      <Link href="/products?budget=5000" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Under ₹5000
                      </Link>
                      <Link href="/products?sort=price_desc" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        Premium Picks
                      </Link>
                    </div>
                  </div>

                  {/* Column 3: Shop by User */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-550">Shop by User</h4>
                    <div className="flex flex-col gap-2.5">
                      <Link href="/products?search=student" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        For Students
                      </Link>
                      <Link href="/products?search=creator" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        For Creators
                      </Link>
                      <Link href="/products?search=gaming" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        For Gamers
                      </Link>
                      <Link href="/products?search=wfh" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        For Work From Home
                      </Link>
                      <Link href="/products?search=setup" className="text-sm font-semibold text-slate-655 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        For Setup Lovers
                      </Link>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
            
            <Link 
              href="/products?type=setup" 
              className={`flex items-center px-3.5 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all ${
                isActive("/products", "setup")
                  ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/15 font-bold"
                  : "text-slate-655 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
              }`}
            >
              Build My Setup
            </Link>
            
            <Link 
              href="/products?type=budget" 
              className={`flex items-center px-3.5 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all ${
                isActive("/products", "budget")
                  ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/15 font-bold"
                  : "text-slate-655 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
              }`}
            >
              Budget Picks
            </Link>
            
            <Link 
              href="/blog" 
              className={`flex items-center px-3.5 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all ${
                isActive("/blog")
                  ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/15 font-bold"
                  : "text-slate-655 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
              }`}
            >
              Buying Guides
            </Link>
            
            <Link 
              href="/products?type=deals" 
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all ${
                isActive("/products", "deals")
                  ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/15 font-bold"
                  : "text-slate-655 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
              }`}
            >
              <span>Deals</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse"></span>
            </Link>
          </nav>
        </div>

        {/* Right Section: Search, Saved Products, Account dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Desktop Search Bar (Pill design) */}
          <form onSubmit={handleSearch} className="hidden md:flex relative group shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, categories, setup ideas..." 
              className="pl-9 pr-16 py-2 rounded-full bg-slate-100 dark:bg-slate-900/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/40 w-60 lg:w-72 transition-all focus:w-80 border border-transparent focus:border-brand-550/20 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-200"
              suppressHydrationWarning
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800/70 text-[9px] font-mono text-slate-400 pointer-events-none uppercase">
                {shortcutText}
              </span>
            )}
          </form>
          
          {/* Mobile Search Button Overlay Trigger */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-slate-600 hover:text-brand-600 dark:text-slate-350 transition-colors md:hidden rounded-full hover:bg-slate-50 dark:hover:bg-slate-900"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          {/* Wishlist Icon with count badge & premium hover state / tooltip */}
          <Link 
            href="/wishlist" 
            className="p-2 text-slate-600 hover:text-brand-600 dark:text-slate-350 transition-colors relative group/wishlist rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 shrink-0"
          >
            <ShoppingBag className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 transition-all duration-300 ${isAnimating ? "scale-125 bg-brand-500" : "scale-100 animate-in zoom-in"}`}>
                {wishlistCount}
              </span>
            )}
            {/* Soft tooltip */}
            <span className="absolute top-full right-0 mt-3 scale-0 group-hover/wishlist:scale-100 transition-all duration-200 origin-top bg-slate-900/90 dark:bg-slate-800/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-md z-50 pointer-events-none">
              Saved Products
            </span>
          </Link>
          
          {/* Interactive Account Menu Dropdown / Auth CTA */}
          {user ? (
            <div className="relative group/account shrink-0 hidden md:block">
              <button className="flex items-center gap-2 p-1.5 px-3 border border-slate-200/60 dark:border-slate-800/80 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-sm font-semibold text-slate-700 dark:text-slate-200">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-slate-500" />
                )}
                <span className="max-w-[70px] truncate">{displayName || user.email?.split("@")[0]}</span>
              </button>
              
              {/* Account Dropdown Menu */}
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover/account:opacity-100 group-hover/account:visible transition-all duration-300 ease-out z-50">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/80 p-4 w-52 flex flex-col gap-1">
                  {user.email?.toLowerCase() === "skmohdfaisal07@gmail.com" && (
                    <a 
                      href={adminUrl} 
                      className="px-3 py-2 bg-brand-50 dark:bg-brand-950/20 hover:bg-brand-100 dark:hover:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" /> Admin Panel
                    </a>
                  )}
                  <Link href="/profile" className="px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/wishlist" className="px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors">
                    Saved Products
                  </Link>
                  <Link href="/profile" className="px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors">
                    Account Settings
                  </Link>
                  <hr className="border-slate-100 dark:border-slate-800 my-1" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/25 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="hidden md:flex items-center gap-2 p-1.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full transition-all text-xs font-bold shadow-md shadow-brand-500/10 shrink-0"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Hamburger Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:text-brand-600 dark:text-slate-300 transition-colors md:hidden rounded-full hover:bg-slate-50 dark:hover:bg-slate-900"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
        </div>
      </div>

      {/* Mobile sliding drawer / accordion overlay navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-15 z-40 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto">
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-5">
              
              {/* Mobile Search input */}
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="w-full">
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, setup ideas..." 
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-200 border border-transparent"
                    suppressHydrationWarning
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </div>
              
              {/* Core Links list */}
              <div className="flex flex-col gap-1">
                
                {/* Categories Accordion */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                  <button 
                    onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-800 dark:text-slate-200 py-2.5 text-base"
                  >
                    <span>Categories</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMobileCategoriesOpen ? "rotate-180 text-brand-600" : "text-slate-400"}`} />
                  </button>
                  
                  {isMobileCategoriesOpen && (
                    <div className="pl-4 mt-2.5 space-y-4 border-l-2 border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
                      
                      {/* Shop by Category column */}
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Shop by Category</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
                          <Link href="/category/tech-accessories" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">Tech Accessories</Link>
                          <Link href="/category/creator-setup" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">Creator Setup</Link>
                          <Link href="/category/gaming-setup" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">Gaming Setup</Link>
                          <Link href="/category/student-essentials" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">Student Essentials</Link>
                          <Link href="/category/desk-setup" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">Desk Setup</Link>
                          <Link href="/category/productivity" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">Productivity</Link>
                          <Link href="/category/smart-gadgets" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">Smart Gadgets</Link>
                          <Link href="/category/home-decor" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">Home Decor</Link>
                        </div>
                      </div>
                      
                      {/* Shop by Budget column */}
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Shop by Budget</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
                          <Link href="/products?budget=500" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">Under ₹500</Link>
                          <Link href="/products?budget=1000" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">Under ₹1000</Link>
                          <Link href="/products?budget=3000" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">Under ₹3000</Link>
                          <Link href="/products?budget=5000" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">Under ₹5000</Link>
                          <Link href="/products?sort=price_desc" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1 col-span-2">Premium Picks</Link>
                        </div>
                      </div>

                      {/* Shop by User column */}
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Shop by User</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
                          <Link href="/products?search=student" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">For Students</Link>
                          <Link href="/products?search=creator" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">For Creators</Link>
                          <Link href="/products?search=gaming" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">For Gamers</Link>
                          <Link href="/products?search=wfh" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1">For WFH</Link>
                          <Link href="/products?search=setup" onClick={() => setIsMenuOpen(false)} className="text-slate-655 dark:text-slate-350 hover:text-brand-600 py-1 col-span-2">For Setup Lovers</Link>
                        </div>
                      </div>
                      
                    </div>
                  )}
                </div>

                {/* Direct Page Links */}
                <Link href="/products?type=setup" onClick={() => setIsMenuOpen(false)} className="font-bold text-slate-800 dark:text-slate-200 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-base">
                  <span>Build My Setup</span>
                </Link>
                
                <Link href="/products?type=budget" onClick={() => setIsMenuOpen(false)} className="font-bold text-slate-800 dark:text-slate-200 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-base">
                  <span>Budget Picks</span>
                </Link>
                
                <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="font-bold text-slate-800 dark:text-slate-200 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-base">
                  <span>Buying Guides</span>
                </Link>
                
                <Link href="/products?type=deals" onClick={() => setIsMenuOpen(false)} className="font-bold text-brand-600 dark:text-brand-400 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-base">
                  <span>Deals</span>
                  <span className="px-2 py-0.5 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 rounded text-xs">Hot</span>
                </Link>
                
                <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="font-bold text-slate-800 dark:text-slate-200 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-base">
                  <span>Saved Products</span>
                  {wishlistCount > 0 && (
                    <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-655 dark:text-slate-300 font-extrabold">{wishlistCount}</span>
                  )}
                </Link>
              </div>

              {/* Account / Authentication Control */}
              {user ? (
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-brand-50 dark:bg-brand-950/20 text-brand-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 truncate">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{displayName || user.email?.split("@")[0]}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-sm font-bold">
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl transition-colors">
                      Profile Settings
                    </Link>
                    <button 
                      onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                      className="py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/15 dark:hover:bg-red-950/25 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  href="/auth" 
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-4 flex items-center justify-center gap-2 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/25 transition-all text-sm uppercase tracking-wider"
                >
                  <User className="w-4 h-4" /> Sign In / Create Account
                </Link>
              )}
              
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
