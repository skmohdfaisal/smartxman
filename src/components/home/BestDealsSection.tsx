"use client";

import Link from "next/link";
import Image from "next/image";
import { Tag, ArrowRight, Percent } from "lucide-react";
import { motion } from "framer-motion";

export interface DealProps {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: string;
  oldPrice: string;
  discount: string;
  affiliateUrl: string;
}

interface BestDealsSectionProps {
  deals: DealProps[];
}

export function BestDealsSection({ deals }: BestDealsSectionProps) {
  const defaultDeals: DealProps[] = [
    {
      id: "deal-1",
      name: "Logitech MX Master 3S Wireless Mouse",
      slug: "logitech-mx-master-3s",
      image: "/products/logitech-mx-master-3s.png",
      price: "₹8,995",
      oldPrice: "₹10,995",
      discount: "18% OFF",
      affiliateUrl: "https://amazon.in",
    },
    {
      id: "deal-2",
      name: "Keychron K2 Wireless Mechanical Keyboard",
      slug: "keychron-k2-v2",
      image: "/products/keychron-k2.png",
      price: "₹7,499",
      oldPrice: "₹9,999",
      discount: "25% OFF",
      affiliateUrl: "https://amazon.in",
    },
    {
      id: "deal-3",
      name: "Sony WH-1000XM5 ANC Headphones",
      slug: "sony-wh-1000xm5",
      image: "/products/sony-wh-1000xm5.png",
      price: "₹29,990",
      oldPrice: "₹34,990",
      discount: "14% OFF",
      affiliateUrl: "https://amazon.in",
    }
  ];

  const displayDeals = deals && deals.length > 0 ? deals.slice(0, 3) : defaultDeals;

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 bg-red-50 dark:bg-red-950/30 rounded-lg text-red-600 dark:text-red-400">
                <Tag className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Limited Offers</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
              Best deals today
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Smart picks with the best current value.
            </p>
          </div>
          
          <Link
            href="/products?type=deals"
            className="mt-4 md:mt-0 px-6 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-100 dark:border-slate-800"
          >
            View All Deals
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Deals Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="group relative flex flex-col bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-900/60 hover:shadow-xl hover:border-slate-200 dark:hover:border-slate-800/80 transition-all duration-300"
            >
              {/* Sticking Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md shadow-red-500/10">
                  <Percent className="w-3 h-3" />
                  {deal.discount}
                </span>
              </div>

              {/* Deal Image Box */}
              <Link
                href={`/product/${deal.slug}`}
                className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white dark:bg-slate-950 p-6 flex items-center justify-center border border-slate-100/80 dark:border-slate-900 mb-6 group-hover:scale-[1.02] transition-all duration-500"
              >
                {deal.image ? (
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-6"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Deal Pic</span>
                  </div>
                )}
              </Link>

              {/* Title & Prices */}
              <div className="flex flex-col flex-1">
                <Link href={`/product/${deal.slug}`}>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 line-clamp-1 mb-2 group-hover:text-brand-600 transition-colors">
                    {deal.name}
                  </h3>
                </Link>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-xl font-black text-red-600 dark:text-red-400">
                    {deal.price}
                  </span>
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500 line-through">
                    {deal.oldPrice}
                  </span>
                </div>

                {/* CTA Button */}
                <Link
                  href={deal.affiliateUrl || `/product/${deal.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full py-4 bg-white hover:bg-brand-600 dark:bg-slate-950 dark:hover:bg-brand-600 text-slate-800 dark:text-slate-200 hover:text-white dark:hover:text-white text-xs font-black uppercase tracking-wider text-center rounded-2xl shadow-sm border border-slate-150 dark:border-slate-850 hover:border-brand-600 dark:hover:border-brand-600 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  Check Deal
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
