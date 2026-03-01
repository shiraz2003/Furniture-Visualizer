import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple JWT token validation helper
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      // Remove expired token
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid token format
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    return false;
  }
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Check if user is authenticated and token is valid
  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }

  // Check if specific role is required and user has that role
  if (requiredRole && userRole !== requiredRole) {
    // If user is not admin but trying to access admin routes, redirect to dashboard
    if (requiredRole === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    // For other role-based restrictions, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;