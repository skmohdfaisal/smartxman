import { NextResponse } from 'next/server';

// Instant Indexing Webhook
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.INDEXING_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const slug = body?.record?.slug || body?.slug;
    
    if (!slug) {
      return NextResponse.json({ error: 'No slug provided' }, { status: 400 });
    }

    const sitemapUrl = 'https://smartxman.com/sitemap.xml';
    
    // Ping Google
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    await fetch(pingUrl, { method: 'GET' });

    // In a real advanced implementation, you'd use Google Indexing API
    // https://developers.google.com/search/apis/indexing-api/v3/quickstart

    return NextResponse.json({ success: true, message: `Pinged search engines for ${slug}` });
  } catch (error) {
    console.error('Error in SEO ping route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
