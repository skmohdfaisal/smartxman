import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(url, key);

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error('Error fetching users:', error);
  } else if (data && data.length > 0) {
    console.log('Columns in users table:', Object.keys(data[0]));
    console.log('Sample data:', data[0]);
  } else {
    console.log('Users table is empty. Attempting to get columns by inserting a dummy or checking metadata.');
    // Let's try to update a non-existent row to see if it complains about missing columns
    const { error: testErr } = await supabase.from('users').update({ gender: 'male', dob: '1990-01-01', bio: 'test', location: 'test' }).eq('id', '00000000-0000-0000-0000-000000000000');
    if (testErr) {
      console.log('Test update error (expected if columns do not exist):', testErr.message);
    } else {
      console.log('Update statement succeeded with custom columns, meaning they might exist!');
    }
  }
}

checkUsers();
