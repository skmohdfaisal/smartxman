"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export function Hero({ settings }: { settings?: any }) {
  const router = useRouter();

  // Use settings from Supabase (admin panel) with fallbacks to current design
  const badge = settings?.hero_badge || "Your personal buying assistant";
  const titleFallback = settings?.hero_title_fallback || "Not sure";
  const titleAccent = settings?.hero_title_accent || "what to buy?";
  const description = settings?.hero_description ||
    "We help students, creators, gamers and everyday buyers find useful products without wasting hours comparing reviews, videos and specifications.";
  const primaryCtaText = settings?.primary_cta_text || "Explore Smart Picks";

  const handlePrimaryCTA = () => {
    const link = settings?.primary_cta_link;
    if (link && link !== "/products") {
      router.push(link);
    } else {
      const el = document.getElementById("trending-picks");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/products");
      }
    }
  };

  const handleSecondaryCTA = () => {
    router.push("/products?filter=budget");
  };

  return (
    <section className="relative pt-16 pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24 overflow-hidden bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-center">
      {/* Subtle ambient lighting & refined grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] max-w-full h-[320px] bg-gradient-to-tr from-brand-500/10 via-indigo-500/8 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-4xl flex flex-col items-center">

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-50/80 dark:bg-brand-950/50 border border-brand-200/60 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-wide mb-6 sm:mb-7 shadow-[0_1px_2px_rgba(40,100,245,0.06)]">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          <span>{badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black tracking-[-0.035em] mb-5 text-slate-950 dark:text-white leading-[1.08] max-w-3xl">
          {titleFallback}{" "}
          <span className="text-brand-600 dark:text-brand-400">{titleAccent}</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300/90 max-w-2xl mx-auto mb-9 leading-relaxed font-normal sm:font-medium">
          {description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-11 w-full max-w-md sm:max-w-none">
          <button
            id="hero-explore-btn"
            onClick={handlePrimaryCTA}
            className="group relative px-7 py-3.5 sm:px-8 sm:py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm tracking-wide rounded-xl sm:rounded-2xl transition-all duration-200 shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:-translate-y-0.5 active:scale-[0.98] w-full sm:w-auto cursor-pointer"
          >
            {primaryCtaText}
          </button>

          <button
            id="hero-budget-btn"
            onClick={handleSecondaryCTA}
            className="px-7 py-3.5 sm:px-8 sm:py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 font-bold text-sm tracking-wide rounded-xl sm:rounded-2xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] w-full sm:w-auto shadow-xs cursor-pointer"
          >
            Browse by Budget
          </button>
        </div>

        {/* Trust micro-copy */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
          {[
            "Curated recommendations",
            "Budget-friendly picks",
            "No confusing product lists",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span className="tracking-tight">{item}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
