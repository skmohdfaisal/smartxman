"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Search, Layers } from "lucide-react";

export function Hero({ settings }: { settings?: any }) {
  const router = useRouter();

  const handlePrimaryCTA = () => {
    const el = document.getElementById("setup-finder");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/categories");
    }
  };

  const handleSecondaryCTA = () => {
    router.push("/products");
  };

  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-center">
      {/* Decorative gradient mesh */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-5xl flex flex-col items-center">
        
        {/* Title - The Core Proposition */}
        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black tracking-tighter mb-6 text-slate-900 dark:text-white leading-[1.05]">
          Buy Better. <span className="text-brand-600 block sm:inline">Waste Less.</span>
        </h1>
        
        {/* Subtext */}
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
          Research-backed recommendations for students, creators, and professionals. 
          Stop wasting money on products you'll regret.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full">
          <button 
            onClick={handlePrimaryCTA}
            className="group relative px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-brand-500/30 active:scale-[0.98] w-full sm:w-auto overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Find My Setup <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </button>
          
          <button 
            onClick={handleSecondaryCTA}
            className="group px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 font-black text-sm uppercase tracking-wider rounded-2xl transition-all w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
               Browse Smart Picks
            </span>
          </button>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-12 pt-10 border-t border-slate-200 dark:border-slate-800/60 w-full max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Search className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">500+</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Products Researched</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">40+</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Buying Guides</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">12</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Categories Covered</div>
          </div>
        </div>

      </div>
    </section>
  );
}
