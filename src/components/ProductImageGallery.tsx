"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Trophy, Star } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  image: string;
  name: string;
  smartScore: number;
  valueScore: number;
}

export default function ProductImageGallery({ images, image, name, smartScore, valueScore }: ProductImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const displayImages = images?.length > 0 ? images : [image];

  return (
    <div className="w-full lg:w-1/2 space-y-6 sticky top-24">
      <div className="aspect-square bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl relative overflow-hidden group shadow-inner flex items-center justify-center p-8">
         <Image 
            src={displayImages[activeImageIndex] || "/placeholder-product.png"} 
            alt={name} 
            fill 
            priority
            className="object-contain p-6 group-hover:scale-102 transition-transform duration-500" 
         />
         
         {/* Dynamic score overlays */}
         <div className="absolute bottom-4 left-4 flex gap-2">
            <div className="bg-white/95 dark:bg-slate-900/90 text-brand-650 dark:text-brand-400 border border-slate-150/40 dark:border-slate-800 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md text-xs font-black uppercase flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-brand-500" /> Smart Score: {Number(smartScore || 0).toFixed(1)}
            </div>
            <div className="bg-white/95 dark:bg-slate-900/90 text-emerald-650 dark:text-emerald-400 border border-slate-150/40 dark:border-slate-800 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md text-xs font-black uppercase flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500" /> VFM Score: {Number(valueScore || 0).toFixed(1)}
            </div>
         </div>
      </div>
      
      {/* Image Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {displayImages.map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={cn(
                "relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 bg-slate-50 dark:bg-slate-850 transition-all",
                activeImageIndex === idx 
                  ? "border-brand-500 ring-4 ring-brand-500/10" 
                  : "border-transparent hover:border-slate-350 dark:hover:border-slate-700"
              )}
            >
              <Image 
                src={img} 
                alt={`${name} thumbnail ${idx + 1}`} 
                fill 
                className="object-contain p-2" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
