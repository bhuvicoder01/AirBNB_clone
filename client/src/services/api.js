import axios from 'axios';

// API Base URL - Change this when you have a backend
const API_URL = import.meta.env.VITE_API_URL||'https://airbnb-clone-2cp7.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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
  // General property endpoints
  getAll: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  search: (filters) => api.get('/properties/search', { params: filters }),

  // Host property endpoints
  getHostProperties: () => api.get('/properties/host/properties'),
  getPropertiesByHostId: (hostId) => api.get(`/properties/host/${hostId}/properties`),
  create: (formData) => api.post('/properties/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  update: (id, propertyData) => api.put(`/properties/${id}`, propertyData),
  delete: (id) => api.delete(`/properties/${id}`),
  toggleStatus: (id) => api.patch(`/properties/${id}/toggle-status`),
  
  // Analytics endpoints for hosts
  getHostStats: () => api.get('/properties/host/stats')
};

// Bookings
export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getById: (id) => api.get(`/bookings/${id}`),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  confirm: (id) => api.put(`/bookings/${id}/confirm`),

  //host endpoints
  getAllBookingsForHostProperties: (hostId) => api.get(`bookings/host/${hostId}`)
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
  getUsersWishList:(userId)=>api.get(`/users/${userId}/wishlist`),
  addToWishlist:(wishlistData)=>api.post('/users/wishlist',wishlistData),
  removeFromWishList:(propertyId,userId)=>api.delete(`/users/${userId}/wishlist/${propertyId}`),
  updateProfile: (userId,userData) => api.put(`/users/${userId}/profile`, userData,{
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Payments
export const paymentAPI = {
  createIntent: (bookingId,paymentDetails) => api.post(`/payments/booking/${bookingId}`,paymentDetails),
  confirm: (paymentId) => api.post('/payments/confirm', { paymentId })
};

export default api;
