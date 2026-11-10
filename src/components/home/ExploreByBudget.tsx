"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Wallet, Target, Users, Tag, Sparkles } from "lucide-react";

export function ExploreByBudget() {
  const [activeTab, setActiveTab] = useState<"budget" | "purpose" | "user">("budget");

  const budgetTiers = [
    {
      label: "Under ₹500",
      tier: "Entry Deals",
      desc: "Cable ties, adaptors, and everyday accessories.",
      href: "/products?budget=500",
      highlight: "Under ₹500",
    },
    {
      label: "Under ₹1,000",
      tier: "Value Finds",
      desc: "Sturdy phone stands, desk organizers, and hubs.",
      href: "/products?budget=1000",
      highlight: "Under ₹1,000",
    },
    {
      label: "Under ₹3,000",
      tier: "Sweet Spot",
      desc: "Ergonomic mice, desk mats, and budget keyboards.",
      href: "/products?budget=3000",
      highlight: "Under ₹3,000",
    },
    {
      label: "Under ₹5,000",
      tier: "Advanced Gear",
      desc: "Wireless keyboards, headphones, and monitor fixtures.",
      href: "/products?budget=5000",
      highlight: "Under ₹5,000",
    },
    {
      label: "Under ₹10,000",
      tier: "Enthusiast",
      desc: "Flagship productivity mice, studio audio, and desk lights.",
      href: "/products?budget=10000",
      highlight: "Under ₹10,000",
    },
  ];

  const purposeOptions = [
    {
      title: "Study",
      tag: "Focus",
      desc: "Quiet keyboards, reading lamps, and student organizers.",
      href: "/products?search=study",
    },
    {
      title: "Gaming",
      tag: "Speed",
      desc: "Low-latency wireless mice, RGB keypads, and headsets.",
      href: "/products?search=gaming",
    },
    {
      title: "Productivity",
      tag: "Workflow",
      desc: "Ergonomic vertical mice, screen lightbars, and docks.",
      href: "/products?search=productivity",
    },
    {
      title: "Content Creation",
      tag: "Studio",
      desc: "USB condenser mics, key lights, and camera mounts.",
      href: "/products?search=creator",
    },
    {
      title: "Everyday Use",
      tag: "Utility",
      desc: "Durable GaN chargers, multi-port dongles, and mats.",
      href: "/products?search=everyday",
    },
  ];

  const userTypes = [
    {
      title: "Students",
      tag: "Budget First",
      desc: "Durable, high-utility gear that won't strain a college budget.",
      href: "/products?search=student",
    },
    {
      title: "Creators",
      tag: "Production",
      desc: "Clean audio, crisp lighting, and dependable studio accessories.",
      href: "/products?search=creator",
    },
    {
      title: "Gamers",
      tag: "Performance",
      desc: "Fast sensors, mechanical switches, and precision gear.",
      href: "/products?search=gaming",
    },
    {
      title: "Professionals",
      tag: "Ergonomics",
      desc: "Tools built for 8+ hour workdays without wrist or eye fatigue.",
      href: "/products?search=professional",
    },
  ];

  return (
    <section
      id="explore-budget"
      className="py-16 md:py-20 lg:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200/70 dark:border-slate-800/60 scroll-mt-20"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50/80 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-[11px] font-bold uppercase tracking-wider mb-3 border border-brand-200/60 dark:border-brand-800/50">
              Interactive Discovery
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-2">
              Looking for something specific?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal max-w-xl">
              Filter curated gear by price limit, your primary workflow, or who you're buying for.
            </p>
          </div>

          {/* Interactive Category Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs self-start md:self-auto">
            <button
              onClick={() => setActiveTab("budget")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "budget"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>By Budget</span>
            </button>
            <button
              onClick={() => setActiveTab("purpose")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "purpose"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>By Purpose</span>
            </button>
            <button
              onClick={() => setActiveTab("user")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "user"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>By User</span>
            </button>
          </div>
        </div>

        {/* Tab 1: By Budget Grid */}
        {activeTab === "budget" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {budgetTiers.map((tier) => (
              <Link
                key={tier.label}
                href={tier.href}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 dark:hover:border-brand-500/40 hover:shadow-[0_12px_24px_-6px_rgba(40,100,245,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {tier.tier}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500/80 group-hover:scale-125 transition-transform" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {tier.label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mb-6">
                    {tier.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  <span>Explore Picks</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Tab 2: By Purpose Grid */}
        {activeTab === "purpose" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {purposeOptions.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 dark:hover:border-brand-500/40 hover:shadow-[0_12px_24px_-6px_rgba(40,100,245,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {item.tag}
                    </span>
                    <Tag className="w-3.5 h-3.5 text-brand-500" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  <span>View Products</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Tab 3: By User Grid */}
        {activeTab === "user" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {userTypes.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 dark:hover:border-brand-500/40 hover:shadow-[0_12px_24px_-6px_rgba(40,100,245,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {item.tag}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    For {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  <span>Explore Recommendations</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
