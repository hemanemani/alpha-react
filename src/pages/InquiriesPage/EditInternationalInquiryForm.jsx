import { Button, Grid, MenuItem, TextField,Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { Block, ZoomOutMap } from "@mui/icons-material";


const EditInternationalInquiryForm = () => {
    const navigate = useNavigate()
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
        user_id: '',
        status:''
    });
    const [offerData,setOfferData] = useState({
        offer_number: '',
        communication_date: '',
        received_sample_amount: '',
        sample_dispatched_date: '',
        sample_sent_through: '',
        sample_received_date: '',
        offer_notes: '',
        international_inquiry_id: '',
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
                    const response = await axiosInstance.get(`international-inquiries/${id}/with-offers`,{
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    setFormData(response.data.international_inquiry);
                    if (response.data.international_offers.length > 0) {
                        setOfferData(response.data.international_offers[0]); // Select the first offer
                    }
                    
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
        setOfferData({
            ...offerData,
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
            const url = id ? `international_inquiries/${id}` : 'international_inquiries';  // Determine the URL for PUT or POST
            const method = id ? 'put' : 'post';  // Use PUT if id exists, otherwise POST
            const requestData = {
                ...formData,
                inquiry_date: formattedInquiryDate,
                first_contact_date: formattedFirstDate,
                second_contact_date: formattedSecondDate,
                third_contact_date: formattedThirdDate,
                user_id: user.id,
            };

            // Include offer data only if status === 1
            if (formData.status === 1) {
                requestData.offer_data = {
                    offer_number: offerData.offer_number,
                    communication_date: offerData.communication_date || null,
                    received_sample_amount: offerData.received_sample_amount || null,
                    sample_dispatched_date: offerData.sample_dispatched_date || null,
                    sample_sent_through: offerData.sample_sent_through || null,
                    sample_received_date: offerData.sample_received_date || null,
                    offer_notes: offerData.offer_notes || null,
                };
            }
            const response = await axiosInstance({
                method: method,
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                data: requestData
            });

            if (response) {
                navigate(formData.status === 1 ? '/offers/international' : '/inquiries/international');
            }else {
                console.error(`${id ? "Failed to edit" : "Failed to add"} international inquiry`, response.status);
            }            
        } catch (error) {
            console.error("Error updating international inquiry:", error);
            if (error.response && error.response.data) {
                console.error("Validation errors:", error.response.data);
            }
        }
    };
    
    return(
        <form onSubmit={handleSubmit}>
            <Grid container spacing="30px"  sx={{padding:"50px",width:"auto",marginLeft:0}}>
                {(formData.status === 1) ? 
                <>
                <Grid item xs={12} sm={12}>
                <Typography variant="h6" fontWeight="500">
                    Add Offers
                </Typography> 
                </Grid>
                    
                <Grid item xs={12} sm={6}>
                    <Typography sx={{fontWeight:"600",marginBottom:1}}>
                        Offer Number
                    </Typography>
                    <TextField
                    fullWidth
                    name="offer_number"
                    value={offerData.offer_number || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter offer number"
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
                        Communication Date
                    </Typography>

                    <TextField
                    fullWidth
                    type="date"
                    name="communication_date"
                    value={offerData.communication_date || ''}
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

                <Grid item xs={12} sm={6}>
                    <Typography sx={{fontWeight:"600",marginBottom:1}}>
                        Received Sample Amount (in Rs.)
                    </Typography>
                    <TextField
                    fullWidth
                    name="received_sample_amount"
                    value={offerData.received_sample_amount || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter sample amount"
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
                        Sample Dispatched Date
                    </Typography>

                    <TextField
                    fullWidth
                    type="date"
                    name="sample_dispatched_date"
                    value={offerData.sample_dispatched_date || ''}
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

                <Grid item xs={12} sm={6}>
                    <Typography sx={{fontWeight:"600",marginBottom:1}}>
                        Sample Sent through
                    </Typography>
                    <TextField
                    fullWidth
                    name="sample_sent_through"
                    value={offerData.sample_sent_through || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Please enter sample sent through"
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
                        Sample Received Date
                    </Typography>

                    <TextField
                    fullWidth
                    type="date"
                    name="sample_received_date"
                    value={offerData.sample_received_date || ''}
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

                {/* Notes */}
                <Grid item xs={12}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Offer Notes
                </Typography>
                <TextField
                    fullWidth
                    name="offer_notes"
                    value={offerData.offer_notes || ''}
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

                </>
                
                : '' }
                

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

                <Grid item xs={12} sm={6}>
                <Typography sx={{fontWeight:"600",marginBottom:1}}>
                    Status
                </Typography>
                <TextField
                        name="status"
                        value={formData.status ?? ""}
                        onChange={handleChange}
                        select
                        fullWidth
                        margin="normal"
                        SelectProps={{
                            displayEmpty: true,
                            MenuProps: {
                              PaperProps: {
                                sx: {
                                  boxShadow: "none",
                                  border: "1px solid #d6d6d6",
                                  borderRadius:"15px"
                                },
                              },
                            },
                          }}
                        
                        sx={{
                            marginTop:0,
                            color:"#000",
                                                     
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
                    <MenuItem value="2" sx={{ fontSize: "14px", fontWeight: "500",borderBottom:"1px solid #d9d9d9"  }}>Select Status</MenuItem>

                    <MenuItem value="1" sx={{fontSize:"14px",fontWeight:"500",borderBottom:"1px solid #d9d9d9" }}><ZoomOutMap sx={{fontSize:"14px",marginRight:"5px"}} /> Move to Offers</MenuItem>
                    <MenuItem value="0" sx={{fontSize:"14px",fontWeight:"500" }}><Block sx={{fontSize:"14px",marginRight:"5px"}} />Cancel</MenuItem>
                 </TextField>
                 </Grid>

                {/* User ID */}
                <Grid item xs={12}>
                    <input type="hidden" name="user_id" value={user?.id || ''} />
                </Grid>
                <Button variant="contained" type="submit" sx={{width:"30%",background:"#000",color:"#fff",textTransform:"capitalize",fontSize:"17px",height:"43px",borderRadius:"6px",display:"block",marginLeft:"auto",marginRight:"auto",marginTop:"100px"}}>
                    Update
                </Button>
            </Grid>
        </form>
    )
}

export default EditInternationalInquiryForm;