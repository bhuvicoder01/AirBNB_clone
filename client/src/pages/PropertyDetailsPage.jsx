import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import PropertyGallery from '../components/property/PropertyGallery';
import AmenitiesList from '../components/property/AmenitiesList';
import ReviewsList from '../components/property/ReviewsList';
import BookingWidget from '../components/booking/BookingWidget';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const { getPropertyById } = useProperty();
  const [property, setProperty] = useState(null);

  const propertyData=async(id)=>{
    // console.log(id)
     const property=await getPropertyById(id)

    setProperty(property);
    // console.log(property)

    };
  useEffect(() => {
    // console.log(id)
    propertyData(id)
    
  }, [id]);

  if (!property) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Title */}
      <h2 className="mb-2">{property.title}</h2>
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="d-flex align-items-center gap-1">
          <i className="bi bi-star-fill"></i>
          <span className="fw-semibold">{property.rating.overall}</span>
          <span className="text-muted">({property.reviews_count} reviews)</span>
        </div>
        <span className="text-muted">·</span>
        <span className="text-decoration-underline">{property.location.city}, {property.location.country}</span>
      </div>

      {/* Gallery */}
      <PropertyGallery images={property.images} />

      {/* Main Content */}
      <div className="row mt-4">
        <div className="col-lg-7">
          {/* Host Info */}
          <div className="border-bottom pb-4">
            <h4>{property.property_type} hosted by {property.host.name}</h4>
            <p className="text-muted mb-3">
              {property.max_guests} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.bathrooms} baths
            </p>
            <div className="d-flex align-items-center gap-3">
              <img 
                src={property.host.avatar} 
                alt={property.host.name}
                className="rounded-circle"
                style={{ width: '48px', height: '48px' }}
              />
              {property.host.superhost && (
                <span className="badge bg-light text-dark border">
                  <i className="bi bi-star-fill text-danger me-1"></i>
                  Superhost
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-bottom py-4">
            <h5 className="mb-3">About this place</h5>
            <p>{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="border-bottom py-4">
            <h5 className="mb-3">What this place offers</h5>
            <AmenitiesList amenities={property.amenities} />
          </div>

          {/* Reviews */}
          <div className="py-4">
            <h5 className="mb-3">
              <i className="bi bi-star-fill me-2"></i>
              {property.rating.overall} · {property.reviews_count} reviews
            </h5>
            <ReviewsList propertyId={property.id} />
          </div>
        </div>

        {/* Booking Widget */}
        <div className="col-lg-5">
          <div className="position-sticky" style={{ top: '100px' }}>
            <BookingWidget property={property} />
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mt-5 border-top pt-4">
        <h5 className="mb-3">Where you'll be</h5>
        <div className="bg-light rounded p-3" style={{ height: '400px' }}>
          <p className="text-center text-muted">
            <i className="bi bi-geo-alt fs-1 d-block mb-2"></i>
            Map: {property.location.city}, {property.location.country}
            <br />
            <small>TODO: Integrate Google Maps API</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
