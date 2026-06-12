"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

export function FeaturedGuides() {
  const guides = [
    {
      title: "Best Phones Under ₹20,000 in India (2026)",
      tag: "Buying Guide",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
      href: "/blog/best-phones-under-20000"
    },
    {
      title: "The Ultimate Minimalist Desk Setup Guide",
      tag: "Setup Ideas",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=800&auto=format&fit=crop",
      href: "/blog/minimalist-desk-setup"
    },
    {
      title: "Budget Mechanical Keyboards That Don't Suck",
      tag: "Review",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
      href: "/blog/budget-mechanical-keyboards"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
              Latest <span className="text-brand-600">Buying Guides</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
              In-depth research and comparisons so you don't have to read 50 Reddit threads.
            </p>
          </div>
          <Link href="/blog" className="flex-shrink-0 inline-flex items-center gap-2 text-brand-600 font-bold uppercase text-sm tracking-widest hover:text-brand-700 transition-colors">
            Read All Guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide, idx) => (
            <Link key={idx} href={guide.href} className="group flex flex-col">
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 border border-slate-100 dark:border-slate-800">
                <Image 
                  src={guide.image} 
                  alt={guide.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md dark:bg-slate-900/90 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                    {guide.tag}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  {guide.readTime}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors leading-tight">
                  {guide.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
