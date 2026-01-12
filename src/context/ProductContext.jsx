import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'https://node-backend-pz3j.onrender.com/api/products';

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(API_URL);
      
      if (response.data && response.data.success) {
        // Transform API data to match our app's structure
        const transformedProducts = response.data.data.map(item => {
          // Normalize category names from API to match category slug format
          let normalizedCategory = item.category;
          
          // Map API categories to match the category slugs from categories API
          const categoryMap = {
            'Vegetables': 'vegetables',
            'Fruits': 'fruits',
            'Dairy': 'dairy',
            'Superfoods': 'superfoods',
            'Pulses': 'pulses',
            'Pulses & Dals': 'pulses',
            'Atta, Rice & Chura': 'atta-rice-chura',
            'Spices & Herbs': 'spices-herbs',
            'Desi Non-Veg': 'non-veg',
            'Local Processed Foods': 'local-processed'
          };
          
          // Use mapped category if available, otherwise convert to lowercase slug format
          normalizedCategory = categoryMap[item.category] || item.category.toLowerCase().replace(/\s+/g, '-');
          
          return {
            id: item.id,
            name: item.name,
            category: normalizedCategory,
            subcategory: item.subcategory || '',
            price: parseFloat(item.price),
            unit: item.unit,
            description: item.description,
            image: item.imageUrl,
            images: [item.imageUrl],
            bgImage: item.bgImageUrl,
            vitamins: item.vitamins || [],
            minerals: item.minerals || [],
            dietaryFiber: item.dietaryFiber || '',
            antioxidants: item.antioxidants || '',
            healthBenefits: item.healthBenefits || [],
            isActive: item.isActive !== false,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            // Additional fields for compatibility
            farmer_sold: true,
            local_only: false,
            quantity_units: item.unit,
            off_reference: item.offReference || ''
          };
        });
        
        setProducts(transformedProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]); // Set empty array on error to show "no products" UI
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Get products by category
  const getProductsByCategory = (categoryName) => {
    return products.filter(product => 
      product.category.toLowerCase() === categoryName.toLowerCase()
    );
  };

  // Get product by ID
  const getProductById = (productId) => {
    return products.find(product => product.id === productId);
  };

  // Get random products from a category
  const getRandomProductsByCategory = (categoryName, count = 4) => {
    const categoryProducts = getProductsByCategory(categoryName);
    const shuffled = [...categoryProducts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Refresh products
  const refreshProducts = () => {
    fetchProducts();
  };

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    getProductsByCategory,
    getProductById,
    getRandomProductsByCategory,
    refreshProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;