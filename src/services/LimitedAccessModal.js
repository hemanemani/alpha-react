import React, { useEffect, useState } from "react";
import { Modal, Box, Button, FormControlLabel, Checkbox, Typography } from "@mui/material";

const LimitedAccessModal = ({open, onClose, onSave, selectedPages})=>{
    const pages = [
        // { key: "home", label: "Home" },
        // { key: "analytics", label: "Analytics" },
        { key: "inquiries/domestic", label: "View Domestic Inquiries" },
        { key: "inquiries/international", label: "View International Inquiries" },
        { key: "offers/domestic", label: "View Domestic Offers" },
        { key: "offers/international", label: "View International Offers" },
        { key: "cancellations/domestic", label: "View Domestic Cancellations" },
        { key: "cancellations/international", label: "View International Cancellations" },
        { key: "inquiries/domestic/modify", label: "Modify Domestic Inquiries" },
        { key: "inquiries/international/modify", label: "Modify International Inquiries" },
        // { key: "users", label: "Users" },    
    ]

    const [selected, setSelected] = useState(selectedPages || []);
    useEffect(() => {
      // Ensure the modal is initialized with previously selected pages
      setSelected(selectedPages);
    }, [selectedPages]);
  
    const handleCheckboxChange = (pageKey) => {
      setSelected((prev) =>
        prev.includes(pageKey)
          ? prev.filter((p) => p !== pageKey) // Uncheck the box
          : [...prev, pageKey] // Check the box
      );
    };
  

    return(
        <Modal open={open} onClose={onClose}>
        <Box sx={{ width: 400, backgroundColor: "white", padding: 3, margin: "auto", marginTop: "10%" }}>
          <Typography variant="h6">Select Accessible Pages</Typography>
          {pages.map((page) => (
            <FormControlLabel
              key={page.key}
              control={
                <Checkbox
                  checked={selected.includes(page.key)}
                  onChange={() => handleCheckboxChange(page.key)}
                />
              }
              label={page.label}
            />
          ))}
          <Box sx={{ marginTop: 2, display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" onClick={() => onSave(selected)}>Save</Button>
            <Button variant="outlined" onClick={onClose}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
  
    );
    
}

export default LimitedAccessModal;