"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function CommunityJoin() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60">
      <div className="container mx-auto px-4 max-w-2xl text-center">

        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
          Get picks delivered to you.
        </h2>

        <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
          New recommendations and deals, straight to your inbox. No noise.
        </p>

        {status === "success" ? (
          <div className="flex items-center justify-center gap-3 py-5 text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-5 h-5" />
            You're in — expect good picks soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <input
              type="email"
              placeholder="Your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status !== "idle"}
              className="flex-1 px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-900 dark:text-white font-medium text-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status !== "idle"}
              className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:bg-slate-400 whitespace-nowrap"
            >
              {status === "loading" ? "Joining..." : <>Subscribe <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm font-medium text-slate-400 dark:text-slate-500">
          {["No spam, ever", "Price drop alerts", "New recommendations weekly"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {item}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
