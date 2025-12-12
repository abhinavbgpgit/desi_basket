import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      ...product,
      quantity: 1
    });
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
      <div className="flex">
        {/* Image on left */}
        <div className="relative w-1/3">
          <img
            src={product.images?.[0] || product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
          />
        </div>

        {/* Description on right */}
        <div className="w-2/3 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">₹{product.price}/{product.unit}</p>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
          </div>

          {/* Two buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleClick}
              className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Detail
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-green-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-green-70 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;