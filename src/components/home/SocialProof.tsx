"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";

export function SocialProof() {
  const testimonials = [
    {
      text: "I was about to spend ₹40,000 on a monitor, but SmartXMan's guide showed me a ₹25,000 alternative that had the exact same panel. Saved me so much money.",
      author: "Rahul S.",
      role: "Software Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
    },
    {
      text: "As a student, I can't afford to buy the wrong tech. The Student Desk Setup guide helped me build a productive space perfectly within my strict budget.",
      author: "Priya K.",
      role: "Design Student",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
    },
    {
      text: "Finally, a site that actually explains WHY a product is good instead of just listing Amazon features. The Smart Score metric makes total sense.",
      author: "Amit M.",
      role: "Freelance Video Editor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
            Don't Just <span className="text-brand-600">Take Our Word</span> For It.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            Join thousands of smart buyers who stopped wasting money on bad tech.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-200 dark:text-slate-800" />
              <div className="flex gap-1 text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-8 relative z-10">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900">
                  <Image src={t.avatar} alt={t.author} width={48} height={48} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{t.author}</h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Future Proofing: Setup Submissions */}
        <div className="mt-16 text-center">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
            Have a setup you're proud of?
          </p>
          <button className="px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm transition-colors">
            Submit Your Setup (Coming Soon)
          </button>
        </div>
      </div>
    </section>
  );
}
