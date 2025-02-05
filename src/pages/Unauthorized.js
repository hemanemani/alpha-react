import { Typography } from "@mui/material";
import React from "react";

const Unauthorized = ()=>{
    return(
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            You Don't have access to this page
        </Typography>
    )
}

export default Unauthorized;