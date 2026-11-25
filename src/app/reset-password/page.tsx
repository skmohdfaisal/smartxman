import ResetPasswordClient from "@/components/ResetPasswordClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set New Password | smartXman",
  description: "Securely reset and update your smartXman account password.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
