import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // 🛒 কার্ট হুক ইমপোর্ট করা হলো

const Header = () => {
    const navigate = useNavigate();
    const { totalItems } = useCart(); // ⚡ কার্ট থেকে totalItems বের করে আনা হলো

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
            <div className="max-w-7xl mx-auto px-4 md:px-12 h-16 flex items-center justify-between">

                {/* ⚡ লোগো - ক্লিক করলে হোমপেজে যাবে */}
                <Link to="/" className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-2xl">⚡</span>
                    <span className="text-xl font-black tracking-tight text-gray-900">
                        Swift<span className="text-purple-600">Cart</span>
                    </span>
                </Link>

                {/* 🔍 সার্চ বার */}
                <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 w-80">
                    <span className="text-gray-400 mr-2 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="Search products, brands..."
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-700"
                    />
                </div>

                {/* 🔗 নেভিগেশন লিংক ও কার্ট */}
                <div className="flex items-center gap-6 font-semibold text-sm text-gray-600">

                    {/* Home লিংক */}
                    <Link to="/" className="hover:text-purple-600 cursor-pointer transition">
                        Home
                    </Link>

                    {/* Shop বা ড্যাশবোর্ড লিংক */}
                    <Link to="/dashboard" className="hover:text-purple-600 cursor-pointer transition">
                        Dashboard
                    </Link>

                    {/* 🛒 কার্ট আইকন - এখন ক্লিক করলে কার্ট পেজে যাবে */}
                    <Link to="/cart" className="relative cursor-pointer hover:text-purple-600 transition">
                        <span className="text-lg">🛒</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* 🔑 Login বাটন - ক্লিক করলে ডাইরেক্ট লগইন পেজে নিয়ে যাবে */}
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition shadow-md shadow-purple-100"
                    >
                        Login
                    </button>

                </div>
            </div>
        </header>
    );
};

export default Header;