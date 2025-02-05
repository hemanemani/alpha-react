import axiosInstance from "./axios";

export const getCsrfToken = async () => {
  try {
    // This fetches the CSRF token by hitting the route /sanctum/csrf-cookie
    await axiosInstance.get("/sanctum/csrf-cookie");
  } catch (error) {
    console.error("Error fetching CSRF token", error);
    throw error;
  }
};

export const authLogin = async (credentials) => {
    try {
      const response = await axiosInstance.post("/login", credentials, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (response.data.access_token && response.data.user && response.data.status === "Login successful") {
        localStorage.setItem("authToken", response.data.access_token);
  
        return response.data;
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };
    
  