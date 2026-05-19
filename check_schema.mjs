import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error('Error fetching:', error);
    return;
  }
  if (data && data.length > 0) {
    console.log('Columns in products table:');
    console.log(Object.keys(data[0]));
  } else {
    console.log('No products found, cannot infer schema this way.');
  }
}

checkSchema();
