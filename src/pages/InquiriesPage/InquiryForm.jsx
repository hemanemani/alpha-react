import { Button, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const InquiryForm = () => {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        inquiry_number: '',
        mobile_number: '',
        inquiry_date: '',
        product_categories: '',
        specific_product: '',
        name: '',
        location: '',
        inquiry_through: '',
        inquiry_reference: '',
        first_contact_date: '',
        first_response: '',
        second_contact_date: '',
        second_response: '',
        third_contact_date: '',
        third_response: '',
        notes: '',
        user_id: ''
    })
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedInquiryDate = moment(formData.inquiry_date, 'YYYY-MM-DD').format('DD-MM-YYYY');
        const formattedFirstDate = moment(formData.first_contact_date, 'YYYY-MM-DD').format('DD-MM-YYYY');
        const formattedSecondDate = moment(formData.second_contact_date, 'YYYY-MM-DD').format('DD-MM-YYYY');
        const formattedThirdDate = moment(formData.third_contact_date, 'YYYY-MM-DD').format('DD-MM-YYYY');



        const token = localStorage.getItem('authToken');

        if (!token || !user) {
            console.log("User is not authenticated.");
            return;
        }
        try {
            const response = await axiosInstance.post('/inquiries', {
                ...formData,
                inquiry_date: formattedInquiryDate,
                first_contact_date: formattedFirstDate,
                second_contact_date: formattedSecondDate,
                third_contact_date : formattedThirdDate,
                user_id: user.id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response) {
                navigate('/inquiries/domestic')
            } else {
                console.error("Failed to add inquiry", response.status);
            }
        } catch (error) {
            console.error("Error submitting inquiry:", error);
            if (error.response && error.response.data) {
                console.error("Validation errors:", error.response.data);
            }
        }
    };
    
    return(
        <form onSubmit={handleSubmit}>
            <Grid container spacing="30px"  sx={{padding:"50px",width:"auto",marginLeft:0}}>
                {/* Inquiry Number */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Inquiry Number
                </Typography>
                <TextField
                    fullWidth
                    name="inquiry_number"
                    value={formData.inquiry_number || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter inquiry number"
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

                {/* Inquiry Date */}
                
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Inquiry Date
                </Typography>

                <TextField
                    fullWidth
                    type="date"
                    name="inquiry_date"
                    value={formData.inquiry_date || ''}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
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

                {/* Name */}
                <Grid item xs={12} sm={12}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Name
                </Typography>
                <TextField
                    fullWidth
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter customer name"
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

                {/* Mobile Number */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Mobile Number
                </Typography>
                <TextField
                    fullWidth
                    name="mobile_number"
                    value={formData.mobile_number || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter mobile number"
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

                {/* Location */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Location (City)
                </Typography>
                <TextField
                    fullWidth
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter city name"
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

                

                {/* Product Categories */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Product Categories
                </Typography>
                <TextField
                    fullWidth
                    name="product_categories"
                    value={formData.product_categories || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter product categories"
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

                {/* Specific Product */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Specific Product
                </Typography>
                <TextField
                    fullWidth
                    name="specific_product"
                    value={formData.specific_product || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter name of specific products"
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

            

                {/* Inquiry Through */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Inquiry Through
                </Typography>
                <TextField
                    fullWidth
                    name="inquiry_through"
                    value={formData.inquiry_through || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter inquiry through"
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

                {/* Inquiry Reference */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Inquiry Reference
                </Typography>
                <TextField
                    fullWidth
                    name="inquiry_reference"
                    value={formData.inquiry_reference || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter inquiry reference"
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

                {/* First Contact Date */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    1st Contact Date
                </Typography>
                <TextField
                    fullWidth
                    type="date"
                    name="first_contact_date"
                    value={formData.first_contact_date || ''}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
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

                {/* First Response */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    1st Response
                </Typography>
                <TextField
                    fullWidth
                    name="first_response"
                    value={formData.first_response || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter 1st response"
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

                {/* Second Contact Date */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    2nd Contact Date
                </Typography>
                <TextField
                    fullWidth
                    type="date"
                    name="second_contact_date"
                    value={formData.second_contact_date || ''}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
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

                {/* Second Response */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    2nd Contact Date
                </Typography>
                <TextField
                    fullWidth
                    name="second_response"
                    value={formData.second_response || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter 2nd response"
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

                {/* Third Contact Date */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    3rd Contact Date
                </Typography>
                <TextField
                    fullWidth
                    type="date"
                    name="third_contact_date"
                    value={formData.third_contact_date || ''}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
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

                {/* Third Response */}
                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    3rd Response
                </Typography>
                <TextField
                    fullWidth
                    name="third_response"
                    value={formData.third_response || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter 3rd response"
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

                {/* Notes */}
                <Grid item xs={12}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Notes
                </Typography>
                <TextField
                    fullWidth
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={4}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                        width:"75%",
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

                {/* User ID */}
                <Grid item xs={12}>
                    <input type="hidden" name="user_id" value={user?.id || ''} />
                </Grid>
                <Button variant="contained" type="submit" sx={{width:"30%",background:"#000",color:"#fff",textTransform:"capitalize",fontSize:"17px",height:"43px",borderRadius:"6px",display:"block",marginLeft:"auto",marginRight:"auto"}}>
                    Add inquiry
                </Button>
            </Grid>
        </form>
    )
}

export default InquiryForm;