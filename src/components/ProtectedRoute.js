import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const auth = localStorage.getItem("auth-token");
  
  return auth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
