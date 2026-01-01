import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, UserCircle, Package, Search, Home, Users, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import desiLogo from '../assets/desi_logo.png';
import { apiService as api } from '../services/api';

const Header = () => {
  const { getItemCount, cartChanged, setCartChanged } = useCart();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentItemCount = getItemCount();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart animation effect
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query) => {
    setIsSearching(true);
    try {
      const results = await api.searchProducts(query);
      setSearchResults(results.slice(0, 5)); // Show top 5 results
      setShowSearchDropdown(results.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (productId) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    setSearchResults([]);
    navigate(`/product/${productId}`);
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
  };

  return (
    <header
      className={`bg-white shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-1' : 'py-1'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src={desiLogo}
            alt="Desi Basket"
            className={`transition-all duration-300 ${
              isScrolled ? 'w-32 md:w-40' : 'w-32 md:w-40'
            }`}
          />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <Search className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
            {isSearching && (
              <div className="absolute right-3 top-2.5">
                <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSearchResultClick(product.id)}
                  className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                >
                  <img
                    src={product.images?.[0] || product.image || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <span className="text-green-600 font-semibold text-sm">
                    ₹{product.price}/{product.unit}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-1 flex-shrink-0">
          <Link
            to="/"
            className={`flex flex-col items-center px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-0.5">Home</span>
          </Link>
          
          <Link
            to="/farmers"
            className={`flex flex-col items-center px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname.includes('/farmers')
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs mt-0.5">Farmers</span>
          </Link>
          
          <Link
            to="/requests"
            className={`flex flex-col items-center px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname.includes('/requests')
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-xs mt-0.5">Requests</span>
          </Link>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300 mx-2"></div>

          {/* Right side icons */}
          {/* Cart Icon */}
          <Link
            to="/cart"
            className={`relative flex flex-col items-center px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname.includes('/cart')
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
            }`}
          >
            <div className={`transition-all duration-300 ${cartAnimation ? 'animate-bounce' : ''}`}>
              {currentItemCount > 0 ? (
                <ShoppingCart className="w-5 h-5" fill="currentColor" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </div>
            <span className="text-xs mt-0.5">Cart</span>
            {currentItemCount > 0 && (
              <span className={`absolute top-0 right-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold transition-all duration-300 ${
                cartAnimation ? 'scale-125' : 'scale-100'
              }`}>
                {currentItemCount}
              </span>
            )}
          </Link>

          {/* Profile Icon with Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className={`flex flex-col items-center px-3 py-1.5 rounded-lg transition-colors focus:outline-none ${
                  location.pathname.includes('/profile')
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-xs mt-0.5">Profile</span>
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700 font-medium">View Profile</span>
                  </Link>
                  
                  <Link
                    to="/requests"
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
          ) : (
            <Link
              to="/auth"
              className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;