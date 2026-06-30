import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // লোকাল স্টোরেজ থেকে আগের কার্ট ডেটা লোড করা (পেজ রিফ্রেশ দিলেও কার্ট খালি হবে না)
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('swiftCart');
    return localData ? JSON.parse(localData) : [];
  });

  // কার্ট চেঞ্জ হলেই লোকাল স্টোরেজে সেভ হবে
  useEffect(() => {
    localStorage.setItem('swiftCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ১. কার্টে প্রোডাক্ট অ্যাড করার ফাংশন
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // প্রোডাক্টটি অলরেডি কার্টে আছে কি না চেক
      const isExist = prevItems.find((item) => item._id === product._id);
      
      if (isExist) {
        // থাকলে শুধু কোয়ান্টিটি ১ বাড়িয়ে দাও
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // না থাকলে নতুন করে ১ কোয়ান্টিটিসহ যোগ করো
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // ২. কোয়ান্টিটি কমানো বা আপডেট করার ফাংশন
  const updateQuantity = (productId, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === productId) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  // ৩. কার্ট থেকে প্রোডাক্ট ডিলিট করার ফাংশন
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  // ৪. কার্ট একদম খালি করার ফাংশন (অর্ডার কমপ্লিট হওয়ার পর লাগবে)
  const clearCart = () => setCartItems([]);

  // কার্টের মোট আইটেম সংখ্যা হিসাব
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // কার্টের মোট টাকার হিসাব
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// কাস্টম হুক যাতে সহজে অন্য ফাইলে ব্যবহার করা যায়
export const useCart = () => useContext(CartContext);