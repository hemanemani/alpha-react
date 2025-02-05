import { Button, Grid, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { useNavigate, useParams } from "react-router-dom";
import LimitedAccessModal from "../../services/LimitedAccessModal";


const EditUserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData,setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        user_name: '',
        mobile_number: '',
        access_level:'view',
        allowed_pages: []

    })

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPages, setSelectedPages] = useState([]);

    useEffect(() => {
        if (formData.access_level === "limited") {
            setSelectedPages(formData.allowed_pages || []);
            setModalOpen(true);
        }
    }, [formData.access_level]);


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
    
    

    useEffect(() => {
        if (id) {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.log("No token found in localStorage");
                return;
              }
            const fetchItem = async () => {
                try {
                    const response = await axiosInstance.get(`users/${id}`,{
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    setFormData(response.data.user);
                    if (response.data.user.access_level === "limited") {
                        setSelectedPages(response.data.user.allowed_pages || []);
                    }
    
                } catch (error) {
                    console.error('Error fetching item:', error);
                }
            };
            fetchItem();
        }
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');

        if (!token) {
            console.log("User is not authenticated.");
            return;
        }

        try {
            const url = id ? `users/${id}` : 'users';  // Determine the URL for PUT or POST
            const method = id ? 'put' : 'post';  // Use PUT if id exists, otherwise POST
                
                const response = await axiosInstance({
                    method: method,
                    url: url,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    data: {
                        ...formData,
                        allowed_pages: selectedPages,

                    }
                });

                if (response) {
                    navigate('/users')
                } else {
                    console.error(`${id ? "Failed to edit" : "Failed to add"} user`, response.status);
                }  
        } catch (error) {
            console.error("Error submitting user:", error);
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
                        value={formData.access_level || ''}
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
                    Edit User
                </Button>
        </form>
    )
}

export default EditUserForm;