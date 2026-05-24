import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadProducts() {
  console.log('Logging in...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'skmohdfaisal07@gmail.com',
    password: '123456',
  });

  if (authError) {
    console.error('Auth error:', authError.message);
    return;
  }

  console.log('Logged in as:', authData.user.email);

  const products = [
    {
      name: 'ZEBRONICS Glassy 10 Wireless Mouse',
      slug: 'zebronics-glassy-10-wireless-mouse',
      description: 'Dual Mode (2.4GHz + BT) wireless mouse featuring up to 1600 DPI, silent operation, and Type-C charging. Ergonomic design suitable for Mac and PC.',
      expert_note: 'A visually striking, transparent budget mouse that offers versatile dual-mode connectivity and the convenience of Type-C recharging.',
      price_range: 'Under ₹1000',
      affiliate_link: 'https://www.amazon.in/ZEBRONICS-Wireless-Operation-Comfortable-Ergonomic/dp/B0F88GT83S/',
      brand: 'ZEBRONICS',
      marketplace: 'Amazon',
      seo_title: 'ZEBRONICS Glassy 10 Wireless Mouse - Dual Mode & Type-C',
      seo_description: 'Buy ZEBRONICS Glassy 10 Wireless Mouse with dual mode, silent operation, and Type-C charging.',
      pros: ["Dual connectivity (BT+2.4GHz)", "Rechargeable via Type-C", "Silent clicks", "Unique transparent aesthetic"],
      cons: ["Build quality may feel plasticky to some", "Battery capacity is modest compared to AA alternatives"],
      buying_verdict: 'Great value for users wanting a stylish, dual-mode rechargeable mouse on a tight budget.',
      smart_score: 8.0,
      value_score: 8.5,
      approval_status: 'published'
    },
    {
      name: 'Portronics Toad 23 Wireless Optical Mouse',
      slug: 'portronics-toad-23-wireless-mouse',
      description: 'A straightforward 2.4GHz wireless optical mouse with USB Nano Dongle, adjustable DPI, and ergonomic click wheel.',
      expert_note: 'A no-frills, reliable basic wireless mouse perfect for everyday office tasks and budget-conscious buyers.',
      price_range: 'Under ₹500',
      affiliate_link: 'https://www.amazon.in/gp/aw/d/B0B296NTFV/',
      brand: 'Portronics',
      marketplace: 'Amazon',
      seo_title: 'Portronics Toad 23 Wireless Optical Mouse',
      seo_description: 'Shop Portronics Toad 23 Wireless Mouse. Affordable, reliable 2.4GHz optical mouse.',
      pros: ["Extremely affordable", "Plug and play simplicity", "Adjustable DPI"],
      cons: ["Basic design", "Lacks Bluetooth connectivity", "Not ideal for gaming"],
      buying_verdict: 'A solid, ultra-budget pick for standard daily usage.',
      smart_score: 7.0,
      value_score: 9.0,
      approval_status: 'published'
    },
    {
      name: 'Logitech M221 Wireless Mouse',
      slug: 'logitech-m221-silent-wireless-mouse',
      description: 'Silent buttons, 2.4 GHz wireless connection with USB Mini Receiver, 1000 DPI Optical Tracking, and up to 18-Month Battery Life.',
      expert_note: 'The gold standard for quiet workspaces. It delivers Logitech\'s renowned reliability with a truly silent click mechanism.',
      price_range: '₹500 - ₹1000',
      affiliate_link: 'https://www.amazon.in/Logitech-Silent-Wireless-Mouse-Charcoal/dp/B01M72LILF/',
      brand: 'Logitech',
      marketplace: 'Amazon',
      seo_title: 'Logitech M221 Silent Wireless Mouse - Charcoal Grey',
      seo_description: 'Get the Logitech M221 Silent Wireless Mouse for a quiet, reliable experience with 18-month battery life.',
      pros: ["Over 90% noise reduction", "18-month battery life", "Reliable Logitech build", "Compact and portable"],
      cons: ["A bit small for larger hands", "No Bluetooth option"],
      buying_verdict: 'The best choice for anyone working in a quiet office, library, or shared space.',
      smart_score: 9.0,
      value_score: 8.5,
      approval_status: 'published'
    },
    {
      name: 'Logitech M186 Wireless Mouse',
      slug: 'logitech-m186-wireless-mouse',
      description: '2.4GHz with USB Mini Receiver, 1000 DPI Optical Tracking, Ambidextrous design, and up to 3 Years Battery Life.',
      expert_note: 'An absolute workhorse. Known for its insane battery life and durability, making it one of the most practical mice available.',
      price_range: '₹500 - ₹1000',
      affiliate_link: 'https://www.amazon.in/Logitech-Wireless-Receiver-Ambidextrous-Compatible/dp/B0D18192T2/',
      brand: 'Logitech',
      marketplace: 'Amazon',
      seo_title: 'Logitech M186 Wireless Mouse - 3 Years Battery Life',
      seo_description: 'Logitech M186 offers reliable 2.4GHz wireless tracking and an incredible 3-year battery life.',
      pros: ["Incredible 3-year battery life", "Very durable build", "Ambidextrous design", "Great value"],
      cons: ["Basic aesthetics", "Clicks are not silent"],
      buying_verdict: 'Perfect for users who want to plug in a mouse and forget about changing batteries for years.',
      smart_score: 8.5,
      value_score: 9.0,
      approval_status: 'published'
    }
  ];

  for (const product of products) {
    const { data, error } = await supabase.from('products').insert([product]).select();
    if (error) {
      console.error(`Error inserting ${product.name}:`, error.message);
    } else {
      console.log(`Successfully inserted ${product.name}`);
    }
  }
}

uploadProducts();
