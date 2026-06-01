"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StickyCTAProps {
  name: string;
  image: string;
  price: string;
  currentPrice: number | null;
  showFreshPrice: boolean;
  affiliateLink: string;
}

export default function StickyCTA({
  name,
  image,
  price,
  currentPrice,
  showFreshPrice,
  affiliateLink
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA when scrolled past 600px
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-150 dark:border-slate-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] py-3 px-4 transition-all duration-300 transform md:py-4",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="container mx-auto max-w-5xl flex items-center justify-between gap-4">
        {/* Left Side: Thumbnail & Title (hidden on tiny screens) */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 overflow-hidden shrink-0 hidden sm:block">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-contain p-1"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400">smart</div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-xs">
              {name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              {showFreshPrice && currentPrice ? (
                <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                  ₹{Number(currentPrice).toLocaleString('en-IN')}
                </span>
              ) : (
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Check Amazon Price
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Affiliate CTA */}
        <div className="w-full sm:w-auto shrink-0">
          <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-sm shadow-brand-500/10 active:scale-[0.98]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{showFreshPrice ? "Buy on Amazon" : "Check Price on Amazon"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
