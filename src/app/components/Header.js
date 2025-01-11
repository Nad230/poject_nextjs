"use client";

import { useState } from "react";
import { AppBar, Toolbar, IconButton, Box, Drawer, List, ListItem, ListItemText, Typography, Menu, MenuItem } from "@mui/material";
import { Notifications, AccountCircle, Brightness4, Menu as MenuIcon } from "@mui/icons-material";
import Link from "next/link"; 

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#1e293b",
          boxShadow: "none",
          borderBottom: "2px solid #334155",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={toggleSidebar} sx={{ marginRight: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "#ffffff" }}>
            MyProject
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {["test1", "Test2"].map((label, index) => (
              <Link
                key={index}
                href={`/${label.toLowerCase().replace(" ", "-")}`}
                style={{
                  textDecoration: "none",
                  color: "#ffffff",
                  transition: "color 0.3s ease, transform 0.3s ease",
                }}
              >
                {label}
              </Link>
            ))}
          </Box>

          <Box sx={{ height: "40px", width: "2px", backgroundColor: "#6b7280", marginX: 2 }} />

          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit">
            <Brightness4 />
          </IconButton>

          <IconButton color="inherit" onClick={handleMenuClick}>
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <Link
              href="/logout"
              style={{
                display: "block",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                backgroundColor: "#ffffff",
                color: "#1e293b",
                border: "none",
                borderRadius: "5px",
                textDecoration: "none",
                transition: "background-color 0.3s",
              }}
              onClick={handleMenuClose}
            >
              Logout
            </Link>
            <Link
              href="/profile"
              style={{
                display: "block",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                backgroundColor: "#ffffff",
                color: "#1e293b",
                border: "none",
                borderRadius: "5px",
                textDecoration: "none",
                transition: "background-color 0.3s",
              }}
              onClick={handleMenuClose}
            >
              Profile
            </Link>
            
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        PaperProps={{
          sx: {
            marginTop: "64px",
            height: "calc(100% - 64px)",
            backgroundColor: "#1e293b",
          },
        }}
      >
        <Box sx={{ width: 250, backgroundColor: "#1e293b", height: "100%", color: "#ffffff" }}>
          <Box sx={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#334155" }} />

          <List>
            {["Test1", "Test2", "Test3"].map((label, index) => (
              <ListItem button key={index}>
                <Link
                  href={`/${label.toLowerCase().replace(" ", "-")}`}
                  style={{
                    textDecoration: "none",
                    color: "#ffffff",
                    transition: "color 0.3s ease, transform 0.3s ease",
                  }}
                  onClick={toggleSidebar}
                >
                  <ListItemText primary={label} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
