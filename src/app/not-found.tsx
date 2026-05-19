"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-[12rem] md:text-[15rem] font-black text-slate-100 dark:text-slate-900 leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="bg-brand-500 text-white px-6 py-2 rounded-full font-bold text-xl md:text-2xl shadow-xl shadow-brand-500/20 mb-4">
            Page Not Found
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium max-w-xs mx-auto">
            The link you followed might be broken, or the page may have been removed.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-brand-500/25"
        >
          <Home className="w-5 h-5" /> Back to Home
        </Link>
        <Link 
          href="/products" 
          className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-full font-semibold transition-all shadow-sm"
        >
          <Search className="w-5 h-5" /> Explore Products
        </Link>
      </div>

      <div className="mt-12">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Go back to previous page
        </button>
      </div>
    </div>
  );
}
