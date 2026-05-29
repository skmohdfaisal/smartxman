const supabaseUrl = "https://caipzlrmccdnpzwjkmzj.supabase.co";
const supabaseAnonKey = "sb_publishable_pE8dqYF8PWnkw7e9vNAdbA_iXN1p2n8";

async function check() {
  const url = `${supabaseUrl}/rest/v1/products?limit=1`;
  const res = await fetch(url, {
    headers: {
      "apikey": supabaseAnonKey,
      "Authorization": `Bearer ${supabaseAnonKey}`
    }
  });
  if (!res.ok) {
    console.error("HTTP Error:", res.status, await res.text());
    return;
  }
  const data = await res.json();
  if (data && data.length > 0) {
    console.log("COLUMNS:", Object.keys(data[0]));
  } else {
    console.log("No data returned or table empty.");
  }
}

check();
