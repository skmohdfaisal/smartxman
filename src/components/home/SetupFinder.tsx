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
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/60">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-3">
            What are you shopping for?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
            Pick your goal and we'll show you exactly what to get.
          </p>
        </div>

        {/* Goal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {goals.map((goal) => (
            <Link
              key={goal.id}
              id={goal.id}
              href={goal.href}
              className="group flex flex-col items-start p-7 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="text-4xl mb-5 select-none">{goal.emoji}</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-brand-600 transition-colors">
                {goal.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed flex-1">
                {goal.desc}
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-brand-600 dark:text-brand-400 text-sm font-bold">
                Shop now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
