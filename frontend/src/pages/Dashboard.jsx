import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerDashboard from './CustomerDashboard';
import SellerDashboard from './SellerDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* কমন টপ বার - এটি সবার জন্যই এক থাকবে */}
      <div className="max-w-6xl mx-auto bg-white p-4 rounded-xl shadow-md flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">SwiftCart Panel</h1>
          <p className="text-sm text-gray-500">Welcome, {user?.name} ({user?.role})</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
        >
          Logout
        </button>
      </div>

      {/* কন্ডিশন অনুযায়ী আলাদা ফাইল রেন্ডার হবে */}
      <div className="max-w-6xl mx-auto">
        {user?.role === 'seller' ? (
          <SellerDashboard user={user} />
        ) : (
          <CustomerDashboard user={user} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;