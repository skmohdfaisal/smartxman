import Link from "next/link";
import { Laptop, Gamepad2, Briefcase, GraduationCap, DollarSign, Zap, Headphones, MonitorSmartphone, Sparkles, Home, Compass, Smartphone, Building, Cpu, Heart, Video, Watch } from "lucide-react";

export function ShopByCategory() {
  const categories = [
    { name: "Tech Accessories", slug: "tech-accessories", description: "Daily tech gear and tools", icon: <MonitorSmartphone className="w-7 h-7" /> },
    { name: "Creator Setup", slug: "creator-gear", description: "Microphones, lights, and cameras", icon: <Video className="w-7 h-7" /> },
    { name: "Gaming Setup", slug: "gaming-accessories", description: "Mice, mechanical keyboards, headsets", icon: <Gamepad2 className="w-7 h-7" /> },
    { name: "Student Essentials", slug: "student-essentials", description: "Back-to-school and study setups", icon: <GraduationCap className="w-7 h-7" /> },
    { name: "Desk Setup", slug: "desk-setup", description: "Ergonomics, stands, and premium mats", icon: <Briefcase className="w-7 h-7" /> },
    { name: "Budget Finds", slug: "budget-finds", description: "High-value deals under ₹1000", icon: <DollarSign className="w-7 h-7" /> },
    { name: "Productivity", slug: "productivity-tools", description: "Focus aids and organizational gear", icon: <Zap className="w-7 h-7" /> },
    { name: "Smart Gadgets", slug: "smart-gadgets", description: "Smart bulbs, plugs, and sensors", icon: <Cpu className="w-7 h-7" /> },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-t border-b border-slate-200/70 dark:border-slate-800/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12 md:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50/80 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-[11px] font-bold uppercase tracking-wider mb-3 border border-brand-200/60 dark:border-brand-800/50">
            Explore Collections
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-3">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-normal">
            Find products organized by your goal, setup style, or everyday workflow.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/60 dark:hover:border-brand-500/50 hover:shadow-[0_12px_24px_-6px_rgba(40,100,245,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-100/70 dark:border-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-3.5 group-hover:scale-105 group-hover:bg-brand-600 group-hover:text-white dark:group-hover:bg-brand-600 dark:group-hover:text-white transition-all duration-200">
                {category.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                {category.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-normal">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
