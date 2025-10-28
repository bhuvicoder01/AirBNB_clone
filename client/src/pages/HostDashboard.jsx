import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProperty } from '../contexts/PropertyContext';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const HostDashboard = () => {
  const { user } = useAuth();
  const { properties } = useProperty();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for host properties
  const hostProperties = properties.slice(0, 3); // Simulate host's properties
  const mockEarnings = {
    thisMonth: 4250,
    lastMonth: 3890,
    totalEarnings: 45890
  };
  const mockBookings = [
    {
      id: 1,
      guestName: 'John Doe',
      propertyTitle: 'Cozy Beach House',
      checkIn: '2025-11-15',
      checkOut: '2025-11-20',
      status: 'confirmed',
      amount: 1750
    },
    {
      id: 2,
      guestName: 'Jane Smith',
      propertyTitle: 'Mountain Cabin',
      checkIn: '2025-11-18',
      checkOut: '2025-11-22',
      status: 'pending',
      amount: 1120
    }
  ];

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>Host Dashboard</h2>
          <p className="text-muted">Welcome back, {user?.name}!</p>
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
                    <h3 className="mb-0">5</h3>
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
                    <h3 className="mb-0">${mockEarnings.thisMonth}</h3>
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
                    <h3 className="mb-0">${mockEarnings.totalEarnings}</h3>
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
                  {mockBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.guestName}</td>
                      <td>{booking.propertyTitle}</td>
                      <td>{booking.checkIn}</td>
                      <td>{booking.checkOut}</td>
                      <td>
                        <span className={`badge ${
                          booking.status === 'confirmed' ? 'bg-success' : 'bg-warning'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>${booking.amount}</td>
                      <td>
                        <Button size="sm" variant="secondary">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
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
            <div key={property.id} className="col-md-4">
              <Card shadow>
                <img
                  src={property.images}
                  alt={property.title}
                  className="w-100 rounded mb-3"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <h5 className="mb-2">{property.title}</h5>
                <p className="text-muted small mb-2">
                  {property.location.city}, {property.location.country}
                </p>
                <p className="fw-bold mb-3">${property.price_per_night}/night</p>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="secondary" fullWidth>
                    Edit
                  </Button>
                  <Button size="sm" variant="warning" fullWidth>
                    Disable
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Other tabs content... */}
    </div>
  );
};

export default HostDashboard;
