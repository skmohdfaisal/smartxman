"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Sparkles, Zap, Search } from "lucide-react";
import { FEATURED_PRODUCTS } from "@/lib/constants";
import { motion } from "framer-motion";

export function Hero() {
  const floatingProducts = FEATURED_PRODUCTS.slice(0, 3);

  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-50/50 to-transparent dark:from-brand-900/10 dark:to-transparent -z-10 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-accent-50/30 to-transparent dark:from-accent-900/5 dark:to-transparent -z-10 blur-3xl opacity-50"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-[13px] font-bold uppercase tracking-wider mb-8 border border-brand-100 dark:border-brand-800/50"
          >
            <Sparkles className="w-4 h-4" />
            500+ curated picks for smarter buying
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-slate-900 dark:text-white leading-[0.9] lg:leading-[0.85]"
          >
            Confused <span className="text-brand-600">what to buy?</span><br />
            <span className="text-slate-400 dark:text-slate-700">Find picks that make sense.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-3xl"
          >
            Smartxman helps students, creators, gamers, and everyday buyers discover useful tech, setup gear, and lifestyle products based on <span className="text-slate-900 dark:text-white font-semibold italic">your budget</span> and real value.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full sm:w-auto"
          >
            <Link href="/products?type=setup" className="w-full sm:w-auto px-10 py-5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 group text-lg">
              Build My Setup <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/products?type=budget" className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl font-bold transition-all text-lg">
              Explore Budget Picks
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em]"
          >
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-500" /> No spammy picks</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-500" /> Clear pros & cons</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-500" /> Budget-friendly</div>
          </motion.div>
        </div>
        
        {/* Emotional Line */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center py-6 border-t border-slate-100 dark:border-slate-900/50"
        >
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 italic">
            Made for people who hate confusing product research. No more open tabs, no more second-guessing.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
