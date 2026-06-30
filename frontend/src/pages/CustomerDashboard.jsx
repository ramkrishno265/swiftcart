import React, { useState, useEffect } from 'react'; // 🔄 useEffect ইমপোর্ট ফিক্স করা হয়েছে
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const CustomerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // 👈 লাইভ স্টেটসমূহ
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔄 ব্যাকএন্ড থেকে কাস্টমারের অর্ডারগুলো লোড করার useEffect
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get('http://127.0.0.1:5000/api/orders/myorders', config);
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('অর্ডার লোড করতে সমস্যা হয়েছে।');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  // স্ট্যাটাসের ওপর ভিত্তি করে কালার ডাইনামিক করার ছোট ফাংশন
  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Shipped': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-red-50 text-red-600 border-red-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-8 px-4 md:px-6 flex flex-col md:flex-row gap-8 min-h-[600px]">

      {/* 🧭 বাম পাশের প্রিমিয়াম সাইডবার */}
      <div className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* ইউজার প্রোফাইল সামারি */}
          <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center text-lg uppercase">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div>
              <h4 className="font-bold text-gray-800 line-clamp-1">{user?.name || 'Customer Name'}</h4>
              <p className="text-xs text-gray-400">Buyer Account</p>
            </div>
          </div>

          {/* মেনু লিংকসমূহ */}
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>📊</span> Dashboard Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>📦</span> My Orders
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>👤</span> Manage Profile
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === 'addresses' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>📍</span> Shipping Address
            </button>
          </nav>
        </div>

        {/* 🔘 সাইডবারের নিচের বাটনসমূহ (শপিং ও লগআউট) */}
        <div className="space-y-2 mt-8">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-purple-600 hover:bg-purple-50 rounded-xl transition border border-purple-100 shadow-sm"
          >
            <span>🛍️</span> Back to Shopping
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition">
            <span>Logout ➔</span>
          </button>
        </div>
      </div>

      {/* 🖥️ ডান পাশের মেইন ডাইনামিক কনটেন্ট এরিয়া */}
      <div className="flex-grow bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

        {/* === TAB 1: OVERVIEW === */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back, {user?.name || 'Guest'}! 👋</h2>
              <p className="text-gray-400 text-sm mt-1">আপনার অর্ডার হিস্ট্রি এবং প্রোফাইল ডিটেইলস এখানে দেখুন।</p>
            </div>

            {/* স্ট্যাটস কার্ড গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Total Orders</h3>
                <p className="text-3xl font-black text-blue-900 mt-2">{orders.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-2xl border border-purple-100">
                <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Cart Items</h3>
                <p className="text-3xl font-black text-purple-900 mt-2">
                  {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-2xl border border-green-100">
                <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wider">Profile Status</h3>
                <span className="inline-block mt-2 bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Verified
                </span>
              </div>
            </div>

            {/* শর্টকাট রিসেন্ট অর্ডার প্রিভিউ */}
            <div className="pt-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Order Status</h3>
              {loading ? (
                <div className="text-gray-400 text-sm animate-pulse">লোড হচ্ছে...</div>
              ) : orders.length === 0 ? (
                <div className="text-gray-400 text-sm bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">কোনো রিসেন্ট অর্ডার পাওয়া যায়নি ভাই।</div>
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-sm font-bold text-gray-800">Order #{orders[0]?._id?.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Placed on {new Date(orders[0]?.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {/* ভিজুয়াল স্টেপ ট্র্যাকার বার */}
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <span className="text-green-600">Ordered</span> ➔
                    <span className={`px-2 py-0.5 rounded-md ${
                      orders[0]?.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-700' : 'text-gray-400'
                    }`}>Processing</span> ➔
                    <span className={orders[0]?.orderStatus === 'Shipped' ? 'bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md' : ''}>Shipped</span> ➔
                    <span className={orders[0]?.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700 px-2 py-0.5 rounded-md' : ''}>Delivered</span>
                  </div>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-blue-600 hover:underline">
                    View Full Details
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === TAB 2: MY ORDERS === */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800">Your Order History</h2>
            
            {loading ? (
              <div className="text-center py-10 text-gray-500 animate-pulse">অর্ডার হিস্ট্রি লোড হচ্ছে...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-10">{error}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400 border border-dashed rounded-xl">আপনি এখনো কোনো অর্ডার করেননি ভাই!</div>
            ) : (
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase text-gray-500">
                      <th className="p-4 pl-6">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 pl-6 font-mono text-xs font-bold text-purple-600">#{ord._id.slice(-6).toUpperCase()}</td>
                        <td className="p-4 text-gray-500">
                          {new Date(ord.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-4 font-bold text-gray-800">${ord.totalAmount.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            ord.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.paymentStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase border ${getStatusColor(ord.orderStatus)}`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* === TAB 3: MANAGE PROFILE === */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800">Account Information</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input type="text" defaultValue={user?.name || 'User'} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <input type="email" defaultValue={user?.email || 'user@example.com'} disabled className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-sm outline-none cursor-not-allowed" />
              </div>
              <div className="md:col-span-2 pt-2">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm shadow-md transition">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* === TAB 4: SHIPPING ADDRESS === */}
        {activeTab === 'addresses' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Default Shipping Address</h2>
              <button className="text-xs font-bold text-blue-600 hover:underline">+ Add New</button>
            </div>
            <div className="border border-blue-100 bg-blue-50/30 rounded-xl p-5 max-w-md relative">
              <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">Home</span>
              <p className="font-bold text-gray-800">{user?.name || 'Customer Name'}</p>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                House #42, Road #12, Dhanmondi,<br />
                Dhaka - 1209, Bangladesh
              </p>
              <p className="text-sm text-gray-500 mt-2 font-semibold">📞 +880 1711-223344</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerDashboard;