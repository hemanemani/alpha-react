import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, allowedAccess, selectedPage }) => {

  const { accessLevel,allowedPages,isLoading } = useAuth();
  const isAuthenticated = localStorage.getItem("authToken");
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!allowedAccess.includes(accessLevel)) {
    return <Navigate to="/unauthorized" />;
  }

  if (accessLevel === "limited" && !allowedPages.includes(selectedPage)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children
  return children;
};

export default ProtectedRoute;
