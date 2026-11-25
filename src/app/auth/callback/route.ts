import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.smartxman.com').replace(/\/$/, "");
  const targetOrigin = isLocalEnv ? origin : (forwardedHost ? `https://${forwardedHost}` : (origin.includes('localhost') ? siteUrl : origin));

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Prioritize explicit destinations like /reset-password
      if (next && next !== '/') {
        return NextResponse.redirect(`${targetOrigin}${next}`);
      }
      if (data?.user?.email?.toLowerCase() === "skmohdfaisal07@gmail.com") {
        const adminUrl = process.env.NODE_ENV === "development"
          ? "http://localhost:3001"
          : (process.env.NEXT_PUBLIC_ADMIN_URL || "https://smartxman-admin.vercel.app");
        return NextResponse.redirect(`${adminUrl}/admin`);
      }
      return NextResponse.redirect(`${targetOrigin}${next}`);
    }
  }

  const authError = searchParams.get('error_description') || searchParams.get('error') || 'Could not authenticate with provider';
  return NextResponse.redirect(`${targetOrigin}/auth?error=${encodeURIComponent(authError)}`);
}
