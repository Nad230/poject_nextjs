"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, IconButton, TextField, Divider } from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import { createSupabaseBrowserClient } from "../utils/supabase/client";
import Header from "../components/Header";

const supabase = createSupabaseBrowserClient();

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        let userEmail = null;
  
        if (session) {
          // If logged in with Google, use the session data directly
          userEmail = session.user.email;
          setProfile(session.user);
          console.log("Logged in with OAuth, Session-based Email:", userEmail);
  
          // Check if logged in with Google and use avatar_url from user_metadata
          const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
  
          if (avatarUrl) {
            setProfile((prevProfile) => ({
              ...prevProfile,
              user_metadata: { ...prevProfile.user_metadata, profile_photo: avatarUrl },
            }));
          }
  
        } else {
          // If no session, check sessionStorage for the email (indicating email/password login)
          userEmail = sessionStorage.getItem("userEmail");
  
          if (userEmail) {
            console.log("Email from sessionStorage:", userEmail);
            setProfile({ email: userEmail });
          } else {
            console.error("No session or stored email found.");
            setLoading(false);
            return;
          }
        }
  
        // Fetch additional profile data based on the email (role, phone, fullname, profile photo)
        const { data, error: roleError } = await supabase
          .from("profiles")
          .select("role, phone, fullname, profile_photo")
          .eq("email", userEmail)
          .single();
  
        if (roleError) {
          console.error("Error fetching profile data:", roleError);
        } else {
          setRole(data?.role || "user");
          setPhone(data?.phone || "Not available");
          setProfile((prevProfile) => ({
            ...prevProfile,
            user_metadata: {
              fullname: data?.fullname || "Not available",
              profile_photo: data?.profile_photo || prevProfile.user_metadata?.profile_photo || null,
            },
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadProfile();
  }, []);
  
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!profile) {
    return <Typography>No user profile found. Please log in.</Typography>;
  }

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleAvatarClick = () => {
    alert("Change your photo functionality goes here");
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          backgroundColor: "#f4f4f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 1,
            textAlign: "center",
            position: "relative",
            transition: "transform 0.5s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <Avatar
  src={
    profile?.user_metadata?.profile_photo || // Use profile_photo if available
    "https://via.placeholder.com/120" // Fallback placeholder
  }
  alt={profile.email || "User"}
  onClick={handleAvatarClick}
  sx={{
    width: 180,
    height: 180,
    top: -150,
    borderRadius: "50%",
    border: "8px solid #ffffff",
    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
    },
  }}
/>

        </Box>

        <Divider orientation="vertical" flexItem sx={{ margin: "0 30px", borderColor: "#e0e0e0" }} />

        <Box sx={{ flex: 2, paddingLeft: 2 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              marginBottom: 1,
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "1px",
              color: "#333",
            }}
          >
            {profile?.user_metadata?.fullname || "Full Name Not Available"}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              marginBottom: 4,
              fontFamily: "'Roboto', sans-serif",
              color: "#666",
            }}
          >
            Role: {role || "Not available"}
          </Typography>

          <Box sx={{ marginBottom: 3 }}>
            {editingField === "fullname" ? (
              <TextField
                fullWidth
                value={profile?.user_metadata?.fullname || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    user_metadata: { ...profile.user_metadata, fullname: e.target.value },
                  })
                }
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                Full Name: {profile?.user_metadata?.fullname || "Not available"}
                <IconButton onClick={() => handleEdit("fullname")} sx={{ color: "primary.main" }}>
                  <AiOutlineEdit />
                </IconButton>
              </Typography>
            )}
          </Box>
            {/* Email Edit Section */}
          <Box sx={{ marginBottom: 4 }}>
            {editingField === "email" ? (
              <TextField
                fullWidth
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                Email: {profile.email}
                <IconButton onClick={() => handleEdit("email")} sx={{ color: "primary.main" }}>
                  <AiOutlineEdit />
                </IconButton>
              </Typography>
            )}
          </Box>

          {/* Phone Edit Section */}
          <Box sx={{ marginBottom: 4 }}>
            {editingField === "phone" ? (
              <TextField
                fullWidth
                value={phone || ""}
                onChange={(e) => setPhone(e.target.value)} // Update phone number
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                Phone: {phone || "Not available"}
                <IconButton onClick={() => handleEdit("phone")} sx={{ color: "primary.main" }}>
                  <AiOutlineEdit />
                </IconButton>
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
