import ProfilePageClient from "@/components/ProfilePageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | smartXman",
  description: "Manage your profile and personal preferences.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
