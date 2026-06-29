const jwt = require('jsonwebtoken');
const User = require('../models/User'); // তোমার ইউজার মডেলের পাথ ঠিক রেখো

const protect = async (req, res, next) => {
  let token;

  // ১. চেক করা হচ্ছে Headers-এ Authorization আছে কি না এবং সেটি Bearer দিয়ে শুরু হয়েছে কি না
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // টোকেনটি আলাদা করা হচ্ছে (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // টোকেন ভেরিফাই করা হচ্ছে (JWT_SECRET দিয়ে)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // টোকেন সঠিক হলে ডাটাবেজ থেকে ঐ ইউজারের ডেটা এনে req.user-এ রাখা হচ্ছে (পাসওয়ার্ড ছাড়া)
      req.user = await User.findById(decoded.id).select('-password');

      // পরবর্তী কাজের জন্য অনুমতি দেওয়া হচ্ছে
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // ২. যদি কোনো টোকেনই না পাওয়া যায়
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };