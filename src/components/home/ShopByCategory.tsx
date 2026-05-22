import Link from "next/link";
import { Laptop, Gamepad2, Briefcase, GraduationCap, DollarSign, Zap, Headphones, MonitorSmartphone } from "lucide-react";

export function ShopByCategory() {
  const categories = [
    { name: "Tech Accessories", slug: "tech-accessories", description: "Essential gear for every day", icon: <MonitorSmartphone className="w-8 h-8" /> },
    { name: "Creator Setup", slug: "creator-setup", description: "For streamers and makers", icon: <Laptop className="w-8 h-8" /> },
    { name: "Gaming Setup", slug: "gaming-setup", description: "High-performance battlestations", icon: <Gamepad2 className="w-8 h-8" /> },
    { name: "Student Essentials", slug: "student-essentials", description: "Dorm and study must-haves", icon: <GraduationCap className="w-8 h-8" /> },
    { name: "Desk Setup", slug: "desk-setup", description: "Ergonomics and organization", icon: <Briefcase className="w-8 h-8" /> },
    { name: "Budget Finds", slug: "budget-finds", description: "Great value under ₹1000", icon: <DollarSign className="w-8 h-8" /> },
    { name: "Productivity", slug: "productivity", description: "Get more done faster", icon: <Zap className="w-8 h-8" /> },
    { name: "Audio", slug: "audio", description: "Headphones and speakers", icon: <Headphones className="w-8 h-8" /> },
  ];

  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-900/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">Shop by category</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find products based on your goal, budget, or setup.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/category/${category.slug}`} 
              className="group p-6 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{category.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
