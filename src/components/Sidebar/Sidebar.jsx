import React, { useEffect, useState } from "react";
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
import { Block, Description, NewReleasesTwoTone,Person } from "@mui/icons-material";




const Sidebar = ({ mobileOpen, handleDrawerToggle,user,drawerWidth,isHoverEnabled,hovered,setHovered }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);


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
            <ListItemIcon sx={{color:'#817f81'}}>{icon}</ListItemIcon>
            <ListItemText 
              sx={{ 
                fontSize: '0.8rem', 
                color:'#817f81',
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
                <ListItemText sx={{ fontSize: '0.75rem',color:'#817f81'}} primary={label} />
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
      submenu: [{ label: "Analytics", to: "/analytics" }],

    },
    {
      key: "inquiries",
      icon: <Description />,
      label: "Inquiries",
      submenu: [
        { label: "Domestic", to: "/inquiries/domestic" },
        { label: "International", to: "/inquiries/international" },
        { label: "Cancellations", to: "/cancellations" },
      ],
    },
    {
      key: "offers",
      icon: <NewReleasesTwoTone/>,
      label: "Offers",
      submenu: [
        { label: "Domestic", to: "/offers/domestic" },
        { label: "International", to: "/offers/international" },
        { label: "Cancellations", to: "/offers/cancellations" },
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
    <Box sx={{ width: isHoverEnabled ? (hovered ? 240 : 60) : 240 }}>

      <Toolbar>
        <Typography variant="h4" sx={{ fontWeight: "bold"}} mb={4} mt={2}>
        <Link to="/" style={{ color: "#000", textDecoration: "none" }}>
          { hovered ?  'Alpha' : ''}
        </Link>
        </Typography>
      </Toolbar>
      { hovered ?
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
                <SearchIcon sx={{ color: "#a3a2a2",marginLeft:"6px",fontSize:"22px" }} />
              </InputAdornment>
            ),
            sx: {
              display: "flex",
              alignItems: "center",
              height: "35px",
              backgroundColor:"#fff"
            },
          }}
          sx={{
            backgroundColor: "#fff",
            borderRadius:"7px",
            "& .MuiInputBase-root": {
              height: "35px",
              lineHeight: "32px",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiInputBase-input": {
              fontSize: "14px",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#84888f"
            },
            color:"#94948f",
          }}
        />
      </Box> : '' }
      { hovered ?
      <Box p={2} pb={0}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "500",
            fontSize: "0.8rem",
            color: "#8e8081",
          }}
        >
          Menu
        </Typography>
      </Box> : ''}

      <Box sx={{ maxHeight: "calc(100vh - 200px)" }}>
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
                        backgroundColor: location.pathname === item.to ? "#fff" : "transparent",
                        color:location.pathname === item.to ? '#000' : '#817f81',
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
      { hovered ?
      <Box p={2} sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
          <Person />
          <ListItemText primary={user.name} secondary= {`@${user.user_name}`} />
        </Box>
      </Box> : ''}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        backgroundColor: "transparent",
        zIndex:"99"
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
            transition: "width 0.3s ease",
            width: isHoverEnabled ? (hovered ? 240 : 60) : 240,
            overflowX: "hidden",
          },
        }}
        open
        onMouseEnter={() => isHoverEnabled && setHovered(true)}
        onMouseLeave={() => isHoverEnabled && setHovered(false)}
      >

        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;