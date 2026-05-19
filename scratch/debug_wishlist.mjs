import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(url, key);

async function test() {
    const { data, error } = await supabase
      .from("wishlist")
      .select(`
        product_id,
        products (*)
      `);
    
    if (error) {
        console.error('Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('Data:', JSON.stringify(data, null, 2));
    }
}

test();
