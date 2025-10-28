import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';

const PropertyCard = ({ property }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const inWishlist = isInWishlist(property.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(property.id);
    } else {
      addToWishlist(property);
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <Link to={`/property/${property.id}`} className="text-decoration-none text-dark">
      <div className="property-card mb-4">
        {/* Image Carousel */}
        <div className="position-relative property-image-container">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-100 rounded-3"
            style={{ height: '280px', objectFit: 'cover' }}
          />
          
          {/* Wishlist Button */}
          <button
            className="btn btn-link position-absolute top-0 end-0 m-2 p-2 bg-white bg-opacity-75 rounded-circle"
            onClick={handleWishlistToggle}
          >
            <i className={`bi ${inWishlist ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
          </button>

          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                className="btn btn-sm btn-light rounded-circle position-absolute top-50 start-0 ms-2 translate-middle-y"
                onClick={prevImage}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn btn-sm btn-light rounded-circle position-absolute top-50 end-0 me-2 translate-middle-y"
                onClick={nextImage}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}

          {/* Image Dots */}
          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
            <div className="d-flex gap-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`rounded-circle ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                  style={{ width: '6px', height: '6px' }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Property Info */}
        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="mb-0 fw-semibold">{property.location.city}, {property.location.country}</h6>
              <p className="text-muted small mb-0">{property.property_type}</p>
              <p className="text-muted small mb-0">
                {property.bedrooms} bed · {property.bathrooms} bath
              </p>
            </div>
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-star-fill small"></i>
              <span className="small fw-semibold">{property.rating.overall}</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="fw-bold">${property.price_per_night}</span>
            <span className="text-muted"> night</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
