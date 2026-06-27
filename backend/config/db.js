const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // এখানে শুধু error.message না দিয়ে পুরো এররটা প্রিন্ট করে দেখি কী সমস্যা
    console.error(`MongoDB Connection Error Detail:`, error);
    process.exit(1);
  }
};

module.exports = connectDB;