const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// এই স্লাশ ( '/' ) দুটো খেয়াল করো। এখানে যেন আবার ভুলে '/api/products' বা '/products' লেখা না থাকে। 
// কারণ বেস পাথ আমরা অলরেডি server.js এ দিয়ে এসেছি।
router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

router.route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;