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
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={product.images?.[0] || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-32 object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-product.jpg';
          }}
        />
        {product.isOrganic && (
          <span className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
            Organic
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">₹{product.price}/{product.unit}</p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-green-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;