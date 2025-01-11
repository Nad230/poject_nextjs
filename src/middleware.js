import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Create the Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
        },
      },
    }
  );

  // Get user session info from Supabase (for regular login)
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error.message);
  }

  // Get access and refresh tokens from cookies (for Google login)
  const access_token = request.cookies.get('access_token');
  const refresh_token = request.cookies.get('refresh_token');

  // Determine if the user is authenticated (either via Supabase user or tokens)
  const isLoggedIn = user || (access_token && refresh_token);

  // Check for special pages: login, callback, signup, or error
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');
  const isForgotPage = request.nextUrl.pathname.startsWith('/forget-password');
  const isResetPage = request.nextUrl.pathname.startsWith('/reset-password');

  const isCallbackPage = request.nextUrl.pathname.startsWith('/auth/callback');
  const isSignupPage = request.nextUrl.pathname === '/signup';
  const isErrorPage = request.nextUrl.pathname === '/error';

  // Allow the request to proceed if the user is logged in or if it's a special page
  if (isLoggedIn || isLoginPage || isCallbackPage || isSignupPage || isErrorPage || isForgotPage || isResetPage) {
    return NextResponse.next(); // Allow the request to proceed
  }

  // If the user is not logged in and trying to access a protected page, redirect to login
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

// Configuration for middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};