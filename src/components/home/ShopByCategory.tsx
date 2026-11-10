import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function ShopByCategory() {
  const categories = [
    {
      name: "Tech Accessories",
      slug: "tech-accessories",
      description: "Cables, GaN chargers, adapters & daily tools",
      image: "/categories/tech.png",
      tag: "Everyday Gear",
    },
    {
      name: "Creator Setup",
      slug: "creator-setup",
      description: "USB microphones, lighting & camera mounts",
      image: "/categories/creator-setup.png",
      tag: "Studio",
    },
    {
      name: "Gaming Setup",
      slug: "gaming-setup",
      description: "Fast mice, mechanical keyboards & audio",
      image: "/categories/setup.png",
      tag: "Performance",
    },
    {
      name: "Student Essentials",
      slug: "student-essentials",
      description: "Budget study setups & college backpack tech",
      image: "/categories/student-essentials.png",
      tag: "Value First",
    },
    {
      name: "Desk Setup",
      slug: "desk-setup",
      description: "Ergonomic chairs, monitor arms & desk mats",
      image: "/categories/desk-setup.png",
      tag: "Workspace",
    },
    {
      name: "Productivity",
      slug: "productivity-tools",
      description: "Ergonomic pointers, lightbars & docks",
      image: "/categories/productivity.png",
      tag: "Deep Work",
    },
    {
      name: "Smart Gadgets",
      slug: "smart-gadgets",
      description: "Smart bulbs, smart plugs & sensors",
      image: "/categories/smart-gadgets.png",
      tag: "Automation",
    },
    {
      name: "Budget Finds",
      slug: "budget-finds",
      description: "High-value tech essentials under ₹1,000",
      image: "/categories/lifestyle.png",
      tag: "Under ₹1K",
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200/70 dark:border-slate-800/60">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50/80 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-[11px] font-bold uppercase tracking-wider mb-3 border border-brand-200/60 dark:border-brand-800/50">
              Visual Directory
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-2">
              Explore by Category
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal max-w-xl">
              Curated gear categorized by workspace role and everyday tech needs.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 bg-brand-50/50 hover:bg-brand-50 dark:bg-brand-950/30 dark:hover:bg-brand-950/60 border border-brand-200/50 dark:border-brand-800/40 font-bold text-xs uppercase tracking-wider transition-all duration-200 shrink-0 group self-start md:self-auto"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Visual Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 dark:hover:border-brand-500/40 hover:shadow-[0_12px_24px_-6px_rgba(40,100,245,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] w-full rounded-xl bg-slate-100 dark:bg-slate-950/60 overflow-hidden mb-4 border border-slate-100 dark:border-slate-800/60">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      {category.tag}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-slate-950 dark:text-white mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mb-4">
                  {category.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <span>Browse Gear</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
