import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Divider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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
      {data.map((item, index) => (
        <Grid container spacing={2} key={index}>
          <Grid item xs={6} sm={6}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {item.city}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Typography variant="body2">{item.value}</Typography>
          </Grid>
        </Grid>
      ))}
    </CardContent>
  </Card>
);

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (date) => setSelectedDate(date);

  const inquiryGrowthData = [
    { city: "Ahmedabad", value: 31 },
    { city: "Mumbai", value: 10 },
    { city: "Surat", value: 8 },
    { city: "Rajkot", value: 5 },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={3} sx={{ width: "100%" }}>
        {/* First Row: Inquiries, Offers */}
        <Grid item xs={12} sm={12} lg={8} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} lg={6} md={6}>
              <SummaryCard
                title="Inquiries"
                value="1K"
                trend="+120"
                domestic="600"
                international="400"
                isPositive={true}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={6} md={6}>
              <SummaryCard
                title="Offers"
                value="300"
                trend="-10"
                domestic="150"
                international="150"
                isPositive={false}
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
                value="20"
                trend="-3"
                domestic="15"
                international="5"
                isPositive={false}
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
              <InquiryGrowthCard data={inquiryGrowthData} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
