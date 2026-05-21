"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Sparkles, Target, Compass, Award } from "lucide-react";
import { motion } from "framer-motion";

export function Hero({ settings }: { settings?: any }) {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  const heroBadge = settings?.hero_badge || "500+ Curated Picks for Smarter Buying";
  const heroTitleFallback = settings?.hero_title_fallback || "Confused";
  const heroTitleAccent = settings?.hero_title_accent || "what to buy?";
  const heroTitleSubtitle = settings?.hero_title_subtitle || "Find picks that make sense.";
  const heroDescription = settings?.hero_description || "Smartxman helps students, creators, gamers, and everyday buyers discover useful tech, setup gear, and lifestyle products based on your budget and real value.";
  const primaryCtaText = settings?.primary_cta_text || "Find My Smart Picks";

  const goals = [
    { id: "student", label: "Student Setup" },
    { id: "creator", label: "Creator Setup" },
    { id: "gaming", label: "Gaming Setup" },
    { id: "desk", label: "Desk Setup" },
  ];

  const budgets = [
    { id: "1000", label: "Under ₹1000" },
    { id: "3000", label: "Under ₹3000" },
    { id: "5000", label: "Under ₹5000" },
    { id: "ultimate", label: "Ultimate" },
  ];

  const handleSearch = () => {
    let url = "/products?";
    const params: string[] = [];
    if (selectedGoal) params.push(`goal=${selectedGoal}`);
    if (selectedBudget) params.push(`budget=${selectedBudget}`);
    
    if (params.length > 0) {
      router.push(url + params.join("&"));
    }
  };

  return (
    <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-white dark:bg-slate-950 bg-gradient-mesh">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-50/30 to-transparent dark:from-brand-900/5 dark:to-transparent -z-10 blur-3xl opacity-60"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Context & Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-6 border border-brand-100 dark:border-brand-800/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {heroBadge}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-5 text-slate-900 dark:text-white leading-[1.05]"
            >
              {heroTitleFallback} <span className="text-brand-600">{heroTitleAccent}</span><br />
              <span className="text-slate-400 dark:text-slate-600">{heroTitleSubtitle}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl"
            >
              {heroDescription}
            </motion.p>
            
            {/* Trust Checklist */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs md:text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Budget-friendly picks
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Clear recommendations
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                No confusing jargon
              </div>
            </motion.div>
          </div>
          
          {/* Right Column: Smart Finder Card */}
          <div className="lg:col-span-5 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-800 relative overflow-hidden"
            >
              {/* Inner subtle glow design */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-50 to-transparent dark:from-brand-900/10 opacity-50 rounded-bl-full pointer-events-none"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-brand-600" />
                  What are you looking for?
                </h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">
                  Select your goal and budget, and we'll help you find the right picks.
                </p>
                
                <div className="space-y-6">
                  {/* Goal Buttons */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 block mb-3">
                      Choose Your Goal
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {goals.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setSelectedGoal(selectedGoal === g.id ? null : g.id)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                            selectedGoal === g.id
                              ? "border-brand-500 bg-brand-50/80 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 ring-2 ring-brand-500/20"
                              : "border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Budget Buttons */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 block mb-3">
                      Budget Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {budgets.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBudget(selectedBudget === b.id ? null : b.id)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                            selectedBudget === b.id
                              ? "border-brand-500 bg-brand-50/80 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 ring-2 ring-brand-500/20"
                              : "border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Primary CTA */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50">
                    <button
                      onClick={handleSearch}
                      disabled={!selectedGoal && !selectedBudget}
                      className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                        selectedGoal || selectedBudget
                          ? "bg-brand-600 text-white hover:bg-brand-700 hover:shadow-brand-500/20 active:scale-[0.98]"
                          : "bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none"
                      }`}
                    >
                      Find My Smart Picks
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    {!selectedGoal && !selectedBudget && (
                      <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-3 font-semibold italic">
                        Please select a goal or budget to continue
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
