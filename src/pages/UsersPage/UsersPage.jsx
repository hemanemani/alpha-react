import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography } from "@mui/material";
import axiosInstance from "../../services/axios";
import { Link, useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";

const UsersPage = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

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
        }else {
          console.error("Failed to fetch users", response.status);
        }

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsersData(); 
  },[]);

  const columns = [
    { field: "name", headerName: "Name", width: 250},
    { field: "role", headerName: "Role", width: 250 },
    { field: "access", headerName: "Access", width: 250 },
    { field: "status", headerName: "Status", width: 250 },
    { field: "actionButtons", headerName: "Action", width: 150, 
      renderCell: (params) => (
          <Grid container spacing={1}>
              <Grid item>
                  <Edit 
                      onClick={() => handleEdit(params.row.id)} 
                      style={{ cursor: 'pointer' }} 
                  />
              </Grid>
              <Grid item>
                  <Delete 
                      onClick={() => handleDelete(params.row.id)} 
                      style={{ cursor: 'pointer' }} 
                  />
              </Grid>
          </Grid>
      ) 
    },

  ];

  const handleEdit = (id)=>{
    navigate(`/edit-user/${id}`)
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
  };
  

  return (
    <Box sx={{ height: 500, width: "100%", p: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Typography variant="h5" gutterBottom>
            Users
          </Typography>
          <Link to="/add-new-users">
          <Button variant="contained" color="primary" size="small">
              Add new User
          </Button>
        </Link>
        </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
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
              // Define default visibility of columns
              id: true,
              name: true,
              role: true,
              status: true,
              access: true,
            },
          },
        }}
      />
    </Box>
  );
};

export default UsersPage;
