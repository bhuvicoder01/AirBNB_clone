import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import PropertyGrid from '../components/property/PropertyGrid';
import FilterPanel from '../components/search/FilterPanel';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { searchProperties,setFilters } = useProperty();
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const filters = {
      location: searchParams.get('location') || '',
      checkIn: searchParams.get('checkIn') || null,
      checkOut: searchParams.get('checkOut') || null,
      adults: parseInt(searchParams.get('adults')) || 1,
      children: parseInt(searchParams.get('children')) || 0,
      infants: parseInt(searchParams.get('infants')) || 0
    };
    setFilters(filters)

    // Handle search from compact search bar (location only)
    if (!filters.checkIn && !filters.checkOut) {
      const results = searchProperties({
        location: filters.location,
        // Use default values for dates and guests
        checkIn: null,
        checkOut: null,
        adults: 1,
        children: 0,
        infants: 0
      });
      setFilteredProperties(results);
    } else {
      // Handle full search with all filters
      const results = searchProperties(filters);
      setFilteredProperties(results);
    }
  }, [searchParams, searchProperties,setFilters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters); // Update context filters
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
