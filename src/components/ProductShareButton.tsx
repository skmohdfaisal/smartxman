"use client";

import React, { useState, useEffect } from "react";
import { Share2, Copy, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductShareButtonProps {
  affiliateLink: string;
  productName: string;
}

// Brand SVG Icons for premium aesthetics
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.416 9.863-9.864.001-2.639-1.023-5.12-2.885-6.983C16.388 1.893 13.91 .87 11.278.87c-5.434 0-9.858 4.417-9.86 9.865-.001 1.939.497 3.53 1.44 5.051L1.83 20.9l5.241-1.374c.004-.002.008-.002.012-.002zM17.521 14.3c-.29-.145-1.711-.845-1.976-.941-.265-.096-.458-.145-.65.145-.19.29-.739.941-.905 1.133-.167.193-.332.217-.622.072-2.825-1.238-4.662-3.145-5.385-4.39-.168-.289-.018-.446.126-.59.13-.13.29-.338.435-.507.145-.17.193-.29.29-.483.096-.193.048-.362-.024-.507-.072-.145-.65-1.567-.89-2.146-.233-.564-.471-.487-.65-.496-.168-.008-.362-.01-.555-.01-.193 0-.507.072-.771.362-.265.29-1.012.99-1.012 2.417s1.036 2.798 1.18 2.99c.145.193 2.036 3.111 4.931 4.364.688.298 1.226.476 1.643.609.692.22 1.322.19 1.82.115.554-.083 1.711-.699 1.952-1.374.24-.675.24-1.253.168-1.374-.072-.121-.265-.193-.555-.338z"/>
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function ProductShareButton({ affiliateLink, productName }: ProductShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleShare = async () => {
    // Attempt Web Share API if supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `Check out ${productName} on SmartXMan!`,
          url: affiliateLink,
        });
        return;
      } catch (err) {
        // Fallback to custom modal if Web Share is aborted or fails
        console.log("Web Share error or user cancelled:", err);
      }
    }
    // Open custom share sheet modal
    setIsOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareText = `Check out this product: ${productName}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + "\n" + affiliateLink)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(affiliateLink)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affiliateLink)}`;

  return (
    <>
      {/* Action Button on Product Page */}
      <button
        onClick={handleShare}
        className="px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-slate-350 dark:hover:border-slate-500 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
      >
        <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        Share
      </button>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white px-6 py-3.5 rounded-full flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-800 dark:border-slate-700"
          >
            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider">Affiliate Link Copied!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Share Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-md"
            />

            {/* Sharing Panel Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden z-10 p-6 md:p-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none">Share Option</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1 leading-tight">Share Product</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Preview Block */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850/50 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 mb-6">
                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider leading-none mb-1.5">Product</p>
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-slate-200 line-clamp-2 leading-relaxed">
                  {productName}
                </h4>
              </div>

              {/* Copy Affiliate Link Input */}
              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Amazon Affiliate Link
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={affiliateLink}
                    className="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-350 focus:outline-none select-all"
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute right-2 p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-150 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Social Platforms Row */}
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Quick Share
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 py-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/10 text-[#25D366] transition-all font-black text-xs uppercase tracking-wider group active:scale-95"
                  >
                    <WhatsAppIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    WhatsApp
                  </a>

                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 border border-slate-900/5 dark:border-white/5 text-slate-900 dark:text-white transition-all font-black text-xs uppercase tracking-wider group active:scale-95"
                  >
                    <TwitterIcon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                    Twitter
                  </a>

                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 py-3 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/10 text-[#1877F2] transition-all font-black text-xs uppercase tracking-wider group active:scale-95"
                  >
                    <FacebookIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Facebook
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
