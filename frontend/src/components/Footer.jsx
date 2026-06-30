import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <span className="text-lg font-black tracking-tight text-gray-900">
            Swift<span className="text-purple-600">Cart</span>
          </span>
          <p className="text-gray-400 text-xs mt-3 leading-relaxed">
            Your premium local marketplace for buying and selling anything with ease and security.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-gray-800 text-sm mb-3">Shop</h4>
          <ul className="space-y-2 text-xs text-gray-500 font-medium">
            <li className="hover:text-purple-600 cursor-pointer">Electronics</li>
            <li className="hover:text-purple-600 cursor-pointer">Clothing</li>
            <li className="hover:text-purple-600 cursor-pointer">Sports</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 text-sm mb-3">Support</h4>
          <ul className="space-y-2 text-xs text-gray-500 font-medium">
            <li className="hover:text-purple-600 cursor-pointer">Help Center</li>
            <li className="hover:text-purple-600 cursor-pointer">Track Order</li>
            <li className="hover:text-purple-600 cursor-pointer">Returns</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 text-sm mb-3">Contact</h4>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            📧 support@swiftcart.com<br/>
            📞 +880 1234-567890
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-4 text-center text-xs text-gray-400 font-medium border-t border-gray-100">
        © 2026 SwiftCart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;