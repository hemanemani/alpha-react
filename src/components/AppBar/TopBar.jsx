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
import { Person } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { useNavigate } from 'react-router-dom';


const TopBar = ({ handleDrawerToggle,user }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const pageTitles = {
    "/": (
      <Box sx={{ p: 1, marginLeft:"20px" }}>
        <span style={{ color: "#7f7f7f",fontSize:"22px" }}>Hello</span>{" "}
        <span style={{ color: "#000",fontSize:"22px" }}>{user.name}</span>
        {location.pathname === "/" && (
          <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
                color: "#7f7f7f",
                fontFamily:"Inter Light",
                marginTop:"5px"
              }}
            >
              Welcome to Alpha, your one-stop admin solutions
            </Typography>
        )}

      </Box>
    ),
    "/analytics": (
      <Box sx={{ p: 1, marginLeft:"20px" }}>
        <span style={{ color: "#000",fontSize:"22px" }}>Analytics</span>
        {location.pathname === "/analytics" && (
          <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
                color: "#7f7f7f",
                fontFamily:"Inter Light",
                marginTop:"5px"
              }}
            >
              Monitor every activity of performance
            </Typography>
        )}
      </Box>
    ),
    "/inquiries/domestic": (
      <Box sx={{ p: 1, marginLeft:"20px" }}>
        <span style={{ color: "#000",fontSize:"22px" }}>All Domestic Inquiries</span>
      </Box>
    ),
    "/inquiries/international": (
      <Box sx={{ p: 1, marginLeft:"20px" }}>
        <span style={{ color: "#000",fontSize:"22px" }}>All International Inquiries</span>
      </Box>
    ),
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
      position="absolute"
      sx={{
        width: { sm: `calc(100% - 240px)` },
        ml: { sm: `240px` },
        backgroundColor: "transparent",
        boxShadow:"none",
        mt:1
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


        </div>

        {/* User Profile Menu */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{ ml: "auto" }}
        >
          <Avatar sx={{ bgcolor: "#f5f5f3", color:"#000" }}>
            <Person />
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
          <MenuItem onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
