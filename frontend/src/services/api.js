import axios from 'axios';

const API_URL = '/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API service functions
export const eventService = {
  // Get all events with optional filters
  getEvents: (params) => apiClient.get('/events/', { params }),
  
  // Get single event by ID
  getEvent: (id) => apiClient.get(`/events/${id}/`),
  
  // Create new event
  createEvent: (data) => apiClient.post('/events/', data),
  
  // Update event
  updateEvent: (id, data) => apiClient.put(`/events/${id}/`, data),
  
  // Delete event
  deleteEvent: (id) => apiClient.delete(`/events/${id}/`),
  
  // Register for event
  registerForEvent: (id) => apiClient.post(`/events/${id}/register/`),
  
  // Cancel registration
  cancelRegistration: (id) => apiClient.post(`/events/${id}/cancel/`),
};

export const categoryService = {
  // Get all categories
  getCategories: () => apiClient.get('/categories/'),
  
  // Get single category
  getCategory: (id) => apiClient.get(`/categories/${id}/`),
};

export const authService = {
  // Login user
  login: (credentials) => apiClient.post('/auth/login/', credentials),
  
  // Register user
  register: (userData) => apiClient.post('/auth/register/', userData),
  
  // Get current user profile
  getProfile: () => apiClient.get('/auth/profile/'),
  
  // Update user profile
  updateProfile: (data) => apiClient.put('/auth/profile/', data),
};

export const attendanceService = {
  // Get user's attendances
  getUserAttendances: () => apiClient.get('/attendances/'),
  
  // Update attendance status
  updateAttendanceStatus: (id, status) => apiClient.patch(`/attendances/${id}/`, { status }),
};