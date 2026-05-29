import WishlistPageClient from "@/components/WishlistPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | smartXman",
  description: "View and manage your saved tech, setups, and lifestyle products.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
