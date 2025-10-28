import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import PropertyGrid from '../components/property/PropertyGrid';
import FilterPanel from '../components/search/FilterPanel';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { searchProperties } = useProperty();
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const filters = {
      location: searchParams.get('location') || '',
      checkIn: searchParams.get('checkIn'),
      checkOut: searchParams.get('checkOut'),
      adults: parseInt(searchParams.get('adults')) || 1,
      children: parseInt(searchParams.get('children')) || 0
    };

    const results = searchProperties(filters);
    setFilteredProperties(results);
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    const results = searchProperties(newFilters);
    setFilteredProperties(results);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Filter Sidebar */}
        <div className={`col-lg-3 ${showFilters ? '' : 'd-none d-lg-block'}`}>
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>

        {/* Results */}
        <div className="col-lg-9">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4>{filteredProperties.length} stays found</h4>
              <p className="text-muted mb-0">
                {searchParams.get('location') && `in ${searchParams.get('location')}`}
              </p>
            </div>
            <button 
              className="btn btn-outline-secondary d-lg-none"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="bi bi-funnel me-2"></i>
              Filters
            </button>
          </div>

          {/* Property Grid */}
          <PropertyGrid properties={filteredProperties} />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
