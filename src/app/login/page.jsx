"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "../utils/supabase/client";
import { login } from "../action/actions";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import Link from "next/link";
import styles from "../styles/auth.module.css";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const handleFormLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.target);

    const errorMessage = await login(formData);

    if (errorMessage) {
      setError(errorMessage);
      setLoading(false);
    } else {
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  };

  const handleOAuthLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`, // Redirect to the OAuth callback page
        },
      });
  
      if (error) {
        setError(`Error: ${error.message}`);
        return;
      }
  
      // OAuth login is initiated, wait for the callback to handle the session
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };
  

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      // Set the session using the received tokens
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(() => {
        // After setting the session, automatically create the cookies
        // This step should make the token cookies like b-zfuqbectykxdfclljtxd-auth-token.0, etc.

        // Redirect to the homepage after successful login
        window.location.href = "/";
      }).catch((error) => {
        setError(`Error setting session: ${error.message}`);
      });
    }
  }, [supabase]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Please login to your account</p>

        <form onSubmit={handleFormLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <AiOutlineMail className={styles.icon} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputWrapper}>
              <AiOutlineLock className={styles.icon} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Logging In..." : "Login"}
            </button>
          </div>
        </form>

        <p className={styles.switch}>
          Don't have an account?{" "}
          <Link href="/signup" className={styles.link}>
            Signup Here
          </Link>
        </p>
        <p className={styles.switch}>Or</p>

        <div className={styles.socialButtons}>
          <div className={styles.socialButton} onClick={handleOAuthLogin}>
            <img
              className={styles.googleImage}
              src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
              alt="Google Login"
            />
          </div>
        </div>
      </div>

      {success && (
        <div className={styles.successMessage}>
          <span className={styles.icon}>✅</span>
          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.icon}>❌</span>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
