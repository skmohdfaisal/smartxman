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
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider mb-6 border border-amber-200/50 dark:border-amber-800/30 shadow-sm">
          🏆 500+ Curated Products
        </div>
        
        {/* Title - Hook (Emotion/Curiosity) */}
        <h1 className="text-4xl md:text-6xl lg:text-[4rem] font-black tracking-tighter mb-6 text-slate-900 dark:text-white leading-[1.05]">
          Curated <span className="text-brand-600 block sm:inline">Smart Product Picks.</span> Stop Wasting Money on Tech You'll Regret.
        </h1>
        
        {/* Subtext - Clarity */}
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-semibold">
          We analyze thousands of gadgets to find the top 1% of smart product picks for your specific needs—whether it's gaming, productivity, or just saving money.
        </p>
        
        {/* CTA & Micro Social Proof */}
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={handleExplore}
            className="group relative px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-brand-500/30 active:scale-[0.98] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Find Your Perfect Gear in 60s <Sparkles className="w-4 h-4" />
            </span>
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </button>
          
          {/* Micro Social Proof */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-6 h-6 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px] overflow-hidden`}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}&backgroundColor=e2e8f0`} alt="user" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400 text-xs">
                ★★★★★
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Join 10,000+ smart buyers
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
