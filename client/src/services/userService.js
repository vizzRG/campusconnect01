// client/src/services/userService.js
import api from "./api.js";

export const userService = {
  getAll: (params) => api.get("/users", { params }),
  getOne: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put("/users/profile", data),
  uploadAvatar: (formData) =>
    api.post("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAvatar: () => api.delete("/users/avatar"),
  getStats: (id) => api.get(`/users/stats/${id || ""}`),
};
