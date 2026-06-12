"use client";

import { useState } from "react";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export function CommunityJoin() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!email) return;
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-200 dark:bg-brand-900/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200 dark:bg-accent-900/20 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest mb-8 shadow-sm">
          <Mail className="w-3.5 h-3.5 text-brand-600" />
          Join The Smart Buyers Club
        </div>

        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
          Stop Missing Out on <span className="text-brand-600">Price Drops</span>.
        </h2>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-10 max-w-2xl mx-auto">
          Get notified when our top-rated gear goes on sale. Plus, receive our <strong className="text-slate-900 dark:text-white">Free Student Setup Guide</strong> instantly when you join.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto relative mb-10">
          <input 
            type="email" 
            placeholder="Enter your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status !== "idle"}
            className="w-full pl-6 pr-32 py-5 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all text-slate-900 dark:text-white font-medium disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={status !== "idle"}
            className="absolute right-2 top-2 bottom-2 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 disabled:bg-slate-400"
          >
            {status === "loading" ? "Joining..." : status === "success" ? "Joined!" : (
              <>Join <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No spam, ever
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Price drop alerts
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> New recommendations
          </div>
        </div>

      </div>
    </section>
  );
}
