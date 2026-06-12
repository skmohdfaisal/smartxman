"use client";

import { Activity, Star, Shield, Cpu, Clock, Headset } from "lucide-react";

export function ResearchStandard() {
  const factors = [
    { name: "Value for Money", icon: Activity, score: "30%" },
    { name: "Real User Reviews", icon: Star, score: "20%" },
    { name: "Reliability", icon: Shield, score: "15%" },
    { name: "Features", icon: Cpu, score: "15%" },
    { name: "Long-Term Use", icon: Clock, score: "10%" },
    { name: "Customer Support", icon: Headset, score: "10%" },
  ];

  return (
    <section className="py-24 bg-slate-900 dark:bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-brand-300">
              The Smart Score
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
              Our Uncompromising <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
                Research Standard
              </span>
            </h2>
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
              We don't just look at spec sheets. Every product is evaluated through our proprietary 'Smart Score' methodology. We calculate true value based on six critical factors before making a recommendation.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="text-5xl font-black text-white">
                8.0<span className="text-2xl text-slate-500">/10</span>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest border-l border-slate-700 pl-6">
                Minimum Score <br/>Required to Feature
              </p>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {factors.map((factor, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all flex flex-col items-start gap-4"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400">
                      <factor.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-slate-500 bg-slate-900/50 px-2 py-1 rounded-md">
                      Weight: {factor.score}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{factor.name}</h3>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
