import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiService as api } from '../services/api';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState('');

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.getProductDetails(productId);
        setProduct(response);
        if (response.deliveryDays && response.deliveryDays.length > 0) {
          setSelectedDeliveryDay(response.deliveryDays[0]);
        }
      } catch (error) {
        console.error('Failed to load product details:', error);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      ...product,
      quantity,
      deliveryDay: selectedDeliveryDay
    });
    navigate('/app/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative h-64 bg-gray-200 animate-pulse"></div>

        <div className="p-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>

          <div className="bg-green-50 rounded-lg p-3 mb-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>

          <div className="mb-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>

          <div className="space-y-3 mb-6 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          <div className="h-10 bg-green-300 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Product</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/app')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <img src="/product-not-found.png" alt="Product not found" className="w-48 h-48 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/app')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <div className="relative">
        <div className="h-64 w-full">
          <img
            src={product.images?.[selectedImage] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
          />
        </div>

        {product.images?.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex justify-center space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-12 h-12 rounded-lg border-2 ${index === selectedImage ? 'border-green-500' : 'border-transparent'}`}
                >
                  <img
                    src={image || '/placeholder-product.jpg'}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-sm text-gray-600">{product.category}</p>
          </div>
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
            {product.certification || 'Certified'}
          </div>
        </div>

        {/* Farmer Info (Optional) */}
        {product.farmer && (
          <div className="flex items-center mb-4 p-3 bg-green-50 rounded-lg">
            <img
              src={product.farmer.image || '/farmer-placeholder.jpg'}
              alt={product.farmer.name}
              className="w-10 h-10 rounded-full mr-3 object-cover"
              onError={(e) => {
                e.target.src = '/farmer-placeholder.jpg';
              }}
            />
            <div>
              <p className="font-semibold text-sm">{product.farmer.name}</p>
              <p className="text-xs text-gray-600">{product.farmer.location}</p>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">About this product</h3>
          <p className="text-sm text-gray-600">{product.description}</p>
        </div>

        {/* Benefits */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Benefits</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            {product.benefits?.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                {benefit}
              </li>
            )) || <li>High quality farm fresh product</li>}
          </ul>
        </div>

        {/* Price and Quantity */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Price</span>
            <span className="text-lg font-bold text-green-800">₹{product.price}/{product.unit}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Quantity</span>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-gray-500 hover:text-gray-700"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-1 border-l border-r border-gray-200">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-gray-500 hover:text-gray-700"
              >
                +
              </button>
            </div>
          </div>

          {product.deliveryDays && product.deliveryDays.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Delivery Day</span>
              <select
                value={selectedDeliveryDay}
                onChange={(e) => setSelectedDeliveryDay(e.target.value)}
                className="px-3 py-1 border border-gray-200 rounded-md text-sm"
              >
                {product.deliveryDays.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4"
        >
          Add to Weekly Request
        </button>

        {/* Delivery Info */}
        <div className="bg-green-50 rounded-lg p-3 text-sm text-gray-600">
          <p className="font-semibold text-green-800 mb-1">Delivery Information</p>
          <p>Your weekly request will be delivered every {selectedDeliveryDay}. You can change this in your cart.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;