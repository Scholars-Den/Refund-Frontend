// src/Components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "../../utils/cookieUtils";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = getCookie("role");

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/adminsignup" replace />;
  }

  return children;
};

export default ProtectedRoute;
