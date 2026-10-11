import axios from 'axios';

// VITE_API_URL is configured on the hosting provider. Keep /api as the local fallback.
const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

// PDF parsing and the first embedding-model download can be slow on a cold free-tier backend.
const api = axios.create({
  baseURL: apiBaseUrl.replace(/\/$/, ''),
  timeout: 180000,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const friendly = getFriendlyError(error);
    return Promise.reject({ ...error, friendlyMessage: friendly });
  }
);

function getFriendlyError(error) {
  if (!error.response) {
    const detail = error.code === 'ECONNABORTED'
      ? 'The request took longer than 3 minutes'
      : (error.message || 'Check your internet or firewall');
    return `Cannot complete the MindForge server request (${detail}). The backend may still be starting or processing the PDF. Please check the backend logs before retrying.`;
  }

  const serverMsg = error.response.data?.detail;

  switch (error.response.status) {
    case 400: return serverMsg || 'Invalid request. Please check your input.';
    case 404: return 'Resource not found.';
    case 422: return 'Please upload a PDF before asking questions.';
    case 500: return serverMsg || 'Backend processing error. Try a different PDF.';
    default: return 'Something went wrong. Please try again.';
  }
}

export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const askQuestion = async (question, explanationMode, difficultyLevel, language) => {
  const response = await api.post('/ask/', {
    question,
    explanation_mode: explanationMode,
    difficulty_level: difficultyLevel,
    language,
  });
  return response.data;
};

export const getInsights = async () => {
  const response = await api.get('/insights/');
  return response.data;
};

export const getFiles = async () => {
  const response = await api.get('/upload/files');
  return response.data;
};

export default api;
