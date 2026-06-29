const Product = require('../models/Product');

// @desc    Create a new product (Sellers only)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    // নতুন প্রোডাক্ট তৈরি এবং সেলারের আইডি হিসেবে লগইন করা ইউজারের আইডি (req.user.id) দেওয়া হচ্ছে
    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      seller: req.user.id 
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products (For everyone)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (Owner/Seller only)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // চেক করা হচ্ছে যে এই প্রোডাক্টের আসল সেলার এবং রিকোয়েস্টকারী একই ব্যক্তি কি না
    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this product' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (Owner/Seller only)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // চেক করা হচ্ছে যে এই প্রোডাক্টের আসল সেলার এবং রিকোয়েস্টকারী একই ব্যক্তি কি না
    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this product' });
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
};