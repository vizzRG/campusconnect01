// client/src/services/aiService.js
import api from "./api.js";

export const aiService = {
  enhanceQuestion: async (data) => {
    const response = await api.post("/ai/enhance-question", data);
    return response.data;
  },

  generateTags: async (data) => {
    const response = await api.post("/ai/generate-tags", data);
    return response.data;
  },

  checkGrammar: async (text) => {
    const response = await api.post("/ai/check-grammar", { text });
    return response.data;
  },
};

export default aiService;
