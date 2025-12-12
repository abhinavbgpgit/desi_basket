import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiService as api } from '../services/api';
import ProductCard from '../components/ProductCard';
import ComboPackCard from '../components/ComboPackCard';

const HomeDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [comboPacks, setComboPacks] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { getItemCount } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, packsResponse, requestResponse] = await Promise.all([
          api.getFeaturedProducts(),
          api.getComboPacks(),
          api.getActiveRequest()
        ]);

        setFeaturedProducts(productsResponse);
        setComboPacks(packsResponse);
        setActiveRequest(requestResponse);
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { name: "Vegetables", icon: "🥬", route: "/app/category/Vegetables" },
    { name: "Fruits", icon: "🍎", route: "/app/category/Fruits" },
    { name: "Grains", icon: "🌾", route: "/app/category/Grains" },
    { name: "Dairy", icon: "🥛", route: "/app/category/Dairy" },
    { name: "Local Meat", icon: "🍗", route: "/app/category/Local Meat & Eggs" },
    { name: "Local Fish", icon: "🐟", route: "/app/category/Local Fish" },
    { name: "Local Processed", icon: "🧈", route: "/app/category/Local Processed Foods" },
    { name: "Organic", icon: "🌱", route: "/app/category/Organic Specials" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 bg-white shadow-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for fresh produce..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled
            />
            <div className="absolute left-4 top-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-4 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm animate-pulse">
                <div className="text-3xl mb-2 bg-gray-200 rounded-full w-12 h-12 mx-auto"></div>
                <div className="text-sm font-medium text-gray-700 bg-gray-200 rounded h-4"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 bg-gray-200 rounded h-6 w-32"></h2>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden w-48 animate-pulse">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 mt-6 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 bg-gray-200 rounded h-6 w-40"></h2>
          <div className="space-y-4">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="p-4 bg-white shadow-sm">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for fresh produce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="absolute left-4 top-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </form>
      </div>

      {/* Categories */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Shop by Category</h2>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.route}
              className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium text-gray-700">{category.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="p-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Featured This Week</h2>
          <Link to="/app/category/all" className="text-green-600 text-sm hover:text-green-700">
            See All
          </Link>
        </div>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-48">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Combo Packs */}
      <div className="p-4 mt-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Combo Packs</h2>
        <div className="space-y-4">
          {comboPacks.map((pack) => (
            <ComboPackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </div>

      {/* Request Status */}
      {activeRequest && (
        <div className="p-4 mt-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-green-800">Your Weekly Request</h3>
                <p className="text-sm text-gray-600">Status: {activeRequest.status}</p>
                <p className="text-sm text-gray-600">Delivery: {activeRequest.deliveryDate}</p>
              </div>
              <Link to="/app/requests" className="text-green-600 text-sm hover:text-green-700">
                View Details
              </Link>
            </div>
            <div className="mt-3 flex space-x-2">
              {activeRequest.items.slice(0, 3).map((item) => (
                <img
                  key={item.id}
                  src={item.image || '/placeholder-product.jpg'}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
              ))}
              {activeRequest.items.length > 3 && (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs">
                  +{activeRequest.items.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Farmers Section */}
      <div className="p-4 mt-6 bg-white rounded-xl relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Meet Our Local Farmers</h2>
          <Link to="/app/farmers" className="text-green-600 text-sm hover:text-green-700 flex items-center">
            View All Farmers
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Modern Farmer Card 1 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
            <div className="flex">
              <div className="w-2/5">
                <img
                  src="/farmer1.jpg"
                  alt="Ramesh Kumar - Organic Vegetable Farmer"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/farmer-placeholder.jpg'; }}
                />
              </div>
              <div className="w-3/5 p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Ramesh Kumar</h3>
                <p className="text-sm text-green-600 mb-1">🌱 Organic Vegetables</p>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  Gorakhpur, UP
                </div>
                <p className="text-xs text-gray-500 mb-2">15+ years experience</p>
                <div className="flex items-center text-xs text-green-600 mb-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Certified Organic
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                  </svg>
                  4.8★ (120 reviews)
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <Link to="/app/farmers" className="text-xs text-green-60 hover:text-green-800 font-medium">
                    See more to connect →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Farmer Card 2 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
            <div className="flex">
              <div className="w-2/5">
                <img
                  src="/farmer2.jpg"
                  alt="Sita Devi - Dairy Farmer"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/farmer-placeholder.jpg'; }}
                />
              </div>
              <div className="w-3/5 p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Sita Devi</h3>
                <p className="text-sm text-green-600 mb-1">🥛 A2 Milk & Ghee</p>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  Varanasi, UP
                </div>
                <p className="text-xs text-gray-500 mb-2">20+ years experience</p>
                <div className="flex items-center text-xs text-green-600 mb-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Premium Quality
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                  </svg>
                  4.9★ (98 reviews)
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <Link to="/app/farmers" className="text-xs text-green-60 hover:text-green-800 font-medium">
                    See more to connect →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Farmer Card 3 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
            <div className="flex">
              <div className="w-2/5">
                <img
                  src="/farmer3.jpg"
                  alt="Amit Yadav - Seasonal Produce Farmer"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/farmer-placeholder.jpg'; }}
                />
              </div>
              <div className="w-3/5 p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Amit Yadav</h3>
                <p className="text-sm text-green-600 mb-1">🍎 Seasonal Produce</p>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  Lucknow, UP
                </div>
                <p className="text-xs text-gray-500 mb-2">8+ years experience</p>
                <div className="flex items-center text-xs text-green-600 mb-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Farm Fresh
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                  </svg>
                  4.7★ (85 reviews)
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <Link to="/app/farmers" className="text-xs text-green-60 hover:text-green-800 font-medium">
                    See more to connect →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Farmer Card 4 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
            <div className="flex">
              <div className="w-2/5">
                <img
                  src="/farmer4.jpg"
                  alt="Priya Sharma - Grains & Pulses Farmer"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/farmer-placeholder.jpg'; }}
                />
              </div>
              <div className="w-3/5 p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Priya Sharma</h3>
                <p className="text-sm text-green-600 mb-1">🌾 Grains & Pulses</p>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  Kanpur, UP
                </div>
                <p className="text-xs text-gray-500 mb-2">12+ years experience</p>
                <div className="flex items-center text-xs text-green-600 mb-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Traditional Farming
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                  </svg>
                  4.8★ (110 reviews)
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <Link to="/app/farmers" className="text-xs text-green-60 hover:text-green-800 font-medium">
                    See more to connect →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Browse All Farmers Card */}
          <div className="bg-green-50 rounded-xl p-4 text-center hover:bg-green-100 transition-colors">
            <div className="w-12 h-12 rounded-lg mx-auto mb-3 bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Explore All Farmers</h3>
            <p className="text-xs text-gray-600 mb-3">Discover our local farming community</p>
            <Link to="/app/farmers" className="inline-flex items-center text-green-600 text-sm font-medium hover:text-green-700">
              Browse All Farmers
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
       </div>
       
     </div>
   </div>
 );
};

export default HomeDashboard;