"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const AuthCallbackPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        console.log("Session Data:", session); // Debug log
        console.log("Session Error:", error);  // Debug log

        if (error || !session) {
          setError("Failed to retrieve session or tokens.");
          setIsProcessing(false);
          return;
        }

        const { access_token, refresh_token } = session;

        if (access_token && refresh_token) {
          // Set cookies for both tokens
          setCookie("access_token", access_token, { maxAge: 3600, path: '/' });
          setCookie("refresh_token", refresh_token, { maxAge: 3600, path: '/' });

          console.log("Tokens successfully set.");
          setError('');
          setIsProcessing(false);
          router.push('/'); // Redirect to the home page
        } else {
          setError("Failed to extract tokens.");
          setIsProcessing(false);
        }
      } catch (err) {
        console.error("Unexpected error during callback processing:", err.message);
        setError("Unexpected error occurred.");
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [router]);

  return (
    <div>
      <h1>Authentication Callback</h1>
      {isProcessing ? (
        <p>Processing your authentication...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>Login Successful!</h1>
          <p>Welcome back!</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallbackPage;
