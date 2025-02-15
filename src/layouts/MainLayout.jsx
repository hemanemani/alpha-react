import React, { useEffect, useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Sidebar from "../components/Sidebar/Sidebar";
import TopBar from "../components/AppBar/TopBar";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(true);


  const location = useLocation();
  const hoverRoutes = ["/inquiries/domestic", "/inquiries/international","/cancellations","/offers/domestic","/offers/international"];
  const isHoverEnabled = hoverRoutes.includes(location.pathname);
  const drawerWidth = isHoverEnabled ? (hovered ? 240 : 60) : 240;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const storedUser = localStorage.getItem("user");

    let user = {};
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }

  return (
    <Box
      sx={{
        display: "flex",
        backgroundImage: "url('https://alpha.organysk.com/assets/images/alpha-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh", // Ensures the background covers the viewport
      }}
    >
      <CssBaseline />
      {/* TopBar */}
      <TopBar handleDrawerToggle={handleDrawerToggle} user={user} drawerWidth={drawerWidth} />
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} user={user} drawerWidth={drawerWidth} isHoverEnabled={isHoverEnabled} hovered={hovered} setHovered={setHovered} />
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` }, // Adjust based on sidebar width
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
