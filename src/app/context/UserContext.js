
"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { setCookie } from 'cookies-next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          setError("Failed to retrieve session.");
          setIsProcessing(false);
          return;
        }

        const { access_token, refresh_token } = session;

        if (access_token && refresh_token) {
          setCookie("access_token", access_token, { maxAge: 3600, path: '/' });
          setCookie("refresh_token", refresh_token, { maxAge: 3600, path: '/' });
          const userResponse = await supabase.auth.getUser();
          if (userResponse.error) {
            setError("Failed to fetch user details.");
            setIsProcessing(false);
            return;
          }

          setUser(userResponse.data.user);
          setIsProcessing(false);
        } else {
          setError("Failed to extract tokens.");
          setIsProcessing(false);
        }
      } catch (err) {
        setError("Unexpected error occurred.");
        setIsProcessing(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isProcessing, error }}>
      {children}
    </UserContext.Provider>
  );
};