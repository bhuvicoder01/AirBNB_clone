import axios from 'axios';

// API Base URL - Change this when you have a backend

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear user data and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods

// Auth
export const authAPI = {
  checkAuth:(id)=> api.get(`/auth/${id}`),
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token })
};

// Properties
export const propertyAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (propertyData) => api.post('/properties', propertyData),
  update: (id, propertyData) => api.put(`/properties/${id}`, propertyData),
  delete: (id) => api.delete(`/properties/${id}`),
  search: (filters) => api.post('/properties/search', filters)
};

// Bookings
export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getById: (id) => api.get(`/bookings/${id}`),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  confirm: (id) => api.put(`/bookings/${id}/confirm`)
};

// Reviews
export const reviewAPI = {
  create: (reviewData) => api.post('/reviews', reviewData),
  getByProperty: (propertyId) => api.get(`/reviews/property/${propertyId}`),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`)
};

// Users
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Payments
export const paymentAPI = {
  createIntent: (amount) => api.post('/payments/create-intent', { amount }),
  confirm: (paymentId) => api.post('/payments/confirm', { paymentId })
};

export default api;
