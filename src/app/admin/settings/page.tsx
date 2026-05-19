"use client";

import { Settings, Globe, Bell, Shield, Palette } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Platform Settings</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Configure your website's general settings and branding.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "General Settings", icon: Globe, desc: "Site name, description, and metadata." },
          { title: "Appearance", icon: Palette, desc: "Themes, colors, and branding assets." },
          { title: "Notifications", icon: Bell, desc: "Configure email and system alerts." },
          { title: "Security", icon: Shield, desc: "Password policies and admin access." }
        ].map((item, idx) => (
          <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
