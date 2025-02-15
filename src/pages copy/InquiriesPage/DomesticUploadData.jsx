import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../../services/axios";
import { Link, useNavigate } from "react-router-dom";
import { Delete, Download } from "@mui/icons-material";

const DomesticUploadData = ({rows, setRows , filteredRows,setFilteredRows}) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [density, setDensity] = useState(localStorage.getItem("dataGridDensity") || "standard");


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

  const handleDensityChange = (newDensity) => {
    setDensity(newDensity);
    localStorage.setItem("dataGridDensity", newDensity);
  };

  const columns = [
    { field: "file_name", headerName: "Name", width: 100 },
    { field: "uploaded_at", headerName: "Date Uploaded", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "uploaded_by", headerName: "Uploaded By", width: 150},
    { field: "file_size", headerName: "File Size", width: 150},

    {
      field: "actionButtons",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Grid container spacing={1}>
          <Grid item>
            <Download onClick={() => handleDownload(params.row.file_path)} style={{ cursor: "pointer" }} />
          </Grid>
          
          <Grid item>
            <Delete onClick={() => handleDelete(params.row.id)} style={{ cursor: "pointer" }} />
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
        file_name: true,
        uploaded_on: true,
        uploaded_by: true,
        file_size: true,
        status: true,
      },
    },
  }}
/>

    </Box>
  );
};

export default DomesticUploadData;