import { ShieldCheck, HeartHandshake, RefreshCw } from "lucide-react";

export function TrustSection() {
  const points = [
    {
      title: "Curated Manually + AI Assisted",
      description: "Our experts research hundreds of specifications and reviews, assisted by machine learning models to synthesize verdicts.",
      icon: <ShieldCheck className="w-8 h-8 text-brand-600 dark:text-brand-400" />,
      bg: "bg-brand-50/50 dark:bg-brand-950/20"
    },
    {
      title: "Zero Biased Rankings",
      description: "We don't accept sponsor money to rank products higher. Our expert scores and VFM indices are 100% objective.",
      icon: <HeartHandshake className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50/50 dark:bg-emerald-950/20"
    },
    {
      title: "Updated Daily",
      description: "Our sync engines run checks daily to update current pricing, deals status, and stock availability on Amazon.",
      icon: <RefreshCw className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
      bg: "bg-purple-50/50 dark:bg-purple-950/20"
    }
  ];

  return (
    <section className="py-20 bg-slate-50/30 dark:bg-slate-900/10 border-b border-slate-100 dark:border-slate-900">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-lg mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
            Our Trust Standards
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            We help you make informed buying decisions with structural guidelines designed to keep recommendations fair, clear, and fresh.
          </p>
        </div>

        {/* Points grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {points.map((p, i) => (
            <div 
              key={i} 
              className="group flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-150/40 dark:border-slate-800/80 shadow-premium hover:shadow-premium-hover hover:border-brand-500/20 dark:hover:border-brand-400/20 transition-all duration-300"
            >
              {/* Icon container */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-350 shadow-inner ${p.bg}`}>
                {p.icon}
              </div>
              
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">
                {p.title}
              </h3>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {p.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
