import React, { useState } from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, InputAdornment, Alert, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getCsrfToken, authLogin } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";

const LoginPage = () => {
  const [user_name,setUserName] = useState('');
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [nameError, setNameError] = useState(""); // Validation for name
  const [passwordError, setPasswordError] = useState(""); // Validation for password
  const [openDialog, setOpenDialog] = useState(false); // State for managing dialog visibility
  const [loading, setLoading] = useState(false); // State for managing loading status
  const [submitting, setSubmitting] = useState(false); // State for managing submission status
  const navigate = useNavigate();
  const { setAccessLevel, setAllowedPages } = useAuth(); // ✅ Get Auth Context methods


  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setNameError(""); // Reset name error
    setPasswordError(""); // Reset password error
    setSubmitting(true); // Set submitting to true when submission starts

    let valid = true;

    if (!user_name) {
      setNameError("Username is required.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    if (!valid) {
      setSubmitting(false); // Stop submitting if validation fails
      return;
    }

    try {
      await getCsrfToken();
      const credentials = { user_name, password };

      await authLogin(credentials, navigate, setAccessLevel, setAllowedPages); // ✅ Pass these

      } catch (error) {
        setError("Login failed. Please check your credentials.");
      } finally {
        setSubmitting(false);
      }

    };

  const handleForgotPasswordClick = () => {
    setOpenDialog(true); // Show the dialog when the user clicks "Forgot Password?"
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12} md={6} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <Box sx={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Sign In
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Enter your Username and Password to sign in
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Login successful!</Alert>}
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Username"
              placeholder="Please enter username"
              variant="outlined"
              value={user_name}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
              margin="normal"
              error={!!nameError}
              helperText={nameError}
            />
            <TextField
              label="Password"
              placeholder="Please enter password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              error={!!passwordError}
              helperText={passwordError}
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
            <Typography
              variant="body2"
              align="right"
              color="#000"
              style={{ cursor: "pointer", marginBottom: "1rem" }}
              onClick={handleForgotPasswordClick} // Trigger the modal when clicked
            >
              Forgot Password?
            </Typography>
            <Button 
  variant="contained" 
  fullWidth 
  size="large" 
  style={{ background: "#000" }} 
  type="submit" 
  sx={{ marginTop: 2 }}
>
  {submitting ? <CircularProgress size={24} style={{ color: "white" }} /> : "Submit"}
</Button>

          </form>
        </Box>
      </Grid>

      <Grid item xs={12} md={6} style={{ display: "flex", alignItems: "center", justifyContent: "center" }} sx={{
        display: "flex",
        backgroundImage: "url('https://alpha.organysk.com/assets/images/alpha-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh", // Ensures the background covers the viewport
      }}>
        <Box textAlign="center">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Alpha
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            by Orgenik Bulk
          </Typography>
        </Box>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{
              sx: { width: "500px", height: "180px",borderRadius:"10px",padding:"5px 10px" }
            }}>
        <DialogContent>
          <Typography variant="body1" sx={{fontSize:"23px",fontWeight:"600"}}>
            Forgot Password?
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "13px",fontWeight: "500",color:"#8d857f",marginTop:"15px" }}>
            Kindly contact <span style={{ textDecoration: "underline" }}>Master Admin</span> for Password Reset.
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button 
            onClick={handleCloseDialog} 
            color="primary" 
            size="small" 
            style={{ background: "#000", color: "white",padding:"5px 35px" }} // White text and black background
            sx={{ marginTop: 2 }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
export default LoginPage;