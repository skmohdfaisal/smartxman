"use client";

import { Check } from "lucide-react";

const promises = [
  "Every recommendation is manually researched before publishing",
  "We focus on usefulness, value and practical needs — not sponsorships",
  "If a product isn't worth buying, we won't recommend it",
];

export function FounderStory() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/60">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
                Why SmartXman?
              </h2>
              <div className="space-y-4 text-[17px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
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
            <ul className="space-y-3">
              {promises.map((promise, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                  </span>
                  {promise}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
