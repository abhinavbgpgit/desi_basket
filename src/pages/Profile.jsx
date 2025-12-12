import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService as api } from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    email: '',
    addresses: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.getUserProfile();
        setProfileData(response.user);
      } catch (error) {
        console.error('Failed to load profile:', error);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // In a real app, you would call: await api.updateProfile(profileData);
      setEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setProfileData(prev => ({
      ...prev,
      addresses: [...prev.addresses, newAddress]
    }));
    setNewAddress({
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      isDefault: false
    });
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
          {editing ? (
            <button
              onClick={handleSaveProfile}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!editing}
                className={`w-full rounded-lg border ${editing ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' : 'border-transparent bg-gray-50'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled
                className="w-full rounded-lg border-transparent bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email || ''}
                onChange={handleInputChange}
                disabled={!editing}
                className={`w-full rounded-lg border ${editing ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' : 'border-transparent bg-gray-50'}`}
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Saved Addresses</h2>
            <button
              onClick={() => setNewAddress(prev => ({ ...prev, isDefault: profileData.addresses.length === 0 }))}
              className="text-green-600 text-sm hover:text-green-700"
            >
              + Add New Address
            </button>
          </div>

          {newAddress.name !== '' && (
            <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">Add New Address</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newAddress.name}
                    onChange={handleAddressChange}
                    className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleAddressChange}
                    className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                    placeholder="Phone number"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={newAddress.addressLine1}
                    onChange={handleAddressChange}
                    className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                    placeholder="Address line 1"
                  />
                  <input
                    type="text"
                    name="addressLine2"
                    value={newAddress.addressLine2}
                    onChange={handleAddressChange}
                    className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500 mt-2"
                    placeholder="Address line 2 (optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                      className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={newAddress.state}
                      onChange={handleAddressChange}
                      className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={newAddress.pincode}
                      onChange={handleAddressChange}
                      className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                      placeholder="Pincode"
                      maxLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={newAddress.landmark}
                      onChange={handleAddressChange}
                      className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                      placeholder="Landmark (optional)"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">Set as default address</label>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleAddAddress}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Save Address
                  </button>
                  <button
                    onClick={() => setNewAddress({
                      name: '',
                      phone: '',
                      addressLine1: '',
                      addressLine2: '',
                      city: '',
                      state: '',
                      pincode: '',
                      landmark: '',
                      isDefault: false
                    })}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {profileData.addresses && profileData.addresses.length > 0 ? (
            <div className="space-y-4">
              {profileData.addresses.map((address, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{address.name}</p>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      {address.landmark && (
                        <p className="text-sm text-gray-600 mt-1">Landmark: {address.landmark}</p>
                      )}
                      {address.isDefault && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                          Default Address
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 text-sm hover:text-blue-700">Edit</button>
                      <button className="text-red-500 text-sm hover:text-red-600">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">No addresses saved</p>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Notification Preferences</span>
              <button className="text-green-600 text-sm hover:text-green-700">Manage</button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">About FarmFresh</span>
              <button className="text-green-600 text-sm hover:text-green-700">Learn More</button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">Terms & Conditions</span>
              <button className="text-green-600 text-sm hover:text-green-700">View</button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">Privacy Policy</span>
              <button className="text-green-600 text-sm hover:text-green-700">View</button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100 transition-colors border border-red-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;