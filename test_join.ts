import { supabase } from './src/lib/supabase';

async function check() {
  const { data, error } = await supabase
      .from("wishlist")
      .select("product_id, products!inner(id)")
      .eq("user_id", "some_id")
      .limit(1);
  console.log("TEST JOIN:", data, error);
}

check();
