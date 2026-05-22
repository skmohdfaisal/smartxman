import ProductCard from "@/components/ProductCard";
import { type ProductProps } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trophy } from "lucide-react";
import { AboutSection } from "@/components/home/AboutSection";
import { Hero } from "@/components/home/Hero";
import { ProductSuggestions } from "@/components/home/ProductSuggestions";
import { BestDealsSection } from "@/components/home/BestDealsSection";
import { WhySmartxman } from "@/components/home/WhySmartxman";
import { supabase } from "@/lib/supabase";
import { getHomepageSettings } from "@/lib/homepage-actions";

export const revalidate = 60;

export default async function Home() {
  const homeSettingsRes = await getHomepageSettings();
  const settings = homeSettingsRes?.success ? homeSettingsRes.data : null;

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
    category: "Tech", // Can map this dynamically based on category relation later
    affiliateLink: p.affiliate_link || "#",
    expertNote: p.expert_note || ""
  }));

  // Fetch deals from Supabase store links with old prices
  const { data: dbDeals } = await supabase
    .from('product_store_links')
    .select('*, product:products(*)')
    .not('old_price', 'is', null)
    .order('created_at', { ascending: false });

  const deals = (dbDeals || [])
    .filter(d => d.product)
    .map(d => {
      const priceNum = Number(d.price) || 0;
      const oldPriceNum = Number(d.old_price) || 0;
      const discountPct = oldPriceNum > priceNum 
        ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)
        : 0;

      return {
        id: d.id,
        name: d.product.name,
        slug: d.product.slug,
        image: d.product.images?.[0] || "/placeholder-product.png",
        price: `₹${priceNum.toLocaleString('en-IN')}`,
        oldPrice: `₹${oldPriceNum.toLocaleString('en-IN')}`,
        discount: `${discountPct}% OFF`,
        affiliateUrl: d.affiliate_url || `/product/${d.product.slug}`
      };
    })
    .filter(d => parseInt(d.discount) > 0)
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Combined Hero + Smart Finder Card Layout */}
      <Hero settings={settings} />

      {/* 2. Product Suggestions Section */}
      <ProductSuggestions products={products} />

      {/* 3. Best Deals Section */}
      <BestDealsSection deals={deals} />

      {/* 4. Featured Categories */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/10">
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
      <WhySmartxman settings={settings} />

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
