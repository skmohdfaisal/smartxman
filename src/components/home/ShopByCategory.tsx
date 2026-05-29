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
    <section className="py-24 bg-slate-50/50 dark:bg-slate-900/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">Shop by category</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Find products based on your goal, budget, or setup.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/category/${category.slug}`} 
              className="group p-6 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-brand-500 dark:hover:border-brand-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                {category.icon}
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight">{category.name}</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-550 font-medium leading-normal">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
