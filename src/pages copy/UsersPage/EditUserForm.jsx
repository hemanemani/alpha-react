import { Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
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
        allowed_pages: [],
        is_admin:''
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
            <Grid container spacing="30px"  sx={{padding:"50px",width:"auto",marginLeft:0}}>
            <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                Name
                </Typography>
                <TextField
                    fullWidth
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter name"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                        height: "40px",width:"75%",
                        borderRadius: "8px",
                        background: "#fff",
                        "& fieldset": {
                            borderColor: "#d6d6d6",
                        },
                        },
                        "& .MuiInputBase-input": {
                        padding: "10px",
                        fontSize: "13px",
                        color: "#181717",
                        },
                    }}
                
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Role
                </Typography>
                <TextField
                        name="is_admin"
                        value={formData.is_admin}
                        onChange={handleChange}
                        select
                        fullWidth
                        margin="normal"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                background: "#fff",
                            height: "40px",width:"75%",
                            borderRadius: "8px",
                            "& fieldset": {
                                borderColor: "#d6d6d6",
                            },
                            },
                            "& .MuiInputBase-input": {
                            padding: "10px",
                            fontSize: "13px",
                            color: "#181717",
                            },
                            marginTop:0,
                        }}
                    >
                    <MenuItem value="1" sx={{fontSize:"13px"}}>Master Admin</MenuItem>
                    <MenuItem value="0" sx={{fontSize:"13px"}}>Admin</MenuItem>
                </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    User Name
                </Typography>
                <TextField
                    fullWidth
                    name="user_name"
                    value={formData.user_name || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter username"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            background: "#fff",
                            height: "40px",width:"75%",
                            borderRadius: "8px",
                            "& fieldset": {
                            borderColor: "#d6d6d6",
                            },
                        },
                        "& .MuiInputBase-input": {
                            padding: "10px",
                            fontSize: "13px",
                            color: "#181717",
                        },
                    }}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Password
                </Typography>
                <TextField
                    fullWidth
                    name="password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter password"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            background: "#fff",
                            height: "40px",width:"75%",
                            borderRadius: "8px",
                            "& fieldset": {
                            borderColor: "#d6d6d6",
                            },
                        },
                        "& .MuiInputBase-input": {
                            padding: "10px",
                            fontSize: "13px",
                            color: "#181717",
                        },
                    }}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Password Confirmation
                </Typography>
                <TextField
                    fullWidth
                    name="password_confirmation"
                    value={formData.password_confirmation || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please confirm password"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            background: "#fff",
                            height: "40px",width:"75%",
                            borderRadius: "8px",
                            "& fieldset": {
                            borderColor: "#d6d6d6",
                            },
                        },
                        "& .MuiInputBase-input": {
                            padding: "10px",
                            fontSize: "13px",
                            color: "#181717",
                        },
                    }}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                Email
                </Typography>
                <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter email id"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            background: "#fff",
                            height: "40px",width:"75%",
                            borderRadius: "8px",
                            "& fieldset": {
                            borderColor: "#d6d6d6",
                            },
                        },
                        "& .MuiInputBase-input": {
                            padding: "10px",
                            fontSize: "13px",
                            color: "#181717",
                        },
                    }}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Phone Number
                </Typography>
                <TextField
                    fullWidth
                    name="mobile_number"
                    value={formData.mobile_number || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter phone number"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            background: "#fff",
                            height: "40px",width:"75%",
                            borderRadius: "8px",
                            "& fieldset": {
                            borderColor: "#d6d6d6",
                            },
                        },
                        "& .MuiInputBase-input": {
                            padding: "10px",
                            fontSize: "13px",
                            color: "#181717",
                        },
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Access
                </Typography>
                <TextField
                        name="access_level"
                        value={formData.access_level || ''}
                        onChange={handleChange}
                        select
                        fullWidth
                        margin="normal"
                        sx={{
                            marginTop:0,
                            "& .MuiOutlinedInput-root": {
                                background: "#fff",
                              height: "40px",width:"75%",
                              borderRadius: "8px",
                              "& fieldset": {
                                borderColor: "#d6d6d6",
                              },
                            },
                            "& .MuiInputBase-input": {
                              padding: "10px",
                              fontSize: "13px",
                              color: "#181717",
                            },
                        }}
                    >
                    <MenuItem value="full" sx={{fontSize:"13px"}}>Full Access</MenuItem>
                    <MenuItem value="view" sx={{fontSize:"13px"}}>View Access</MenuItem>
                    <MenuItem value="limited" sx={{fontSize:"13px"}}>Limited Access</MenuItem>
                 </TextField>
                 </Grid>
                <Grid item xs={12} sm={6}>
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
                            <Typography sx={{fontWeight:"600",marginBottom:1}}>
                                Accessing Pages
                            </Typography>
                            <ul>
                                {selectedPages.map((page) => (
                                <li style={{fontSize:"13px",fontWeight:"500"}} key={page}>{page}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Grid>
            </Grid>
                
                <Button variant="contained" type="submit" sx={{width:"30%",background:"#000",color:"#fff",textTransform:"capitalize",fontSize:"17px",height:"43px",borderRadius:"6px",display:"block",marginLeft:"auto",marginRight:"auto"}}>
                    Update
                </Button>
        </form>
    )
}

export default EditUserForm;