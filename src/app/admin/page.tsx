import { Users, Package, FileText, MousePointerClick } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-600 dark:text-slate-400">Welcome back, Admin. Here is what's happening on your platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Users", value: "1,248", icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
          { label: "Total Products", value: "342", icon: Package, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
          { label: "Blog Posts", value: "28", icon: FileText, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
          { label: "Affiliate Clicks", value: "12.4K", icon: MousePointerClick, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/admin/products/new" className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-brand-500 dark:hover:border-brand-500 transition-colors text-center font-medium">
            + Add New Product
          </a>
          <button className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-brand-500 dark:hover:border-brand-500 transition-colors text-center font-medium">
            + Create Blog Post
          </button>
          <button className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-brand-500 dark:hover:border-brand-500 transition-colors text-center font-medium">
            + Manage Categories
          </button>
        </div>
      </div>
    </div>
  );
}
