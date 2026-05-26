import Link from "next/link";
import { Laptop, Gamepad2, Briefcase, GraduationCap, DollarSign, Zap, Headphones, MonitorSmartphone, Sparkles, Home, Compass, Smartphone, Building, Cpu, Heart, Video, Watch } from "lucide-react";

export function ShopByCategory() {
  const categories = [
    { name: "Laptops", slug: "laptops", description: "Work, gaming, & student laptops", icon: <Laptop className="w-7 h-7" /> },
    { name: "Smartphones", slug: "smartphones", description: "Flagship and budget phones", icon: <Smartphone className="w-7 h-7" /> },
    { name: "Headphones & Earbuds", slug: "headphones-earbuds", description: "True wireless & over-ears", icon: <Headphones className="w-7 h-7" /> },
    { name: "Smartwatches & Wearables", slug: "smartwatches-wearables", description: "Smartwatches & health bands", icon: <Watch className="w-7 h-7" /> },
    { name: "Computer Components", slug: "computer-components-storage", description: "SSDs, RAM, and storage", icon: <Cpu className="w-7 h-7" /> },
    { name: "Laptop Accessories", slug: "laptop-accessories", description: "Sleeves, stands, and hubs", icon: <Laptop className="w-7 h-7" /> },
    { name: "Desk Setup", slug: "desk-setup", description: "Ergonomics and mats", icon: <Briefcase className="w-7 h-7" /> },
    { name: "Tech Accessories", slug: "tech-accessories", description: "Daily tech gear and tools", icon: <MonitorSmartphone className="w-7 h-7" /> },
    { name: "Creator Gear", slug: "creator-gear", description: "Microphones and lighting", icon: <Video className="w-7 h-7" /> },
    { name: "Mobile Accessories", slug: "mobile-accessories", description: "Chargers, power banks", icon: <Smartphone className="w-7 h-7" /> },
    { name: "Audio Gear", slug: "audio-gear", description: "Headphones and earbuds", icon: <Headphones className="w-7 h-7" /> },
    { name: "Gaming Accessories", slug: "gaming-accessories", description: "Mice, keyboards, headsets", icon: <Gamepad2 className="w-7 h-7" /> },
    { name: "Student Essentials", slug: "student-essentials", description: "Dorm study essentials", icon: <GraduationCap className="w-7 h-7" /> },
    { name: "Productivity Tools", slug: "productivity-tools", description: "Timers and focus gear", icon: <Zap className="w-7 h-7" /> },
    { name: "Work From Home", slug: "work-from-home", description: "Remote work comfort", icon: <Home className="w-7 h-7" /> },
    { name: "Home Office", slug: "home-office", description: "Workspace upgrades", icon: <Building className="w-7 h-7" /> },
    { name: "Smart Gadgets", slug: "smart-gadgets", description: "Smart bulbs and plugs", icon: <Cpu className="w-7 h-7" /> },
    { name: "Travel Tech", slug: "travel-tech", description: "Adapters, tech sleeves", icon: <Compass className="w-7 h-7" /> },
    { name: "Lifestyle Gear", slug: "lifestyle-gear", description: "Smart bottles, mini fans", icon: <Sparkles className="w-7 h-7" /> },
    { name: "Budget Finds", slug: "budget-finds", description: "Values under ₹1000", icon: <DollarSign className="w-7 h-7" /> },
    { name: "Daily Use Products", slug: "daily-use-products", description: "Keychains, cleaning gel", icon: <Heart className="w-7 h-7" /> },
  ];

  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-900/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">Shop by category</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Find premium recommended products handpicked based on your work environment, budget, or goal.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/category/${category.slug}`} 
              className="group p-5 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-brand-500 dark:hover:border-brand-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                {category.icon}
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight">{category.name}</h3>
              <p className="text-[11px] text-slate-405 dark:text-slate-500 font-medium leading-normal">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
