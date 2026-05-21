"use client";

import { CheckCircle, XCircle, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";

export function WhySmartxman({ settings }: { settings?: any }) {
  const whyTitle = settings?.why_smartxman_title || "Why Smartxman?";
  const whyDesc = settings?.why_smartxman_desc || "Most product websites just show links. We help you understand what to buy, why to buy, and when to skip.";

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">{whyTitle}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {whyDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-brand-600">
                <CheckCircle className="w-6 h-6" />
                <h3 className="text-xl font-bold">What we do best</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Unbiased reviews from real product research",
                  "Clear pros, cons and real-world alternatives",
                  "Budget-first picks that offer maximum value",
                  "Simplified specs (no confusing tech jargon)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-slate-400">
                <XCircle className="w-6 h-6" />
                <h3 className="text-xl font-bold">What we avoid</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Spammy 'Top 10' lists with zero research",
                  "Promoting low-quality garbage products",
                  "Hiding flaws just to get a click",
                  "Overwhelming you with too many options"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-500 dark:text-slate-500 text-sm font-medium leading-relaxed italic">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mt-1.5 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Who should buy", color: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
              { label: "Who should avoid", color: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
              { label: "Best alternative", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
              { label: "Budget match", color: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" }
            ].map((tag) => (
              <div key={tag.label} className={`${tag.color} p-4 rounded-2xl text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2`}>
                 {tag.label}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/about" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:gap-3 transition-all">
              Learn more about our process <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
