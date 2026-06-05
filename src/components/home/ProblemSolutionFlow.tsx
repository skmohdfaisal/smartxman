import { XCircle, CheckCircle2, ShieldCheck, Zap, ArrowRight, Ban, EyeOff, SearchX, Check, Shield } from "lucide-react";
import Link from "next/link";

export function ProblemSolutionFlow() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
            Buying tech is <span className="text-rose-500 line-through decoration-rose-500/30 decoration-8">broken.</span> We fixed it.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            Say goodbye to endless scrolling, fake reviews, and decision fatigue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* The Problem */}
          <div className="bg-white dark:bg-slate-950 p-8 rounded-[2rem] border-2 border-rose-100 dark:border-rose-900/30 shadow-lg shadow-rose-500/5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider mb-6">
                <XCircle className="w-4 h-4" /> The Old Way
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
                Endless confusion & buyer's remorse.
              </h3>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: <SearchX />, text: "Hours wasted reading conflicting reviews" },
                  { icon: <EyeOff />, text: "Fake ratings boosting terrible products" },
                  { icon: <Ban />, text: "Overpaying for features you don't need" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 font-medium">
                    <span className="text-rose-400 dark:text-rose-500 mt-0.5">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-2xl">😫</span> "I just want to know what to buy without spending 3 days researching."
            </div>
          </div>

          {/* The Solution */}
          <div className="bg-gradient-to-b from-brand-600 to-brand-700 p-8 rounded-[2rem] shadow-2xl shadow-brand-500/20 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider mb-6 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4" /> The SmartXman Way
              </div>
              <h3 className="text-2xl font-extrabold mb-6">
                Curated clarity & guaranteed value.
              </h3>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: <ShieldCheck />, text: "Expert-tested, hand-picked recommendations" },
                  { icon: <Check />, text: "Honest pros, cons, and bottom-line verdicts" },
                  { icon: <Zap />, text: "Budget-matched picks for your exact workflow" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 font-medium text-brand-50">
                    <span className="text-brand-300 mt-0.5">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mt-8">
              <a href="#intent-selector" className="w-full sm:w-auto bg-white text-brand-700 hover:bg-brand-50 px-6 py-3 rounded-xl font-bold transition-colors text-center inline-flex justify-center items-center gap-2">
                Find Your Setup <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-2 text-brand-100 text-sm font-semibold">
                <Shield className="w-4 h-4" /> 100% independent advice
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
