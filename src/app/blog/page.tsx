"use client";

import { ArrowLeft, Clock, Calendar, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getBlogs } from "@/lib/blogs-actions";


export default function BlogPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const res = await getBlogs();
      if (res.success && res.data) {
        // Only show published articles in the public feed
        const published = res.data.filter((art: any) => art.status === "published");
        setArticles(published);
      }
    } catch (err) {
      console.error("Failed to load blog articles:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30 dark:bg-slate-950">
      <div className="bg-slate-50 dark:bg-slate-900/50 py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 font-bold mb-6 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-slate-900 dark:text-white leading-tight">
            Guides & Articles
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Read our latest expert buying guides, reviews, and setup inspiration.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-slate-500 font-medium">Loading articles...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Link 
                key={article.id} 
                href={`/blog/${article.slug}`}
                className="group flex flex-col sm:flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300"
              >
                <div className="w-full sm:w-2/5 aspect-video sm:aspect-auto bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  <Image 
                    src={article.cover_image || "/categories/tech.png"} 
                    alt={article.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3 text-xs font-bold">
                      <span className="text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {article.category}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {article.read_time || "5 min read"}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" /> {new Date(article.created_at || Date.now()).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 font-medium">No published articles found. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}
