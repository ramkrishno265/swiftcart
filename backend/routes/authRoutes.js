const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// নিশ্চিত করো এখানে ঠিকঠাক বানানসহ '/register' লেখা আছে
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;