"use client";

import { User, Shield, Mail, Key } from "lucide-react";

export default function AdminUsers() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Manage Users</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">View and manage accounts registered on your platform.</p>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">User Management coming soon</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            We are working on a complete user management system to help you handle permissions and account data.
          </p>
        </div>
      </div>
    </div>
  );
}

import { Users } from "lucide-react";
