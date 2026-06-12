"use client";

import Image from "next/image";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function FounderStory() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              Why I Built <span className="text-brand-600">SmartXMan</span>
            </h2>
            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-400 font-medium">
              <p>
                As a Computer Science student, I found myself constantly overwhelmed by fake reviews, sponsored YouTube videos, and endless comparison tabs just to buy a simple keyboard or monitor.
              </p>
              <p>
                I realized that figuring out what to buy had become a full-time job. I kept wasting money on products I eventually regretted.
              </p>
              <p>
                That's why I created SmartXMan. My goal is simple: to do the exhausting research for you. We analyze the specs, compare the alternatives, and evaluate real-world value so you don't have to.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  The SmartXMan Promise
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Every recommendation is manually researched before being published.
                </p>
              </div>
            </div>
            
            <div className="pt-6">
              <Link href="/about" className="inline-flex items-center gap-2 text-brand-600 font-bold uppercase text-sm tracking-widest hover:text-brand-700 transition-colors">
                Read the Full Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Image Content */}
          <div className="flex-1 w-full max-w-md lg:max-w-none relative">
            <div className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-brand-500/10 border border-slate-200 dark:border-slate-800">
              <Image 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop" 
                alt="Faisal - Founder of SmartXMan" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <p className="text-white font-black text-2xl">Faisal</p>
                <p className="text-slate-300 font-medium">Founder & Chief Researcher</p>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-500 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
