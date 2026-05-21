"use server";

import { supabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const JSON_DB_PATH = path.resolve(process.cwd(), "src/lib/blogs_db.json");

// Helper to read local JSON fallback
function readLocalBlogs(): any[] {
  try {
    if (fs.existsSync(JSON_DB_PATH)) {
      const data = fs.readFileSync(JSON_DB_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read local blogs fallback:", err);
  }
  return [];
}

// Helper to wrap Supabase calls in a timeout
async function withTimeout<T>(promise: any, timeoutMs: number = 3000): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Database operation timed out"));
    }, timeoutMs);
  });
  
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

export async function getBlogs() {
  try {
    const result = await withTimeout<any>(
      supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false })
    );
    const { data, error } = result;

    if (error) {
      if (error.code === "PGRST205" || error.message.includes("relation \"public.blogs\" does not exist")) {
        console.warn("Supabase blogs table missing, falling back to local database.");
        return { success: true, data: readLocalBlogs(), source: "local" };
      }
      throw error;
    }
    return { success: true, data: data || [], source: "supabase" };
  } catch (err: any) {
    console.error("Supabase fetch failed, falling back to local:", err.message);
    return { success: true, data: readLocalBlogs(), source: "local" };
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const result = await withTimeout<any>(
      supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single()
    );
    const { data, error } = result;

    if (error) {
      if (error.code === "PGRST205" || error.message.includes("relation \"public.blogs\" does not exist")) {
        const local = readLocalBlogs();
        const found = local.find((b) => b.slug === slug);
        return { success: !!found, data: found || null, source: "local" };
      }
      throw error;
    }
    return { success: true, data, source: "supabase" };
  } catch (err: any) {
    console.error("Supabase single fetch failed, trying local:", err.message);
    const local = readLocalBlogs();
    const found = local.find((b) => b.slug === slug);
    return { success: !!found, data: found || null, source: "local" };
  }
}
