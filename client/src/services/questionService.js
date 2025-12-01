// client/src/services/questionService.js
import api from "./api.js";

export const questionService = {
  getAll: (params) => api.get("/questions", { params }),
  getOne: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post("/questions", data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  vote: (id, type) => api.post(`/questions/${id}/vote`, { type }),
  getTags: () => api.get("/questions/tags"),
};
