"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { Check } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-24 h-8 hidden sm:block">
                <Image 
                  src="/logo.png" 
                  alt="smartXman Logo" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 150px"
                  className="object-contain object-left"
                />
              </div>
              <h3 className="text-xl font-bold tracking-tighter text-brand-600 dark:text-brand-400 sm:hidden">smartXman</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Smart Product Picks That Actually Make Sense. Discover curated tech, setup, gaming, and lifestyle products recommended with real research.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://www.linkedin.com/company/smartxman" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://www.instagram.com/official_smartxman" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://www.youtube.com/@smartxman" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/products" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">All Products</Link></li>
              <li><Link href="/blog" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Buying Guides & Blog</Link></li>
              <li><Link href="/category/tech" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Tech Accessories</Link></li>
              <li><Link href="/category/creator" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Creator Setup</Link></li>
              <li><Link href="/category/gaming" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Gaming Setup</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Newsletter</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Get weekly updates on the best deals and product reviews.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg animate-in fade-in zoom-in duration-300">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  required
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button type="submit" className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex-1 max-w-2xl">
            <p className="mb-2">smartXman may earn a small commission when you buy through some links. Our recommendations are based on usefulness, value, and practical needs.</p>
            <p>© {new Date().getFullYear()} smartXman. All rights reserved.</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
