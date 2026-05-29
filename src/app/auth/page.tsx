import AuthPageClient from "@/components/AuthPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Sign In / Sign Up | smartXman",
  description: "Sign in or sign up for a smartXman account to save products and setups.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthPage() {
  return <AuthPageClient />;
}
