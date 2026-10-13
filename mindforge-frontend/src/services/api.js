import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({
  baseURL: apiBaseUrl.replace(/\/$/, ''),
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage = error.response?.data?.detail;
    if (!error.response) {
      error.friendlyMessage = error.code === 'ECONNABORTED'
        ? 'The server did not respond in time. Please retry once the backend is awake.'
        : 'Cannot connect to the MindForge server. Please check the backend deployment.';
    } else if (serverMessage) {
      error.friendlyMessage = serverMessage;
    } else {
      error.friendlyMessage = `MindForge request failed (HTTP ${error.response.status}).`;
    }
    return Promise.reject(error);
  }
);

export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload/', formData);
  return response.data;
};

export const getIndexingStatus = async (jobId) => {
  const response = await api.get(`/upload/status/${encodeURIComponent(jobId)}`);
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
