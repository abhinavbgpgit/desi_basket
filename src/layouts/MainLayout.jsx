import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Home, Users, ClipboardList, LogOut, UserCircle, Package } from 'lucide-react';
import desiLogo from '../assets/desi_logo.png';

const MainLayout = () => {
  const { getItemCount, cartChanged, setCartChanged } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const currentItemCount = getItemCount();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart animation effect - triggers only when cart changes
  useEffect(() => {
    if (cartChanged) {
      setCartAnimation(true);
      const timer = setTimeout(() => {
        setCartAnimation(false);
        setCartChanged(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [cartChanged, setCartChanged]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    setShowProfileDropdown(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className={`bg-white shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-3'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/app" className="flex items-center space-x-2">
              <img
                src={desiLogo}
                alt="Farm Fresh"
                className={`transition-all duration-300 ${
                  isScrolled ? 'w-24' : 'w-36'
                }`}
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Cart Icon with Animation */}
            <Link to="/app/cart" className="relative group">
              <div className={`transition-all duration-300 ${cartAnimation ? 'animate-bounce' : ''}`}>
                {currentItemCount > 0 ? (
                  <ShoppingCart
                    className={`text-gray-700 group-hover:text-green-600 transition-all duration-300 ${
                      isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                    }`}
                    fill="currentColor"
                  />
                ) : (
                  <ShoppingCart
                    className={`text-gray-700 group-hover:text-green-600 transition-all duration-300 ${
                      isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                    }`}
                  />
                )}
              </div>
              {currentItemCount > 0 && (
                <span className={`absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold transition-all duration-300 ${
                  cartAnimation ? 'scale-125' : 'scale-100'
                }`}>
                  {currentItemCount}
                </span>
              )}
            </Link>

            {/* Profile Icon with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="focus:outline-none group"
              >
                <User
                  className={`text-gray-700 group-hover:text-green-600 transition-all duration-300 ${
                    isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                  <Link
                    to="/app/profile"
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700 font-medium">View Profile</span>
                  </Link>
                  
                  <Link
                    to="/app/requests"
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700 font-medium">Your Orders</span>
                  </Link>

                  <div className="border-t border-gray-200 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5 text-red-600 mr-3" />
                    <span className="text-red-600 font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className={`transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}></div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
        <div className="flex justify-around py-3">
          <Link to="/app" className="flex flex-col items-center text-sm text-gray-600 hover:text-green-600 transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/app/farmers" className="flex flex-col items-center text-sm text-gray-600 hover:text-green-600 transition-colors">
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Farmers</span>
          </Link>
          <Link to="/app/requests" className="flex flex-col items-center text-sm text-gray-600 hover:text-green-600 transition-colors">
            <ClipboardList className="w-6 h-6" />
            <span className="text-xs mt-1">Requests</span>
          </Link>
          <Link to="/app/cart" className="flex flex-col items-center text-sm text-gray-600 hover:text-green-600 relative transition-colors">
            <div className={`${cartAnimation ? 'animate-bounce' : ''}`}>
              {currentItemCount > 0 ? (
                <ShoppingCart className="w-6 h-6" fill="currentColor" />
              ) : (
                <ShoppingCart className="w-6 h-6" />
              )}
            </div>
            <span className="text-xs mt-1">Cart</span>
            {currentItemCount > 0 && (
              <span className={`absolute -top-1 right-2 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold ${
                cartAnimation ? 'scale-125' : 'scale-100'
              } transition-all duration-300`}>
                {currentItemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex flex-col items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;