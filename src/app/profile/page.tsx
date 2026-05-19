"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  LogOut, 
  Heart, 
  Settings, 
  Shield, 
  Loader2, 
  Calendar, 
  MapPin, 
  AlignLeft, 
  Info, 
  Check, 
  ArrowLeft, 
  Phone 
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    gender: "",
    dob: "",
    bio: "",
    location: ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        mobile: profile.mobile || "",
        gender: profile.gender || "",
        dob: profile.dob || "",
        bio: profile.bio || "",
        location: profile.location || ""
      });
    }
  }, [profile]);

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          mobile: formData.mobile,
          gender: formData.gender || null,
          dob: formData.dob || null, // Date must be valid or null in PostgreSQL
          bio: formData.bio,
          location: formData.location
        })
        .eq("id", user.id);

      if (error) throw error;
      
      setMessage({ type: "success", text: "Your profile has been updated successfully!" });
      
      // Update local profile state
      setProfile((prev: any) => ({
        ...prev,
        ...formData
      }));
      
      // Switch back to overview tab after 1.5s
      setTimeout(() => {
        setActiveTab("overview");
        setMessage({ type: "", text: "" });
      }, 1500);
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage({ 
        type: "error", 
        text: "Failed to save details. Did you run the SQL migration script in your Supabase dashboard?" 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  // Google Profile Fallbacks
  const googleAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const avatarUrl = profile?.avatar || googleAvatar;
  const displayName = profile?.name || user?.user_metadata?.full_name || "Member";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">My Account</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your profile and personal preferences.</p>
        </div>
        {activeTab === "settings" && (
          <button 
            onClick={() => setActiveTab("overview")}
            className="self-start md:self-auto px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors font-medium flex items-center gap-2 text-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm text-center relative overflow-hidden">
            <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white dark:border-slate-800 shadow-lg relative overflow-hidden group">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-brand-600" />
              )}
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate">{displayName}</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 truncate">{user?.email}</p>
            
            {/* Show badge if logged in with Google */}
            {googleAvatar && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold mb-6">
                <Check className="w-3.5 h-3.5" /> Google Profile Synced
              </div>
            )}
            
            <button 
              onClick={handleSignOut}
              className="w-full py-3 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-semibold border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          <div className="bg-slate-900 dark:bg-brand-600 rounded-3xl p-6 text-white overflow-hidden relative group">
             <div className="relative z-10">
                <h3 className="font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-slate-300 dark:text-brand-100 text-sm mb-4">Get early access to deals and exclusive product reviews.</p>
                <button className="px-4 py-2 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors shadow-md">Learn More</button>
             </div>
             <Shield className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === "overview" ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/wishlist" className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-lg">My Wishlist</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View and manage your saved products.</p>
                  </Link>

                  <button 
                    onClick={() => setActiveTab("settings")}
                    className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group text-left"
                  >
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                      <Settings className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-lg">Settings</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal information.</p>
                  </button>
                </div>

                {/* Personal Profile Details Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Personal Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Gender</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">
                        {profile?.gender || "Not Specified"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date of Birth</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {profile?.dob ? new Date(profile.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "Not Specified"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Location</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" /> {profile?.location || "Not Specified"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone Number</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-slate-400" /> {profile?.mobile || "Not Specified"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Bio</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl italic border border-slate-100/50 dark:border-slate-800/50">
                      "{profile?.bio || "No bio added yet. Tell us a bit about yourself in settings!"}"
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                    <button className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider">Clear all</button>
                  </div>
                  <div className="p-8 text-center py-16">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                       <Shield className="w-8 h-8" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No recent activity to show.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Edit Settings</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Customize your profile page information.</p>
                  
                  {message.text && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300 ${
                      message.type === "success" 
                        ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-950" 
                        : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-950"
                    }`}>
                      <Info className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-semibold">{message.text}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Display Name */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                          placeholder="Your Display Name"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                          placeholder="Mobile Number"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          type="date"
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-700 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gender Selector */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Gender</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["male", "female", "other", "prefer not to say"].map((genderVal) => (
                        <button
                          key={genderVal}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: genderVal })}
                          className={`py-3 px-4 rounded-2xl border text-sm font-semibold capitalize text-center transition-all ${
                            formData.gender === genderVal
                              ? "bg-brand-500 text-white border-brand-500 shadow-md scale-105"
                              : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {genderVal}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Personal Bio</label>
                    <div className="relative">
                      <AlignLeft className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <textarea
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                        placeholder="Write a brief intro about yourself..."
                      ></textarea>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-500/20"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Saving Changes...
                        </>
                      ) : (
                        "Save Profile Settings"
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
