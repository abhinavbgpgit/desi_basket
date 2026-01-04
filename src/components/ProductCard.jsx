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
  const totalPrice = quantity > 0 ? product.price * quantity : product.price;

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
    <div className="bg-white rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.12),0px_1px_2px_rgba(0,0,0,0.24)] pt-2 px-2 md:px-[15px] pb-3 w-full flex flex-col h-auto flex-shrink-0" style={{ minHeight: '370px' }}>
      
      {/* Image */}
      <div className="bg-red-300 rounded-lg overflow-hidden mb-3 flex justify-center md:-mx-[7px]
      shadow-[0px_1px_3px_rgba(0,0,0,0.12),0px_1px_2px_rgba(0,0,0,0.24)]
      ">
        <img
          src={product.images?.[0] || product.image || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-36 object-cover"
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">
        {product.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-3 leading-snug flex-grow">
        {product.description ||
          'High Vitamin C, very good for health and brain , eat daily'}
      </p>

      {/* Price + Action - Fixed at bottom on mobile */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mt-auto">
        
        {/* Price - Mobile: Single line, Desktop: Two lines */}
        <div className="flex items-center gap-2 md:flex-col md:items-start md:gap-0">
          <p className="text-red-600 font-semibold text-sm md:text-xl">
            ₹{totalPrice} Rs
          </p>
          <p className="text-sm text-gray-700">
            Amount : {quantity > 0 ? quantity + (product.unit ? product.unit.replace('1', '') : 'kg') : (product.unit || '1kg')}
          </p>
        </div>

        {/* Buy / Quantity */}
        <div className="flex flex-col items-center md:items-end w-full md:w-auto">
          {quantity > 0 ? (
            <>
              <div className="flex items-center bg-green-600 text-white rounded-lg overflow-hidden w-full md:w-auto mx-2 md:mx-0">
                {quantity === 1 ? (
                  <button
                    onClick={decrement}
                    className="px-3 py-1 text-lg font-bold hover:bg-green-700 flex items-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={decrement}
                    className="px-3 py-1 text-lg font-bold hover:bg-green-700"
                  >
                    −
                  </button>
                )}
                <span className="px-4 text-sm font-semibold flex-1 text-center">
                  {quantity}
                </span>
                <button
                  onClick={increment}
                  className="px-3 py-1 text-lg font-bold hover:bg-green-700"
                >
                  +
                </button>
              </div>

              {/* EXACT BELOW BUTTON */}
              <div className="flex flex-col items-center md:items-end gap-1 mt-1">
                <p className="text-green-600 text-sm font-medium">
                  added item into cart
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/weekly-cart');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-lg text-xs w-full md:w-auto"
                >
                  Go to Cart
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={handleBuy}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg text-sm w-full md:w-auto mx-2 md:mx-0"
            >
              Buy This
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
