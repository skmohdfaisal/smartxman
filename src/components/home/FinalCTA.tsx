"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-slate-900 dark:bg-slate-950 text-center relative overflow-hidden border-t border-slate-800">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-full h-[280px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/70 border border-brand-800/70 text-brand-400 text-[11px] font-bold uppercase tracking-wider mb-4">
          Next Step
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Ready to <span className="text-brand-400">Buy Smarter?</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 font-normal max-w-xl mx-auto mb-9 leading-relaxed">
          Stop guessing. Start building your perfect setup today with recommendations you can actually trust.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link 
            href="/categories" 
            className="group px-7 py-3.5 sm:px-8 sm:py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm tracking-wide rounded-xl sm:rounded-2xl transition-all shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/35 hover:-translate-y-0.5 active:scale-[0.98] w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            Find My Setup <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/products" 
            className="group px-7 py-3.5 sm:px-8 sm:py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-sm tracking-wide rounded-xl sm:rounded-2xl transition-all border border-white/15 backdrop-blur-md hover:-translate-y-0.5 active:scale-[0.98] w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400" /> Browse Smart Picks
          </Link>
        </div>
      </div>
    </section>
  );
}
