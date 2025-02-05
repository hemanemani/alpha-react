import { Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";

const EditInquiryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
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

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (id) {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.log("No token found in localStorage");
                return;
              }
            const fetchItem = async () => {
                try {
                    const response = await axiosInstance.get(`inquiries/${id}`,{
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    setFormData(response.data.inquiry);
                } catch (error) {
                    console.error('Error fetching item:', error);
                }
            };
            fetchItem();
        }
    }, [id]);

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
        const formattedSecondDate = formData.second_contact_date ? moment(formData.second_contact_date, 'YYYY-MM-DD').format('DD-MM-YYYY'): '';
        const formattedThirdDate = formData.third_contact_date ? moment(formData.third_contact_date, 'YYYY-MM-DD').format('DD-MM-YYYY'): '';
        const token = localStorage.getItem('authToken');

        if (!token || !user) {
            console.log("User is not authenticated.");
            return;
        }
        try {
            const url = id ? `inquiries/${id}` : 'inquiries';  // Determine the URL for PUT or POST
            const method = id ? 'put' : 'post';  // Use PUT if id exists, otherwise POST
                
                const response = await axiosInstance({
                    method: method,
                    url: url,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    data: {
                        ...formData,
                        inquiry_date: formattedInquiryDate,
                        first_contact_date: formattedFirstDate,
                        second_contact_date: formattedSecondDate,
                        third_contact_date : formattedThirdDate,
                        user_id: user.id
                    }
                });
                if (response) {
                    navigate('/inquiries/domestic')
                } else {
                    console.error(`${id ? "Failed to edit" : "Failed to add"} inquiry`, response.status);
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
            <Grid container spacing={3}>
                {/* Inquiry Number */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Inquiry Number"
                    name="inquiry_number"
                    value={formData.inquiry_number || ''}
                    onChange={handleChange}
                    variant="outlined"
                    
                />
                </Grid>

                {/* Mobile Number */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobile_number"
                    value={formData?.mobile_number || ''}
                    onChange={handleChange}
                    variant="outlined"
                    
                />
                </Grid>

                {/* Inquiry Date */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Inquiry Date"
                    type="date"
                    name="inquiry_date"
                    value={formData.inquiry_date || ''}
                    onChange={handleChange}
                    variant="outlined"
                    
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                </Grid>

                {/* Product Categories */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Product Categories"
                    name="product_categories"
                    value={formData.product_categories || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
                </Grid>

                {/* Specific Product */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Specific Product"
                    name="specific_product"
                    value={formData.specific_product || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
                </Grid>

                {/* Name */}
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

                {/* Location */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
                </Grid>

                {/* Inquiry Through */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Inquiry Through"
                    name="inquiry_through"
                    value={formData.inquiry_through || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
                </Grid>

                {/* Inquiry Reference */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Inquiry Reference"
                    name="inquiry_reference"
                    value={formData.inquiry_reference || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
                </Grid>

                {/* First Contact Date */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="First Contact Date"
                    type="date"
                    name="first_contact_date"
                    value={formData.first_contact_date || ''}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                </Grid>

                {/* First Response */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="First Response"
                    name="first_response"
                    value={formData.first_response || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
                </Grid>

                {/* Second Contact Date */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Second Contact Date"
                    type="date"
                    name="second_contact_date"
                    value={formData.second_contact_date || ''}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                </Grid>

                {/* Second Response */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Second Response"
                    name="second_response"
                    value={formData.second_response || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
                </Grid>

                {/* Third Contact Date */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Third Contact Date"
                    type="date"
                    name="third_contact_date"
                    value={formData.third_contact_date || ''}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                </Grid>

                {/* Third Response */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Third Response"
                    name="third_response"
                    value={formData.third_response || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={4}
                />
                </Grid>

                {/* User ID */}
                <Grid item xs={12}>
                    <input type="hidden" name="user_id" value={user?.id || ''} />
                </Grid>
                <Button variant="contained" color="primary" size="small" type="submit" sx={{marginLeft:"auto"}}>
                    Edit inquiry
                </Button>
            </Grid>
        </form>
    )
}

export default EditInquiryForm;