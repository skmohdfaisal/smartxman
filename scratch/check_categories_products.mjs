import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local
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

const TARGET_SLUGS = ['student-essentials', 'gaming-setup', 'work-from-home', 'creator-setup'];

async function diagnose() {
  console.log('\n========================================');
  console.log('   smartXman Category Diagnostic Tool');
  console.log('========================================\n');

  // 1. Check all categories
  const { data: allCats, error: catError } = await supabase.from('categories').select('id, name, slug, is_active');
  if (catError) {
    console.error('❌ Error fetching categories:', catError.message);
    return;
  }
  console.log(`📁 Total categories in DB: ${allCats?.length ?? 0}`);
  console.log('All categories:');
  (allCats || []).forEach(c => console.log(`  - [${c.slug}] ${c.name} (active: ${c.is_active})`));

  console.log('\n--- Checking 4 homepage categories ---');
  for (const slug of TARGET_SLUGS) {
    const cat = (allCats || []).find(c => c.slug === slug);
    if (!cat) {
      console.log(`\n❌ MISSING: "${slug}" — NOT FOUND in DB!`);
      console.log(`   👉 FIX: This category needs to be created in DB.`);
      continue;
    }
    console.log(`\n✅ Found category: "${slug}" → ID: ${cat.id}`);

    // Check published products by primary_category_id
    const { data: primaryProds, error: pe } = await supabase
      .from('products')
      .select('id, name, status')
      .eq('primary_category_id', cat.id);
    
    // Check via product_categories join
    const { data: linkedProds, error: le } = await supabase
      .from('product_categories')
      .select('product_id, products(id, name, status)')
      .eq('category_id', cat.id);

    const primaryPublished = (primaryProds || []).filter(p => p.status === 'published');
    const linkedPublished = (linkedProds || [])
      .map(lp => lp.products)
      .filter(p => p && p.status === 'published');

    console.log(`   Primary category products: ${primaryProds?.length ?? 0} total, ${primaryPublished.length} published`);
    console.log(`   Linked (join table) products: ${linkedProds?.length ?? 0} total, ${linkedPublished.length} published`);

    if (primaryPublished.length === 0 && linkedPublished.length === 0) {
      const totalPrimary = primaryProds?.length ?? 0;
      const totalLinked = linkedProds?.length ?? 0;
      if (totalPrimary > 0 || totalLinked > 0) {
        console.log(`   ⚠️  Products exist but NONE are "published" — they may be drafts!`);
        (primaryProds || []).forEach(p => console.log(`      - "${p.name}" → status: ${p.status}`));
      } else {
        console.log(`   ⚠️  NO products assigned to this category at all.`);
      }
    } else {
      console.log(`   Published products in this category:`);
      [...primaryPublished, ...linkedPublished].forEach(p => console.log(`      ✓ ${p.name}`));
    }
  }

  // 3. Check total published products
  const { count, error: countErr } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');
  
  console.log(`\n📦 Total published products in DB: ${count ?? 0}`);
  if ((count ?? 0) === 0) {
    console.log('   ⚠️  No published products at all! Go to admin and set products to "published" status.');
  }

  console.log('\n========================================\n');
}

diagnose();
