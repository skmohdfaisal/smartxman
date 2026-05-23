import { redirect } from "next/navigation";

export default function AdminRedirectPage() {
  const adminUrl = process.env.NODE_ENV === "development" 
    ? "http://localhost:3001" 
    : (process.env.NEXT_PUBLIC_ADMIN_URL || "https://smartxman-admin.vercel.app");
  redirect(adminUrl);
}
