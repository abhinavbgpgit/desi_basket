import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import desiLogoInverted from '../assets/desi_logo_inverted.png';
import foodsImage from '../assets/foods.png';

const Auth = () => {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
    deliveryInstructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { sendOTP, login, completeProfile } = useAuth();
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
      // Bypass OTP sending - API not ready
      console.log('Bypassing OTP sending for phone:', phone);
      setStep('otp');
    } catch (error) {
      setError(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Bypass OTP validation - accept any OTP
    console.log('Bypassing OTP verification for phone:', phone, 'with OTP:', otp);

    try {
      // Bypass login API call - API not ready
      console.log('Bypassing login API call');

      // Simulate successful login with mock user data
      const mockUser = {
        phone: phone,
        profileCompleted: false, // Force profile completion step
        name: '',
        email: ''
      };

      // Store mock token
      localStorage.setItem('token', 'mock-token-' + phone);

      // Move to profile step
      setStep('profile');
    } catch (error) {
      setError(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!profileData.name.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    if (!profileData.address.trim()) {
      setError('Please enter your address');
      setLoading(false);
      return;
    }

    if (!profileData.city.trim()) {
      setError('Please enter your city');
      setLoading(false);
      return;
    }

    if (!profileData.pincode.match(/^\d{6}$/)) {
      setError('Please enter a valid 6-digit pincode');
      setLoading(false);
      return;
    }

    try {
      const response = await completeProfile({
        ...profileData,
        phone
      });

      if (response.success) {
        navigate('/app');
      }
    } catch (error) {
      setError(error.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Visual content */}
          <div className="lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 p-8 lg:p-12 flex flex-col justify-center items-center text-white">
           
              <img src={desiLogoInverted} alt="Desi Basket Logo" className="w-72  h-20" />
           
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-center">Welcome to Desi Basket</h1>
            <p className="text-center text-green-100 mb-8 max-w-sm">
              Experience the freshest produce directly from local farmers to your doorstep.
            </p>

            {/* Sab Hatke Foods Image */}
            <div className="relative w-72  h-64 rounded-2xl overflow-hidden">
              <img
                src={foodsImage}
                alt="Sab Hatke Foods"
                className="w-72 h-full "
              />
            </div>
          </div>

          {/* Right side - Form content */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center items-center">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm"
              >
                {error}
              </motion.div>
            )}

            {step === 'phone' && (
              <PhoneStep
                phone={phone}
                setPhone={setPhone}
                onSubmit={handlePhoneSubmit}
                loading={loading}
              />
            )}

            {step === 'otp' && (
              <OtpStep
                otp={otp}
                setOtp={setOtp}
                onSubmit={handleOtpSubmit}
                onResend={() => sendOTP(phone)}
                loading={loading}
                phone={phone}
              />
            )}

            {step === 'profile' && (
              <ProfileStep
                profileData={profileData}
                onChange={handleInputChange}
                onSubmit={handleProfileSubmit}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PhoneStep = ({ phone, setPhone, onSubmit, loading }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6 ">
       
        <div className="flex justify-center items-center">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full max-w-md">
            <span className="inline-flex items-center px-3 bg-gray-50 text-gray-500 text-sm h-12 border-r border-gray-300">
              +91
            </span>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your mobile number"
              className="flex-1 h-12 border-none focus:ring-green-500 focus:border-green-500 focus:outline-none px-3"
              maxLength={10}
              required
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          We'll send you a one-time password (OTP) to verify your number
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
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
            Sending OTP...
          </span>
        ) : (
          'Continue with OTP'
        )}
      </motion.button>
    </form>
  );
};

const OtpStep = ({ otp, setOtp, onSubmit, onResend, loading, phone }) => {
  const [resendTimer, setResendTimer] = React.useState(30);
  const [canResend, setCanResend] = React.useState(false);

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResend = async () => {
    setCanResend(false);
    setResendTimer(30);
    await onResend();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6">
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
          Enter OTP
        </label>
        <p className="text-sm text-gray-600 mb-4">
          We've sent a 6-digit code to +91 {phone}
        </p>

        <div className="flex justify-center space-x-2 mb-4">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={otp[index] || ''}
              onChange={(e) => {
                const newOtp = otp.split('');
                newOtp[index] = e.target.value;
                setOtp(newOtp.join(''));
                if (e.target.value && index < 5) {
                  document.getElementById(`otp-${index + 1}`).focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !otp[index] && index > 0) {
                  document.getElementById(`otp-${index - 1}`).focus();
                }
              }}
              id={`otp-${index}`}
              className="w-10 h-12 text-center border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-lg"
              required
            />
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || loading}
            className="text-sm text-green-600 hover:text-green-700 disabled:text-gray-400"
          >
            {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
          </button>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading || otp.length !== 6}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
          loading || otp.length !== 6
            ? 'bg-green-300 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
            </svg>
            Verifying...
          </span>
        ) : (
          'Verify OTP'
        )}
      </motion.button>
    </form>
  );
};

const ProfileStep = ({ profileData, onChange, onSubmit, loading }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profileData.name}
            onChange={onChange}
            placeholder="Enter your full name"
            className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Full Address
          </label>
          <textarea
            id="address"
            name="address"
            value={profileData.address}
            onChange={onChange}
            placeholder="Enter your full address"
            rows={3}
            className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={profileData.city}
            onChange={onChange}
            placeholder="Enter your city"
            className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={profileData.pincode}
              onChange={onChange}
              placeholder="Enter pincode"
              maxLength={6}
              className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-1">
              Referral Code (Optional)
            </label>
            <input
              type="text"
              id="referralCode"
              name="referralCode"
              value={profileData.referralCode || ''}
              onChange={onChange}
              placeholder="Enter referral code"
              className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Instructions (Optional)
          </label>
          <textarea
            id="deliveryInstructions"
            name="deliveryInstructions"
            value={profileData.deliveryInstructions || ''}
            onChange={onChange}
            placeholder="Any special delivery instructions?"
            rows={2}
            className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
          loading
            ? 'bg-green-300 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
            </svg>
            Completing Profile...
          </span>
        ) : (
          'Complete Profile'
        )}
      </motion.button>
    </form>
  );
};

export default Auth;