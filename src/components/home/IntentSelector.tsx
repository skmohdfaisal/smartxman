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
    <section id="intent-selector" className="py-20 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 scroll-mt-20">
      <div className="container mx-auto px-4">
        
        {/* Guided Step Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-wider mb-4">
            Step 1 of 2
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
            What are you building today?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto font-medium text-base">
            Select your primary workflow. We'll filter out the noise and show you only the gear that makes sense for your setup.
          </p>
        </div>

        {/* Guided Decision Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {intents.map((intent) => (
            <Link
              key={intent.goal}
              href={`/products?goal=${intent.goal}`}
              className={`group relative p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900/40 border-2 border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center overflow-hidden ${intent.color.replace('border-', 'hover:border-')}`}
            >
              {/* Radio-like indicator */}
              <div className="absolute top-4 right-4 w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-brand-500 group-hover:bg-brand-50 transition-colors flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-brand-500 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 ${intent.iconBg}`}>
                {intent.icon}
              </div>
              
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                {intent.name}
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">
                {intent.description}
              </p>

              <div className="mt-auto w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider group-hover:bg-brand-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                Select Path <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
