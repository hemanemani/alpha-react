import { Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import axiosInstance from "../../services/axios";
import { IosShare } from "@mui/icons-material";

const BulkUploadInternational = () => {
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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

        try {
            const response = await axiosInstance.post('/international-inquiries/bulk-upload',formData,  {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setSuccessMessage("Upload successful!");
            } else {
                console.error("Failed to upload file", response.status);
            }

        } catch (error) {
            console.error("Error uploading file:", error);
            if (error.response && error.response.data) {
                console.error("Validation errors:", error.response.data);
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

    
    return(
        <form>
             <Button
            size="small"
            variant="outlined"
            sx={{ bgcolor: "transparent", color: "#000", borderRadius: "8px", fontSize:"13px",textTransform:"capitalize",border:"1px solid #d9d9d9",padding:"5px 12px" }}
            onClick={handleDownload}
          >
            <IosShare sx={{fontSize:"13px",marginRight:"5px"}} />Export
          </Button>
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
            {uploading && <Typography variant="body2" sx={{textAlign:"center"}}>Uploading...</Typography>}
            {successMessage && <Typography color="success" sx={{textAlign:"center"}}>{successMessage}</Typography>}

        </form>
    )
}

export default BulkUploadInternational;