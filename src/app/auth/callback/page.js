'use client'; // Mark the component as a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for client-side navigation
import { setCookie } from 'cookies-next';
import { createClient } from '@supabase/supabase-js'; // Ensure Supabase is imported

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const AuthCallbackPage = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      const query = window.location.search;
      const hash = window.location.hash;

      // Extract access_token and refresh_token from the URL
      const params = new URLSearchParams(query);
      const extractedAccessToken =
        params.get("access_token") ||
        new URLSearchParams(hash.replace("#", "")).get("access_token");

      const extractedRefreshToken =
        params.get("refresh_token") ||
        new URLSearchParams(hash.replace("#", "")).get("refresh_token");

      console.log("Extracted Access Token:", extractedAccessToken); // Debug log
      console.log("Extracted Refresh Token:", extractedRefreshToken); // Debug log

      if (extractedAccessToken && extractedRefreshToken) {
        // Store tokens in cookies
        setCookie('access_token', extractedAccessToken, { maxAge: 3600, path: '/' });
        setCookie('refresh_token', extractedRefreshToken, { maxAge: 3600, path: '/' });
        
        // Set the tokens to state for display
        setAccessToken(extractedAccessToken);
        setRefreshToken(extractedRefreshToken);

        setError(""); // Clear any previous errors

        // Validate the session
        const session = await checkSession();
        if (session) {
          console.log("Session detected:", session);
          setIsProcessing(false);
          router.push('/'); // Redirect to home
        } else {
          setError("Failed to detect a valid session.");
          setIsProcessing(false);
        }
      } else {
        setError("No authentication tokens found in the URL.");
        setIsProcessing(false); // Stop processing in case of errors
      }
    };

    processCallback();
  }, [router]);

  const checkSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        return null;
      }
      console.log("Fetched session:", data.session);
      return data.session;
    } catch (err) {
      console.error("Unexpected error checking session:", err.message);
      return null;
    }
  };

  // Validate the token
  const decodeJwt = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  };

  const validateToken = async (token) => {
    const decoded = decodeJwt(token);
    if (decoded && decoded.exp * 1000 > Date.now()) {
      console.log("Token is valid");
      return true;
    } else {
      console.log("Token is expired or invalid");
      return false;
    }
  };

  return (
    <div>
      <h1>Authentication Callback</h1>
      {isProcessing ? (
        <p>Processing your authentication...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Login Successful!</h1>
          <p>Welcome back!</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallbackPage;
