import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);

  useEffect(() => {
    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const createBooking = async (bookingData) => {
    // TODO: Replace with actual API call
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    return newBooking;
  };

  const getBookingById = (id) => {
    return bookings.find(b => b.id === parseInt(id));
  };

  const getUserBookings = (userId) => {
    return bookings.filter(b => b.userId === userId);
  };

  const cancelBooking = (bookingId) => {
    const updatedBookings = bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const value = {
    bookings,
    currentBooking,
    setCurrentBooking,
    createBooking,
    getBookingById,
    getUserBookings,
    cancelBooking
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};