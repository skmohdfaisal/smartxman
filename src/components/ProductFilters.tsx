"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "recommended";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "recommended") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <select 
      value={currentSort}
      onChange={handleSortChange}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
    >
      <option value="recommended">Recommended</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="rating_desc">Highest Rated</option>
    </select>
  );
}
