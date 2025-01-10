"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { MdVisibility, MdVisibilityOff } from "react-icons/md"; // Visibility icons
import styles from "../styles/auth.module.css";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Password updated successfully. Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset Your Password</h1>
        <p className={styles.subtitle}>Enter your new password below</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={styles.input}
              />
              <span
                onClick={() => setPasswordVisible(!passwordVisible)}
                className={styles.eyeIcon}
              >
                {passwordVisible ? <MdVisibilityOff /> : <MdVisibility />}
              </span>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
              />
              <span
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                className={styles.eyeIcon}
              >
                {confirmPasswordVisible ? <MdVisibilityOff /> : <MdVisibility />}
              </span>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={
              message.includes("successfully")
                ? styles.successMessage
                : styles.errorMessage
            }
          >
            <span className={styles.icon}>
              {message.includes("successfully") ? "✅" : "❌"}
            </span>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
