"use server";

import { supabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const JSON_PATH = path.resolve(process.cwd(), "src/lib/homepage_db.json");

const defaultSettings = {
  hero_badge: "500+ Curated Picks for Smarter Buying",
  hero_title_accent: "what to buy?",
  hero_title_fallback: "Confused",
  hero_title_subtitle: "Find picks that make sense.",
  hero_description: "Smartxman helps students, creators, gamers, and everyday buyers discover useful tech, setup gear, and lifestyle products based on your budget and real value.",
  primary_cta_text: "Find My Smart Picks",
  primary_cta_link: "/products",
  why_smartxman_title: "Why Smartxman?",
  why_smartxman_desc: "We review tech and gear without bias, focusing entirely on value and your workflow."
};

export async function getHomepageSettings() {
  try {
    const { data, error } = await supabase
      .from("homepage_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();
    
    if (!error && data) {
      return { success: true, data, source: "supabase" };
    }
  } catch (e) {
    console.warn("Supabase homepage_settings read failed, using JSON fallback");
  }

  // Fallback to JSON
  try {
    if (fs.existsSync(JSON_PATH)) {
      const data = fs.readFileSync(JSON_PATH, "utf-8");
      return { success: true, data: JSON.parse(data), source: "local" };
    }
  } catch (err) {
    console.error("Failed to read local homepage settings:", err);
  }

  return { success: true, data: defaultSettings, source: "default" };
}
