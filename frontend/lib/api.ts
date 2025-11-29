import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/signup', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getMe: () => api.get('/auth/me')
};

// Forms API
export const formsAPI = {
  generateForm: (prompt: string) =>
    api.post('/forms/generate', { prompt }),
  
  getUserForms: () => api.get('/forms/my-forms'),
  
  getFormById: (id: string) => api.get(`/forms/${id}`),
  
  getFormByLink: (link: string) => api.get(`/forms/public/${link}`),
  
  deleteForm: (id: string) => api.delete(`/forms/${id}`)
};

// Submissions API
export const submissionsAPI = {
  submitForm: (link: string, responses: Record<string, any>) =>
    api.post(`/submissions/${link}`, { responses }),
  
  getFormSubmissions: (formId: string) =>
    api.get(`/submissions/form/${formId}`),
  
  getAllUserSubmissions: () => api.get('/submissions/all')
};

// Upload API
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  deleteImage: (publicId: string) =>
    api.delete('/upload', { data: { publicId } })
};

export default api;
