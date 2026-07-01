const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`অনুরোধ এসেছে: ${req.method} ${req.url}`);
  next();
});


app.get('/', async (req,res) => {
    res.send('SwiftCart Backend API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 💡 process.env.PORT অবশ্যই প্রথমে দিতে হবে, কারণ Render নিজে থেকে একটি পোর্ট অ্যাসাইন করে
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});