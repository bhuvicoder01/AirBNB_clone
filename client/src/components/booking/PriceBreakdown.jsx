import React from 'react';

const PriceBreakdown = ({ pricePerNight, nights, pricing }) => {
  return (
    <div className="price-breakdown">
      <div className="d-flex justify-content-between mb-2">
        <span className="text-decoration-underline">
          ${pricePerNight} x {nights} {nights === 1 ? 'night' : 'nights'}
        </span>
        <span>${pricing.subtotal.toFixed(2)}</span>
      </div>
      
      <div className="d-flex justify-content-between mb-2">
        <span className="text-decoration-underline">Cleaning fee</span>
        <span>${pricing.cleaningFee.toFixed(2)}</span>
      </div>
      
      <div className="d-flex justify-content-between mb-3">
        <span className="text-decoration-underline">Service fee</span>
        <span>${pricing.serviceFee.toFixed(2)}</span>
      </div>
      
      <hr />
      
      <div className="d-flex justify-content-between fw-bold">
        <span>Total</span>
        <span>${pricing.total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PriceBreakdown;
