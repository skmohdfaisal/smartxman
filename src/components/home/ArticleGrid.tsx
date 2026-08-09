"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

interface Guide {
  title: string;
  tag?: string;
  readTime?: string;
  image: string;
  href: string;
}

interface ArticleGridProps {
  title: React.ReactNode;
  subtitle?: string;
  guides: Guide[];
  linkHref?: string;
  linkText?: string;
  bgClass?: string;
}

export function ArticleGrid({
  title,
  subtitle,
  guides,
  linkHref,
  linkText,
  bgClass = "bg-white dark:bg-slate-950"
}: ArticleGridProps) {
  if (!guides || guides.length === 0) return null;

  return (
    <section className={`py-24 ${bgClass} border-t border-slate-200 dark:border-slate-800`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {linkHref && linkText && (
            <Link href={linkHref} className="flex-shrink-0 inline-flex items-center gap-2 text-brand-600 font-bold uppercase text-sm tracking-widest hover:text-brand-700 transition-colors">
              {linkText} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide, idx) => (
            <Link key={idx} href={guide.href} className="group flex flex-col">
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                {guide.image ? (
                  <Image 
                    src={guide.image} 
                    alt={guide.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                ) : null}
                {guide.tag && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md dark:bg-slate-900/90 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                      {guide.tag}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                {guide.readTime && (
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    {guide.readTime}
                  </div>
                )}
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
