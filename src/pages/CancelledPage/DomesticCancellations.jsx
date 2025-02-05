import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import axiosInstance from "../../services/axios";

const DomesticCancellations = () => {

  const [rows, setRows] = useState([]);

  useEffect(()=>{
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
    fetchCancellationData(); 
  },[]);

  const columns = [
    { field: "inquiry_number", headerName: "Inq. No.", width: 100 },
    { field: "inquiry_date", headerName: "Inq. Date", width: 200 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "mobile_number", headerName: "Mobile", width: 150 },
    { field: "product_categories", headerName: "Product Categories", width: 150 },
    { field: "location", headerName: "location", width: 200 },
    { field: "addedBy", headerName: "Added By", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
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
