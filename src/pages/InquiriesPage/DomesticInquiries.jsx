import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../../services/axios";
import { Link, useNavigate } from "react-router-dom";
import { Block, Edit, ZoomOutMap } from "@mui/icons-material";


const DomesticInquiries = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [density, setDensity] = useState(localStorage.getItem("dataGridDensity") || "standard");

  const fetchInquiryData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("User is not authenticated.");
      return;
    }

    try {
      const response = await axiosInstance.get("/inquiries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data) {
        const processedData = response.data.map((item) => ({
          ...item,
          addedBy: item.user?.name || "Unknown",
        }));
        setRows(processedData);
        setFilteredRows(processedData);
      } else {
        console.error("Failed to fetch inquiries", response.status);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  useEffect(() => {
    fetchInquiryData();
  }, []);

  useEffect(() => {
    const filteredData = rows.filter((row) =>
      Object.values(row).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setFilteredRows(filteredData);
  }, [searchText, rows]);

  const handleDownload = async () => {
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        console.log("User is not authenticated.");
        return;
      }
  
      try {
        const response = await axiosInstance.get('/domestic-template-download', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Important for downloading files
        });
  
        // Create a link element to simulate the download action
        const link = document.createElement('a');
        link.href = URL.createObjectURL(response.data);
        link.download = 'domestic-template.xlsx'; // Specify the default filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading the file:", error);
      }
    };

  const handleDensityChange = (newDensity) => {
    setDensity(newDensity);
    localStorage.setItem("dataGridDensity", newDensity);
  };

  // handle update status

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

        await fetchInquiryData(); 

    }
    } catch (error) {
        console.error("Error updating status:", error);
    }

  };
  
  const handleOffers = (id) => handleUpdateStatus(id, 1);
  const handleCancel = (id) => handleUpdateStatus(id, 0);
  
  

  const columns = [
    { field: "inquiry_number", headerName: "Inq. No.", width: 100 },
    { field: "inquiry_date", headerName: "Inq. Date", width: 200 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "mobile_number", headerName: "Mobile", width: 150 },
    { field: "product_categories", headerName: "Product Categories", width: 150 },
    { field: "location", headerName: "Location", width: 200 },
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
            <ZoomOutMap onClick={() => handleOffers(params.row.id)} style={{ cursor: "pointer" }} />
          </Grid>
          <Grid item>
            <Block onClick={() => handleCancel(params.row.id)} style={{ cursor: "pointer" }} />
          </Grid>
        </Grid>
      ),
    },
  ];

  const handleEdit = (id) => {
    navigate(`/inquiries/domestic/edit-inquiry/${id}`);
  };

  

  return (
    <Box sx={{ height: 500, width: "100%", p: 2 }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
      <Typography gutterBottom sx={{ fontSize: '12px', fontWeight: 'bold', textDecoration: 'underline' }}>
          View Analytics
      </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link to="/inquiries/domestic/new-inquiry">
            <Button size="small" variant="contained" sx={{ bgcolor: "black", color: "white", borderRadius: "8px", px: 1 }}>
              + Add New Inquiry
            </Button>
          </Link>
          <Link to="/inquiries/domestic/upload">
            <Button size="small" variant="outlined" sx={{ borderRadius: "8px", px: 1 }}>
              + Bulk Upload
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
        </Box>
      </Box>

      {/* SEARCH BAR */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search inquiries..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            width: "250px",
            bgcolor: "white",
            borderRadius: "8px",
            boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* DATA GRID */}
      <DataGrid
  slots={{ toolbar: GridToolbar }}
  rows={filteredRows}
  columns={columns}
  pageSizeOptions={[5, 10, 20, 50]} // Add multiple options for rows per page
  pagination
  checkboxSelection
  disableSelectionOnClick
  density={density} 
  onDensityChange={handleDensityChange}
  components={{
    Toolbar: GridToolbar,
  }}
  componentsProps={{
    toolbar: {
      showQuickFilter: true,
      quickFilterProps: { debounceMs: 500 },
    },
    pagination: {
      labelRowsPerPage: "Rows per page:", // Explicitly show the label
    },
  }}
  initialState={{
    pagination: {
      paginationModel: { pageSize: 5 },
    },
    columns: {
      columnVisibilityModel: {
        inquiry_number: true,
        inquiry_date: true,
        name: true,
        mobile_number: true,
        product_categories: false,
        location: false,
        addedBy: false,
      },
    },
  }}
/>

    </Box>
  );
};

export default DomesticInquiries;