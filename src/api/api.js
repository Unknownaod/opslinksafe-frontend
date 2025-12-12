import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://opslinksafe-backend.onrender.com/api",
  // ❌ No cookies needed for JWT Bearer auth
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
});

// ✅ Automatically attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error handling (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🔐 Token invalid or expired — logging out.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
