import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // লোকাল স্টোরেজ থেকে ইউজারের ডেটা আনা
  const user = JSON.parse(localStorage.getItem('user'));

  // লগআউট হ্যান্ডলার
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    navigate('/login'); // লগআউট হলে আবার লগইন পেজে পাঠিয়ে দেবে
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Welcome to SwiftCart</h1>
        <p className="text-gray-500 mb-6">User Dashboard</p>

        <div className="bg-blue-50 p-4 rounded-xl text-left mb-6 space-y-2">
          <p className="text-gray-700"><strong>Name:</strong> {user?.name}</p>
          <p className="text-gray-700"><strong>Email:</strong> {user?.email}</p>
          <p className="text-gray-700">
            <strong>Role:</strong> <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-sm font-semibold capitalize">{user?.role}</span>
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;