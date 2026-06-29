import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // লোকাল স্টোরেজে টোকেন আছে কি না চেক করা হচ্ছে
  const token = localStorage.getItem('token');

  // যদি টোকেন না থাকে, তবে ইউজারকে সরাসরি লগইন পেজে পাঠিয়ে দেবে
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // আর যদি টোকেন থাকে, তবে সে তার কাঙ্ক্ষিত পেজটি দেখতে পাবে
  return children;
};

export default ProtectedRoute;