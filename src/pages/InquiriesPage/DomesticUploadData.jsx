import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../../services/axios";
import { Link, useNavigate } from "react-router-dom";
import { FolderOpen } from "@mui/icons-material";


const DomesticUploadData = ({rows, setRows , filteredRows,setFilteredRows}) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");


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

  const columns = [
    { field: "file_name", headerName: "Name", width: 200,
      renderCell: (params) => (
        <>
        
        <Grid container alignItems="center" spacing={1}>
          {/* File Icon */}
          <Grid item>
            <FolderOpen fontSize="medium" sx={{ marginRight: "10px" }} />
          </Grid>

          {/* File Name & Size */}
          <Grid item>
            <Typography variant="body2" fontWeight="500">
              {params.value}
            </Typography>
            <Typography variant="caption" color="gray" sx={{ display: "block" }}>
              {params.row.file_size} KB
            </Typography>
          </Grid>
        </Grid>

        </>
  
      ), 
      sx:{
        display:"flex",
        alignItems:"center"
      }
    },
    { field: "uploaded_at", headerName: "Date Uploaded", width: 250 },
    { field: "uploaded_by", headerName: "Uploaded By", width: 200},
    { field: "status", headerName: "Status", width: 200,
      renderCell : (params) => (
        <Typography 
          sx={{ 
            color: params.value === "Uploaded" ? "#4bb543" : "inherit", 
            fontWeight: "500",
            lineHeight:"inherit"
          }}
        >
          {params.value}
        </Typography>
      )
     },
    {
      field: "actionButtons",
      headerName: "",
      width: 250,
      renderCell: (params) => (
        
        <Grid container spacing={1}>
          <Grid item>
          <Button
              size="small"
              variant="outlined"
              sx={{ bgcolor: "transparent", color: "#000", borderRadius: "8px", fontSize:"12px",textTransform:"capitalize",border:"1px solid #d9d9d9", cursor: "pointer", marginRight:"10px" }}
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{ bgcolor: "black", color: "#fff", borderRadius: "8px", fontSize:"12px",textTransform:"capitalize",border:"1px solid #d9d9d9", cursor: "pointer"}}
              onClick={() => handleDownload(params.row.file_path)}
            >
              Download
            </Button>
            
          </Grid>
        </Grid>
      ),
    },
    
   
  ];

  const handleDownload=(filePath)=>{
    if (!filePath) {
        console.error("File path is missing.");
        return;
    }

    const baseUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    const fullPath = `${baseUrl}/${filePath}`;

    window.open(fullPath, "_blank");
  }

  const handleDelete = async(id) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.log("User is not authenticated.");
        return;
    }

    try {
        const response = await axiosInstance.delete(`/bulk-domestic-data/${id}`, {
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

  };

  return (
    <Box sx={{ height: 500, width: "100%", p: 2 }}>
      {/* SEARCH BAR */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search uploads..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            width: "250px",
          }}
          InputProps={{
            sx:{
              borderRadius: "8px",
              fontSize:"13px",
              border:"1px solid #d9d9d9",
              paddingRight:"0",
              bgcolor: "white",

            },
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>


      {/* DATA GRID */}
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id} // Ensure unique ID
        pageSize={10}
        pageSizeOptions={[5, 10, 20]}
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
          pagination: {
            paginationModel: { pageSize: 5, page: 0 }, // Default to 10 rows per page
          }, 
          columns: {
            columnVisibilityModel: {
              file_name: true,
              uploaded_on: true,
              uploaded_by: true,
              status: true,
            },
          },
        }}
        sx={{
          mt:4,
          "& .MuiDataGrid-columnHeaders": {
            color: "#827f7f",
            fontSize: "14px",
            fontWeight: "500",

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
          },            
          height:"auto"
        }}
      />

    </Box>
  );
};

export default DomesticUploadData;