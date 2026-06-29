import React from 'react';

const CustomerDashboard = ({ user }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-blue-600">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-2">Customer Dashboard</h2>
      <p className="text-gray-600 mb-6">আপনার অর্ডার হিস্ট্রি এবং প্রোফাইল ডিটেইলস এখানে দেখুন।</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-2">My Orders</h3>
          <p className="text-2xl font-black text-blue-900 mt-2">0 Orders</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-2">Cart Items</h3>
          <p className="text-2xl font-black text-blue-900 mt-2">0 Items</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-2">Profile Status</h3>
          <span className="inline-block mt-2 bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
            Verified
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;