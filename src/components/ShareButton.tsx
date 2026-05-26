"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleShare}
      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-colors flex items-center gap-1.5 text-xs font-semibold"
    >
      <Share2 className="w-4 h-4" />
      <span>{copied ? "Copied!" : "Share"}</span>
    </button>
  );
}
