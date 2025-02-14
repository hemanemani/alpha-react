import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import DomesticCancellations from './DomesticCancellations';
import InternationalCancellations from './InternationalCancellations';


// TabPanel component to render the content for each tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function CancellationTab() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ height: 500, width: "100%"}}>
      {/* Tabs component */}
      <Tabs 
      value={value} 
      onChange={handleChange}
      aria-label="basic tabs"
      sx={{
        "& .MuiTab-root": { color: "#827f7f", }, // Default color for tabs
        "& .Mui-selected": { color: "black !important" }, // Active tab color
        "& .MuiTabs-indicator": { backgroundColor: "#000 !important" }, // Indicator color
      }}
      >
        <Tab label="Domestic" id="tab-0" sx={{fontWeight: "500",fontSize:"14px",textTransform:"capitalize",minWidth:"64px"}} />
        <Tab label="International" id="tab-1" sx={{fontWeight: "500",fontSize:"14px",textTransform:"capitalize",minWidth:"64px"}}  />
      </Tabs>

      {/* TabPanel Components */}
      <TabPanel value={value} index={0}>
        <DomesticCancellations />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <InternationalCancellations />
      </TabPanel>
    </Box>
  );
}
