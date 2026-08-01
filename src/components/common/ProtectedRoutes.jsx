import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

export default function ProtectedRoutes({ allowedRoles }) {
  const { currentUser, userProfile, role, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen text="Verifying security credentials..." />;
  }

  // If no user is logged in
  if (!currentUser && !userProfile) {
    return <Navigate to="/login" replace />;
  }

  // Check role authorization if specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role)) {
      // Redirect to user's appropriate home
      if (role === "admin") return <Navigate to="/admin-dashboard" replace />;
      if (role === "doctor") return <Navigate to="/doctor-dashboard" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
