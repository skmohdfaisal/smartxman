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

async function checkSchema() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error('Error fetching from products:', error);
  } else {
    console.log('Columns in products table:');
    if (data && data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      console.log('Success, but no products found to inspect keys.');
    }
  }

  // Also let's check blogs
  const { data: blogData, error: blogError } = await supabase.from('blogs').select('*').limit(1);
  if (blogError) {
    console.error('Error fetching from blogs:', blogError);
  } else {
    console.log('Columns in blogs table:');
    if (blogData && blogData.length > 0) {
      console.log(Object.keys(blogData[0]));
    } else {
      console.log('Success, but no blogs found.');
    }
  }
  
  // Also check seo_settings
  const { data: seoData, error: seoError } = await supabase.from('seo_settings').select('*').limit(1);
  if (seoError) {
    console.error('Error fetching from seo_settings:', seoError);
  } else {
    console.log('Columns in seo_settings table:');
    if (seoData && seoData.length > 0) {
      console.log(Object.keys(seoData[0]));
    } else {
      console.log('Success, but no seo_settings found.');
    }
  }
}

checkSchema();
