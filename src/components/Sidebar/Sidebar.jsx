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
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle,user }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
 

  const location = useLocation();

  const handleMenuToggle = (menuKey) => {
    setOpenMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    handleMenuClose();
  };

  const collapsibleMenu = (menuKey, icon, label, submenuItems) => {
    const filteredSubmenuItems = submenuItems.filter((item) =>
      item.label.toLowerCase().includes(searchQuery)
    );

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
                fontWeight: location.pathname === '/' + menuKey ? 'bold' : 'normal'
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
                  fontWeight: location.pathname === to ? 'bold' : 'normal',
                  backgroundColor: location.pathname === to ? "#f0f0f0" : "transparent",
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
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Alpha
        </Typography>
      </Toolbar>
      
      <Box p={2}>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Search..."
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "grey.500" }} />
              </InputAdornment>
            ),
            sx: {
              display: "flex",
              alignItems: "center",
              height: "32px",
            },
          }}
          sx={{
            backgroundColor: "#ffffff",
            "& .MuiInputBase-root": {
              height: "32px",
              lineHeight: "32px",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiInputBase-input": {
              fontSize: "0.93rem",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "grey.500",
            },
          }}
        />
      </Box>

      <Box p={2} pb={0}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "0.8rem",
            color: "grey.500",
          }}
        >
          Menu
        </Typography>
      </Box>

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
                        fontWeight: location.pathname === item.to ? 'bold' : 'normal',
                        backgroundColor: location.pathname === item.to ? "#f0f0f0" : "transparent",
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

      <Box p={2} sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <ListItemText primary={user.name} secondary={user.email} />
          </Box>
        
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
        backgroundColor: "#f5f5f3",
      }}
      aria-label="sidebar"
    >
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
            backgroundColor: "#f5f5f3",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            backgroundColor: "#f5f5f3",
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