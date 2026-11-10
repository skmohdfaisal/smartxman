"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const goals = [
  {
    emoji: "🎓",
    name: "Student Setup",
    desc: "Essentials for college life on any budget.",
    href: "/category/student-essentials",
    id: "goal-student",
  },
  {
    emoji: "🎮",
    name: "Gaming Setup",
    desc: "Gear that keeps up with your game.",
    href: "/category/gaming-setup",
    id: "goal-gaming",
  },
  {
    emoji: "💼",
    name: "Work Setup",
    desc: "Tools that help you focus and get more done.",
    href: "/category/work-from-home",
    id: "goal-work",
  },
  {
    emoji: "🎥",
    name: "Creator Setup",
    desc: "Equipment for YouTube, streaming, and content.",
    href: "/category/creator-setup",
    id: "goal-creator",
  },
];

export function SetupFinder() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-t border-b border-slate-200/70 dark:border-slate-800/60">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Section header */}
        <div className="text-center mb-12 md:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50/80 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-[11px] font-bold uppercase tracking-wider mb-3 border border-brand-200/60 dark:border-brand-800/50">
            Setup Finder
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-3">
            What are you shopping for?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal max-w-md mx-auto">
            Pick your goal and explore tailor-made setups without guesswork.
          </p>
        </div>

        {/* Goal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {goals.map((goal) => (
            <Link
              key={goal.id}
              id={goal.id}
              href={goal.href}
              className="group flex flex-col items-start p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/60 dark:hover:border-brand-500/50 hover:shadow-[0_12px_24px_-6px_rgba(40,100,245,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-2xl mb-4 select-none group-hover:scale-105 transition-transform">
                {goal.emoji}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                {goal.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed flex-1">
                {goal.desc}
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
                Shop now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
