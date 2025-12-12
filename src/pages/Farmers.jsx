import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService as api } from '../services/api';

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        const data = await api.getAllFarmers();
        setFarmers(data);
      } catch (error) {
        console.error('Failed to load farmers:', error);
        setError('Failed to load farmers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-green-800 mb-6">Our Local Farmers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden animate-pulse">
              <div className="flex">
                <div className="w-2/5">
                  <div className="w-full h-full bg-gray-200"></div>
                </div>
                <div className="w-3/5 p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-20 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Farmers</h2>
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
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Our Local Farmers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {farmers.map((farmer) => (
          <div key={farmer.id} className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
            <div className="flex">
              <div className="w-2/5">
                <img
                  src={farmer.image || '/farmer-placeholder.jpg'}
                  alt={farmer.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/farmer-placeholder.jpg';
                  }}
                />
              </div>
              <div className="w-3/5 p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{farmer.name}</h3>
                <p className="text-sm text-green-600 mb-1">{farmer.specialties && farmer.specialties.length > 0 ? `🌱 ${farmer.specialties[0]}` : '🌱 Local Produce'}</p>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  {farmer.location || 'Bhagalpur, Bihar'}
                </div>
                <p className="text-xs text-gray-500 mb-2">{farmer.yearsExperience || '5'}+ years experience</p>
                <div className="flex items-center text-xs text-green-600 mb-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  {farmer.certifications && farmer.certifications.length > 0 ? farmer.certifications[0] : 'Certified Farmer'}
                </div>
                <div className="flex items-center text-xs text-blue-600 mb-2">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1zm0 4a1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1z" clipRule="evenodd"></path>
                  </svg>
                  {farmer.rating || '4.5★'} ({farmer.reviewCount || '50'} reviews)
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <Link to={`/app/farmer/${farmer.id}`} className="text-xs text-green-60 hover:text-green-800 font-medium">
                    See more to connect →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-800 mb-2">About Our Farmers</h2>
        <p className="text-gray-600 mb-4">
          All our farmers are local to the Bhagalpur region and follow traditional, organic farming practices.
          They are certified and committed to providing the freshest, most natural produce to our community.
        </p>
        <p className="text-gray-600">
          By purchasing from our platform, you're directly supporting local farmers and helping to sustain
          traditional agricultural practices in our region.
        </p>
      </div>
    </div>
  );
};

export default Farmers;