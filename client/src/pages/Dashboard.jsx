import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserBookings ,bookings} = useBooking();
  
  const userBookings = user ? bookings : [];
  const upcomingBookings = userBookings.filter(b => b.status === 'confirmed'&& new Date(b.checkIn) > new Date());
  const pastBookings = userBookings.filter(b => b.status === 'completed' && new Date(b.checkOut) < new Date());

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Trips</h2>

      {/* Upcoming Trips */}
      <div className="mb-5">
        <h4 className="mb-3">Upcoming ({upcomingBookings.length})</h4>
        {upcomingBookings.length > 0 ? (
          <div className="row g-4">
            {upcomingBookings.map((booking) => (
              <div key={booking._id} className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5>{booking.propertyTitle}</h5>
                    <p className="text-muted">
                      {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                    <Link to={`/booking/${booking._id}`} className="btn btn-outline-dark">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 border rounded">
            <p className="text-muted">No upcoming trips</p>
            <Link to="/" className="btn btn-danger">Start searching</Link>
          </div>
        )}
      </div>

      {/* Past Trips */}
      <div>
        <h4 className="mb-3">Where you've been</h4>
        {pastBookings.length > 0 ? (
          <div className="row g-4">
            {pastBookings.map((booking) => (
              <div key={booking._id} className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5>{booking.propertyTitle}</h5>
                    <p className="text-muted">
                      {booking.checkIn} - {booking.checkOut}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No past trips</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
