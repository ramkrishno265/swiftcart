import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // আমাদের Node.js ব্যাকএন্ডের মেইন ইউআরএল
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;