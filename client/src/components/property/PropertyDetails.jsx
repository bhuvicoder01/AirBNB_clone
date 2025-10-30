import React from 'react';

const PropertyDetails = ({ property }) => {
  return (
    <div className="property-details">
      {/* Main Title and Info */}
      <div className="mb-4">
        <h2 className="mb-2">{property.title}</h2>
        <div className="d-flex flex-wrap align-items-center gap-3 text-muted">
          <span>
            <i className="bi bi-star-fill text-warning me-1"></i>
            {property?.rating?.overall} ({property.reviews_count} reviews)
          </span>
          <span>·</span>
          <span className="text-decoration-underline">
            {property.location.city}, {property.location.country}
          </span>
        </div>
      </div>

      {/* Property Highlights */}
      <div className="border-top border-bottom py-4 mb-4">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <i className="bi bi-house-door fs-4 me-3"></i>
              <div>
                <h6 className="mb-1">{property.property_type}</h6>
                <p className="text-muted small mb-0">
                  {property.max_guests} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.bathrooms} baths
                </p>
              </div>
            </div>
          </div>

          {property.host.superhost && (
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                <i className="bi bi-award fs-4 me-3"></i>
                <div>
                  <h6 className="mb-1">{property.host.name} is a Superhost</h6>
                  <p className="text-muted small mb-0">
                    Superhosts are experienced, highly rated hosts
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <i className="bi bi-geo-alt fs-4 me-3"></i>
              <div>
                <h6 className="mb-1">Great location</h6>
                <p className="text-muted small mb-0">
                  95% of recent guests gave the location a 5-star rating
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <i className="bi bi-calendar-check fs-4 me-3"></i>
              <div>
                <h6 className="mb-1">Free cancellation for 48 hours</h6>
                <p className="text-muted small mb-0">
                  Get a full refund if you change your mind
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-muted">{property.description}</p>
      </div>
    </div>
  );
};

export default PropertyDetails;
