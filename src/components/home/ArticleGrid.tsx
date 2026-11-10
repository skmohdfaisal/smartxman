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
    <section className={`py-16 md:py-20 lg:py-24 ${bgClass} border-t border-slate-200/70 dark:border-slate-800/60`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          {linkHref && linkText && (
            <Link 
              href={linkHref} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 bg-brand-50/50 hover:bg-brand-50 dark:bg-brand-950/30 dark:hover:bg-brand-950/60 border border-brand-200/50 dark:border-brand-800/40 font-bold text-xs uppercase tracking-wider transition-all duration-200 shrink-0 group self-start md:self-auto"
            >
              {linkText} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
          {guides.map((guide, idx) => (
            <Link key={idx} href={guide.href} className="group flex flex-col p-3 rounded-2xl border border-transparent hover:border-slate-200/80 dark:hover:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900/60 hover:shadow-[0_12px_24px_-6px_rgba(40,100,245,0.08)] transition-all duration-200">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 border border-slate-200/70 dark:border-slate-800/70 bg-slate-100 dark:bg-slate-900 shadow-xs">
                {guide.image ? (
                  <Image 
                    src={guide.image} 
                    alt={guide.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                  />
                ) : null}
                {guide.tag && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-xs border border-slate-200/60 dark:border-slate-700/60">
                      {guide.tag}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col px-1">
                {guide.readTime && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">
                    <Clock className="w-3 h-3" />
                    {guide.readTime}
                  </div>
                )}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug line-clamp-2">
                  {guide.title}
                </h3>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 opacity-90 group-hover:opacity-100 uppercase tracking-wider">
                  Read guide <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
