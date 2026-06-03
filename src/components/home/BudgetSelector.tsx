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
    <section className="py-16 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
            Choose Your Budget
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium text-sm">
            Select a price range to explore handpicked products that offer the best value.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <Link
              key={tier.description}
              href={tier.link}
              className={`group p-6 rounded-3xl bg-slate-50/30 dark:bg-slate-900/20 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between ${tier.color}`}
            >
              <div>
                {/* Icon wrapper */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform ${tier.iconBg}`}>
                  {tier.icon}
                </div>
                
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
                  {tier.name}
                </span>
                
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 leading-none">
                  {tier.description}
                </h3>
                
                <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed font-semibold mb-6">
                  {tier.subtext}
                </p>
              </div>

              <div className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-350 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors inline-flex items-center gap-1">
                Explore picks <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
