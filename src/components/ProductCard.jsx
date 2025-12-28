import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const {
    addToCart,
    updateQuantity,
    removeFromCart,
    getItemQuantity
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const quantity = getItemQuantity(product.id);

  const handleBuy = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }

    addToCart({
      ...product,
      quantity: 1
    });
  };

  const increment = (e) => {
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const decrement = (e) => {
    e.stopPropagation();
    if (quantity === 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-full">
      {/* Image */}
      <img
        src={product.images?.[0] || product.image || '/placeholder-product.jpg'}
        alt={product.name}
        className="w-full h-32 object-contain mb-2"
      />

      {/* Delivery time */}
      <div className="text-xs text-gray-600 mb-1">⏱ 11 MINS</div>

      {/* Name */}
      <h3 className="text-sm font-semibold leading-snug line-clamp-2">
        {product.name}
      </h3>

      {/* Weight */}
      <p className="text-xs text-gray-500 mb-3">
        {product.unit}
      </p>

      {/* Price + Action */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm">₹{product.price}</span>

        {quantity > 0 ? (
          <div className="flex items-center bg-green-600 text-white rounded-lg overflow-hidden">
            <button
              onClick={decrement}
              className="px-2 text-lg font-bold hover:bg-green-700"
            >
              −
            </button>
            <span className="px-3 text-sm font-semibold">
              {quantity}
            </span>
            <button
              onClick={increment}
              className="px-2 text-lg font-bold hover:bg-green-700"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleBuy}
            className="border border-green-600 text-green-700 text-sm font-semibold px-3 py-1 rounded-lg hover:bg-green-50"
          >
            Buy This
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
