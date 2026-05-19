import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(url, key);

async function test() {
    const { data: tables, error } = await supabase.rpc('get_tables'); // This might not work if rpc not defined
    // Let's just try to select from products
    const { data: p, error: pe } = await supabase.from('products').select('id').limit(1);
    console.log('Products table exists:', !!p, pe?.message);
    
    const { data: w, error: we } = await supabase.from('wishlist').select('id').limit(1);
    console.log('Wishlist table exists:', !!w, we?.message);
}

test();
