import { Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
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
        access_level:'view',
        is_admin:''
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
                        value={formData.access_level}
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
                    <h4>Selected Pages:</h4>
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
                    Create User
            </Button>

        </form>
    )
}

export default UserForm;