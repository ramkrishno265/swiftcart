const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150' // সাময়িকভাবে একটি ডিফল্ট ইমেজ লিংক
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // কোন সেলার প্রোডাক্টটি অ্যাড করেছে তা ট্র্যাক রাখার জন্য ইউজার মডেলের সাথে লিংক
    required: true
  }
}, {
  timestamps: true // প্রোডাক্ট কখন তৈরি বা আপডেট হলো তা অটোমেটিক ট্র্যাক করবে
});

module.exports = mongoose.model('Product', productSchema);