import { Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import axiosInstance from "../../services/axios";


const BulkUploadDomestic = () => {
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    
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
            const response = await axiosInstance.post('/inquiries/bulk-upload',formData,  {
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

export default BulkUploadDomestic;