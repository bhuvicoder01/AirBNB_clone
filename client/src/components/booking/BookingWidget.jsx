import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Calendar from './Calendar';
import PriceBreakdown from './PriceBreakdown';
import { calculateNights } from '../../utils/dateUtils';
import { calculateTotalPrice } from '../../utils/priceCalculator';

const BookingWidget = ({ property }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { createBooking } = useBooking();
  
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const pricing = nights > 0 ? calculateTotalPrice(property.price_per_night, nights) : null;

  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    try {
      await createBooking({
        propertyId: property.id,
        propertyTitle: property.title,
        checkIn,
        checkOut,
        guests,
        totalPrice: pricing.total,
        userId: 1 // TODO: Get from auth context
      });
      
      navigate('/bookings');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  return (
    <div className="card shadow-lg border-0">
      <div className="card-body p-4">
        {/* Price */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="h4 fw-bold">${property.price_per_night}</span>
            <span className="text-muted"> night</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <i className="bi bi-star-fill small"></i>
            <span className="fw-semibold">{property.rating.overall}</span>
            <span className="text-muted small">({property.reviews_count})</span>
          </div>
        </div>

        {/* Date Selection */}
        <div className="border rounded mb-3">
          <div className="row g-0">
            <div className="col-6 border-end">
              <div 
                className="p-3 cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <label className="small fw-semibold d-block">CHECK-IN</label>
                <div className="text-muted small">
                  {checkIn || 'Add date'}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div 
                className="p-3 cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <label className="small fw-semibold d-block">CHECKOUT</label>
                <div className="text-muted small">
                  {checkOut || 'Add date'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-top p-3">
            <label className="small fw-semibold d-block mb-2">GUESTS</label>
            <select 
              className="form-select"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
            >
              {[...Array(property.max_guests)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendar Popup */}
        {showCalendar && (
          <div className="mb-3">
            <Calendar
              checkIn={checkIn}
              checkOut={checkOut}
              onDateSelect={(dates) => {
                setCheckIn(dates.checkIn);
                setCheckOut(dates.checkOut);
                if (dates.checkOut) {
                  setShowCalendar(false);
                }
              }}
            />
          </div>
        )}

        {/* Reserve Button */}
        <button 
          className="btn btn-danger w-100 py-3 mb-3"
          onClick={handleReserve}
          disabled={!checkIn || !checkOut}
        >
          Reserve
        </button>

        <p className="text-center text-muted small mb-3">You won't be charged yet</p>

        {/* Price Breakdown */}
        {pricing && (
          <PriceBreakdown
            pricePerNight={property.price_per_night}
            nights={nights}
            pricing={pricing}
          />
        )}
      </div>
    </div>
  );
};

export default BookingWidget;
