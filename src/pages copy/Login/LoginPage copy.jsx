import React from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { getCsrfToken, authLogin } from "../../services/authService";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
  const [user_name,setUserName] = useState('');
  const [password,setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Get the navigate function for redirection


  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await getCsrfToken();
  
      const credentials = { user_name, password };
  
      const response = await authLogin(credentials);
  
      if (response.access_token) {
        localStorage.setItem("authToken", response.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));
  
        console.log("Login successful:", response.user);
        navigate("/");
  
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Login failed", error.message);
    }
  };
  
  

  return (
    <Grid container style={{ height: "100vh" }}>
      {/* Left Side - Login Form */}
      <Grid
        item
        xs={12}
        md={6}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Sign In
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Enter your Username and Password to sign in
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              placeholder="Please enter username"
              variant="outlined"
              value={user_name}
              onChange={(item)=>setUserName(item.target.value)}
              autoComplete="Username" 
              fullWidth
            />
            <TextField
              label="Password"
              placeholder="Please enter password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(item)=>setPassword(item.target.value)}
              autoComplete="current-password" 
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="body2" align="right" color="primary">
              Forgot Password?
            </Typography>
            <Button variant="contained" color="primary" fullWidth size="large" type="submit">
              Submit
            </Button>
          </form>
        </Box>
      </Grid>

      {/* Right Side - Branding */}
      <Grid
        item
        xs={12}
        md={6}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0f7fa, #e1bee7)",
        }}
      >
        <Box textAlign="center">
          <Typography variant="h3" fontWeight="bold">
            Alpha
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            by Orgenik Bulk
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
