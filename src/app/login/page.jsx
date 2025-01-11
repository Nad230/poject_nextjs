"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "../utils/supabase/client";
import { login } from "../action/actions";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { MdVisibility, MdVisibilityOff } from "react-icons/md"; // Corrected imports for visibility icons
import Link from "next/link";
import styles from "../styles/auth.module.css";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility state
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
      }, 100);
    }
    sessionStorage.setItem('userEmail', formData.get('email'));
    const email = sessionStorage.getItem('userEmail');
console.log("Stored Email:", email);



  };

  const handleOAuthLogin = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider, // dynamically use the provider passed
        options: {
          redirectTo: `${window.location.origin}/auth/callback`, // Redirect to the OAuth callback page
        },
      });
  
      if (error) {
        setError(`Error: ${error.message}`);
        return;
      }
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

      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(() => {
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
                type={passwordVisible ? "text" : "password"} // Toggle password visibility
                name="password"
                placeholder="Password"
                required
                className={styles.input}
              />
              <span 
                onClick={() => setPasswordVisible(!passwordVisible)} 
                className={styles.eyeIcon}>
                {passwordVisible ? <MdVisibilityOff /> : <MdVisibility />} {/* Use MdVisibility for toggle */}
              </span>
            </div>
          </div>
          <p className={styles.forgotPassword}>
          <Link href="/forget-password" className={styles.link}>forgot password?</Link>
        </p>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Logging In..." : "Login"}
            </button>
          </div>
        </form>

        

        <div className={styles.switch}>
          <p>Don't have an account? 
            <Link href="/signup" className={styles.link}>Signup Here</Link>
          </p>
        </div>

        <div className={styles.divider}>
          <span>Or</span>
        </div>

        <div className={styles.socialButtons}>
          {/* Google Login Button */}
          <div className={styles.socialButton} onClick={() => handleOAuthLogin("google")}>
            <img
              className={styles.googleImage}
              src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
              alt="Google Login"
            />
          </div>

          {/* Facebook Login Button */}
          <div className={styles.socialButton} onClick={() => handleOAuthLogin("facebook")}>
            <img
              className={styles.facebookImage}
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
              alt="Facebook Login"
            />
          </div>

          {/* GitHub Login Button */}
          <div className={styles.socialButton} onClick={() => handleOAuthLogin("github")}>
            <img
              className={styles.githubImage}
              src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
              alt="GitHub Login"
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
