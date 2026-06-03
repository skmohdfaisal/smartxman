import Link from "next/link";
import { GraduationCap, Video, Gamepad2, Briefcase, ArrowRight } from "lucide-react";

export function IntentSelector() {
  const intents = [
    {
      name: "Student Setup",
      goal: "student-setup",
      description: "Smart, budget-friendly essentials to stay focused and productive.",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "border-blue-100 dark:border-blue-950/30 hover:border-blue-500 hover:shadow-blue-500/5",
      iconBg: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
    },
    {
      name: "Creator Setup",
      goal: "creator-setup",
      description: "Audio, video, and lighting gear for creators, streams, and podcasts.",
      icon: <Video className="w-6 h-6" />,
      color: "border-purple-100 dark:border-purple-950/30 hover:border-purple-500 hover:shadow-purple-500/5",
      iconBg: "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400"
    },
    {
      name: "Gaming Setup",
      goal: "gaming-setup",
      description: "High-performance accessories, keypads, and lighting for ultimate play.",
      icon: <Gamepad2 className="w-6 h-6" />,
      color: "border-red-100 dark:border-red-950/30 hover:border-red-500 hover:shadow-red-500/5",
      iconBg: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
    },
    {
      name: "Office Setup",
      goal: "desk-setup",
      description: "Ergonomics, stands, and organizing accessories for clean productivity.",
      icon: <Briefcase className="w-6 h-6" />,
      color: "border-emerald-100 dark:border-emerald-950/30 hover:border-emerald-500 hover:shadow-emerald-500/5",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
    }
  ];

  return (
    <section id="intent-selector" className="py-16 bg-slate-50/50 dark:bg-slate-900/10 border-b border-slate-100 dark:border-slate-900 scroll-mt-20">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
            Choose Your Intent
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium text-sm">
            What setup environment are you looking to build or upgrade? Select your workflow.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {intents.map((intent) => (
            <Link
              key={intent.goal}
              href={`/products?goal=${intent.goal}`}
              className={`group p-6 rounded-3xl bg-white dark:bg-slate-900/40 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between ${intent.color}`}
            >
              <div>
                {/* Icon wrapper */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform ${intent.iconBg}`}>
                  {intent.icon}
                </div>
                
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 leading-none">
                  {intent.name}
                </h3>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mb-6">
                  {intent.description}
                </p>
              </div>

              <div className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-350 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors inline-flex items-center gap-1">
                Explore setup <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
