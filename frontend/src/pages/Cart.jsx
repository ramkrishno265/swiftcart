import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  // কার্ট যদি খালি থাকে, তাহলে এই সুন্দর ভিউটি দেখাবে
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
        <p className="text-gray-400 text-sm mt-1 max-w-sm">
          মনে হচ্ছে আপনি এখনো কোনো প্রোডাক্ট কার্টে যোগ করেননি। আমাদের সেরা অফারগুলো দেখতে শপিংয়ে ফিরে যান।
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-purple-100 transition-all transform hover:-translate-y-0.5"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-12">
      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 tracking-tight">
        Shopping <span className="text-purple-600">Cart</span> ({totalItems})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* 📦 বাম পাশে: কার্ট আইটেমসমূহের লিস্ট */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 md:gap-6 relative group transition hover:shadow-md"
            >
              {/* প্রোডাক্ট ইমেজ */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                <img
                  src={item.image && item.image.startsWith('http') ? item.image : 'https://picsum.photos/400'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* প্রোডাক্ট ডিটেইলস */}
              <div className="flex-grow min-w-0 pr-6">
                <h3 className="font-bold text-gray-800 text-base md:text-lg line-clamp-1 group-hover:text-purple-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Seller: <span className="text-gray-600 font-medium">{item.seller?.name || 'SwiftCart Seller'}</span>
                </p>
                <p className="text-purple-700 font-black text-lg mt-2">
                  ${(item.price * item.quantity).toFixed(2)}
                  {item.quantity > 1 && (
                    <span className="text-xs text-gray-400 font-normal ml-2">(${item.price.toFixed(2)} each)</span>
                  )}
                </p>
              </div>

              {/* কোয়ান্টিটি কন্ট্রোলার এবং ডিলিট বাটন */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 shrink-0">
                {/* প্লাস-মাইনাস বাটন বার */}
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-gray-800 select-none">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition"
                  >
                    +
                  </button>
                </div>

                {/* 🗑️ ডিলিট বাটন */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition"
                  title="Remove Item"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 💳 ডান পাশে: প্রিমিয়াম অর্ডার সামারি কার্ড */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">Order Summary</h2>
          
          <div className="space-y-3.5 text-sm font-medium text-gray-500">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} items)</span>
              <span className="text-gray-800 font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-green-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (Included)</span>
              <span className="text-gray-800 font-bold">$0.00</span>
            </div>
            
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-base font-bold text-gray-800">Total Amount</span>
              <span className="text-2xl font-black text-purple-700">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* চেকআউট বাটন */}
          <button
            onClick={() => navigate('/checkout')} // আপাতত ড্যাশবোর্ডে পাঠাচ্ছি, পরে চেকআউট পেজে যাবে
            className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-100 transition-all text-center flex items-center justify-center gap-2"
          >
            Proceed to Checkout ➔
          </button>

          <p className="text-[11px] text-gray-400 text-center mt-3">
            🔒 Secure checkout. Satisfaction guaranteed.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Cart;