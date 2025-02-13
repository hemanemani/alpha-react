import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Avatar, Box, Button, FormControlLabel, Grid, IconButton, InputAdornment, Switch, TextField, Typography,Menu,
  MenuItem } from "@mui/material";
import axiosInstance from "../../services/axios";
import { Link, useNavigate } from "react-router-dom";
import { Block, Edit, MoreHoriz } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";

const UsersPage = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [toggleStates, setToggleStates] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  useEffect(()=>{
    const fetchUsersData = async()=>{
      const token = localStorage.getItem('authToken');
        if (!token) {
        console.log("User is not authenticated.");
        return;
      }

      try {
        const response = await axiosInstance.get('/users',{
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
        );

        if(response){
          setRows(response.data);
          const initialToggleStates = {};
          response.data.forEach(user => {
            initialToggleStates[user.id] = user.status;  // Assuming `status` is either 1 or 0
          });

          // Set the toggleStates state
          setToggleStates(initialToggleStates);

        }else {
          console.error("Failed to fetch users", response.status);
        }

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsersData(); 
  },[]);

  const handleToggle = async (id) => {
    const newState = toggleStates[id] === 1 ? 0 : 1;
    const updatedToggleStates = { ...toggleStates, [id]: newState };
  
    setToggleStates(updatedToggleStates);
  
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log("User is not authenticated.");
        return;
      }
  
      await axiosInstance.post(
        `/update-status/${id}`,
        { status: newState },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Failed to update user status", error);
    }
  };
  
  
  const columns = [
    { field: "name", headerName: "Name", width: 250},
    { field: "is_admin", headerName: "Role", width: 250,
      renderCell: (params) => (
        <Typography sx={{ lineHeight: 'inherit' }}>
            {params.row.is_admin ? 'Master Admin User' : 'Admin'}
        </Typography>
      )
     },
    { field: "access_level", headerName: "Access", width: 250 },
    { field: "status", headerName: "Status", width: 250,
      renderCell: (params) => (
        <FormControlLabel
        control={
          <Switch
            checked={toggleStates[params.id] === 1}
            onChange={() => handleToggle(params.id)}
            color="black"
            opacity="1"
            sx={{
              "& .MuiSwitch-thumb": {
                border:"1px solid #000"
              },
              "& .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: "transparent",
                border:"1px solid #000"
              },
              "& .Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#000",
                opacity:1
              },

            }}
          
          />
        }
        label={toggleStates[params.id] === 1 ? "Active" : "Inactive"}
      />  
      ),

    },
    { field: "actionButtons", headerName: "", width: 150, 
      renderCell: (params) => (
          <Grid container spacing={1} sx={{display:"block",marginTop:'auto'}}>
            <IconButton onClick={handleMenuOpen}>
              <Avatar sx={{ bgcolor: "#d9d9d9", color:"#000",width:'35px',height:'35px' }}>
                <MoreHoriz />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "user-menu",
              }}
              sx={{
                "& .MuiPaper-root": {
                  boxShadow:"none",
                  borderRadius:"15px",
                  border:"1px solid #d9d9d9"
                },
              }}
            
            >
              {/* <MenuItem sx={{borderBottom:"1px solid #dedede",margin:0,padding:"0 15px"}}>
                <FormControlLabel
                  labelPlacement="start"
                  componentsProps={{
                    typography: { sx: { fontSize: "14px", color: "#000", fontWeight: "500",marginRight:"80px" } }
                  }}
                  label={toggleStates[params.id] === 1 ? "Active" : "Inactive"}
                  control={
                    <Switch
                      checked={toggleStates[params.id] === 1}
                      onChange={() => handleToggle(params.id)}
                      color="black"
                    />
                  }
                />
              </MenuItem> */}
              <MenuItem sx={{fontSize:"14px",color:"#000",fontWeight:"500"}} onClick={() => handleEdit(params.row.id)} >
                <Edit 
                    style={{ cursor: 'pointer',fontSize:"16px",color:"#565656",marginRight:"8px" }}
                /> Edit Profile
              </MenuItem>
              <MenuItem sx={{fontSize:"14px",color:"#000",fontWeight:"500"}} onClick={() => handleDelete(params.row.id)} 
              >
                <Block 
                    style={{ cursor: 'pointer',fontSize:"16px",color:"#565656",marginRight:"8px" }}
                />Delete
              </MenuItem>
            </Menu>
          </Grid>
      ) 
    },

  ];

  const handleEdit = (id)=>{
    console.log('hello')
    navigate(`/edit-user/${id}`)
    setAnchorEl(null); 
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        console.error("No auth token found.");
        return;
      }
      await axiosInstance.delete(`users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user.id !== id));
      alert("User deleted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
  
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete user. Please try again.");
    }
    setAnchorEl(null); 
  };
  

  return (
    <Box sx={{ height: 500, width: "100%", p: 2 }}>
        <div style={{ display: "flex", justifyContent: "end", alignItems: "center", marginBottom: "16px", gap:"15px" }}>
          <Box>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search users..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{
                width: "250px",
              }}
              InputProps={{
                sx:{
                  borderRadius: "8px",
                  fontSize:"13px",
                  paddingRight:"0",
                  bgcolor: "white"
                },
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Link to="/add-new-users">
          <Button variant="contained" color="primary" size="small" sx={{background:"#000",fontSize:"12px",textTransform:"capitalize",padding:"5px 18px"}}>
              Add new User +
          </Button>
        </Link>
        </div>
      <DataGrid
        rows={rows}
        columns={columns}
        // pageSize={5}
        // rowsPerPageOptions={[5, 10, 20]}
        // checkboxSelection
        disableSelectionOnClick
        components={{
          Toolbar: GridToolbar,
        }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true, // Adds the quick search bar
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: true,
              name: true,
              role: true,
              status: true,
              access: true,
            },
          },
        }}
        sx={{
          mt:4,
          "& .MuiDataGrid-columnHeaders": {
            color: "#827f7f",
            fontSize: "16px",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-row": {
            color: "#000",
            fontSize:"15px",
            fontWeight:"500"
          },
          "& .MuiDataGrid-container--top [role='row'], & .MuiDataGrid-container--bottom [role='row']": {
            backgroundColor: "transparent !important",
          }            
      
        }}
      />
    </Box>
  );
};

export default UsersPage;
