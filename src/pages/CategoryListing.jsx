import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService as api } from '../services/api';
import ProductCard from '../components/ProductCard';

const CategoryListing = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    seasonal: false,
    organic: false,
    weeklyDelivery: true
  });
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.getProductsByCategory(categoryId);
        setProducts(response);
      } catch (error) {
        console.error('Failed to load products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const applyFilters = () => {
    // Filter logic would be applied here
    // For now, we'll just log the filters
    console.log('Applying filters:', filters);
  };

  const filteredProducts = products
    .filter(product => filters.organic ? product.isOrganic : true)
    .filter(product => filters.seasonal ? product.isSeasonal : true)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // Default sort
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Products</h2>
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
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800 capitalize">{categoryId}</h1>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm"
            >
              <option value="popularity">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <button
              onClick={applyFilters}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="seasonal"
                checked={filters.seasonal}
                onChange={() => handleFilterChange('seasonal', !filters.seasonal)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="seasonal" className="ml-2 text-sm text-gray-700">Seasonal</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="organic"
                checked={filters.organic}
                onChange={() => handleFilterChange('organic', !filters.organic)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="organic" className="ml-2 text-sm text-gray-700">Organic</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weeklyDelivery"
                checked={filters.weeklyDelivery}
                onChange={() => handleFilterChange('weeklyDelivery', !filters.weeklyDelivery)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="weeklyDelivery" className="ml-2 text-sm text-gray-700">Weekly Delivery</label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <img src="/empty-products.png" alt="No products found" className="w-32 h-32 mx-auto mb-4" />
            <p className="text-gray-600">No products found in this category</p>
            <Link to="/app" className="text-green-600 mt-2 inline-block hover:text-green-700">
              Browse other categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryListing;