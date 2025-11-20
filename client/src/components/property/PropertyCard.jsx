import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';

const PropertyCard = ({ property }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {user}=useAuth()

  // Memoize wishlist check for performance
  const inWishlist = useMemo(() => isInWishlist(property._id), [property._id, isInWishlist]);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(property._id,user._id);
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

  // console.log(property)
  return (
    <Link to={`/property/${property._id}`} className="text-decoration-none text-dark" aria-label={`View details for ${property.title}`}>
      <div className="property-card mb-4">
        <div className="position-relative property-image-container">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-100 rounded-3"
            style={{ height: '280px', objectFit: 'cover' }}
          />
          <button
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className="btn btn-link position-absolute top-0 end-0 m-2 p-2 bg-white bg-opacity-75 rounded-circle"
            onClick={handleWishlistToggle}
            id={`wishlistbtn-${property._id}`}
          >
            <i className={`bi ${inWishlist ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
          </button>

          {property.images.length > 1 && (
            <>
              <button
                aria-label="Previous image"
                className="btn btn-sm btn-light rounded-circle position-absolute top-50 start-0 ms-2 translate-middle-y"
                onClick={prevImage}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                aria-label="Next image"
                className="btn btn-sm btn-light rounded-circle position-absolute top-50 end-0 me-2 translate-middle-y"
                onClick={nextImage}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}

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

        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="mb-0 fw-semibold">
                {property.location.city}, {property.location.country}
              </h6>
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
            <span className="fw-bold">₹{property.price_per_night}</span>
            <span className="text-muted"> night</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
