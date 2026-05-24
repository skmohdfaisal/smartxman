"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProductSaveButtonProps {
  productId: string;
}

export default function ProductSaveButton({ productId }: ProductSaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkIfSaved();
  }, [productId]);

  const checkIfSaved = async () => {
    if (!productId) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (data) setIsSaved(true);
  };

  const toggleSave = async () => {
    if (!productId) return;
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/auth");
      return;
    }

    if (isSaved) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      
      if (!error) {
        setIsSaved(false);
        window.dispatchEvent(new Event('wishlist-updated'));
      }
    } else {
      const { error } = await supabase
        .from("wishlist")
        .insert([{ user_id: user.id, product_id: productId }]);
      
      if (!error) {
        setIsSaved(true);
        window.dispatchEvent(new Event('wishlist-updated'));
      }
    }
  };

  return (
    <button 
      onClick={toggleSave}
      className={cn(
        "px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border flex items-center justify-center gap-2",
        isSaved 
          ? "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-650 dark:text-red-400" 
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-slate-350"
      )}
    >
      <Heart className={cn("w-4 h-4 transition-colors", isSaved && "fill-red-500 text-red-500")} />
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}
