import React, { useEffect, useState } from "react";
import { Modal, Box, Button, FormControlLabel, Checkbox, Typography, Grid } from "@mui/material";
import { Close } from "@mui/icons-material";

const LimitedAccessModal = ({open, onClose, onSave, selectedPages})=>{
    // const pages = [
    //     // { key: "home", label: "Home" },
    //     // { key: "analytics", label: "Analytics" },
    //     { key: "inquiries/domestic", label: "View Domestic Inquiries" },
    //     { key: "inquiries/international", label: "View International Inquiries" },
    //     { key: "offers/domestic", label: "View Domestic Offers" },
    //     { key: "offers/international", label: "View International Offers" },
    //     { key: "cancellations/domestic", label: "View Domestic Cancellations" },
    //     { key: "cancellations/international", label: "View International Cancellations" },
    //     { key: "inquiries/domestic/modify", label: "Modify Domestic Inquiries" },
    //     { key: "inquiries/international/modify", label: "Modify International Inquiries" },
    //     // { key: "users", label: "Users" },    
    // ]

    const tableData = [
            {
              action: 'Inquiries',
              items: [
                { name: 'Domestic Inquiries', 
                  view: {key: "inquiries/domestic", label: "View Domestic Inquiries"}, 
                  modify:{key: "inquiries/domestic/modify", label: "Modify Domestic Inquiries"} 
                },
                { name: 'International Inquiries', 
                  view: {key: "inquiries/international", label: "View international Inquiries"},
                  modify: {key: "inquiries/international/modify", label: "Modify international Inquiries"} 
                },
              ],
            },
            {
              action: 'Offers',
              items: [
                { name: 'Domestic Offers', 
                  view: {key: "offers/domestic", label: "View Domestic Offers"},
                  modify:{key: "inquiries/domestic/modify", label: "Modify Domestic Inquiries"} 

                },
                { name: 'International Offers', 
                  view: {key: "offers/international", label: "View International Offers"},
                  modify: {key: "inquiries/international/modify", label: "Modify international Inquiries"} 
                 },
              ],
            },
          ];

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
        <Box sx={{ width: 640, backgroundColor: "white", padding: 3, margin: "auto", marginTop: "3%",borderRadius:"25px",border:"2px solid #d3cece", "&:focus-visible": {border: "none",outline: "none"},
}}>
          <Grid sx={{display:"flex",alignItems:"center",justifyContent:"space-between"}} >
          <Typography variant="h5" sx={{fontWeight:"600"}}>User Permissions</Typography>
          <div style={{background:"#ffe6e2",padding:"6px",height:"30px",borderRadius:"5px"}}>
            <Close sx={{cursor:"pointer",background:"#fc573b",color:"#fff",fontSize:"16px",borderRadius:"50%",padding:"2px"}} onClick={onClose} />
          </div>
          </Grid>
          <table className="table" style={{width:"100%", marginTop:"25px"}}>
            <thead>
              <tr style={{color:"#84807f",fontSize:"14px"}}>
                <th style={{width:"50%",textAlign:"left",fontWeight:"500",height:'30px'}}>Actions</th>
                <th style={{width:"25%",fontWeight:"500",height:'30px'}}>View</th>
                <th style={{width:"25%",fontWeight:"500",height:'30px'}}>Modify</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((action) => (
                <React.Fragment key={action.action}>
                  <tr>
                    <td colSpan="3" className="action-header" style={{fontSize:"14px",color:"#000",fontWeight:"500",border:"2px solid #e3e3e3",borderBottom:"2px solid #e3e3e3",background:"#f2f2f2",padding:'3px'}}>
                      {action.action}
                    </td>
                  </tr>
                  {action.items.map((item) => (
                    <tr key={item.name}>
                      <td style={{fontSize:"13px",color:"#000",fontWeight:"500",padding:"5px 0",lineHeight:1}}>{item.name}</td>
                      <td style={{textAlign:"center"}}>
                        <input
                          type="checkbox"
                          checked={selected.includes(item.view.key)}
                          onChange={() => handleCheckboxChange(item.view.key)}
                          style={{
                            width: "18px",
                            height: "18px",
                            accentColor: "#000",
                          }}
                        />
                      </td>
                      <td style={{textAlign:"center"}}>
                        <input
                          type="checkbox"
                          checked={selected.includes(item.modify.key)}
                          onChange={() => handleCheckboxChange(item.modify.key)}
                          style={{
                            width: "18px",
                            height: "18px",
                            accentColor: "#000",
                          }}
                        
                        />

                      </td>
                    </tr>
                  ))}
                </React.Fragment>
                ))}
            </tbody>
          </table>


          {/* {pages.map((page) => (
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
          ))} */}
          

          <Button variant="contained" onClick={() => onSave(selected)} sx={{width:"65%",background:"#000",color:"#fff",textTransform:"capitalize",fontSize:"15px",height:"40px",borderRadius:"6px",display:"block",marginLeft:"auto",marginRight:"auto",marginTop:"150px"}}>
          Update Permission
          </Button>
        </Box>
      </Modal>
  
    );
    
}

export default LimitedAccessModal;