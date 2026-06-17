"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

  const productDeals = displayDeals.map(d => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    brand: "",
    image: d.image,
    images: [d.image],
    current_price: Number(d.price.replace(/[^0-9]/g, "")) || 0,
    old_price: Number(d.oldPrice.replace(/[^0-9]/g, "")) || 0,
    price_is_fresh: true,
    last_price_checked_at: "2026-06-03T00:00:00.000Z",
    rating: 4.8,
    category: "Special Offer",
    bestFor: `Strong value pick — ${d.discount} off current price`,
    affiliateLink: d.affiliateUrl || "#",
    isBestDeal: true,
    smartScore: 9.0,
    valueScore: 9.5
  }));

  return (
    <section id="deals" className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60 scroll-mt-20">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
              Deals Worth Checking
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Current picks that offer strong value for the price.
            </p>
          </div>
          <Link
            href="/products?type=deals"
            className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold text-sm hover:opacity-80 transition-opacity shrink-0 group"
          >
            See all deals <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Deal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
