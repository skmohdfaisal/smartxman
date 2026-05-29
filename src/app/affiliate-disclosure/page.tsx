import { Info } from "lucide-react";

export const metadata = {
  title: "Affiliate Disclosure | Smartxman",
  description: "Read about how we fund our research and recommendations through affiliate links.",
  alternates: {
    canonical: "/affiliate-disclosure",
  },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <div className="flex items-center justify-center mb-8">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400">
          <Info className="w-8 h-8" />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black text-center text-slate-900 dark:text-white mb-12">
        Affiliate Disclosure
      </h1>

      <div className="prose prose-lg dark:prose-invert mx-auto bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300">
          Smartxman may earn a small commission when you buy through some product links on our website.
        </p>
        
        <p className="font-bold text-slate-900 dark:text-white mt-6 text-lg">
          This does not increase the price you pay.
        </p>
        
        <p>
          Our goal is not to make you buy more. Our goal is to help you buy better. 
        </p>
        
        <p>
          We try to recommend products based on usefulness, value, practical needs, and clear buying guidance. 
        </p>
        
        <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-l-4 border-brand-500">
          <p className="m-0 text-slate-600 dark:text-slate-400 text-sm">
            We do not guarantee that every product is perfect for everyone, so always check the latest price, availability, warranty, and product details before buying.
          </p>
        </div>
      </div>
    </div>
  );
}
