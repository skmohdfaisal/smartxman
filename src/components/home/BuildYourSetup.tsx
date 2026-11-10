"use client";

import Link from "next/link";
import { ArrowRight, Sliders, GraduationCap, Video, Gamepad2, Briefcase } from "lucide-react";

export function BuildYourSetup() {
  const pathways = [
    {
      title: "Student Desk",
      goal: "Study & Value",
      desc: "Essentials tailored for college dorms, shared spaces, and focused exam sessions.",
      href: "/category/student-essentials",
      icon: <GraduationCap className="w-5 h-5" />,
      tag: "Budget Picks",
    },
    {
      title: "Creator Studio",
      goal: "Audio & Video",
      desc: "Equipment for podcasts, YouTube recordings, streaming, and editing desks.",
      href: "/category/creator-setup",
      icon: <Video className="w-5 h-5" />,
      tag: "Studio Gear",
    },
    {
      title: "Gaming Station",
      goal: "Speed & Accuracy",
      desc: "Ultra-fast wireless sensors, mechanical switches, and immersive desk audio.",
      href: "/category/gaming-setup",
      icon: <Gamepad2 className="w-5 h-5" />,
      tag: "High FPS",
    },
    {
      title: "Ergonomic Office",
      goal: "Comfort & Deep Work",
      desc: "Tools designed to eliminate wrist fatigue, neck strain, and workspace clutter.",
      href: "/category/desk-setup",
      icon: <Briefcase className="w-5 h-5" />,
      tag: "All-Day Comfort",
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white dark:bg-slate-950 border-b border-slate-200/70 dark:border-slate-800/60">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Main Feature Banner */}
        <div className="p-8 sm:p-10 lg:p-12 rounded-3xl bg-slate-900 dark:bg-slate-900/90 text-white relative overflow-hidden mb-8 border border-slate-800 shadow-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/70 border border-brand-800/70 text-brand-400 text-[11px] font-bold uppercase tracking-wider mb-4">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Setup Planner</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              Build Your Ideal Setup
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8">
              Assemble a cohesive workspace without the guesswork. Choose a curated pathway or custom-build your desk gear piece by piece matched to your exact budget.
            </p>

            <Link
              href="/products?type=setup"
              className="px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm tracking-wide rounded-xl transition-all shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/35 hover:-translate-y-0.5 active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Setup Builder</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Curated Setup Pathway Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pathways.map((path) => (
            <Link
              key={path.title}
              href={path.href}
              className="group p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 dark:hover:border-brand-500/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-[0_12px_24px_-6px_rgba(40,100,245,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    {path.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {path.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {path.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mb-6">
                  {path.desc}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <span>Explore Setup</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
