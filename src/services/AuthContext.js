import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "./axios";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessLevel, setAccessLevel] = useState(null);
  const [allowedPages, setAllowedPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.log("User is not authenticated.");
        setTimeout(() => setIsLoading(false), 500);
        return;
      }

    axiosInstance.get("/user-access", { 
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${token}`,
    }

     })
      .then(response => {
        setAccessLevel(response.data.access_level);
        setAllowedPages(response.data.allowed_pages || []);
      })
      .catch(() => {
        setAccessLevel("view"); // Default to "view" on error
        localStorage.removeItem("authToken"); // Clear token on failure
        navigate("/login");
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 500);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ accessLevel, allowedPages, setAccessLevel, setAllowedPages, isLoading }}>
      {!isLoading ? children : <div>Loading...</div>} 
            {/* {children} */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
