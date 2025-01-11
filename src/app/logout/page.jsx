"use client";

import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, // Supabase URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Supabase Anon Key
  );
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      // Log out the user from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
        return;
      }

      // Clear cookies manually (remove access and refresh tokens)
      document.cookie = "access_token=; Max-Age=0; path=/;";
      document.cookie = "refresh_token=; Max-Age=0; path=/;";
      document.cookie = "sb-zfuqbectykxdfclljtxd-auth-token.0=; Max-Age=0; path=/;";
      document.cookie = "sb-zfuqbectykxdfclljtxd-auth-token.1=; Max-Age=0; path=/;";
      document.cookie = "supabase.auth.token=; Max-Age=0; path=/;";
      document.cookie = "supabase.auth.refresh_token=; Max-Age=0; path=/;";

      // Clear localStorage and sessionStorage
      localStorage.removeItem("supabase.auth.token");
      localStorage.removeItem("supabase.auth.refresh_token");
      sessionStorage.removeItem("userEmail");
      
      // After clearing the session, cookies, and storage, redirect to login page
      router.push("/login");
    };

    logout(); // Trigger logout when the page loads
  }, [supabase, router]);

  return (
    <div>
      <p>Logging you out...</p>
    </div>
  );
}
