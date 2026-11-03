// API client using axios for CareerLink
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to extract clean error message from API response or network failure
export const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.response && error.response.statusText) {
    return `Error: ${error.response.statusText}`;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

// Opportunity API endpoints
export const fetchOpportunities = (params = {}) => api.get('/opportunities', { params });
export const fetchDomains = () => api.get('/opportunities/domains');
export const fetchOpportunityById = (id) => api.get(`/opportunities/${id}`);
export const createOpportunity = (data) => api.post('/opportunities', data);
export const updateOpportunity = (id, data) => api.put(`/opportunities/${id}`, data);
export const deleteOpportunity = (id) => api.delete(`/opportunities/${id}`);

// Application API endpoints
export const createApplication = (data) => api.post('/applications', data);
export const fetchApplications = (params = {}) => api.get('/applications', { params });
export const fetchApplicationById = (id) => api.get(`/applications/${id}`);

export default api;

