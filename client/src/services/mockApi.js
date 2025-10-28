import { mockProperties, mockUsers } from '../data/mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API implementation
const mockApi = {
  // Properties
  properties: {
    getAll: async () => {
      await delay();
      return { data: mockProperties };
    },
    
    getById: async (id) => {
      await delay();
      const property = mockProperties.find(p => p.id === parseInt(id));
      if (!property) {
        throw new Error('Property not found');
      }
      return { data: property };
    },
    
    search: async (filters) => {
      await delay();
      let results = [...mockProperties];
      
      if (filters.location) {
        results = results.filter(p =>
          p.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
          p.location.country.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      if (filters.priceRange) {
        results = results.filter(p =>
          p.price_per_night >= filters.priceRange &&
          p.price_per_night <= filters.priceRange
        );
      }
      
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        results = results.filter(p =>
          filters.propertyTypes.includes(p.property_type)
        );
      }
      
      if (filters.amenities && filters.amenities.length > 0) {
        results = results.filter(p =>
          filters.amenities.every(amenity => p.amenities.includes(amenity))
        );
      }
      
      return { data: results };
    },
    
    create: async (propertyData) => {
      await delay();
      const newProperty = {
        id: mockProperties.length + 1,
        ...propertyData,
        rating: { overall: 0 },
        reviews_count: 0,
        createdAt: new Date().toISOString()
      };
      mockProperties.push(newProperty);
      return { data: newProperty };
    }
  },
  
  // Auth
  auth: {
    login: async (credentials) => {
      await delay();
      const user = mockUsers.find(u => u.email === credentials.email);
      if (!user || user.password !== credentials.password) {
        throw new Error('Invalid credentials');
      }
      const { password, ...userWithoutPassword } = user;
      return {
        data: {
          user: userWithoutPassword,
          token: 'mock-jwt-token-' + Date.now()
        }
      };
    },
    
    register: async (userData) => {
      await delay();
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
      const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        avatar: 'https://i.pravatar.cc/150',
        createdAt: new Date().toISOString()
      };
      mockUsers.push(newUser);
      const { password, ...userWithoutPassword } = newUser;
      return {
        data: {
          user: userWithoutPassword,
          token: 'mock-jwt-token-' + Date.now()
        }
      };
    }
  },
  
  // Bookings
  bookings: {
    create: async (bookingData) => {
      await delay();
      const booking = {
        id: Date.now(),
        ...bookingData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      // Store in localStorage
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push(booking);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      return { data: booking };
    },
    
    getUserBookings: async (userId) => {
      await delay();
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      return { data: bookings.filter(b => b.userId === userId) };
    },
    
    cancel: async (bookingId) => {
      await delay();
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedBookings = bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      );
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      return { data: { success: true } };
    }
  },
  
  // Reviews
  reviews: {
    getByProperty: async (propertyId) => {
      await delay();
      // Mock reviews for demo
      return {
        data: [
          {
            id: 1,
            propertyId,
            userName: 'John Doe',
            userAvatar: 'https://i.pravatar.cc/150?img=10',
            rating: 5,
            comment: 'Amazing place! Highly recommended.',
            createdAt: '2025-10-15'
          }
        ]
      };
    },
    
    create: async (reviewData) => {
      await delay();
      const review = {
        id: Date.now(),
        ...reviewData,
        createdAt: new Date().toISOString()
      };
      return { data: review };
    }
  }
};

export default mockApi;
