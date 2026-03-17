import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY,
  withCredentials: true, // ⭐ IMPORTANT: sends cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // No token logic needed because backend uses cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized responses
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request");

      // optional redirect
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;