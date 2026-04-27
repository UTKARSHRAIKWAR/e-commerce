import api from "./api";

export const authService = {

  // Register user
  register: async (userData) => {
    try {
      const { data } = await api.post("/auth/users/register", userData);
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const { data } = await api.post("/auth/users/login", credentials);
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get logged-in user profile
  getProfile: async () => {
    try {
      const { data } = await api.get("/auth/protected/users/profile/my");
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const { data } = await api.put("/auth/users/profile", userData);
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const { data } = await api.post("/auth/protected/users/logout");
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

};