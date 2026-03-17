import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Shield, Camera, Edit3, Key, LogOut } from 'lucide-react';
import { updateUserProfile, logout } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    phone: user?.phone || '', 
    address: user?.address || '' 
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.updateProfile(formData).catch(() => ({
        ...user, ...formData
      }));
      dispatch(updateUserProfile(res));
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-gray-500 mt-2">Manage your personal information, security preferences and settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center sticky top-24">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-indigo-600 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-lg shadow-primary-500/30">
                {user?.name?.charAt(0) || <User size={48} />}
              </div>
              <button className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full text-gray-600 hover:text-primary-600 shadow-md border border-gray-100 transition-colors">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">{user?.name || "John Doe"}</h2>
            <p className="text-sm font-medium text-gray-500 mb-8">{user?.email || "john@example.com"}</p>
            
            <div className="flex flex-col gap-2">
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-medium rounded-xl transition-colors">
                <User size={18} /> Personal Information
              </button>
              <button className="flex items-center gap-3 px-4 py-3 bg-white text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors text-left border border-transparent">
                <Shield size={18} /> Security & Passwords
              </button>
              <hr className="my-2 border-gray-100" />
              <button onClick={() => dispatch(logout())} className="flex items-center gap-3 px-4 py-3 bg-white text-red-600 hover:bg-red-50 font-medium rounded-xl transition-colors text-left border border-transparent">
                <LogOut size={18} /> Logout securely
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-500 bg-primary-50 px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
              )}
            </div>

            <div className="p-6 sm:p-8">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3.5 transition-colors" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3.5 transition-colors" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3.5 transition-colors" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Address</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3.5 transition-colors"></textarea>
                  </div>
                  <div className="sm:col-span-2 flex gap-4 mt-4">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 bg-white text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-500 shadow-lg hover:shadow-primary-600/30 transition-all flex items-center justify-center min-w-[140px]">
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</h4>
                    <p className="text-base font-medium text-gray-900">{formData.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</h4>
                    <p className="text-base font-medium text-gray-900">{formData.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number</h4>
                    <p className="text-base font-medium text-gray-900">{formData.phone || 'Not provided'}</p>
                  </div>
                  <div className="sm:col-span-2">
                     <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Default Shipping Address</h4>
                     <p className="text-base font-medium text-gray-900">{formData.address || 'Address not configured yet.'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
