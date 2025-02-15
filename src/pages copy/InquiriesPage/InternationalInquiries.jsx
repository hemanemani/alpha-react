import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography, TextField, InputAdornment, MenuItem, Avatar, IconButton, Menu } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../../services/axios";
import { Link, useNavigate } from "react-router-dom";
import { Block, Edit, IosShare, MoreHoriz, ZoomOutMap } from "@mui/icons-material";


const InternationalInquiries = () => {

  const navigate = useNavigate()
  const [rows, setRows] = useState([]);
   const [searchText, setSearchText] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
  
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
    };

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

  useEffect(()=>{
    fetchInternationalInquiryData(); 
  },[]);

 

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

  // handle update status

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        console.log("User is not authenticated.");
        return;
      }
  
      const response = await axiosInstance.patch(`/international-inquiries/${id}/update-international-inquiry-status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        console.log(response.data.message);

        await fetchInternationalInquiryData(); 

    }
    } catch (error) {
        console.error("Error updating status:", error);
    }

  };
  
  const handleOffers = (id) => handleUpdateStatus(id, 1);
  const handleCancel = (id) => handleUpdateStatus(id, 0);

  const columns = [
    { field: "inquiry_number", headerName: "Inq. No.", width: 70,renderHeader: () => (
      <span>
        Inquiry <br /> Number
      </span>
    ) },
    { field: "inquiry_date", headerName: "Inq. Date", width: 150,renderHeader: () => (
      <span>
        Inquiry <br /> Date
      </span>
    )},
    { field: "specific_product", headerName: "Specific Products", width: 100,renderHeader: () => (
      <span>
        Specific <br /> Products
      </span>
    )},
    { field: "product_categories", headerName: "Product Categories", width: 100,renderHeader: () => (
      <span>
        Product <br /> Categ.
      </span>
    )},
    { field: "name", headerName: "Name", width: 100 },
    { field: "location", headerName: "Location (City)", width: 150,renderHeader: () => (
      <span>
        Location <br /> (City)
      </span>
    )},
    { field: "first_contact_date", headerName: "1st Contact Date", width: 150,renderHeader: () => (
      <span>
        1st Contact <br /> Date
      </span>
    ) },
    { field: "second_contact_date", headerName: "2nd Contact Date", width: 150,renderHeader: () => (
      <span>
        2nd Contact <br /> Date
      </span>
    ) },
    { field: "third_contact_date", headerName: "3rd Contact Date", width: 150,renderHeader: () => (
      <span>
        3rd Contact <br /> Date
      </span>
    ) },
    { field: "notes", headerName: "Notes", width: 100 },
    { field: "actionButtons", headerName: "", width: 100, 
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
              <MenuItem sx={{fontSize:"14px",color:"#000",fontWeight:"500"}} onClick={() => handleEdit(params.row.id)} >
                <Edit 
                    style={{ cursor: 'pointer',fontSize:"16px",color:"#565656",marginRight:"8px" }}
                /> Edit Inquiry
              </MenuItem>
              <MenuItem sx={{fontSize:"14px",color:"#000",fontWeight:"500"}} onClick={() => handleOffers(params.row.id)} 
              >
                <ZoomOutMap 
                    style={{ cursor: 'pointer',fontSize:"16px",color:"#565656",marginRight:"8px" }}
                />Move to Offers
              </MenuItem>
              <MenuItem sx={{fontSize:"14px",color:"#000",fontWeight:"500"}} onClick={() => handleCancel(params.row.id)} 
              >
                <Block 
                    style={{ cursor: 'pointer',fontSize:"16px",color:"#565656",marginRight:"8px" }}
                />Cancel
              </MenuItem>
            </Menu>
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
    <Box sx={{ height: 500, width: "100%", p: 2}}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
      <Typography gutterBottom sx={{ fontSize: '14px', fontWeight: 'bold', textDecoration: 'underline' }}>
          View Analytics
      </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link to="/inquiries/international/new-international-inquiry">
            <Button variant="contained" sx={{ bgcolor: "black", color: "white", borderRadius: "8px",fontSize:"13px",padding:"5px 12px",textTransform:"capitalize" }}>
              + Add New Inquiry
            </Button>
          </Link>
          <Link to="/inquiries/international/upload">
            <Button size="small" variant="outlined" sx={{ bgcolor: "transparent", color: "#000", borderRadius: "8px", padding:"5px 12px",fontSize:"13px",textTransform:"capitalize",border:"1px solid #d9d9d9" }}>
              + Bulk Upload
            </Button>
          </Link>
          <Button
            size="small"
            variant="outlined"
            sx={{ bgcolor: "transparent", color: "#000", borderRadius: "8px", fontSize:"13px",textTransform:"capitalize",border:"1px solid #d9d9d9",padding:"5px 12px" }}
          >
            <IosShare sx={{fontSize:"13px",marginRight:"5px"}} />Export
          </Button>
        </Box>
      </Box>

      {/* SEARCH BAR */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2,mt:4,mr:"10%" }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search inquiries..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            width: "250px",
            bgcolor: "white",
          }}
          InputProps={{
            sx:{
              borderRadius: "8px",
              fontSize:"13px",
              border:"1px solid #d9d9d9",
              paddingRight:"0"
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
        <Typography sx={{color:'#817f89',fontWeight:"500",fontSize:"13px"}}>Total : {rows.length} </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
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
              paginationModel: { pageSize: 10, page: 0 }, // Default to 10 rows per page
            }, 
            columns: {
              columnVisibilityModel: {
                id: true,
                inquiry_number: true,
                inquiry_date: true,
                specific_product: true,
                product_categories: true,
                name: true,
                location: true,
                first_contact_date: true,
                second_contact_date	: true,
                third_contact_date: true,
                notes: true,
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

export default InternationalInquiries;
