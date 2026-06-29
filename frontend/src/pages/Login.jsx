import React, { useState } from 'react'; // <-- এই লাইনটি মিসিং ছিল
import { Link, useNavigate } from 'react-router-dom'; // useNavigate যোগ করো // <-- এই লাইনটিও মিসিং ছিল
import API from '../api/axiosInstance';

const Login = () => {
  // ১. লগইন ইনপুট স্টেট
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  // ২. ইনপুট চেঞ্জ হ্যান্ডলার
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 // ৩. ফর্ম সাবমিট হ্যান্ডলার (আপডেটেড)
  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // ব্যাকএন্ডের /auth/login এন্ডপয়েন্টে লগইন ডেটা পাঠানো হচ্ছে
      const response = await API.post('/auth/login', formData);
      
      console.log('Login Success:', response.data);
      alert('Login Successful!');
      navigate('/dashboard');
      
      // লগইন সফল হলে ব্যাকএন্ড থেকে আসা JWT টোকেনটি আমরা লোকাল স্টোরেজে সেভ করে রাখব
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // এরপর ইউজারকে ড্যাশবোর্ড বা হোম পেজে রিডাইরেক্ট করা যাবে...
      
    } catch (error) {
      console.error('Login Error:', error.response?.data);
      alert(error.response?.data?.message || 'Invalid email or password!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">SwiftCart</h2>
        <p className="text-center text-gray-500 mb-6">Welcome back! Sign in to your account</p>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* ইমেইল ইনপুট */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* পাসওয়ার্ড ইনপুট */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            Login
          </button>
        </form>

        {/* রেজিস্ট্রেশন পেজের লিংক */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;