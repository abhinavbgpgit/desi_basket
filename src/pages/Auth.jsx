import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import desiLogoInverted from '../assets/desi_logo_inverted.png';
import foodsImage from '../assets/foods.png';

const Auth = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!phone.match(/^[6-9]\d{9}$/)) {
      setError('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    try {
      // Check if user exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '{}');
      let userData = existingUsers[phone];

      if (!userData) {
        // Create new user
        userData = {
          phone: phone,
          uid: `user_${phone}`,
          profileCompleted: true,
          name: '',
          email: '',
          hasAddress: false,
          createdAt: new Date().toISOString()
        };

        // Save to users database
        existingUsers[phone] = userData;
        localStorage.setItem('users', JSON.stringify(existingUsers));
      }

      // Store current user data
      localStorage.setItem('token', `token_${phone}`);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update AuthContext state
      if (setUser) {
        setUser(userData);
      }

      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Visual content */}
          <div className="lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 p-8 lg:p-12 flex flex-col justify-center items-center text-white">
            <img src={desiLogoInverted} alt="Desi Basket Logo" className="w-72 h-20" />
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-center">Welcome to Desi Basket</h1>
            <p className="text-center text-green-100 mb-8 max-w-sm">
              Experience the freshest produce directly from local farmers to your doorstep.
            </p>

            {/* Sab Hatke Foods Image */}
            <div className="relative w-72 h-64 rounded-2xl overflow-hidden">
              <img
                src={foodsImage}
                alt="Sab Hatke Foods"
                className="w-72 h-full"
              />
            </div>
          </div>

          {/* Right side - Form content */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center items-center">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Login to Continue</h2>
              <p className="text-gray-600 text-sm mb-6 text-center">
                Enter your mobile number to access your account
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handlePhoneSubmit}>
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                    <span className="inline-flex items-center px-3 bg-gray-50 text-gray-500 text-sm h-12 border-r border-gray-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your mobile number"
                      className="flex-1 h-12 border-none focus:ring-0 focus:outline-none px-3"
                      maxLength={10}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Your data will be saved and remembered for future visits
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !phone}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
                    loading || !phone
                      ? 'bg-green-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    'Continue'
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;