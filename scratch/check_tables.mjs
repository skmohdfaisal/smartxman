import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manually parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const tables = [
  'users',
  'profiles',
  'products',
  'categories',
  'blogs',
  'deals',
  'comments',
  'newsletter_subscribers',
  'homepage_settings',
  'seo_settings',
  'product_store_links',
  'amazon_imports',
  'contact_submissions'
];

async function check() {
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`❌ Table "${table}": error: ${error.message} (${error.code})`);
      } else {
        console.log(`✅ Table "${table}": exists! Count checked: ${data.length}`);
      }
    } catch (e) {
      console.log(`❌ Table "${table}": exception: ${e.message}`);
    }
  }
}

check();
