import Link from "next/link";
import { Coins, Wallet, CreditCard, Crown, ArrowRight } from "lucide-react";

export function BudgetSelector() {
  const tiers = [
    {
      name: "Entry Level",
      description: "Under ₹1,000",
      subtext: "Mousepads, simple cables, organizers, and lighting upgrades",
      color: "border-blue-100 dark:border-blue-950/30 hover:border-blue-500",
      iconBg: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
      icon: <Coins className="w-6 h-6" />,
      link: "/products?budget=1000"
    },
    {
      name: "Sweet Spot",
      description: "Under ₹3,000",
      subtext: "Premium mice, keyboard kits, hubs, and desktop stands",
      color: "border-indigo-100 dark:border-indigo-950/30 hover:border-indigo-500",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400",
      icon: <Wallet className="w-6 h-6" />,
      link: "/products?budget=3000"
    },
    {
      name: "Advanced Choice",
      description: "Under ₹5,000",
      subtext: "Mechanical keyboards, headphones, and workspace fixtures",
      color: "border-purple-100 dark:border-purple-950/30 hover:border-purple-500",
      iconBg: "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400",
      icon: <CreditCard className="w-6 h-6" />,
      link: "/products?budget=5000"
    },
    {
      name: "Enthusiast Setup",
      description: "Premium Picks",
      subtext: "Top-tier audio, desk organizers, chairs, and monitors",
      color: "border-amber-100 dark:border-amber-950/30 hover:border-amber-500",
      iconBg: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
      icon: <Crown className="w-6 h-6" />,
      link: "/products?sort=price_desc"
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-900">
      <div className="container mx-auto px-4">
        
        {/* Guided Step Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-wider mb-4">
            Step 2 of 2
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
            What's your budget?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto font-medium text-base">
            We find the best value at every price point. Pick a range to see top-rated products that won't break the bank.
          </p>
        </div>

        {/* Guided Decision Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <Link
              key={tier.description}
              href={tier.link}
              className={`group relative p-8 rounded-[2rem] bg-white dark:bg-slate-950 border-2 border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center overflow-hidden ${tier.color.replace('border-', 'hover:border-')}`}
            >
              {/* Radio-like indicator */}
              <div className="absolute top-4 right-4 w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-brand-500 group-hover:bg-brand-50 transition-colors flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-brand-500 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${tier.iconBg}`}>
                {tier.icon}
              </div>
              
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
                {tier.name}
              </span>
              
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                {tier.description}
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">
                {tier.subtext}
              </p>

              <div className="mt-auto w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider group-hover:bg-brand-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                Show Products <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
