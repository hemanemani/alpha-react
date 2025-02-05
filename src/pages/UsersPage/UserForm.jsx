import { Button, Grid, MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";
import axiosInstance from "../../services/axios";
import { useNavigate } from "react-router-dom";
import LimitedAccessModal from "../../services/LimitedAccessModal";


const UserForm = () => {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        user_name: '',
        mobile_number: '',
        access_level:'view'
    })

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPages, setSelectedPages] = useState([]);
  

    const handleChange = (e)=>{
        const newValue = e.target.value;

        setFormData({
            ...formData,
            [e.target.name] : newValue
        })
    if (newValue == "limited") {
        setModalOpen(true);
        }
    };
    
    // Handle saving selected pages
    const handleSavePages = (pages) => {
        setSelectedPages(pages);
        setModalOpen(false);
    };
      

      
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');

        if (!token) {
            console.log("User is not authenticated.");
            return;
        }
        try {
            const response = await axiosInstance.post('/users', {
                ...formData,
                allowed_pages: formData.access_level === "limited" ? selectedPages : [],

                
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
                
            });
            
            if (response) {
                navigate('/users')
            } else {
                console.error("Failed to add user", response.status);
            }
        } catch (error) {
            console.error("Error submitting error:", error);
            if (error.response && error.response.data) {
                console.error("Validation errors:", error.response.data);
            }
        }
    };
    
    return(
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    variant="outlined"
                    
                />
                </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    variant="outlined"
                    
                />
                </Grid>

                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="password"
                    name="password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
                </Grid>

                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Confirm Password"
                    name="password_confirmation"
                    value={formData.password_confirmation || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
                </Grid>

                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="User Name"
                    name="user_name"
                    value={formData.user_name || ''}
                    onChange={handleChange}
                    variant="outlined"
                    
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobile_number"
                    value={formData.mobile_number || ''}
                    onChange={handleChange}
                    variant="outlined"
                    
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                        label="Access"
                        name="access_level"
                        value={formData.access_level}
                        onChange={handleChange}
                        select
                        fullWidth
                        margin="normal"
                    >
                    <MenuItem value="full">Full Access</MenuItem>
                    <MenuItem value="view">View Access</MenuItem>
                    <MenuItem value="limited">Limited Access</MenuItem>
                 </TextField>
                 </Grid>
            </Grid>

            {/* Limited Access Modal */}
            <LimitedAccessModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSavePages}
                selectedPages={selectedPages}
            />

            {/* Display Selected Pages for Reference */}
            {formData.access_level === "limited" && (
                <div>
                <h4>Selected Pages:</h4>
                <ul>
                    {selectedPages.map((page) => (
                    <li key={page}>{page}</li>
                    ))}
                </ul>
                </div>
            )}

            <Button variant="contained" color="primary" size="small" type="submit" sx={{marginLeft:"auto",marginTop:"15px"}}>
                    Add new User
            </Button>
        </form>
    )
}

export default UserForm;