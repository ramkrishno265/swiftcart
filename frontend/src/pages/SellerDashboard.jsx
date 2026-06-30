import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SellerDashboard = ({ user }) => {
  // ড্যাশবোর্ডের সেকশন কন্ট্রোল ('products' অথবা 'orders')
  const [activeSection, setActiveSection] = useState('products');

  // ফর্মের স্টেট
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    image: '',
    description: ''
  });

  // প্রোডাক্ট লিস্ট, অর্ডার লিস্ট এবং অন্যান্য স্টেট
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // এডিট মোড ট্র্যাকিং করার জন্য স্টেট
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const { name, price, category, image, description } = formData;

  // ১. ব্যাকএন্ড থেকে সব প্রোডাক্ট নিয়ে আসার ফাংশন
  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('http://127.0.0.1:5000/api/products', config);
      // ব্যাকএন্ড থেকে অ্যারে আসছে কিনা নিশ্চিত করা
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setFetchLoading(false);
    }
  };


  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      await axios.put(`http://127.0.0.1:5000/api/orders/${orderId}/status`, { orderStatus: newStatus }, config);
      setSuccess('Order status updated successfully!');

      // ড্যাশবোর্ডের ডেটা রিফ্রেশ করা
      fetchSellerOrders();
    } catch (err) {
      console.error('Status update error:', err);
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };


  // 🏪 ২. ব্যাকএন্ড থেকে সেলারের প্রোডাক্টের অর্ডারগুলো নিয়ে আসা
  const fetchSellerOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('http://127.0.0.1:5000/api/orders/sellerorders', config);

      // কনসোলে চেক করার জন্য প্রিন্ট (রাইট ক্লিক করে Inspect > Console-এ দেখবে ডেটা আসে কিনা)
      console.log("Seller Orders Data:", response.data);

      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching seller orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
    fetchSellerOrders();
  }, []);

  // 💰 লাইভ টোটাল সেলস বা আর্নিং ক্যালকুলেট করার লজিক
  const totalSales = orders.reduce((sum, ord) => sum + (Number(ord.sellerTotal) || 0), 0);

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // ৩. ডিলিট (Delete) ফাংশน
  const handleDelete = async (id, prodName) => {
    if (window.confirm(`Are you sure you want to delete "${prodName}"?`)) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        await axios.delete(`http://127.0.0.1:5000/api/products/${id}`, config);
        setSuccess(`"${prodName}" removed successfully!`);
        fetchMyProducts();

        if (editProductId === id) {
          handleCancelEdit();
        }
      } catch (err) {
        console.error('Delete error:', err);
        setError(err.response?.data?.message || 'Failed to delete the product.');
      }
    }
  };

  // ৪. এডিট (Edit) মোড অন করার ফাংশন
  const handleEditClick = (prod) => {
    setIsEditing(true);
    setEditProductId(prod._id);
    setFormData({
      name: prod.name,
      price: prod.price,
      category: prod.category,
      image: prod.image || '',
      description: prod.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ৫. এডিট ক্যানসেল করার ফাংশন
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditProductId(null);
    setFormData({
      name: '',
      price: '',
      category: 'Electronics',
      image: '',
      description: ''
    });
  };

  // ৬. ফর্ম সাবমিট
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const dataToSend = { ...formData, price: Number(formData.price) };

      if (isEditing) {
        await axios.put(`http://127.0.0.1:5000/api/products/${editProductId}`, dataToSend, config);
        setSuccess(`"${name}" successfully updated!`);
        setIsEditing(false);
        setEditProductId(null);
      } else {
        await axios.post('http://127.0.0.1:5000/api/products', dataToSend, config);
        setSuccess(`"${name}" successfully published!`);
      }

      setFormData({
        name: '',
        price: '',
        category: 'Electronics',
        image: '',
        description: ''
      });

      fetchMyProducts();
    } catch (err) {
      console.error('Server error:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      {/* স্ট্যাটস কার্ড সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 shadow-sm">
          <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Total Products</h3>
          <p className="text-3xl font-black text-purple-900 mt-2">{products.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm">
          <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wider">Total Sales (Earnings)</h3>
          <p className="text-3xl font-black text-green-900 mt-2">${totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Active Orders</h3>
          <p className="text-3xl font-black text-blue-900 mt-2">{orders.length}</p>
        </div>
      </div>

      {/* 🧭 সেকশন টগল বাটন মেনু */}
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        <button
          onClick={() => { setActiveSection('products'); setSuccess(''); setError(''); }}
          className={`pb-3 text-sm font-bold transition-all ${activeSection === 'products' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          📦 Manage Products
        </button>
        <button
          onClick={() => { setActiveSection('orders'); setSuccess(''); setError(''); }}
          className={`pb-3 text-sm font-bold transition-all ${activeSection === 'orders' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          🏪 Customer Orders ({orders.length})
        </button>
      </div>

      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium text-sm">🎉 {success}</div>}
      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium text-sm">⚠️ {error}</div>}

      {/* === SECTION 1: MANAGE PRODUCTS === */}
      {activeSection === 'products' && (
        <div className="space-y-8">
          {/* প্রোডাক্ট অ্যাড/এডিট ফর্ম */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="p-2 bg-purple-100 text-purple-600 rounded-lg text-lg">
                {isEditing ? '📝' : '🛍️'}
              </span>
              {isEditing ? 'Edit Product Details' : 'Add New Product'}
            </h2>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" name="name" value={name} onChange={onChange} required placeholder="e.g., Wireless Gaming Mouse" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input type="number" name="price" value={price} onChange={onChange} required min="0" step="0.01" placeholder="e.g., 49.99" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="category" value={category} onChange={onChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white">
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Books">Books</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="url" name="image" value={image} onChange={onChange} placeholder="https://example.com/image.jpg" className="w-full px-4 py-2.5 rounded-xl border border-gray-300" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={description} onChange={onChange} required rows="4" placeholder="Write something..." className="w-full px-4 py-2.5 rounded-xl border border-gray-300 resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {isEditing && (
                  <button type="button" onClick={handleCancelEdit} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition">
                    Cancel
                  </button>
                )}
                <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition">
                  {loading ? 'Processing...' : isEditing ? 'Update Product' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>

          {/* প্রোডাক্ট লিস্ট টেবিল */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">My Products</h2>
            </div>

            {fetchLoading ? (
              <div className="p-12 text-center text-gray-500 font-medium">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No products uploaded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-bold border-b border-gray-100">
                      <th className="p-4 pl-6">Image</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {products.map((prod) => (
                      <tr key={prod._id} className="hover:bg-gray-50 transition">
                        <td className="p-4 pl-6">
                          <img src={prod.image || 'https://via.placeholder.com/50'} alt={prod.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                        </td>
                        <td className="p-4 font-semibold text-gray-900">{prod.name}</td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-purple-700">${prod.price}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleEditClick(prod)} className="text-blue-600 hover:text-blue-800 font-medium mr-3 transition">Edit</button>
                          <button onClick={() => handleDelete(prod._id, prod.name)} className="text-red-600 hover:text-red-800 font-medium transition">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* === SECTION 2: CUSTOMER ORDERS === */}
      {activeSection === 'orders' && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Orders Received</h2>
          </div>

          {ordersLoading ? (
            <div className="p-12 text-center text-gray-500 font-medium">Loading customer orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-400">আপনার প্রোডাক্টের জন্য কোনো অর্ডার এখনো আসেনি ভাই!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-bold border-b border-gray-100">
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items (Qty)</th>
                    <th className="p-4">Your Revenue</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 pl-6 font-mono text-xs font-bold text-purple-600">
                        #{ord._id ? ord._id.slice(-6).toUpperCase() : 'N/A'}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-900">{ord.customerName || 'Guest'}</p>
                        <p className="text-xs text-gray-400">{ord.shippingAddress?.phone || ''}</p>
                      </td>
                      <td className="p-4">
                        {ord.items && ord.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-600">
                            • {item.name} <span className="font-bold text-purple-600">({item.quantity})</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-bold text-green-600">${Number(ord.sellerTotal || 0).toFixed(2)}</td>
                      <td className="p-4">
                        <select
                          value={ord.orderStatus || 'Processing'}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className={`px-2 py-1 text-xs font-bold uppercase rounded-lg border outline-none cursor-pointer transition
                            ${ord.orderStatus === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                            ${ord.orderStatus === 'Shipped' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : ''}
                            ${ord.orderStatus === 'Delivered' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                            ${ord.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                          `}
                        >
                          <option value="Processing">⏳ Processing</option>
                          <option value="Shipped">📦 Shipped</option>
                          <option value="Delivered">✅ Delivered</option>
                          <option value="Cancelled">❌ Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-xs text-gray-400">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;