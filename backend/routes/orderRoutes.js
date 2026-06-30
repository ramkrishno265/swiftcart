const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product'); // 👈 প্রোডাক্ট মডেলটি এখানে ইম্পোর্ট করো
const { protect } = require('../middleware/authMiddleware');

// 🛒 ১. নতুন অর্ডার তৈরি করার API (UPDATED)
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items found' });
    }

    // প্রতিটা প্রোডাক্টের সেলার আইডি ডাটাবেজ থেকে বের করে এখানে পুশ করব
    const orderItems = [];
    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      orderItems.push({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        seller: dbProduct.seller // 👈 প্রোডাক্টে থাকা সেলার আইডি অর্ডারে অ্যাসাইন করা হলো
      });
    }

    const newOrder = new Order({
      user: req.user._id,
      items: orderItems, // 👈 আমাদের তৈরি করা সেলার আইডি সহ আইটেম লিস্ট
      shippingAddress,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error while placing order' });
  }
});

// কাস্টমারের নিজের অর্ডার দেখার রাউট
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// 🏪 সেলারের অর্ডার নিয়ে আসার রাউট
router.get('/sellerorders', protect, async (req, res) => {
  try {
    // এখন 'items.seller' দিয়ে নিখুঁতভাবে ম্যাচ করবে
    const orders = await Order.find({ 'items.seller': req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const sellerSpecificOrders = orders.map(order => {
      const myItems = order.items.filter(item => item.seller.toString() === req.user._id.toString());
      const myTotal = myItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        _id: order._id,
        customerName: order.user?.name || 'Guest Buyer',
        shippingAddress: order.shippingAddress,
        items: myItems,
        sellerTotal: myTotal,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt
      };
    });

    res.json(sellerSpecificOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// 🔄 ৩. সেলারের মাধ্যমে অর্ডারের স্ট্যাটাস পরিবর্তন করার API
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    // ভ্যালিডেশন চেক (তুমি মডেলে যে enum ব্যবহার করেছ)
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    // অর্ডারটি খুঁজে বের করা
    const order = await Order.findById(req.id || req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // সিকিউরিটি চেক: এই অর্ডারের ভেতর লগইন করা সেলারের কোনো প্রোডাক্ট আছে কিনা নিশ্চিত করা
    const hasSellerProduct = order.items.some(item => item.seller.toString() === req.user._id.toString());
    if (!hasSellerProduct) {
      return res.status(403).json({ message: 'Not authorized to update this order status' });
    }

    // স্ট্যাটাস আপডেট এবং পেমেন্ট স্ট্যাটাস অটোমেটিক হ্যান্ডেল করা
    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') {
      order.paymentStatus = 'Paid'; // ডেলিভারড হয়ে গেলে পেমেন্ট স্ট্যাটাস অটো 'Paid' হয়ে যাবে
    }

    await order.save();
    res.json({ success: true, message: `Order status updated to ${orderStatus}`, order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
});

module.exports = router;