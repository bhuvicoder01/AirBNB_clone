import React, { useState } from 'react';
import Modal from '../common/Modal';

const AmenitiesList = ({ amenities }) => {
  const [showAll, setShowAll] = useState(false);
  const displayAmenities = showAll ? amenities : amenities.slice(0, 10);

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': 'wifi',
      'Kitchen': 'house-door',
      'Free parking': 'car-front',
      'Parking': 'car-front',
      'Pool': 'water',
      'Hot tub': 'droplet',
      'Air conditioning': 'fan',
      'Heating': 'thermometer-half',
      'TV': 'tv',
      'Washer': 'washing-machine',
      'Dryer': 'washing-machine',
      'Gym': 'dumbbell',
      'Elevator': 'elevator',
      'Beach access': 'umbrella-beach',
      'Fireplace': 'fire',
      'Workspace': 'laptop',
      'Hair dryer': 'wind',
      'Iron': 'iron',
      'Essentials': 'basket'
    };
    return icons[amenity] || 'check2';
  };

  return (
    <>
      <div className="amenities-list">
        <div className="row g-3">
          {displayAmenities.map((amenity, index) => (
            <div key={index} className="col-md-6">
              <div className="d-flex align-items-center">
                <i className={`bi bi-${getAmenityIcon(amenity)} me-3 fs-5`}></i>
                <span>{amenity}</span>
              </div>
            </div>
          ))}
        </div>

        {amenities.length > 10 && (
          <button
            className="btn btn-outline-dark mt-4"
            onClick={() => setShowAll(true)}
          >
            Show all {amenities.length} amenities
          </button>
        )}
      </div>

      <Modal
        show={showAll}
        onClose={() => setShowAll(false)}
        title="All Amenities"
        size="lg"
      >
        <div className="row g-4">
          {amenities.map((amenity, index) => (
            <div key={index} className="col-md-6">
              <div className="d-flex align-items-center p-3 border rounded">
                <i className={`bi bi-${getAmenityIcon(amenity)} me-3 fs-4`}></i>
                <span className="fw-semibold">{amenity}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default AmenitiesList;
