"use client";

import Link from "next/link";
import { ArrowRight, Laptop, Video, Briefcase, Gamepad2, Home, Wallet } from "lucide-react";

export function SetupFinder() {
  const setups = [
    { name: "Student Setup", icon: Laptop, desc: "Budget-friendly essentials for college.", href: "/category/student" },
    { name: "Creator Setup", icon: Video, desc: "Gear for YouTubers and streamers.", href: "/category/creator" },
    { name: "Productivity", icon: Briefcase, desc: "Tools to maximize your focus.", href: "/category/productivity" },
    { name: "Gaming Setup", icon: Gamepad2, desc: "High-performance gaming rigs.", href: "/category/gaming" },
    { name: "Work From Home", icon: Home, desc: "Ergonomic wfh office builds.", href: "/category/wfh" },
    { name: "Budget Essentials", icon: Wallet, desc: "Maximum value under strict budgets.", href: "/category/budget" },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
              Find Your <span className="text-brand-600">Perfect Setup</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
              Don't buy random products. Build a cohesive ecosystem. Choose your goal below and discover complete, research-backed solutions.
            </p>
          </div>
          <Link href="/categories" className="flex-shrink-0 inline-flex items-center gap-2 text-brand-600 font-bold uppercase text-sm tracking-widest hover:text-brand-700 transition-colors">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {setups.map((setup, idx) => (
            <Link 
              key={idx} 
              href={setup.href}
              className="group block p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-premium transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                  <setup.icon className="w-7 h-7" strokeWidth={2} />
                </div>
                <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-600 group-hover:border-brand-200 transition-colors">
                  <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 transition-colors">
                {setup.name}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {setup.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
