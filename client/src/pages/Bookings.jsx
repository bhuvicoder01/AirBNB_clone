import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { useProperty } from '../contexts/PropertyContext';

const Bookings = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const{properties}=useProperty();
  const {isLoading, userBookings, cancelBooking } = useBooking();
  const navigate=useNavigate()
  
  useEffect(() => {
    console.log('Language changed to:', language);
    console.log('Translation for myBookings:', t('myBookings'));
  }, [language, t]);
  
  // console.log(user?._id)
  const bookings = userBookings||[]
  // console.log(bookings)
  const upcomingBookings = bookings.filter(b => 
    (b?.status === 'confirmed'||b?.status==='pending') && new Date(b?.checkIn).getDate() >= new Date().getDate() 
  );
  const pastBookings = bookings.filter(b => 
    b?.status === 'completed' || new Date(b?.checkOut).getDate() < new Date().getDate()
  );
  const cancelledBookings = bookings?.filter(b => b?.status === 'cancelled');

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
    }
  };

  const BookingCard = ({ booking }) => (
    <Card shadow className="mb-3">
      <div className="row g-0">
        <span style={{fontFamily:'fantasy',color:`${booking.status==='cancelled'?'red':(booking.status==='pending'?'orange':'green')}`}}>{booking?.status==='pending'?'🤧Not confirmed':(booking.status==='cancelled'?'😵Cancelled':'😎Confirmed')}</span>
        <div className="col-md-4">
          <img
            src={properties.filter(p=>p._id===booking.propertyId)[0]?.images[0]}
            className="img-fluid rounded-start h-100"
            alt={booking.propertyTitle}
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{booking.propertyTitle}</h5>
            <p className="text-muted mb-2">
              <i className="bi bi-calendar me-2"></i>
              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <p className="text-muted mb-2">
              <i className="bi bi-people me-2"></i>
              {booking.guests} {t('guests')}
            </p>
            <p className="fw-bold mb-3">
              {t('total')}: ₹{booking.totalPrice}
            </p>
            
            <div className="d-flex gap-2">
              <Link to={`/property/${booking.propertyId}`}>
                <Button variant="secondary" size="sm">
                  {t('view')} Property
                </Button>
              </Link>
              {(booking?.status === 'confirmed'||booking?.status==='pending')&&booking?.payment?.status==='pending' && new Date(booking.checkIn).getDate >= new Date().getDate && (
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={() => navigate(`/payment/booking/${booking._id}`)}
                >
                  {t('Pay')} to Confirm
                </Button>
              )}
              {(booking?.status === 'confirmed'|| booking?.status==='pending') && new Date(booking?.checkIn).getDate >= new Date().getDate && (
                <Button 
                  variant="warning" 
                  size="sm"
                  onClick={() => handleCancelBooking(booking._id)}
                >
                  {t('cancel')} Booking
                </Button>
              )}
              {booking.status === 'completed' && (
                <Button variant="secondary" size="sm">
                  Write Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (<>
  {isLoading ? <Loading />:
    <div className="container mt-4">
      <h2 className="mb-4">{t('myBookings')}</h2>

      {/* Upcoming Bookings */}
      <div className="mb-5">
        <h4 className="mb-3">
          Upcoming Bookings ({upcomingBookings.length})
        </h4>
        {upcomingBookings.length > 0 ? (
          upcomingBookings.map(booking => (
            <BookingCard key={booking._id} booking={booking} />
          ))
        ) : (
          <Card>
            <div className="text-center py-5">
              <i className="bi bi-calendar-x fs-1 text-muted d-block mb-3"></i>
              <p className="text-muted mb-3">No upcoming bookings</p>
              <Link to="/">
                <Button>Find a place to stay</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Past Bookings */}
      <div className="mb-5">
        <h4 className="mb-3">
          Past Bookings ({pastBookings.length})
        </h4>
        {pastBookings.length > 0 ? (
          pastBookings.map(booking => (
            <BookingCard key={booking._id} booking={booking} />
          ))
        ) : (
          <p className="text-muted">No past bookings</p>
        )}
      </div>

      {/* Cancelled Bookings */}
      {cancelledBookings.length > 0 && (
        <div>
          <h4 className="mb-3">
            Cancelled Bookings ({cancelledBookings.length})
          </h4>
          {cancelledBookings.map(booking => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
}</> );
};

export default Bookings;
