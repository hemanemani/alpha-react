import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableRow, IconButton} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import axiosInstance from "../../services/axios";
import { Autorenew } from "@mui/icons-material";


const SummaryCard = ({ title, value, trend, domestic, international, isPositive }) => (
    <Card sx={{ borderRadius: 6, boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", border:"1px solid #ccc5c5", minHeight: 180, padding: 2 }}>
      <CardContent>
        {/* Title and Value on the same line, Trend below */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "end" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Typography variant="h6" sx={{color: "#7f7f7f",fontSize:"22px",fontWeight:"500"}}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color={isPositive ? "#71ad47" : "red"}
            sx={{ display: "flex", alignItems: "center", mt: 0.5,mr:1.3 }}
          >
            {isPositive ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
            {trend}
          </Typography>
        </Box>
        <Grid container mt={2}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div>
            <Typography variant="body2" sx={{color: "#7f7f7f",fontSize:"16px"}}>
              Domestic
            </Typography>                                     
            <Typography variant="body2" sx={{textAlign:"center",fontSize:"16px",fontWeight:"600"}} mt={1}>{domestic}</Typography>
            </div>
            <div>
            <Typography variant="body2" sx={{color: "#7f7f7f",fontSize:"16px"}}>
              International
            </Typography>                                  
            <Typography variant="body2" sx={{textAlign:"center",fontSize:"16px",fontWeight:"600"}} mt={1}>{international}</Typography>
            </div>
            
          </Box>
        </Grid>
      </CardContent>
    </Card>
);



const InquiryGrowthCard = ({ data }) => (
  <Card sx={{ borderRadius: 6, boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", border:"1px solid #ccc5c5", minHeight: 180, padding: 2 }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <Typography variant="h6" sx={{color: "#7f7f7f",fontSize:"22px",fontWeight:"500",mb:2}}>
          Inquiry Growth
        </Typography>
        <Typography variant="h6" sx={{color: "#7f7f7f",fontSize:"12px",fontWeight:"500",mb:2,background:"#ececec",padding: "0px 10px",border:"1px solid #dddddd"}}>
          All Time
        </Typography>
      </Box>

      {data.length > 0 ? (
        <TableContainer>
          <Table>
            <TableBody>
              {data.map((location, index) => (
                <TableRow key={index}>
                  <TableCell sx={{border:0,padding:"10px 0px",fontSize:"16px",fontWeight:"500"}}>{location.location}</TableCell>
                  <TableCell sx={{border:0,padding:"5px",fontSize:"16px",fontWeight:"500",textAlign:"center"}}>{location.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No data available
        </Typography>
      )}
    </CardContent>
  </Card>
);


const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (date) => setSelectedDate(date);
  const [refresh, setRefresh] = useState(false);

  const [dashBoardData, setdashBoardData] = useState(
    {
      topLocations: [],
    }
  );

  const fetchDashboardData = async()=>{
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("User is not authenticated.");
      return;
    }

    try {
      const response = await axiosInstance.get("/refresh", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data) {
        setdashBoardData(response.data.data)
      } else {
        console.error("Failed to fetch inquiries", response.status);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  }

  useEffect(() => {
      fetchDashboardData();
    }, [refresh]);
  

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={3} sx={{ width: "100%" }}>
        <Grid item xs={12} sx={{display:"flex",alignItems:"center",justifyContent:"end"}}>
            <Autorenew sx={{fontSize:"15px",marginRight:"3px"}} />
            <Typography sx={{fontSize:"12px",marginRight:"6px",fontWeight:"bold",cursor:"pointer"}} onClick={() => setRefresh(prev => !prev)}>Refresh All</Typography>
        </Grid>

        {/* First Row: Inquiries, Offers */}
        <Grid item xs={12} sm={12} lg={8} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} lg={6} md={6}>
            <SummaryCard
                title="Inquiries"
                value={ 
                  (dashBoardData?.inquiry?.count || 0) + (dashBoardData?.interInquiry?.count || 0)
                }
                trend={dashBoardData?.inquiry?.dateRanges?.yesterday || 0}
                domestic={dashBoardData?.inquiry?.count || 0}
                international={dashBoardData?.interInquiry?.count || 0}
                isPositive={true}
                />


            </Grid>
            <Grid item xs={12} sm={12} lg={6} md={6}>
              <SummaryCard
                title="Offers"
                value={ 
                  (dashBoardData?.inquiry?.offers || 0) + (dashBoardData?.interInquiry?.offers || 0)
                }
                trend={dashBoardData?.inquiry?.offerDateRanges?.yesterday || 0}
                domestic={dashBoardData?.inquiry?.offers || 0}
                international={dashBoardData?.interInquiry?.offers || 0}
                isPositive={true}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={6} md={6}>
              <SummaryCard
                title="Orders Completed"
                value="120"
                trend="+2"
                domestic="115"
                international="5"
                isPositive={true}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={6} md={6}>
              <SummaryCard
                title="Canceled Inquiries"
                value={ 
                  (dashBoardData?.inquiry?.cancellations || 0) + (dashBoardData?.interInquiry?.cancellations || 0)
                }
                trend={dashBoardData?.inquiry?.cancelDateRanges?.yesterday || 0}
                domestic={dashBoardData?.inquiry?.cancellations || 0}
                international={dashBoardData?.interInquiry?.cancellations || 0}
                isPositive={true}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Second Row: Date Calendar and Inquiry Growth */}
        <Grid item xs={12} sm={12} lg={4} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 6, boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", border:"1px solid #ccc5c5", minHeight: 180}}>

                <CardContent sx={{ display: "flex", justifyContent: "center",padding:0 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} sx={{paddingBottom:0}}>
                    <DateCalendar
                      selected={selectedDate}
                      onChange={handleDateChange}
                      style={{ display: "inline" }}
                      sx={{
                        "& .MuiTypography-root": { fontSize: "1rem",color:"#8c849e" }, // Increase font size of text
                        "& .MuiPickersDay-root": { fontSize: "1rem" }, // Increase font size of days
                        "& .MuiPickersToolbar-root": { fontSize: "1rem" }, // Increase header font size
                      }}
                      className="card-calender"
                    />
                  </LocalizationProvider>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <InquiryGrowthCard data={dashBoardData?.topLocations} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
