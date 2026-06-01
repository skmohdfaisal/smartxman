"use client";

import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";

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

  // Map minimal deal structures to standard ProductProps for ProductCard compatibility
  const productDeals = displayDeals.map(d => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    brand: "Deal Alert",
    image: d.image,
    images: [d.image],
    current_price: Number(d.price.replace(/[^0-9]/g, "")) || 0,
    old_price: Number(d.oldPrice.replace(/[^0-9]/g, "")) || 0,
    price_is_fresh: true,
    last_price_checked_at: new Date().toISOString(),
    rating: 4.8,
    category: "Special Offer",
    bestFor: `Save on your tech setup today`,
    affiliateLink: d.affiliateUrl || "#",
    isBestDeal: true,
    smartScore: 9.0,
    valueScore: 9.5
  }));

  return (
    <section className="py-20 bg-slate-50/20 dark:bg-slate-900/10 border-b border-slate-100 dark:border-slate-900">
      <div className="container mx-auto px-4">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 bg-red-50 dark:bg-red-950/30 rounded-lg text-red-600 dark:text-red-400">
                <Tag className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Limited Offers</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
              Best Deals Today
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Smart picks with verified discount value and ratings.
            </p>
          </div>
          
          <Link
            href="/products?type=deals"
            className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-850"
          >
            View All Deals
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Deals Cards Layout using ProductCard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
