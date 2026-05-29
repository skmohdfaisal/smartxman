const supabaseUrl = "https://caipzlrmccdnpzwjkmzj.supabase.co";
const supabaseAnonKey = "sb_publishable_pE8dqYF8PWnkw7e9vNAdbA_iXN1p2n8";

async function check() {
  const url = `${supabaseUrl}/rest/v1/price_history?limit=1`;
  const res = await fetch(url, {
    headers: {
      "apikey": supabaseAnonKey,
      "Authorization": `Bearer ${supabaseAnonKey}`
    }
  });
  console.log("price_history response status:", res.status);
  
  const url2 = `${supabaseUrl}/rest/v1/product_categories?limit=1`;
  const res2 = await fetch(url2, {
    headers: {
      "apikey": supabaseAnonKey,
      "Authorization": `Bearer ${supabaseAnonKey}`
    }
  });
  console.log("product_categories response status:", res2.status);
}

check();
