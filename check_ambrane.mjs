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

async function checkProduct() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', 'ambrane-unbreakable-60w-3a-fast-charging-1-5m-braided-type-c-cable')
    .single();
  if (error) {
    console.error('Error fetching product:', error);
  } else {
    console.log('Product data:');
    console.log(data);
  }
}

checkProduct();
