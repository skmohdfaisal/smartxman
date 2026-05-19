import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const DEMO_BLOGS = [
  {
    title: "The Ultimate WFH Desk Setup Guide 2026",
    slug: "ultimate-wfh-desk-setup-guide-2026",
    excerpt: "Everything you need to know to build a clean, productive, and ergonomic home office setup.",
    category: "Guides",
    read_time: "8 min read",
    cover_image: "/blog/wfh-guide.png",
    status: "published",
    content: `
# The Ultimate WFH Desk Setup Guide 2026

Working from home has evolved from a temporary arrangement into a permanent lifestyle. A well-designed workspace is no longer just about a desk and a chair—it is about creating an environment that fosters focus, supports physical health, and looks aesthetically pleasing.

In this guide, we break down the core components of the ultimate remote work setup for 2026.

## 1. The Ergonomic Foundation: Desk & Chair
Your desk and chair are the bedrock of your setup. Sitting for prolonged periods is detrimental to spinal health, which is why a **height-adjustable standing desk** is essential. Pair it with a high-back ergonomic chair that provides robust lumbar support.

## 2. Lighting is Key
Poor lighting leads to eye strain and fatigue. We recommend a smart monitor light bar like the **BenQ ScreenBar Halo** to illuminate your desk surface without causing glare on the screen.

## 3. High-Performance Input Tools
Upgrade your keyboard and mouse. A mechanical keyboard like the **Keychron K2** paired with a productivity-oriented mouse like the **Logitech MX Master 3S** will make every click and keystroke a joy.
    `,
    reference_links: [
      { label: "Logitech MX Master 3S", url: "/product/logitech-mx-master-3s" },
      { label: "Keychron K2 Keyboard", url: "/product/keychron-k2-v2" },
      { label: "BenQ ScreenBar Halo", url: "/product/benq-screenbar-halo" }
    ]
  },
  {
    title: "Mechanical Keyboards: Switches Explained",
    slug: "mechanical-keyboards-switches-explained",
    excerpt: "Linear, tactile, or clicky? A deep dive into choosing the right switches for typing and gaming.",
    category: "Tech",
    read_time: "5 min read",
    cover_image: "/blog/switches-guide.png",
    status: "published",
    content: `
# Mechanical Keyboards: Switches Explained

If you spend hours typing or gaming, upgrading to a mechanical keyboard is one of the best investments you can make. But with dozens of switch options on the market, it can be intimidating to choose.

Let's break down the three primary categories of mechanical switches: Linear, Tactile, and Clicky.

## 1. Linear Switches (Quiet & Smooth)
Linear switches are preferred by gamers. They offer a smooth, consistent keystroke from top to bottom with no tactile bump. Red switches (like Cherry MX Reds or Gateron Reds) are the classic examples.

## 2. Tactile Switches (Responsive & Quiet)
Tactile switches are the favorite among programmers and writers. They feature a noticeable bump halfway through the press, letting you know the key has registered without needing to bottom out. Brown switches are the standard here.

## 3. Clicky Switches (Loud & Satisfying)
Clicky switches offer both a tactile bump and a distinct click sound. They provide maximum feedback, but can be very distracting in an office environment. Blue switches are the classic clicky choice.
    `,
    reference_links: [
      { label: "Keychron K2 Keyboard", url: "/product/keychron-k2-v2" }
    ]
  },
  {
    title: "Top 5 Noise Cancelling Headphones for Travel",
    slug: "top-5-noise-cancelling-headphones-for-travel",
    excerpt: "We tested the best ANC headphones on 15-hour flights to find out which ones actually save your sanity.",
    category: "Reviews",
    read_time: "10 min read",
    cover_image: "/categories/tech.png",
    status: "published",
    content: `
# Top 5 Noise Cancelling Headphones for Travel

Whether you are working in a noisy coffee shop or flying across the globe, a pair of Active Noise Cancelling (ANC) headphones is a sanity saver. 

We spent weeks testing the latest premium options to identify the top travel companions.

## 1. Sony WH-1000XM5 (The ANC King)
The Sony XM5 headphones offer industry-leading active noise cancellation. They are lightweight, exceptionally comfortable for long flights, and deliver a rich, customizable sound profile.

## 2. Bose QuietComfort Ultra
Bose remains the gold standard for pure comfort. The QC Ultra fold down easily and offer incredibly plush earcups that you can wear for 10+ hours without fatigue.
    `,
    reference_links: [
      { label: "Sony WH-1000XM5", url: "/product/sony-wh-1000xm5" }
    ]
  },
  {
    title: "Cable Management 101: Hide Those Wires",
    slug: "cable-management-101-hide-those-wires",
    excerpt: "Stop living with a rat's nest under your desk. Follow these 5 steps to a perfectly clean setup.",
    category: "Guides",
    read_time: "6 min read",
    cover_image: "/categories/setup.png",
    status: "published",
    content: `
# Cable Management 101: Hide Those Wires

A clean desk setup is key to clear focus. Nothing ruins a beautiful workspace faster than a chaotic jumble of power cords, display cables, and charging wires hanging below your desk.

Follow our step-by-step guide to achieving wire-free bliss.

## Step 1: Mount a Power Strip Under Your Desk
Instead of running five different cords to the wall outlet, mount a single high-quality power strip directly underneath your desk surface using double-sided mounting tape or screws.

## Step 2: Use Cable Trays
Under-desk cable management trays are a lifesaver. They hold power adapters, bulky cables, and excess wire length completely out of sight.

## Step 3: Bundle and Tie
Use Velcro straps or zip ties to bundle cables running along your monitor arms or desk legs together.
    `,
    reference_links: [
      { label: "BenQ ScreenBar Halo", url: "/product/benq-screenbar-halo" }
    ]
  }
];

async function seed() {
  try {
    console.log("Seeding blogs into Supabase database...");
    
    for (const blog of DEMO_BLOGS) {
      console.log(`Upserting blog: ${blog.title}...`);
      
      const { data, error } = await supabase
        .from('blogs')
        .upsert(
          [blog],
          { onConflict: 'slug' }
        )
        .select();
        
      if (error) {
        console.error(`Error inserting ${blog.title}:`, error);
      } else {
        console.log(`Successfully upserted: ${blog.title}`, data?.[0]?.id);
      }
    }
    
    console.log("All demo blogs upserted successfully!");
  } catch (err) {
    console.error("Uncaught seed error:", err);
  }
}

seed();
