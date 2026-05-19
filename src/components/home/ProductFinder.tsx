"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function ProductFinder() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  const getFinderLink = () => {
    let url = "/products?";
    if (selectedGoal) url += `goal=${selectedGoal.toLowerCase().replace(" ", "-")}&`;
    if (selectedBudget) url += `budget=${selectedBudget.replace(/[^0-9]/g, "") || "ultimate"}`;
    return url;
  };

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-brand-500/10 dark:bg-brand-500/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-14 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          {/* Inner decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-50 to-transparent dark:from-brand-900/20 opacity-60 pointer-events-none rounded-bl-full"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-brand-50 dark:bg-brand-900/30 rounded-2xl mb-6 text-brand-600 dark:text-brand-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                What are you looking for?
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
                Select your goal and budget, and we'll instantly find the perfect gear matched to your specific needs.
              </p>
            </div>
          
          <div className="space-y-10">
            <div>
              <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-6 block text-center">Choose Your Goal</label>
              <div className="flex flex-wrap justify-center gap-3">
                {["Student Setup", "Creator Setup", "Gaming Setup", "Desk Setup"].map(goal => (
                  <button 
                    key={goal} 
                    onClick={() => setSelectedGoal(goal)}
                    className={`px-6 py-3 rounded-2xl border-2 transition-all text-sm font-bold ${
                      selectedGoal === goal 
                        ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400" 
                        : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-6 block text-center">Budget Range</label>
              <div className="flex flex-wrap justify-center gap-3">
                {["Under ₹1000", "Under ₹3000", "Under ₹5000", "Ultimate"].map(budget => (
                  <button 
                    key={budget} 
                    onClick={() => setSelectedBudget(budget)}
                    className={`px-6 py-3 rounded-2xl border-2 transition-all text-sm font-bold ${
                      selectedBudget === budget 
                        ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400" 
                        : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700"
                    }`}
                  >
                    {budget}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <Link 
                href={getFinderLink()} 
                className={`w-full max-w-md mx-auto py-5 rounded-[2rem] font-black text-center transition-all shadow-xl block uppercase tracking-widest text-lg ${
                  selectedGoal || selectedBudget 
                    ? "bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/20" 
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed pointer-events-none"
                }`}
              >
                Find My Smart Picks
              </Link>
              {!selectedGoal && !selectedBudget && (
                <p className="text-center text-xs text-slate-500 mt-4 font-medium italic">Please select a goal or budget to continue</p>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
