import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Grid, Typography } from "@mui/material";
import axiosInstance from "../../services/axios";
import { Block, Edit, ZoomOutMap } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const DomesticOffers = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);

  const fetchOffersData = async()=>{
    const token = localStorage.getItem('authToken');
      if (!token) {
      console.log("User is not authenticated.");
      return;
    }

    try {
      const response = await axiosInstance.get('/inquiry-approved-offers',{
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
      );

      if (response && response.data) {
        // Preprocess data to include "addedBy" field
        const processedData = response.data.map((item) => ({
          ...item,
          addedBy: item.user?.name || "Unknown",
        }));
        setRows(processedData);
      }else {
        console.error("Failed to fetch offers", response.status);
      }

    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(()=>{
    fetchOffersData(); 
  },[]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        console.log("User is not authenticated.");
        return;
      }
  
      const response = await axiosInstance.patch(`/inquiries/${id}/update-inquiry-status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        console.log(response.data.message);

        // Optimistically update the status in the table
        await fetchOffersData(); 

    }
    } catch (error) {
        console.error("Error updating status:", error);
    }

  };

  const handleEdit = (id) => {
    navigate(`/inquiries/domestic/edit-inquiry/${id}`);
  };
  
  const handleMoveToInquiries = (id) => handleUpdateStatus(id, null);
  const handleCancel = (id) => handleUpdateStatus(id, 0);

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
            <ZoomOutMap onClick={() => handleMoveToInquiries(params.row.id)} style={{ cursor: "pointer" }} />
          </Grid>
          <Grid item>
            <Block onClick={() => handleCancel(params.row.id)} style={{ cursor: "pointer" }} />
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: "100%", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Offers Page
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
              addedBy: true
            },
          },
        }}
      />
    </Box>
  );
};

export default DomesticOffers;
