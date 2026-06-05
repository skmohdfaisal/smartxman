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
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function countBlogs() {
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('id, title, slug, status')
    .eq('status', 'published');
  if (error) {
    console.error("Error fetching blogs:", error);
  } else {
    console.log(`Total published blogs: ${blogs?.length || 0}`);
    console.log("Blogs list:", blogs?.map(b => b.slug));
  }
}

countBlogs();
