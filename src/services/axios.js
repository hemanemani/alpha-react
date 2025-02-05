import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// const API_URL = "https://ogaenik.com/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // Send cookies with each request (important for CSRF)
});

export default axiosInstance;
