import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProperty } from '../contexts/PropertyContext';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Toast from '../components/common/Toast';
import { propertyAPI, bookingAPI } from '../services/api';

const HostDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  
  // State for host data
  const [hostProperties, setHostProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState({
    thisMonth: 0,
    lastMonth: 0,
    totalEarnings: 0
  });

  // Fetch host properties and bookings
  useEffect(() => {
    const fetchHostData = async () => {
      try {
        setLoading(true);
        console.log("loading start")
        // Fetch properties owned by the host
        const propertiesResponse = await propertyAPI.getAll({ hostId: user?._id });
        setHostProperties(propertiesResponse.data);

        // Fetch bookings for the host's properties
        const bookingsResponse = await bookingAPI.getUserBookings(user?._id);
        setBookings(bookingsResponse.data.bookings);

        // Calculate earnings
        const calculateEarnings = () => {
          const now = new Date();
          const thisMonth = now.getMonth();
          const thisYear = now.getFullYear();

          const thisMonthEarnings = bookingsResponse.data.bookings
            .filter(booking => {
              const bookingDate = new Date(booking.checkIn);
              return bookingDate.getMonth() === thisMonth && 
                     bookingDate.getFullYear() === thisYear &&
                     booking.status === 'confirmed';
            })
            .reduce((total, booking) => total + booking.totalPrice, 0);

          const lastMonthEarnings = bookingsResponse.data.bookings
            .filter(booking => {
              const bookingDate = new Date(booking.checkIn);
              const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
              const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
              return bookingDate.getMonth() === lastMonth && 
                     bookingDate.getFullYear() === lastMonthYear &&
                     booking.status === 'confirmed';
            })
            .reduce((total, booking) => total + booking.totalPrice, 0);

          const totalEarnings = bookingsResponse.data.bookings
            .filter(booking => booking.status === 'confirmed')
            .reduce((total, booking) => total + booking.totalPrice, 0);

          setEarnings({
            thisMonth: thisMonthEarnings,
            lastMonth: lastMonthEarnings,
            totalEarnings
          });
        };

        calculateEarnings();
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        setShowToast(true);
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchHostData();
    }
  }, [user?._id]);

  // Handle property actions
  const handlePropertyAction = async (propertyId, action) => {
    try {
      if (action === 'edit') {
        navigate(`/host/edit-listing/${propertyId}`);
      } else if (action === 'disable') {
        await propertyAPI.toggleStatus(propertyId);
        setShowToast(true);
        // Refresh properties
        const response = await propertyAPI.getAll({ hostId: user?.id });
        setHostProperties(response.data);
      }
    } catch (err) {
      setError('Failed to perform action. Please try again.');
      setShowToast(true);
    }
  };

  // Handle booking actions
  const handleBookingAction = async (bookingId, action) => {
    try {
      if (action === 'confirm') {
        await bookingAPI.confirm(bookingId);
      } else if (action === 'cancel') {
        await bookingAPI.cancel(bookingId);
      }
      // Refresh bookings
      const response = await bookingAPI.getUserBookings(user?.id);
      setBookings(response.data.bookings);
    } catch (err) {
      setError('Failed to update booking status. Please try again.');
      setShowToast(true);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mt-4">
      {showToast && (
        <Toast 
          message={error || 'Operation successful'} 
          type={error ? 'error' : 'success'} 
          onClose={() => {
            setShowToast(false);
            setError(null);
          }}
        />
      )}
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>Host Dashboard</h2>
          <p className="text-muted">Welcome back, {user?.firstName} Sir!🤠</p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link to="/host/new-listing">
            <Button>
              <i className="bi bi-plus-circle me-2"></i>
              Add New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <Button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
        </li>
        <li className="nav-item">
          <Button
            className={`nav-link ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            Listings
          </Button>
        </li>
        <li className="nav-item">
          <Button
            className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </Button>
        </li>
        <li className="nav-item">
          <Button
            className={`nav-link ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            Earnings
          </Button>
        </li>
      </ul>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <Card shadow>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 small">Total Listings</p>
                    <h3 className="mb-0">{hostProperties.length}</h3>
                  </div>
                  <i className="bi bi-house fs-2 text-primary"></i>
                </div>
              </Card>
            </div>
            <div className="col-md-3">
              <Card shadow>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 small">Active Bookings</p>
                    <h3 className="mb-0">{bookings.filter(b=>b.status=="confirmed"&& b.isActive==true).length}</h3>
                  </div>
                  <i className="bi bi-calendar-check fs-2 text-success"></i>
                </div>
              </Card>
            </div>
            <div className="col-md-3">
              <Card shadow>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 small">This Month</p>
                    <h3 className="mb-0">₹{earnings.thisMonth}</h3>
                  </div>
                  <i className="bi bi-cash-stack fs-2 text-warning"></i>
                </div>
              </Card>
            </div>
            <div className="col-md-3">
              <Card shadow>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 small">Total Earned</p>
                    <h3 className="mb-0">₹{earnings.totalEarnings}</h3>
                  </div>
                  <i className="bi bi-graph-up fs-2 text-danger"></i>
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Bookings */}
          <Card title="Recent Bookings" shadow className="mb-4">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Property</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.userId}</td>
                      <td>{booking.propertyTitle}</td>
                      <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                      <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          booking.status === 'confirmed' ? 'bg-success' :
                          booking.status === 'pending' ? 'bg-warning' :
                          'bg-danger'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>₹{booking.totalPrice}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="success"
                                onClick={() => handleBookingAction(booking._id, 'confirm')}
                              >
                                Confirm
                              </Button>
                              <Button 
                                size="sm" 
                                variant="danger"
                                onClick={() => handleBookingAction(booking._id, 'cancel')}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              variant="danger"
                              onClick={() => handleBookingAction(booking._id, 'cancel')}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <div className="row g-4">
          {hostProperties.map(property => (
            <div key={property._id} className="col-md-4">
              <Card shadow>
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-100 rounded mb-3"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <h5 className="mb-2">{property.title}</h5>
                <p className="text-muted small mb-2">
                  {property.location.city}, {property.location.country}
                </p>
                <p className="fw-bold mb-3">₹{property.price_per_night}/night</p>
                <div className="d-flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    fullWidth
                    onClick={() => handlePropertyAction(property._id, 'edit')}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="warning" 
                    fullWidth
                    onClick={() => handlePropertyAction(property._id, 'disable')}
                  >
                    {property.isActive ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
          {hostProperties.length === 0 && (
            <div className="col-12">
              <Card shadow className="text-center py-5">
                <h5 className="mb-3">No Properties Listed</h5>
                <p className="text-muted mb-4">Start hosting by adding your first property</p>
                <Link to="/host/new-listing">
                  <Button>
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Listing
                  </Button>
                </Link>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <Card shadow>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Property</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking.userId}</td>
                    <td>{booking.propertyTitle}</td>
                    <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        booking.status === 'confirmed' ? 'bg-success' :
                        booking.status === 'pending' ? 'bg-warning' :
                        'bg-danger'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>₹{booking.totalPrice}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="success"
                              onClick={() => handleBookingAction(booking._id, 'confirm')}
                            >
                              Confirm
                            </Button>
                            <Button 
                              size="sm" 
                              variant="danger"
                              onClick={() => handleBookingAction(booking._id, 'cancel')}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => handleBookingAction(booking._id, 'cancel')}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Earnings Tab */}
      {activeTab === 'earnings' && (
        <div className="row">
          <div className="col-12">
            <Card shadow className="mb-4">
              <div className="row">
                <div className="col-md-4">
                  <h5>This Month</h5>
                  <h2 className="text-primary">₹{earnings.thisMonth}</h2>
                  <p className="text-muted">
                    {earnings.thisMonth > earnings.lastMonth ? (
                      <span className="text-success">
                        <i className="bi bi-arrow-up"></i>
                        {((earnings.thisMonth - earnings.lastMonth) / (earnings.lastMonth!=0?earnings.lastMonth:1) * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-danger">
                        <i className="bi bi-arrow-down"></i>
                        {((earnings.lastMonth - earnings.thisMonth) / (earnings.lastMonth!=0?earnings.lastMonth:1) * 100).toFixed(1)}%
                      </span>
                    )}
                    {' '}vs last month
                  </p>
                </div>
                <div className="col-md-4">
                  <h5>Last Month</h5>
                  <h2>₹{earnings.lastMonth}</h2>
                </div>
                <div className="col-md-4">
                  <h5>Total Earnings</h5>
                  <h2 className="text-success">₹{earnings.totalEarnings}</h2>
                </div>
              </div>
            </Card>

            <Card shadow title="Recent Transactions">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Guest</th>
                      <th>Property</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings
                      .filter(booking => booking.status === 'confirmed')
                      .slice(0, 10)
                      .map(booking => (
                        <tr key={booking._id}>
                          <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                          <td>{booking.userId}</td>
                          <td>{booking.propertyTitle}</td>
                          <td>
                            <span className="badge bg-success">Paid</span>
                          </td>
                          <td>₹{booking.totalPrice}</td>
                        </tr>
                      ))}
                    {bookings.filter(booking => booking.status === 'confirmed').length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostDashboard;
