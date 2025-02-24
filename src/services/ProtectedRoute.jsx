import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, allowedAccess, selectedPage }) => {

  const { accessLevel,allowedPages,isLoading } = useAuth();
  const isAuthenticated = localStorage.getItem("authToken");
  if (isLoading || accessLevel === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (accessLevel === "full") {
    return children;
  }


  if (!allowedAccess.includes(accessLevel)) {
    return <Navigate to="/unauthorized" replace />;
  }


  // If access level is "limited" but user has "view" permission, allow access
  if (accessLevel === "limited" && allowedAccess.includes("view") && allowedPages.includes(selectedPage)) {
    return children;
  }

  return children;


};

export default ProtectedRoute;
