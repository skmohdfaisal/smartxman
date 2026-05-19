export interface ProductProps {
  id: string;
  name: string;
  slug: string;
  image: string;
  images: string[];
  price: string;
  rating: number;
  reviews: number;
  category: string;
  expertNote: string;
  asin?: string;
  brand?: string;
  affiliateLink?: string;
  approvalStatus?: string;
  bestFor?: string;
  whoShouldBuy?: string;
  whoShouldAvoid?: string;
  pros?: string[];
  cons?: string[];
  alternatives?: any[];
  smartScore?: number;
  valueScore?: number;
  setupScore?: number;
  buyingVerdict?: string;
  testedByUs?: boolean;
  priceIsFresh?: boolean;
}

export const FEATURED_PRODUCTS: ProductProps[] = [
  {
    id: "1",
    name: "Logitech MX Master 3S Wireless Mouse",
    slug: "logitech-mx-master-3s",
    image: "/products/logitech-mx-master-3s.png",
    images: [
      "/products/logitech-mx-master-3s.png",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?q=80&w=2070&auto=format&fit=crop"
    ],
    price: "₹8,995",
    rating: 4.9,
    reviews: 1245,
    category: "Productivity",
    expertNote: "The undisputed king of productivity mice. The quiet clicks and MagSpeed wheel make it worth every penny.",
  },
  {
    id: "2",
    name: "Keychron K2 Wireless Mechanical Keyboard",
    slug: "keychron-k2-v2",
    image: "/products/keychron-k2.png",
    images: [
      "/products/keychron-k2.png",
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2070&auto=format&fit=crop"
    ],
    price: "₹7,499",
    rating: 4.7,
    reviews: 856,
    category: "Setup",
    expertNote: "Excellent entry point into mechanical keyboards with a compact 75% layout perfect for minimal setups.",
  },
  {
    id: "3",
    name: "Sony WH-1000XM5 Noise Cancelling Headphones",
    slug: "sony-wh-1000xm5",
    image: "/products/sony-wh-1000xm5.png",
    images: [
      "/products/sony-wh-1000xm5.png",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583333222044-589c60891987?q=80&w=2070&auto=format&fit=crop"
    ],
    price: "₹29,990",
    rating: 4.8,
    reviews: 2130,
    category: "Tech",
    expertNote: "Industry-leading ANC. Lighter and more comfortable than the XM4s, though the case is a bit bulkier.",
  },
  {
    id: "4",
    name: "BenQ ScreenBar Halo Monitor Light",
    slug: "benq-screenbar-halo",
    image: "/products/benq-screenbar-halo.png",
    images: [
      "/products/benq-screenbar-halo.png",
      "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547119957-637f8679db1e?q=80&w=1964&auto=format&fit=crop"
    ],
    price: "₹15,990",
    rating: 4.9,
    reviews: 420,
    category: "Setup",
    expertNote: "Eliminates screen glare and reduces eye strain. The wireless controller is a fantastic addition.",
  }
];
