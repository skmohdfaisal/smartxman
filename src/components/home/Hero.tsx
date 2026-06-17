"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export function Hero({ settings }: { settings?: any }) {
  const router = useRouter();

  const handlePrimaryCTA = () => {
    const el = document.getElementById("trending-picks");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/products");
    }
  };

  const handleSecondaryCTA = () => {
    router.push("/products?filter=budget");
  };

  return (
    <section className="relative pt-28 pb-24 lg:pt-36 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-center">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-4xl flex flex-col items-center">

        {/* Eyebrow label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 text-brand-600 dark:text-brand-400 text-[11px] font-black uppercase tracking-widest mb-8">
          Your personal buying assistant
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 text-slate-900 dark:text-white leading-[1.05]">
          Not sure{" "}
          <span className="text-brand-600">what to buy?</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          We help students, creators, gamers and everyday buyers find useful products
          without wasting hours comparing reviews, videos and specifications.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full">
          <button
            id="hero-explore-btn"
            onClick={handlePrimaryCTA}
            className="group relative px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-brand-500/25 active:scale-[0.98] w-full sm:w-auto"
          >
            Explore Smart Picks
          </button>

          <button
            id="hero-budget-btn"
            onClick={handleSecondaryCTA}
            className="px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-bold text-sm rounded-2xl transition-all w-full sm:w-auto"
          >
            Browse by Budget
          </button>
        </div>

        {/* Trust micro-copy */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          {[
            "Curated recommendations",
            "Budget-friendly picks",
            "No confusing product lists",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-500 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
