"use client";
import { useState } from "react";
import Link from "next/link";
import { signup } from "../action/actions";
import { AiOutlineMail, AiOutlineUser, AiOutlineLock, AiOutlineEye, AiOutlinePhone } from 'react-icons/ai'; // Importation des icônes
import styles from "../styles/auth.module.css";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isObscure, setIsObscure] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous error message
  
    const formData = new FormData(e.target);
  
    try {
      const response = await signup(formData);
      
      // Log the full response for debugging
      console.log("Signup response:", response);
  
      if (response.success) {
        window.location.href = '/login'; // Redirect to login page
      } else {
        setError(response.error || "Something went wrong!");
      }
    } catch (err) {
      console.error("Error during signup process:", err); // Log any errors
      setError("An error occurred during signup.");
    } finally {
      setLoading(false); // Stop loading animation
    }
  };
  
  
  
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create an Account</h1>
        <p className={styles.subtitle}>Sign up to get started</p>
        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <AiOutlineUser className={styles.icon} />
              <input
                type="text"
                name="fullname"
                placeholder="Full Name..."
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputWrapper}>
              <AiOutlineMail className={styles.icon} />
              <input
                type="email"
                name="email"
                placeholder="Email..."
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputWrapper}>
              <AiOutlinePhone className={styles.icon} />
              <input
                type="text"
                name="phone"
                placeholder="Phone..."
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputWrapper}>
              <AiOutlineLock className={styles.icon} />
              <input
                type={isObscure ? "password" : "text"}
                name="password"
                placeholder="Password..."
                required
                className={styles.input}
              />
              <AiOutlineEye
                className={styles.eyeIcon}
                onClick={() => setIsObscure(!isObscure)} // Toggle password visibility
              />
            </div>
            
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Signing Up..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.icon}>❌</span>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
