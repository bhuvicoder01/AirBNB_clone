import React from 'react';
import PropertyCard from './PropertyCard';

const PropertyGrid = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-house fs-1 text-muted"></i>
        <p className="text-muted mt-3">No properties found😵</p>
      </div>
    );
  }
  const activeProperties=properties.filter(p=>p.isActive);
  if (!activeProperties || activeProperties.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-house fs-1 text-muted"></i>
        <p className="text-muted mt-3">No active properties found😵</p>
      </div>
    );
  }
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
      {activeProperties.map((property) => (
        <div key={property._id} className="col">
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
};

export default PropertyGrid;
