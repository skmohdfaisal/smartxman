"use client";

import { Check } from "lucide-react";

const promises = [
  "Every recommendation is manually researched before publishing",
  "We focus on usefulness, value and practical needs — not sponsorships",
  "If a product isn't worth buying, we won't recommend it",
];

export function FounderStory() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-200/70 dark:border-slate-800/60">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="p-7 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50/80 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-[11px] font-bold uppercase tracking-wider mb-3 border border-brand-200/60 dark:border-brand-800/50">
              Our Commitment
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-4">
              Why SmartXman?
            </h2>
            <div className="space-y-4 text-base sm:text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              <p>
                I started SmartXman because I was tired of spending hours watching videos and
                reading reviews just to buy one product.
              </p>
              <p>
                The goal is simple: help people discover useful products faster without wasting
                time. Every recommendation focuses on usefulness, value and practical needs.
              </p>
            </div>
          </div>

          {/* Promise list */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            {promises.map((promise, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/40">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </span>
                <span className="leading-snug">{promise}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
