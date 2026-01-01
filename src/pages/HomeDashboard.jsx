import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { apiService as api } from '../services/api';
import ProductCard from '../components/ProductCard';
import ComboPackCard from '../components/ComboPackCard';
import FarmerCard from '../components/FarmerCard';
import CategoryCard from '../components/CategoryCard';
import BannerCarousel from '../components/BannerCarousel';
import farmersData from '../data/farmers.json';
import categoriesData from '../data/categories.json';
import productsData from '../data/data.json';
import { processCategoriesWithImages } from '../utils/categoryImages';

const HomeDashboard = () => {
  const [categoryProducts, setCategoryProducts] = useState({});
  const [comboPacks, setComboPacks] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const categoriesRef = useRef(null);

  // Process categories with imported images
  const categories = processCategoriesWithImages(categoriesData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [packsResponse, requestResponse] = await Promise.all([
          api.getComboPacks(),
          api.getActiveRequest()
        ]);

        // Group products by category and get random 4 from each
        const grouped = {};
        
        categories.forEach(category => {
          const categoryKey = category.categoryKey;
          let categoryItems = productsData.filter(
            product => product.category === categoryKey
          );

          // Filter by subcategories if specified
          if (category.subcategories && category.subcategories.length > 0) {
            categoryItems = categoryItems.filter(
              product => category.subcategories.includes(product.subcategory)
            );
          }
          
          // Shuffle and take 4 random items
          const shuffled = [...categoryItems].sort(() => Math.random() - 0.5);
          grouped[category.name] = shuffled.slice(0, 4);
        });

        setCategoryProducts(grouped);
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

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const container = categoriesRef.current;
      if (!container) return;
      
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, startX, scrollLeft]);


  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
    e.preventDefault(); // Prevent default behavior
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const handleCategoryClick = (e) => {
    if (isDragging) {
      e.preventDefault(); // Prevent navigation if dragging
      setIsDragging(false);
    }
  };

  const scrollLeftCategories = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRightCategories = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          {/* <h2 className="text-lg font-semibold text-gray-800 mb-4">Shop by Category</h2> */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-2 px-12 scrollbar-hide">
              {[...Array(11)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm animate-pulse flex-shrink-0 w-40">
                  <div className="text-3xl mb-2 bg-gray-200 rounded-full w-12 h-12 mx-auto"></div>
                  <div className="text-sm font-medium text-gray-700 bg-gray-200 rounded h-4"></div>
                </div>
              ))}
            </div>
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
    <div className="min-h-screen bg-green-50">
      {/* Banner Carousel Section */}
      <BannerCarousel />

      {/* Categories */}
      <div className="pt-2 bg-green-400 mt-2 rounded-xl">
        {/* <h2 className="text-base font-semibold text-gray-800 mb-4">Shop by Category</h2> */}
        <div className="relative">
          {/* Left Gradient Background - Hidden on mobile */}
          {/* <div className="hidden md:block absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/20 to-transparent z-5 pointer-events-none"></div> */}

          {/* Left Arrow - Hidden on mobile */}
          <button
            onClick={scrollLeftCategories}
            className="hidden md:block absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Categories Container */}
          <div
            ref={categoriesRef}
            className={`flex gap-2 overflow-x-auto pb-2 scrollbar-hide mt-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none px-0 md:px-12`}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                category={category}
                onClick={handleCategoryClick}
                isDragging={isDragging}
              />
            ))}
          </div>

          {/* Right Gradient Background - Hidden on mobile */}
          {/* <div className="hidden md:block absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/20 to-transparent z-5 pointer-events-none"></div> */}

          {/* Right Arrow - Hidden on mobile */}
          <button
            onClick={scrollRightCategories}
            className="hidden md:block absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category-wise Products */}
      {categories.map((category) => {
        const products = categoryProducts[category.name] || [];
        if (products.length === 0) return null;

        return (
          <div key={category.name} className="pt-0 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {category.displayName}
              </h2>
              <Link
                to={category.route}
                className="text-green-600 text-sm hover:text-green-700 flex items-center gap-1"
              >
                See All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:flex md:overflow-x-auto gap-2 p-1 scrollbar-hide">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
      })}

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
              <Link to="/requests" className="text-green-600 text-sm hover:text-green-700">
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
          <Link to="/farmers" className="text-green-600 text-sm hover:text-green-700 flex items-center">
            View All {farmersData.farmers.length} Farmers
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Display first 5 farmers using FarmerCard component */}
          {farmersData.farmers.slice(0, 5).map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}

          {/* Browse All Farmers Card */}
          <Link
            to="/farmers"
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center hover:from-green-100 hover:to-emerald-100 transition-all duration-300 border-2 border-green-200 hover:border-green-300 flex flex-col items-center justify-center group"
          >
            <div className="w-14 h-14 rounded-full mx-auto mb-3 bg-green-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Explore All Farmers</h3>
            <p className="text-xs text-gray-600 mb-3">Discover {farmersData.farmers.length}+ local farmers</p>
            <span className="inline-flex items-center text-green-600 text-sm font-semibold group-hover:text-green-700">
              Browse All
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;