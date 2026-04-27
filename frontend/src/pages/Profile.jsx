import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  User,
  Mail,
  Shield,
  Camera,
  Edit3,
  LogOut,
  Phone,
  MapPin,
} from "lucide-react";
import { logout, updateUserProfile } from "../store/slices/authSlice";
import { authService } from "../services/authService";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoadingPage(true);

      const res = await authService.getProfile();

      setUser(res);
      setFormData({
        name: res?.name || "",
        email: res?.email || "",
        phone: res?.phone || "",
        address: res?.address || "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoadingPage(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await authService.updateProfile(formData);

      setUser(res);
      dispatch(updateUserProfile(res));
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPage) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-2">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sticky top-24">
            <div className="text-center">
              <div className="relative w-28 h-28 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-primary-600 text-white flex items-center justify-center text-4xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || <User size={40} />}
                </div>

                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow border hover:bg-gray-50">
                  <Camera size={16} />
                </button>
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                {user?.name || "User"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {user?.email || "No Email"}
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-600 font-medium"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">
                <Shield size={18} />
                Security
              </button>

              <button
                onClick={() => dispatch(logout())}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h3>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="p-6">
              {isEditing ? (
                <form
                  onSubmit={handleUpdate}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 min-w-[140px]"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard
                    icon={<User size={18} />}
                    title="Full Name"
                    value={user?.name}
                  />

                  <InfoCard
                    icon={<Mail size={18} />}
                    title="Email"
                    value={user?.email}
                  />

                  <InfoCard
                    icon={<Phone size={18} />}
                    title="Phone"
                    value={user?.phone}
                  />

                  <InfoCard
                    icon={<MapPin size={18} />}
                    title="Address"
                    value={user?.address}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, value }) => {
  return (
    <div className="border rounded-xl p-4">
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>

      <p className="font-semibold text-gray-900">{value || "Not Provided"}</p>
    </div>
  );
};

export default Profile;
