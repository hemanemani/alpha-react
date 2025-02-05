import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  IconButton,
  Box,
  Divider,
  TextField,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import InfoIcon from "@mui/icons-material/Info";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PeopleIcon from "@mui/icons-material/People";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight"; // Submenu icon
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Three-dot menu icon
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle, user }) => {
  const [openMenu, setOpenMenu] = useState(null); // Store the currently open menu key
  const [searchQuery, setSearchQuery] = useState(""); // State to manage the search query
  const [anchorEl, setAnchorEl] = useState(null); // State to handle three-dot menu

  const location = useLocation(); // Get current route
  const handleMenuToggle = (menuKey) => {
    setOpenMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase()); // Normalize the search query
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu when three dots are clicked
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Implement logout logic here
    handleMenuClose();
  };

  const collapsibleMenu = (menuKey, icon, label, submenuItems) => {
    const filteredSubmenuItems = submenuItems.filter((item) =>
      item.label.toLowerCase().includes(searchQuery)
    );

    // Hide menu if no subitems match the search query
    if (!label.toLowerCase().includes(searchQuery) && filteredSubmenuItems.length === 0) {
      return null;
    }

    return (
      <React.Fragment>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleMenuToggle(menuKey)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText 
              sx={{ 
                fontSize: '0.8rem', 
                fontWeight: location.pathname === '/' + menuKey ? 'bold' : 'normal' // Bold active main menu
              }} 
              primary={label} 
            />
            {openMenu === menuKey ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === menuKey} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {filteredSubmenuItems.map(({ label, to }, index) => (
              <ListItemButton
                key={index}
                component={Link}
                to={to}
                sx={{
                  pl: 4,
                  fontWeight: location.pathname === to ? 'bold' : 'normal', // Bold active submenu
                  backgroundColor: location.pathname === to ? "#f0f0f0" : "transparent", // Highlight active submenu
                }}
              >
                <ListItemIcon>
                  <SubdirectoryArrowRightIcon />
                </ListItemIcon>
                <ListItemText sx={{ fontSize: '0.75rem' }} primary={label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </React.Fragment>
    );
  };

  const menuItems = [
    {
      key: "home",
      icon: <HomeIcon />,
      label: "Home",
      to: "/",
    },
    {
      key: "analytics",
      icon: <AnalyticsIcon />,
      label: "Analytics",
      submenu: [{ label: "Sub-Analytics", to: "/analytics" }],
    },
    {
      key: "inquiries",
      icon: <InfoIcon />,
      label: "Inquiries",
      submenu: [
        { label: "Domestic", to: "/inquiries/domestic" },
        { label: "International", to: "/inquiries/international" },
      ],
    },
    {
      key: "offers",
      icon: <LocalOfferIcon />,
      label: "Offers",
      submenu: [
        { label: "Domestic", to: "/offers/domestic" },
        { label: "International", to: "/offers/international" },
      ],
    },
    {
      key: "cancellations",
      icon: <LocalOfferIcon />,
      label: "Cancellations",
      submenu: [
        { label: "Domestic", to: "/cancellations/domestic" },
        { label: "International", to: "/cancellations/international" },
      ],
    },
    {
      key: "users",
      icon: <PeopleIcon />,
      label: "Users",
      to: "/users",
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery) ||
      (item.submenu &&
        item.submenu.some((submenuItem) =>
          submenuItem.label.toLowerCase().includes(searchQuery)
        ))
  );

  const drawerContent = (
    <Box>
      {/* Customized Toolbar with "Alpha" */}
      <Toolbar className="MuiToolbar-root MuiToolbar-gutters MuiToolbar-regular css-1ygil4i-MuiToolbar-root">
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Alpha
        </Typography>
      </Toolbar>
      <Divider />
      {/* Search Field */}
      <Box p={2}>
      <TextField
  fullWidth
  variant="outlined"
  placeholder="Search..."
  size="small"
  value={searchQuery}
  onChange={handleSearchChange}
  sx={{
    backgroundColor: "#fffff", // Set the background color to your desired color
  }}
/>

      </Box>
      

      {/* Menu Label */}
      <Box p={2} pb={0}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "0.8rem", // Adjust the font size to make it bigger
            color: "grey.500", // Set the color to grey
          }}
        >
          Menu
        </Typography>
      </Box>

      {/* Scrollable Menu */}
      <Box sx={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        <List>
          {filteredMenuItems.map((item) =>
            item.submenu
              ? collapsibleMenu(item.key, item.icon, item.label, item.submenu)
              : item.label.toLowerCase().includes(searchQuery) && (
                  <ListItem disablePadding key={item.key}>
                    <ListItemButton
                      component={Link}
                      to={item.to}
                      sx={{
                        fontWeight: location.pathname === item.to ? 'bold' : 'normal', // Bold active main menu
                        backgroundColor: location.pathname === item.to ? "#f0f0f0" : "transparent", // Highlight active main menu
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText sx={{ fontSize: '0.75rem' }} primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                )
          )}
        </List>
      </Box>

      {/* User Profile Section */}
      <Box p={2} sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Divider />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <ListItemText primary={user.name} />
          </Box>
         
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        backgroundColor: "#f5f5f3", // Set sidebar background color
      }}
      aria-label="sidebar"
    >
      {/* Mobile Drawer */}
      <Drawer
  variant="temporary"
  open={mobileOpen}
  onClose={handleDrawerToggle}
  ModalProps={{
    keepMounted: true,
  }}
  sx={{
    display: { xs: "block", sm: "none" },
    "& .MuiDrawer-paper": { 
      backgroundColor: "#f5f5f3", // Set the background color of the drawer's paper
    },
  }}
>
        {drawerContent}
      </Drawer>

      {/* Permanent Drawer */}
      <Drawer
  variant="permanent"
  sx={{
    display: { xs: "none", sm: "block" },
    "& .MuiDrawer-paper": { 
      backgroundColor: "#f5f5f3", // Set the background color of the drawer's paper
    },
  }}
  open
>
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
