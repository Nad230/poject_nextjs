"use client";

import { useUser } from '../context/UserContext'; // Import the useUser hook
import { Box, Typography, Avatar } from "@mui/material";

const Profile = () => {
  const { user } = useUser(); // Get user data from context

  if (!user) {
    return <Typography>Loading...</Typography>; // Show loading state if the user data isn't available yet
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 3,
        backgroundColor: "#ffffff",
        borderRadius: 2,
        boxShadow: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <Avatar
        src={user?.avatar_url || "https://example.com/default-profile.jpg"} // Default image if no avatar exists
        alt={user?.name || "User"}
        sx={{
          width: 100,
          height: 100,
          marginBottom: 2,
          marginX: "auto",
        }}
      />

      <Typography variant="h6" gutterBottom>
        {user?.name || "Anonymous User"}
      </Typography>

      <Typography variant="body1" color="textSecondary">
        Email: {user?.email || "Not provided"}
      </Typography>
    </Box>
  );
};

export default Profile;
