"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-32 bg-slate-900 dark:bg-black text-center relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/30 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Buy Smarter?</span>
        </h2>
        <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto mb-12">
          Stop guessing. Start building your perfect setup today with recommendations you can actually trust.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/categories" 
            className="group relative px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-brand-500/30 active:scale-[0.98] w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Find My Setup <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          
          <Link 
            href="/products" 
            className="group px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all border border-white/10 backdrop-blur-md w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Browse Smart Picks
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
