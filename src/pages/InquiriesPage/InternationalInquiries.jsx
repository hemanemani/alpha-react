import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button,Grid, Typography } from "@mui/material";
import axiosInstance from "../../services/axios";
import { Link, useNavigate } from "react-router-dom";
import { Delete,Edit } from "@mui/icons-material";


const InternationalInquiries = () => {

  const navigate = useNavigate()
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(()=>{
    const fetchInternationalInquiryData = async()=>{
      const token = localStorage.getItem('authToken');
        if (!token) {
        console.log("User is not authenticated.");
        return;
      }

      try {
        const response = await axiosInstance.get('/international_inquiries',{
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
          console.error("Failed to fetch international inquiries", response.status);
        }

      } catch (error) {
        console.error("Error fetching international inquiries:", error);
      }
    };
    fetchInternationalInquiryData(); 
  },[]);

  const handleDownload = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("User is not authenticated.");
      return;
    }

    try {
      const response = await axiosInstance.get('/international-template-download', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Important for downloading files
      });

      // Create a link element to simulate the download action
      const link = document.createElement('a');
      link.href = URL.createObjectURL(response.data);
      link.download = 'international_inquiry_template.xlsx'; // Specify the default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
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
    { field: "status", headerName: "Status", width: 150 },
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
    navigate(`/inquiries/international/edit-international-inquiry/${id}`)
  }

  const handleDelete = async(id)=>{
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.log("User is not authenticated.");
        return;
    }

    try {
        const response = await axiosInstance.delete(`/international_inquiries/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            console.log("Item deleted successfully.");

            setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            setFilteredRows((prevFilteredRows) =>
                prevFilteredRows.filter((row) => row.id !== id)
            );
        } else {
            console.error("Failed to delete item:", response.status);
        }
    } catch (error) {
        console.error("Error deleting item:", error);
    }
  }

  return (
    <Box sx={{ height: 500, width: "100%", p: 2 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <Typography variant="h5" gutterBottom>
          International Inquiries Page
        </Typography>
        <div>
          <Link to="/inquiries/international/new-international-inquiry">
            <Button variant="contained" color="primary" size="small" sx={{marginRight:'15px'}}>
                Add new Inquiry
            </Button>
          </Link>
          <Link to="/inquiries/international/upload">
            <Button variant="contained" color="primary" size="small">
                Bulk Upload
            </Button>
          </Link>
            <Button
              size="small"
              variant="outlined"
              sx={{ borderRadius: "8px", px: 1 }}
              onClick={handleDownload}
            >
              Export
            </Button>
          
        </div>
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

export default InternationalInquiries;
