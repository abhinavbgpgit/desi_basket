import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Home, Users, ClipboardList, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';

const MainLayout = () => {
  const { getItemCount, cartChanged } = useCart();
  const currentItemCount = getItemCount();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Common Header */}
      <Header />

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16"></div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pt-0 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
        <div className="flex justify-around py-3">
          <Link to="/" className="flex flex-col items-center text-sm text-gray-600 hover:text-green-600 transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/farmers" className="flex flex-col items-center text-sm text-gray-600 hover:text-green-600 transition-colors">
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Farmers</span>
          </Link>
          <Link to="/requests" className="flex flex-col items-center text-sm text-gray-600 hover:text-green-600 transition-colors">
            <ClipboardList className="w-6 h-6" />
            <span className="text-xs mt-1">Requests</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center text-sm text-gray-600 hover:text-green-600 relative transition-colors">
            <div className={`${cartChanged ? 'animate-bounce' : ''}`}>
              {currentItemCount > 0 ? (
                <ShoppingCart className="w-6 h-6" fill="currentColor" />
              ) : (
                <ShoppingCart className="w-6 h-6" />
              )}
            </div>
            <span className="text-xs mt-1">Cart</span>
            {currentItemCount > 0 && (
              <span className={`absolute -top-1 right-2 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold ${
                cartChanged ? 'scale-125' : 'scale-100'
              } transition-all duration-300`}>
                {currentItemCount}
              </span>
            )}
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-sm text-gray-600 hover:text-green-600 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;