import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // কার্ট প্রোভাইডার ইমপোর্ট করা হলো
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header'; 
import Footer from './components/Footer'; 
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';




// সাব-কম্পোনেন্ট: যেখানে কারেন্ট পেজ ট্র্যাক করে হেডার-ফুটার হাইড/শো করা হয়
const AppContent = () => {
  const location = useLocation();

  // চেক করা হচ্ছে ইউজার এখন ড্যাশবোর্ড, লগইন বা রেজিস্টার পেজে আছে কি না
  const hideHeaderFooter = 
    location.pathname.startsWith('/dashboard') || 
    location.pathname === '/login' || 
    location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* কন্ডিশন মিলে গেলে হেডার হাইড থাকবে, অন্যথায় দেখাবে */}
      {!hideHeaderFooter && <Header />}

      {/* মাঝখানের মেইন বডি অংশ */}
      <main className={`flex-grow w-full mx-auto ${hideHeaderFooter ? 'max-w-full' : 'max-w-7xl'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* কন্ডিশন মিলে গেলে ফুটার হাইড থাকবে, অন্যথায় দেখাবে */}
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

// মেইন App কম্পোনেন্ট যেখানে CartProvider দিয়ে পুরো অ্যাপকে র‍্যাপ করা হয়েছে
function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;