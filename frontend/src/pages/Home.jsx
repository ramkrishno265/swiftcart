import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // ক্যাটাগরি লিস্ট
  const categories = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports'];

  // ব্যাকএন্ড থেকে সব প্রোডাক্ট নিয়ে আসার ফাংশন
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // হোমপেজের প্রোডাক্টের জন্য কোনো টোকেন লাগবে না, কারণ এটা পাবলিক এপিআই
        const response = await axios.get('http://127.0.0.1:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ক্যাটাগরি অনুযায়ী প্রোডাক্ট ফিল্টার করার লজিক
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(prod => prod.category === selectedCategory);

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-12">
      {/* 🎯 হিরো সেকশন বা ব্যানার */}
      <div className="bg-gradient-to-r border border-purple-100 bg-white rounded-3xl p-8 md:p-12 mb-10 shadow-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            Discover Your Next <span className="text-purple-600">Favorite</span> Thing
          </h1>
          <p className="text-gray-500 mt-3 text-sm md:text-base max-w-md">
            Shop the best products directly from trusted local sellers. High quality, great prices.
          </p>
        </div>
        <div className="text-6xl bg-purple-100 p-6 rounded-2xl hidden md:block">🛒</div>
      </div>

      {/* 🏷️ ক্যাটাগরি ফিল্টার বার (ডুপ্লিকেট রিমুভ করা হয়েছে) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📦 প্রোডাক্ট গ্রিড সেকশন */}
      {loading ? (
        <div className="text-center py-24 text-gray-500 font-medium text-lg">
          <div className="animate-pulse mb-2">⚡ Loading fresh products...</div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600 font-medium bg-red-50 border border-red-200 rounded-2xl">
          ⚠️ {error}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 text-gray-400 text-lg">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((prod) => (
            <div
              key={prod._id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* প্রোডাক্ট ইমেজ */}
              <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-100">
                <img
                  src={prod.image && prod.image.startsWith('http') ? prod.image : 'https://picsum.photos/400'}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = 'https://picsum.photos/400'; }}
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
                  {prod.category}
                </span>
              </div>

              {/* প্রোডাক্ট ইনফো */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg line-clamp-1 group-hover:text-purple-600 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">
                    Seller: <span className="font-medium text-gray-600">{prod.seller?.name || 'SwiftCart Seller'}</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                {/* দাম এবং বাটন */}
                <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-50">
                  <span className="text-xl font-black text-purple-700">
                    ${prod.price.toFixed(2)}
                  </span>
                  
                  <button
                    onClick={() => addToCart(prod)}
                    className="bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white p-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;