"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, SlidersHorizontal, CheckCircle2 } from "lucide-react";

interface HeroProps {
  settings?: any;
  featuredProducts?: any[];
}

export function Hero({ settings, featuredProducts = [] }: HeroProps) {
  const router = useRouter();

  const headline = settings?.hero_headline || "Good tech. Better choices.";
  const supportingCopy =
    settings?.hero_description ||
    "Useful gadgets, smarter setups, and products worth your money. Find something that fits your budget and the way you live.";

  const handlePrimaryCTA = () => {
    const el = document.getElementById("smart-picks");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/products");
    }
  };

  const handleSecondaryCTA = () => {
    const el = document.getElementById("explore-budget");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/products?type=budget");
    }
  };

  // Curated showcase products using actual smartxman assets
  const showcase = [
    {
      name: "Logitech MX Master 3S",
      category: "Productivity",
      price: "₹8,995",
      tag: "Editor Pick",
      slug: "logitech-mx-master-3s",
      image: "/products/logitech-mx-master-3s.png",
      note: "The benchmark for ergonomic desk workflows.",
    },
    {
      name: "Keychron K2 Wireless",
      category: "Desk Setup",
      price: "₹7,499",
      tag: "Best Tactile",
      slug: "keychron-k2-v2",
      image: "/products/keychron-k2.png",
      note: "75% compact layout with Mac & Windows support.",
    },
    {
      name: "Sony WH-1000XM5",
      category: "Audio",
      price: "₹29,990",
      tag: "Top ANC",
      slug: "sony-wh-1000xm5",
      image: "/products/sony-wh-1000xm5.png",
      note: "Industry-leading active noise cancellation.",
    },
  ];

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28 overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200/70 dark:border-slate-850">
      {/* Subtle ambient lighting & texture */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-brand-500/8 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 dark:opacity-15 pointer-events-none -z-0" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Asymmetrical Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Small Editorial Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
              <span>SMARTXMAN EDITION</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">2026 PICKS</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-black tracking-[-0.035em] text-slate-950 dark:text-white leading-[1.06] mb-5 text-balance">
              Good tech.{" "}
              <span className="text-brand-600 dark:text-brand-400">Better choices.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mb-8 leading-relaxed font-normal">
              {supportingCopy}
            </p>

            {/* Dual Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-10">
              <button
                id="hero-explore-btn"
                onClick={handlePrimaryCTA}
                className="px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm tracking-wide rounded-xl transition-all duration-200 shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:-translate-y-0.5 active:scale-[0.98] inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Smart Picks</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-budget-btn"
                onClick={handleSecondaryCTA}
                className="px-6 py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-850 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 font-bold text-sm tracking-wide rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Find by Budget</span>
              </button>
            </div>

            {/* Editorial Standard Trust Notes */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Manually Researched</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Sponsored Rankings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Real Price Tracking</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Editorial Product Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Featured Showcase Card */}
              <div className="relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_50px_-15px_rgba(40,100,245,0.08)]">
                
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-[10px] font-black uppercase tracking-wider">
                    {showcase[0].tag}
                  </span>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    {showcase[0].category}
                  </span>
                </div>

                {/* Real Product Image */}
                <div className="relative aspect-[4/3] w-full rounded-xl bg-slate-50 dark:bg-slate-950/60 overflow-hidden mb-5 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-4">
                  <Image
                    src={showcase[0].image}
                    alt={showcase[0].name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                    style={{ objectFit: "contain" }}
                    className="p-3 transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-bold text-base text-slate-950 dark:text-white">
                    {showcase[0].name}
                  </h3>
                  <span className="text-base font-black text-slate-950 dark:text-white">
                    {showcase[0].price}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                  {showcase[0].note}
                </p>

                <Link
                  href={`/product/${showcase[0].slug}`}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Secondary Floating Overlap Card (Desktop only for asymmetric balance) */}
              <div className="hidden sm:flex items-center gap-3 p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xl absolute -bottom-6 -left-6 z-20 max-w-[280px]">
                <div className="relative w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 p-1">
                  <Image
                    src={showcase[1].image}
                    alt={showcase[1].name}
                    fill
                    sizes="48px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {showcase[1].category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {showcase[1].name}
                  </h4>
                  <span className="text-xs font-black text-brand-600 dark:text-brand-400">
                    {showcase[1].price}
                  </span>
                </div>
              </div>

              {/* Audio Floating Overlap Badge (Top Right) */}
              <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-lg absolute -top-4 -right-4 z-20">
                <div className="relative w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-950 shrink-0 p-0.5">
                  <Image
                    src={showcase[2].image}
                    alt={showcase[2].name}
                    fill
                    sizes="28px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div>
                  <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block leading-none">
                    Verified Pick
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {showcase[2].name.split(" ")[0]} {showcase[2].name.split(" ")[1]}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
