// client/src/services/answerService.js
import api from "./api.js";

export const answerService = {
  getByQuestion: (questionId, params) =>
    api.get(`/answers/question/${questionId}`, { params }),
  create: (questionId, data) =>
    api.post(`/answers/question/${questionId}`, data),
  update: (id, data) => api.put(`/answers/${id}`, data),
  delete: (id) => api.delete(`/answers/${id}`),
  vote: (id, type) => api.post(`/answers/${id}/vote`, { type }),
  accept: (id) => api.post(`/answers/${id}/accept`),
  addComment: (id, body) => api.post(`/answers/${id}/comment`, { body }),
};
