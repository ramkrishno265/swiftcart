import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import axios from 'axios';


const Register = () => {
    // ১. ইনপুট স্টেট ম্যানেজমেন্ট
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer' // ডিফল্ট রোল 'customer'
    });

    const { name, email, password, role } = formData;

    // ২. ইনপুট চেঞ্জ হ্যান্ডলার
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ৩. ফর্ম সাবমিট হ্যান্ডলার (আপডেটেড)
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            // ব্যাকএন্ডের /auth/register এন্ডপয়েন্টে ডেটা পাঠানো হচ্ছে
            // axiosInstance বাদ দিয়ে সরাসরি পুরো ইউআরএল দিয়ে টেস্ট
            const response = await API.post('/auth/register', formData);

            console.log('Registration Success:', response.data);
            alert('Registration Successful!');

            // সফল হলে ইউজারকে অটোমেটিক লগইন পেজে পাঠিয়ে দেবে
            // (এজন্য উপরে চাইলে react-router-dom থেকে useNavigate ব্যবহার করতে পারো, আপাতত আমরা অ্যালার্ট রাখছি)

        } catch (error) {
            console.error('Registration Error:', error.response?.data);
            alert(error.response?.data?.message || 'Something went wrong!');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">SwiftCart</h2>
                <p className="text-center text-gray-500 mb-6">Create your account to get started</p>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* নাম ইনপুট */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            placeholder="John Doe"
                            required
                        />
                    </div>

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

                    {/* রোল সিলেকশন (Dropdown) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Join As</label>
                        <select
                            name="role"
                            value={role}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition"
                        >
                            <option value="customer">Customer (Buy Products)</option>
                            <option value="seller">Seller (Sell Products)</option>
                        </select>
                    </div>

                    {/* সাবমিট বাটন */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
                    >
                        Register
                    </button>
                </form>

                {/* লগইন পেজের লিংক */}
                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;