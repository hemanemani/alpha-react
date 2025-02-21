import { Button, Grid, Typography,Box,Stack,Chip, LinearProgress, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import DomesticUploadData from "./DomesticUploadData";
import { FolderOpen, IosShare, UploadFile } from "@mui/icons-material";
import { Close } from "@mui/icons-material";

const BulkUploadDomestic = () => {
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [errorMessages,setErrorMessages] = useState([]);
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);


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

      

      useEffect(() => {
        if (uploading) {
          const interval = setInterval(() => {
            setProgress((oldProgress) => {
              if (oldProgress >= 100) {
                clearInterval(interval);
                setUploading(false);
                return 100;
              }
              return oldProgress + 10;
            });
          }, 300);
          
          return () => clearInterval(interval);
        }
      }, [uploading]);
    
      
    
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
              console.log(response)
                setSuccessMessage(`file ${response.data.file_name} ${response.data.status}`); 
                await fetchInquiryData(); 
            } 
            // else {
            //     setSuccessMessage("Upload failed.");
            // }

        } catch (error) {
            console.error("Error uploading file:", error);
            // setSuccessMessage("Upload failed.");
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
            setSelectedFile(file);  // Store the selected file
            handleFileUpload(file); // Auto-upload when a file is selected
            setProgress(0);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);  // Store the selected file
            handleFileUpload(file);
            setProgress(0);

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
            sx={{ bgcolor: "transparent", color: "#000", borderRadius: "8px", fontSize:"13px",textTransform:"capitalize",border:"1px solid #d9d9d9",padding:"5px 12px", display:"block", marginLeft:"auto" }}
            onClick={handleDownload}
          >
            <IosShare sx={{fontSize:"13px",marginRight:"5px"}} />Export
          </Button>
        <form>
              <Grid style={{margin:"30px 15px"}}>
                <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={handleDrop} 
                    style={{
                        border: "3px dashed #ccc", 
                        padding: "20px", 
                        textAlign: "center",
                        cursor: "pointer",
                        borderRadius:"15px"
                    }}
                    
                >
                  {errorMessages.length > 0 ? (
                    <Box sx={{ p: 2, backgroundColor: "transparent" }}>
                      <Grid container direction="row">
                          <Grid item xs={9} sx={{height:"130px",overflow:"auto"}}>
                            <Stack spacing={1} direction="row" flexWrap="wrap">
                                {errorMessages.map((error, index) => (
                                  <Chip
                                    key={index}
                                    label={`Row ${error.row}: ${error.errors.join(", ")}`}
                                    sx={{
                                      backgroundColor: "red",
                                      color: "white",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                      padding: "7px 15px",
                                      borderRadius: "15px",
                                      margin:"10px !important"
                                    }}
                                  />
                                ))}
                            </Stack>
                          </Grid>
                          <Grid item xs={3} sx={{display:"block",marginTop:"auto",textAlign:"right"}}>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ bgcolor: "#000", color: "#fff", borderRadius: "8px", fontSize:"13px",textTransform:"capitalize",border:"1px solid #d9d9d9",padding:"4px 25px" ,cursor:"pointer"}}
                            onClick={() => {setErrorMessages([]);setProgress(0);}}
                          >Retry
                          </Button>  
                          </Grid>
                      </Grid>
                      
                    </Box>
                    ) : (
                      <>
                      {uploading ? (
                        <Stack spacing={1} sx={{ width: "100%", textAlign: "center",position: "relative" }}>
                          <IconButton 
                              sx={{ 
                                position: "absolute", 
                                top: 0, 
                                right: 0, 
                              }} 
                              onClick={() => {
                                setUploading(false); 
                                setSelectedFile(null); 
                                setProgress(0);
                              }}
                            >
                              <Close sx={{cursor:"pointer",background:"#fc573b",color:"#fff",fontSize:"16px",borderRadius:"50%",padding:"2px"}} />
                          </IconButton>
                          

                          <Grid container direction="row" alignItems="center">
                            <FolderOpen fontSize="medium" sx={{ marginRight: "10px" }} />
                            <Typography variant="body2" fontWeight="500">
                              {selectedFile.name}
                            </Typography>
                              <Grid container direction="column" alignItems="center">
                              <Typography variant="caption" color="gray" sx={{display:"block",marginRight:"auto"}}>
                                ({(selectedFile.size / 1024).toFixed(2)} KB)
                              </Typography>
                              </Grid>
                          </Grid>

                          <LinearProgress variant="determinate" value={progress} sx={{ 
                            height: 8, 
                            borderRadius: 4,                      
                            transition: "width 0.5s ease-in-out",
                            backgroundColor: "#c6c6c6",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#000",
                            },
                         }}
                          />
                          <Typography variant="body2">{progress}% Uploaded</Typography>
                        </Stack>
                      ) : (
                        <Box sx={{padding:"25px",textAlign: "center", position: "relative"}}>
                        <UploadFile sx={{fontSize:"35px",marginBottom:"10px"}} />
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1,fontSize:"15px" }}>
                          <span style={{textDecoration:"underline"}}>Click to upload </span>or drag and drop
                        </Typography>
                        <Typography variant="body2" sx={{fontSize:"13px",fontWeight:"500",color:"#848091"}}>
                          Maximum file size 1MB, Only CSV format
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
                          <Grid container direction="row" sx={{justifyContent:"end"}}> 
                            {successMessage && <Typography color="success" sx={{backgroundColor:"#4bb543",color:"#fff",padding:"4px 8px",fontSize:"12px",borderRadius:"20px",fontWeight:"500"}}>{successMessage}</Typography>}
                          </Grid>
                        </Box>
                      )}
                      </>
                    )}
                  
                </Grid>
              </Grid>            
        </form>
        <DomesticUploadData rows={rows} setRows={setRows} filteredRows={filteredRows} setFilteredRows={setFilteredRows} />
        </>
    )
}

export default BulkUploadDomestic;