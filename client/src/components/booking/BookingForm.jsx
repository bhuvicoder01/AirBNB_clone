import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingForm = ({ booking, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    billingAddress: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // TODO: Integrate with actual payment gateway (Stripe/Razorpay)
    // For now, just simulate successful payment
    
    onSubmit({
      ...booking,
      guestInfo: formData,
      paymentStatus: 'completed'
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Guest Information */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Guest Information</h5>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Special Requests (Optional)</label>
            <textarea
              className="form-control"
              name="specialRequests"
              rows="3"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any special requests for your stay?"
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Payment Information</h5>
          
          <div className="alert alert-info mb-3">
            <i className="bi bi-info-circle me-2"></i>
            This is a demo. Use test card: 4242 4242 4242 4242
          </div>

          <div className="mb-3">
            <label className="form-label">Card Number *</label>
            <input
              type="text"
              className="form-control"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Expiry Date *</label>
              <input
                type="text"
                className="form-control"
                name="cardExpiry"
                placeholder="MM/YY"
                value={formData.cardExpiry}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">CVV *</label>
              <input
                type="text"
                className="form-control"
                name="cardCVV"
                placeholder="123"
                maxLength="3"
                value={formData.cardCVV}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Billing Address *</label>
            <input
              type="text"
              className="form-control"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Terms and Submit */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              required
              id="termsCheck"
            />
            <label className="form-check-label" htmlFor="termsCheck">
              I agree to the terms and conditions and cancellation policy
            </label>
          </div>

          <button type="submit" className="btn btn-danger w-100 py-3">
            Confirm and Pay
          </button>
        </div>
      </div>
    </form>
  );
};

export default BookingForm;
