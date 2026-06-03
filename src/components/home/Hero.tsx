"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function Hero({ settings }: { settings?: any }) {
  const router = useRouter();
  const heroBadge = settings?.hero_badge || "Smart Product Recommendation Engine";

  const handleExplore = () => {
    const el = document.getElementById("intent-selector");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/products");
    }
  };

  return (
    <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-center">
      {/* Decorative gradient mesh */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-4xl flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-[10px] font-black uppercase tracking-wider mb-6 border border-brand-100/50 dark:border-brand-800/30">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          {heroBadge}
        </div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-6xl lg:text-[4.25rem] font-black tracking-tighter mb-6 text-slate-900 dark:text-white leading-[1.05]">
          Confused <span className="text-brand-600">what to buy?</span>
        </h1>
        
        {/* Subtext */}
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-semibold">
          Simple, human product recommendations curated by experts. We filter out the noise and biases to give you clear buying advice.
        </p>
        
        {/* CTA */}
        <div>
          <button 
            onClick={handleExplore}
            className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-brand-500/20 active:scale-[0.98]"
          >
            Explore Smart Picks
          </button>
        </div>
      </div>
    </section>
  );
}
