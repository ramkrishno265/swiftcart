import React, { useState } from 'react';
import axios from 'axios';

const SellerDashboard = ({ user }) => {
  // ফর্মের স্টেট
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    image: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { name, price, category, image, description } = formData;

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // ইউজার টাইপ করা শুরু করলে এরর মেসেজ মুছে যাবে
  };

  // ফর্ম সাবমিট ও ব্যাকএন্ড কানেকশন হ্যান্ডলার
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // লোকাল স্টোরেজ থেকে লগইন টোকেনটি আনা হচ্ছে
      const token = localStorage.getItem('token');

      // হেডার্স কনফিগারেশন (টোকেন পাস করার জন্য)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      // ব্যাকএন্ড এপিআই-তে ডাটা পাঠানো হচ্ছে (তোমার ব্যাকএন্ড পোর্ট ৫০0০ হলে)
      const response = await axios.post(
        'http://127.0.0.1:5000/api/products',
        formData,
        config
      );

      if (response.status === 201 || response.status === 200) {
        setSuccess(`"${name}" successfully published!`);
        
        // ফর্ম একদম খালি করে দেওয়া
        setFormData({
          name: '',
          price: '',
          category: 'Electronics',
          image: '',
          description: ''
        });
      }
    } catch (err) {
      console.error('Server error:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* স্ট্যাটস কার্ড সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 shadow-sm">
          <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Total Products</h3>
          <p className="text-3xl font-black text-purple-900 mt-2">0</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 shadow-sm">
          <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Total Sales</h3>
          <p className="text-3xl font-black text-purple-900 mt-2">$0.00</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 shadow-sm">
          <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Store Status</h3>
          <span className="inline-block mt-2 bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
            Active
          </span>
        </div>
      </div>

      {/* প্রোডাক্ট অ্যাড করার ফর্ম */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="p-2 bg-purple-100 text-purple-600 rounded-lg text-lg">🛍️</span>
          Add New Product
        </h2>

        {/* সাকসেস বা এরর মেসেজ অ্যালার্ট */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium text-sm">
            🎉 {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* প্রোডাক্টের নাম */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                placeholder="e.g., Wireless Gaming Mouse"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>

            {/* প্রোডাক্টের দাম */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={onChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g., 49.99"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ক্যাটাগরি */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={category}
                onChange={onChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            {/* ইমেজের ইউআরএল */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                name="image"
                value={image}
                onChange={onChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>
          </div>

          {/* প্রোডাক্ট ডেসক্রিপশন */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              required
              rows="4"
              placeholder="Write something about your product..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition resize-none"
            ></textarea>
          </div>

          {/* সাবমিট বাটন */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-purple-200 transition-all duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerDashboard;