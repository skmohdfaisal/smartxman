import ProductCard from "@/components/ProductCard";
import { type ProductProps } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trophy } from "lucide-react";
import { AboutSection } from "@/components/home/AboutSection";
import { Hero } from "@/components/home/Hero";
import { ProductFinder } from "@/components/home/ProductFinder";
import { WhySmartxman } from "@/components/home/WhySmartxman";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  // Fetch real products from Supabase
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const activeProducts = (dbProducts || []).filter(p => p.is_active !== false);

  const products = activeProducts.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price_range || "N/A",
    rating: Number(p.rating) || 0,
    reviews: 0,
    image: p.images?.[0] || "/placeholder-product.png",
    images: p.images || [],
    category: "Tech", // For now, handle category mapping if needed
    affiliateLink: p.affiliate_link || "#",
    expertNote: p.expert_note || ""
  }));

  // Budget picks logic (using the price_range string or a specific price field)
  const budgetPicks = products.filter(p => {
    const priceNum = parseInt(p.price.replace(/[^0-9]/g, ""));
    return isNaN(priceNum) || priceNum < 10000;
  }).slice(0, 4);

  const trendingPicks = products.filter(p => p.id).slice(0, 8); // Just take recent ones for now

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Product Finder Box (Separate Section) */}
      <ProductFinder />

      {/* 3. Trending Budget Picks */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Top Rated Value</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">Trending Budget Picks</h2>
              <p className="text-slate-600 dark:text-slate-400">High performance gear that won't break your bank.</p>
            </div>
            <Link href="/products?type=budget" className="hidden md:flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold hover:text-brand-700 dark:hover:text-brand-300 transition-colors uppercase text-xs tracking-widest">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Categories */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">Featured Categories</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Explore our complete collection of handpicked gear for every use case.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Tech Accessories", slug: "tech", count: "124", image: "/categories/tech.png" },
              { name: "Setup Gear", slug: "setup", count: "86", image: "/categories/setup.png" },
              { name: "Lifestyle Gear", slug: "lifestyle", count: "142", image: "/categories/lifestyle.png" },
              { name: "Productivity", slug: "productivity", count: "95", image: "/categories/productivity.png" }
            ].map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className="group relative overflow-hidden rounded-[2rem] aspect-[4/3] bg-slate-100 dark:bg-slate-800 flex flex-col justify-end border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-all shadow-sm hover:shadow-md">
                <Image 
                  src={category.image} 
                  alt={category.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10"></div>
                <div className="relative z-20 p-8">
                  <h3 className="text-2xl font-black text-white mb-1 tracking-tight">{category.name}</h3>
                  <p className="text-slate-300 text-sm font-medium">{category.count} Products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Smartxman? */}
      <WhySmartxman />

      {/* 6. Best Setup Guides */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">Build Your Setup</h2>
              <p className="text-slate-600 dark:text-slate-400">Expert guides to help you build the perfect environment.</p>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-brand-600 font-bold uppercase text-xs tracking-widest">
              Read All Guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Ultimate Student Desk", tag: "Budget", image: "/blog/wfh-guide.png", slug: "ultimate-wfh-desk-setup-guide-2026" },
              { title: "Minimalist Creator Station", tag: "Premium", image: "/blog/switches-guide.png", slug: "mechanical-keyboards-switches-explained" },
              { title: "Pro Gaming Environment", tag: "Performance", image: "/categories/setup.png", slug: "cable-management-101-hide-those-wires" }
            ].map((guide) => (
              <Link key={guide.slug} href={`/blog/${guide.slug}`} className="group block">
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 border border-slate-100 dark:border-slate-800">
                  <Image src={guide.image} alt={guide.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm dark:bg-slate-900/90 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      {guide.tag}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{guide.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />
    </div>
  );
}
