import { Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import DomesticUploadData from "./DomesticUploadData";
import { IosShare } from "@mui/icons-material";

const BulkUploadDomestic = () => {
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [errorMessages,setErrorMessages] = useState([]);

    const fetchInquiryData = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.log("User is not authenticated.");
          return;
        }
    
        try {
          const response = await axiosInstance.get("/bulk-domestic-data", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (response && response.data) {
            const processedData = response.data.map((item) => ({
              ...item,
              uploaded_by: item.user?.name || 'Unknown'
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
      
    
    const handleFileUpload = async (file) => {
        if (!file) return;

        const token = localStorage.getItem('authToken');

        if (!token) {
            console.log("User is not authenticated.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        setUploading(true); 
        setSuccessMessage(""); 
        setErrorMessages([]);
        try {
            const response = await axiosInstance.post('/inquiries/bulk-upload',formData,  {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setSuccessMessage(response.data.status); 
                await fetchInquiryData(); 
            } else {
                setSuccessMessage("Upload failed.");
            }

        } catch (error) {
            console.error("Error uploading file:", error);
            setSuccessMessage("Upload failed.");
            if (error.response && error.response.data.errors) {
                setErrorMessages(error.response.data.errors);
            }    
        } finally {
            setUploading(false);
        }

    };
    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file); // Auto-upload when a file is selected
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

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

    
    return(
        <>
         <Button
            size="small"
            variant="outlined"
            sx={{ bgcolor: "transparent", color: "#000", borderRadius: "8px", fontSize:"13px",textTransform:"capitalize",border:"1px solid #d9d9d9",padding:"5px 12px" }}
            onClick={handleDownload}
          >
            <IosShare sx={{fontSize:"13px",marginRight:"5px"}} />Export
          </Button>
        <form>
            <Grid container spacing={3} style={{justifyContent:"center",marginTop:"15px"}}>
           
                <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={handleDrop} 
                    style={{
                        border: "2px dashed #ccc", 
                        padding: "20px", 
                        textAlign: "center",
                        cursor: "pointer"
                    }}
                >
                    <Typography variant="body1">
                        Drag & drop file here, or click to select
                    </Typography>
                    
                    <input
                        type="file"
                        onChange={handleChange}
                        style={{
                            marginTop: "10px",
                            display: "block",
                            opacity: 0,
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            left: 0,
                            top: 0,
                            cursor: "pointer"
                        }}
                    />
                </Grid>
            </Grid>
            {errorMessages.length > 0 && (
                <div className="error-container">
                    <h4>Validation Errors:</h4>
                    <ul>
                        {errorMessages.map((error, index) => (
                            <li key={index}>
                                Row {error.row}: {error.errors.join(", ")}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {uploading && <Typography variant="body2" sx={{textAlign:"center"}}>Uploading...</Typography>}
            {successMessage && <Typography color="success" sx={{textAlign:"center"}}>{successMessage}</Typography>}
            
        </form>
        <DomesticUploadData rows={rows} setRows={setRows} filteredRows={filteredRows} setFilteredRows={setFilteredRows} />
        </>
    )
}

export default BulkUploadDomestic;