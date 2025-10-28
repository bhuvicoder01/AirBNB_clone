import React, { useState } from 'react';

const FilterPanel = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
    onFilterChange({ priceRange: newRange });
  };

  const togglePropertyType = (type) => {
    const newTypes = propertyTypes.includes(type)
      ? propertyTypes.filter(t => t !== type)
      : [...propertyTypes, type];
    setPropertyTypes(newTypes);
    onFilterChange({ propertyTypes: newTypes });
  };

  const toggleAmenity = (amenity) => {
    const newAmenities = amenities.includes(amenity)
      ? amenities.filter(a => a !== amenity)
      : [...amenities, amenity];
    setAmenities(newAmenities);
    onFilterChange({ amenities: newAmenities });
  };

  return (
    <div className="filter-panel bg-white p-4 rounded shadow-sm">
      <h5 className="mb-4">Filters</h5>

      {/* Price Range */}
      <div className="mb-4">
        <h6 className="mb-3">Price Range</h6>
        <div className="d-flex gap-3 mb-2">
          <input
            type="number"
            className="form-control"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            placeholder="Min"
          />
          <input
            type="number"
            className="form-control"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            placeholder="Max"
          />
        </div>
        <input
          type="range"
          className="form-range"
          min="0"
          max="1000"
          value={priceRange[1]}
          onChange={(e) => handlePriceChange(e, 1)}
        />
      </div>

      {/* Property Type */}
      <div className="mb-4">
        <h6 className="mb-3">Property Type</h6>
        {['Entire place', 'Private room', 'Shared room'].map(type => (
          <div key={type} className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={propertyTypes.includes(type)}
              onChange={() => togglePropertyType(type)}
              id={type}
            />
            <label className="form-check-label" htmlFor={type}>
              {type}
            </label>
          </div>
        ))}
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <h6 className="mb-3">Amenities</h6>
        {['WiFi', 'Kitchen', 'Parking', 'Pool', 'Hot tub', 'Gym'].map(amenity => (
          <div key={amenity} className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={amenities.includes(amenity)}
              onChange={() => toggleAmenity(amenity)}
              id={amenity}
            />
            <label className="form-check-label" htmlFor={amenity}>
              {amenity}
            </label>
          </div>
        ))}
      </div>

      <button className="btn btn-dark w-100">
        Show Results
      </button>
    </div>
  );
};

export default FilterPanel;
