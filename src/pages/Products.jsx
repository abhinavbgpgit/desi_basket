import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import categoriesData from '../data/categories.json';
import productsData from '../data/data.json';
import { processCategoriesWithImages } from '../utils/categoryImages';

const Products = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryName || 'Vegetables');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const categoriesRef = useRef(null);

  // Process categories with imported images
  const categories = processCategoriesWithImages(categoriesData);

  // Update filtered products when category changes
  useEffect(() => {
    const category = categories.find(cat => cat.name === selectedCategory);
    if (!category) {
      setFilteredProducts([]);
      return;
    }

    const categoryKey = category.categoryKey;
    let products = productsData.filter(
      product => product.category === categoryKey
    );

    // Filter by subcategories if specified
    if (category.subcategories && category.subcategories.length > 0) {
      products = products.filter(
        product => category.subcategories.includes(product.subcategory)
      );
    }

    setFilteredProducts(products);
  }, [selectedCategory]);

  // Update selected category when URL param changes
  useEffect(() => {
    if (categoryName) {
      setSelectedCategory(decodeURIComponent(categoryName));
    }
  }, [categoryName]);

  // Drag scroll handlers
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
    e.preventDefault();
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
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const handleCategoryClick = (e) => {
    if (isDragging) {
      e.preventDefault();
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

  const currentCategory = categories.find(cat => cat.name === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Categories Section */}
      <div className="p-4 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Shop by Category</h2>
        <div className="relative">
          {/* Left Gradient Background - Hidden on mobile */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/20 to-transparent z-5 pointer-events-none"></div>

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
            className={`flex gap-2 overflow-x-auto pb-2 scrollbar-hide mt-3 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none px-0 md:px-12`}
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
                isSelected={selectedCategory === category.name}
              />
            ))}
          </div>

          {/* Right Gradient Background - Hidden on mobile */}
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/20 to-transparent z-5 pointer-events-none"></div>

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

        {/* Category Title and Count - Below Categories */}
        <div className="mt-6">
          <h1 className="text-xl font-bold text-gray-800">
            {currentCategory?.displayName || selectedCategory}
          </h1>
          <p className="text-sm text-gray-600 mt-1">{filteredProducts.length} items available</p>
        </div>
      </div>

      {/* Products Grid with Vertical Scroll */}
      <div className="p-4 pt-0">
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 280px)' }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-600">No items available in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;