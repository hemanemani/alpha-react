import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Divider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import axiosInstance from "../../services/axios";


const SummaryCard = ({ title, value, trend, domestic, international, isPositive }) => (

  <Card sx={{ borderRadius: 3, boxShadow: 2, minHeight: 180, padding: 3 }}>
    <CardContent>
      {/* Title and Value on the same line, Trend below */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color={isPositive ? "green" : "red"}
          sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
        >
          {isPositive ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
          {trend}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Domestic
          </Typography>
          <Typography variant="body2">{domestic}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            International
          </Typography>
          <Typography variant="body2">{international}</Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);



const InquiryGrowthCard = ({ data }) => (
  <Card sx={{ borderRadius: 2, boxShadow: 3, minHeight: 150, padding: 2 }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold">
        Inquiry Growth
      </Typography>
      <Divider sx={{ my: 2 }} />

      {data.length > 0 ? (
        <ul>
          {data.map((location, index) => (
            <li key={index}>
              {location.location}: {location.count}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}


    </CardContent>
  </Card>
);


const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (date) => setSelectedDate(date);
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
        console.log(response.data.data)
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
    }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={3} sx={{ width: "100%" }}>
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
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent sx={{ display: "flex", justifyContent: "center" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      selected={selectedDate}
                      onChange={handleDateChange}
                      style={{ display: "inline" }}
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
