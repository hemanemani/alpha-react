import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountCircle } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { useNavigate } from 'react-router-dom';


const TopBar = ({ handleDrawerToggle,user }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const pageTitles = {
    "/": (
      <Box sx={{ p: 1 }}>
        <span style={{ color: "#7f7f7f", fontWeight: "bold" }}>Hello</span>{" "}
        <span style={{ fontWeight: "bold", color: "black" }}>{user.name}</span>
      </Box>
    ),
    "/analytics": "Analytics",
    "/inquiries/domestic": "Domestic Inquiries",
    "/inquiries/international": "International Inquiries",
    "/offers": "Offers",
    "/users": "Users",
  };

  const currentPage = pageTitles[location.pathname] || "Dashboard";

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    console.log("Profile Clicked");
    handleMenuClose();
  };

  const handleChangePassword = () => {
    console.log("Change Password Clicked");
    handleMenuClose();
  };

  const handleLogout = async()=>{

    try {

      const response = await axiosInstance.post('/logout',{},{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.status === 200) {
        console.log("Logout successful");
  
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
        handleMenuClose();
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed", error.message);

    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - 240px)` },
        ml: { sm: `240px` },
        backgroundColor: "white", // Set toolbar background to white
      }}
    >
      <Toolbar sx={{ color: "black" }}>
        {/* Hamburger Menu Icon for Desktop */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }} // Visible only on mobile
        >
          <MenuIcon />
        </IconButton>

        {/* Current Page Title */}
        <div>
          <Typography
            variant="h6"
            className="inter-font"
            noWrap
            sx={{ flexGrow: 1, color: "black", fontSize: "1rem" }}
          >
            {currentPage}
          </Typography>

          {/* Show Welcome Message on Home Page Only */}
          {location.pathname === "/" && (
            <Typography
              variant="body1"
              sx={{
                display: "block",
                marginTop: "4px",
                fontSize: "0.8rem",
                color: "grey.600",
              }}
            >
              Welcome to Alpha, your one-stop admin solutions
            </Typography>
          )}

          {/* Show "Monitor every activity of performance" on Analytics Page */}
          {location.pathname === "/analytics" && (
            <Typography
              variant="body1"
              sx={{
                display: "block",
                marginTop: "4px",
                fontSize: "0.8rem",
                color: "grey.600",
              }}
            >
              Monitor every activity of performance
            </Typography>
          )}
        </div>

        {/* User Profile Menu */}
        <IconButton
          color="inherit"
          onClick={handleMenuOpen}
          sx={{ display: "flex", alignItems: "center", ml: "auto" }}
        >
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <AccountCircle />
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "user-menu",
          }}
        >
          <MenuItem onClick={handleProfile} sx={{ fontWeight: "bold" }}>
            Profile
          </MenuItem>
          <MenuItem onClick={handleChangePassword} sx={{ fontWeight: "bold" }}>
            Change Password
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ fontWeight: "bold" }}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
