"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { TextField, Button, Typography, Box } from "@mui/material";

// Initialize the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage("");
    setIsError(false);

    try {
      // Check if email exists in profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single(); // Use .single() to fetch one record

      // If email is not found in the profiles table
      if (error || !data) {
        console.log("No user found with this email.");
        setMessage("We don't have an account with this email.");
        setIsError(true);
      } else {
        console.log("User found, sending reset password email...");
        // Trigger password reset email
        const { data: resetData, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: "http://localhost:3000/reset-password",
        });

        if (resetError) {
          console.error("Error sending reset password email:", resetError.message);
          setMessage(`Error: ${resetError.message}`);
          setIsError(true);
        } else {
          setMessage("A password reset email has been sent. Please check your inbox.");
          setIsError(false);
        }
      }
    } catch (err) {
      console.error("Unexpected error occurred:", err);
      setMessage("An unexpected error occurred. Please try again.");
      setIsError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "0 auto",
        padding: 3,
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Réinitialisation du mot de passe
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Entrez votre adresse e-mail pour recevoir un lien de réinitialisation de mot de passe.
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Adresse e-mail"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Envoyer"}
        </Button>
      </form>

      {message && (
        <Typography
          sx={{
            marginTop: 2,
            color: isError ? "error.main" : "success.main",
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
