import React, { createContext, useContext, useState, useEffect, use } from 'react';
import { bookingAPI } from '../services/api';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const user=JSON.parse(localStorage.getItem('user'))
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [userBookings,setUserBookings]=useState([]);
    const [isLoading,setIsLoading]=useState(true)


  const getUserBookings = async(userId) => {
   const userBookings=(await bookingAPI.getUserBookings(userId))
    if(userBookings.status===200){
    setBookings(userBookings.data.bookings)
    setUserBookings(userBookings.data.bookings)
    localStorage.setItem('bookings',JSON.stringify(userBookings.data.bookings))
    setIsLoading(false)
    return userBookings.data.bookings|[];}
    
  };
  
  useEffect(() => {

    (getUserBookings(user?._id))
    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
      setUserBookings(JSON.parse(storedBookings))
      
    }
    
    
  }, []);

  const createBooking = async (bookingData) => {
    // TODO: Replace with actual API call
    const newBooking = {
      ...bookingData,
      status: 'confirmed',
    }
    ;
    const response=await bookingAPI.create(newBooking)

    const updatedBookings = [...bookings, response.data.booking];
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    return response.data.booking;
  };

  const getBookingById = async(id) => {
    const booking=await bookingAPI.getById(id);
    return booking.data;
  };

  

  const cancelBooking = async(bookingId) => {
    console.log(bookings)
    const updatedBookings = bookings.map(b => {
      b._id === bookingId ? { ...b, status: 'cancelled' } : b
   console.log(b._id ,bookingId)
  }   
    );
    await bookingAPI.cancel(bookingId)
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    window.location.reload()
  };

  const value = {
    bookings,
    isLoading,
    currentBooking,
    userBookings,
    setCurrentBooking,
    createBooking,
    getBookingById,
    getUserBookings,
    cancelBooking
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};