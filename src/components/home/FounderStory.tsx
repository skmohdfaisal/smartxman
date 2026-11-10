"use client";

import { useState } from "react";
import { Check, CheckCircle2, ArrowRight } from "lucide-react";

export function FounderStory() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  const principles = [
    "Every pick is manually researched and verified before publishing",
    "Focus on practical everyday value — zero sponsored rankings",
    "If a product isn't worth our own money, we won't recommend it with yours",
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200/70 dark:border-slate-800/60">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
          
          {/* Label */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50/80 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-[11px] font-bold uppercase tracking-wider mb-4 border border-brand-200/60 dark:border-brand-800/50">
            Founder Editorial Note
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-5">
            Why SmartXMan exists.
          </h2>

          <div className="space-y-4 text-base sm:text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
            <p>
              I started SmartXMan because buying tech shouldn't feel like a full-time job. Between sponsored YouTube rankings, affiliate SEO spam, and fake five-star reviews, finding honest gear became exhausting.
            </p>
            <p>
              Our approach is simple: We research, cross-reference user reports, and filter out marketing fluff to highlight products that deliver genuine everyday value for your desk, studio, or backpack.
            </p>
          </div>

          {/* 3 Core Editorial Principles */}
          <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800 mb-8">
            {principles.map((principle, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/40">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </span>
                <span className="leading-snug">{principle}</span>
              </div>
            ))}
          </div>

          {/* Founder Signoff & Compact Newsletter */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm block">
                Faisal
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Founder, SmartXMan
              </span>
            </div>

            {/* Newsletter input */}
            <div className="max-w-xs w-full">
              {status === "success" ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/50">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Subscribed! Expect good picks soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
                  <input
                    type="email"
                    required
                    placeholder="Get weekly smart picks"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status !== "idle"}
                    className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={status !== "idle"}
                    className="px-3.5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
