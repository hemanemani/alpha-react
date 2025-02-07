import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Grid, Typography } from "@mui/material";
import axiosInstance from "../../services/axios";
import { useNavigate } from "react-router-dom";
import { Block, Edit } from "@mui/icons-material";

const DomesticCancellations = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  const fetchCancellationData = async()=>{
    const token = localStorage.getItem('authToken');
      if (!token) {
      console.log("User is not authenticated.");
      return;
    }

    try {
      const response = await axiosInstance.get('/inquiry-cancellation-offers',{
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response && response.data) {
        // Preprocess data to include "addedBy" field
        const processedData = response.data.map((item) => ({
          ...item,
          addedBy: item.user?.name || "Unknown",
        }));
        setRows(processedData);
      }else {
        console.error("Failed to fetch cancellations", response.status);
      }

    } catch (error) {
      console.error("Error fetching cancellations:", error);
    }
  };

  useEffect(()=>{
    fetchCancellationData(); 
  },[]);

  const handleEdit = (id) => {
    navigate(`/inquiries/domestic/edit-inquiry/${id}`);
  };
  
  const handleBlockInquiry = async(id,mobile_number) => {
    try {
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        console.log("User is not authenticated.");
        return;
      }
  
      const response = await axiosInstance.post(`/block-inquiry/${id}`, { mobile_number },
        { headers: 
          { Authorization: `Bearer ${token}` }
        }
      );
      console.log(response)
      if (response.data.success) {
        setRows(prevRows => prevRows.filter(row => row.id !== id));
        console.log('Blocked successfully')
    }

    } catch (error) {
        alert(error.response?.data?.error || "Duplicate Entry");
    }

  };


  const columns = [
    { field: "inquiry_number", headerName: "Inq. No.", width: 100 },
    { field: "inquiry_date", headerName: "Inq. Date", width: 200 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "mobile_number", headerName: "Mobile", width: 150 },
    { field: "product_categories", headerName: "Product Categories", width: 150 },
    { field: "location", headerName: "location", width: 200 },
    { field: "addedBy", headerName: "Added By", width: 150 },
    {
      field: "actionButtons",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Grid container spacing={1}>
          <Grid item>
            <Edit onClick={() => handleEdit(params.row.id)} style={{ cursor: "pointer" }} />
          </Grid>
          <Grid item>
          <Block onClick={() => handleBlockInquiry(params.row.id, params.row.mobile_number)} style={{ cursor: "pointer" }} />
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: "100%", p: 2 }}>
      <Typography variant="h5" gutterBottom>
      Cancellations Page
      </Typography>
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
              inquiry_number: true,
              inquiry_date: true,
              name: true,
              mobile_number: true,
              product_categories: true,
              location: true,
              addedBy: true,
              status: true,
            },
          },
        }}
      />
    </Box>
  );
};

export default DomesticCancellations;
