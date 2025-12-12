import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService as api } from '../services/api';

const FarmerDetails = () => {
  const { farmerId } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        setLoading(true);
        const [farmerData, farmerProducts] = await Promise.all([
          api.getFarmerDetails(farmerId),
          api.getProductsByFarmer(farmerId)
        ]);
        setFarmer(farmerData);
        setProducts(farmerProducts);
      } catch (error) {
        console.error('Failed to load farmer data:', error);
        setError('Failed to load farmer data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, [farmerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Farmer Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/app/farmers"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Farmers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="relative">
            <img
              src={farmer.image || '/farmer-placeholder.jpg'}
              alt={farmer.name}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.src = '/farmer-placeholder.jpg';
              }}
            />
            <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
              {farmer.yearsExperience}+ years experience
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{farmer.name}</h1>
                <p className="text-lg text-gray-600">{farmer.farmName}</p>
                <p className="text-sm text-gray-500 mt-1">📍 {farmer.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">📞 {farmer.contact}</p>
                <p className="text-sm text-gray-600 mt-1">✉️ Certified: {farmer.certification}</p>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {farmer.specialties.map((specialty, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">About {farmer.name.split(' ')[0]}</h2>
              <p className="text-gray-600">{farmer.description}</p>
            </div>
          </div>
        </div>

        {products.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Products by {farmer.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="relative mb-2">
                    <img
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-24 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    {product.isOrganic && (
                      <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                        Organic
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-sm text-gray-800 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600">₹{product.price}/{product.unit}</p>
                  <Link
                    to={`/app/product/${product.id}`}
                    className="block text-center mt-2 text-xs bg-green-600 text-white py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/app/farmers"
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Farmers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FarmerDetails;