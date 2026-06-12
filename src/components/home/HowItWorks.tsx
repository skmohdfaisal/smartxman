"use client";

import { Search, Scale, BadgeDollarSign, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "1. Research & Aggregate",
      description: "We analyze hundreds of user reviews, Reddit threads, and expert opinions to filter out the noise.",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Scale,
      title: "2. Compare Alternatives",
      description: "We benchmark the product against top competitors in its price bracket to ensure it actually holds up.",
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: BadgeDollarSign,
      title: "3. Analyze Value",
      description: "We calculate the 'Smart Score' based on features vs. price to guarantee you're getting your money's worth.",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      icon: CheckCircle2,
      title: "4. Final Recommendation",
      description: "Only products that pass our strict criteria make it to the website. No junk. No filler.",
      color: "text-brand-500",
      bg: "bg-brand-50 dark:bg-brand-900/20"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
            How <span className="text-brand-600">SmartXMan</span> Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            We do the heavy lifting so you don't have to. Our 4-step curation process ensures every recommendation is truly worth your money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-premium-hover transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
