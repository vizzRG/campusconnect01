// client/src/services/authService.js
import api from "./api.js";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  },

  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put("/auth/update-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  verifyToken: async () => {
    try {
      const response = await api.get("/auth/verify");
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      throw error;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
