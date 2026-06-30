import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // শিপিং ঠিকানার স্টেট
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  // অর্ডার সাবমিট করার ফাংশন
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // লোকাল স্টোরেজ বা স্টেট থেকে লগইন করা ইউজারের টোকেন নেওয়া
      const token = localStorage.getItem('token'); 
      if (!token) {
        setError('অর্ডার করতে দয়া করে আগে লগইন করুন।');
        setLoading(false);
        return;
      }

      // ব্যাকএন্ডে পাঠানোর জন্য ডাটা ফরম্যাট করা
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress,
        totalAmount: totalPrice
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // ব্যাকএন্ড API-তে হিট করা
      const response = await axios.post('http://127.0.0.1:5000/api/orders', orderData, config);

      if (response.data.success) {
        clearCart(); // অর্ডার সফল হলে কার্ট খালি করে দেওয়া
        alert('🎉 আপনার অর্ডারটি সফলভাবে প্লেস হয়েছে!');
        navigate('/dashboard'); // ড্যাশবোর্ডে রিডাইরেক্ট করা
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'অর্ডার প্লেস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-24">
        <h2 className="text-xl font-bold text-gray-700">চেকআউট করার জন্য কার্টে কোনো প্রোডাক্ট নেই ভাই!</h2>
        <button onClick={() => navigate('/')} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-xl">শপিং করুন</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-12">
      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📝 বাম পাশে: শিপিং ফর্ম */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">📦 Shipping Information</h2>
          
          {error && <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">{error}</div>}

          <form onSubmit={handlePlaceOrder} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input type="text" name="name" required value={shippingAddress.name} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500 text-sm transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                <input type="text" name="phone" required value={shippingAddress.phone} onChange={handleChange} placeholder="+880 17XXXXXXXX" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500 text-sm transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Address</label>
              <input type="text" name="address" required value={shippingAddress.address} onChange={handleChange} placeholder="House #42, Road #12, Dhanmondi" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500 text-sm transition" />
            </div>

            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
              <input type="text" name="city" required value={shippingAddress.city} onChange={handleChange} placeholder="Dhaka" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500 text-sm transition" />
            </div>

            <button type="submit" disabled={loading} className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition disabled:bg-purple-400">
              {loading ? 'Processing Order...' : 'Confirm & Place Order ➔'}
            </button>
          </form>
        </div>

        {/* 💳 ডান পাশে: অর্ডার সামারি */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Your Items</h2>
          <div className="max-h-60 overflow-y-auto divide-y divide-gray-50 mb-4">
            {cartItems.map(item => (
              <div key={item._id} className="py-3 flex justify-between items-center text-sm">
                <div className="pr-2">
                  <p className="font-bold text-gray-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center font-bold">
            <span className="text-gray-800">Total Payable</span>
            <span className="text-xl text-purple-700">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;