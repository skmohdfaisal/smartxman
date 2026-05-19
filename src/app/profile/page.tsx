"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User, Mail, LogOut, Heart, Settings, Shield, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">My Account</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile and saved products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <div className="w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600 border-4 border-white dark:border-slate-800 shadow-lg">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{profile?.name || "Member"}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{user?.email}</p>
            
            <button 
              onClick={handleSignOut}
              className="w-full py-3 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          <div className="bg-slate-900 dark:bg-brand-600 rounded-3xl p-6 text-white overflow-hidden relative group">
             <div className="relative z-10">
                <h3 className="font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-slate-300 dark:text-brand-100 text-sm mb-4">Get early access to deals and exclusive product reviews.</p>
                <button className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">Learn More</button>
             </div>
             <Shield className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/wishlist" className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-lg">My Wishlist</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">View and manage your saved products.</p>
            </Link>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group opacity-60">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-lg">Settings</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal information.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <button className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider">Clear all</button>
            </div>
            <div className="p-8 text-center py-20">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                 <Shield className="w-8 h-8" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No recent activity to show.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
