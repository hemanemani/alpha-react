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
        setIsLoading(false); 
        navigate("/login");
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
      }
      )
      
      .catch(() => setAccessLevel("view"))
      .finally(() => setIsLoading(false)); // Always update loading state
  }, []);

  return (
    <AuthContext.Provider value={{ accessLevel,allowedPages,isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
