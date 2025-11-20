import React, { useState } from 'react';
import PropertyCard from './PropertyCard';

const PropertyGrid = ({ properties, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-house fs-1 text-muted"></i>
        <p className="text-muted mt-3">No properties found😵</p>
      </div>
    );
  }
  
  const activeProperties = properties.filter(p => p.isActive);
  
  if (!activeProperties || activeProperties.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-house fs-1 text-muted"></i>
        <p className="text-muted mt-3">No active properties found😵</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(activeProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = activeProperties.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {currentProperties.map((property) => (
          <div key={property._id} className="col">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-5 mb-4">
          <button
            className="btn btn-outline-secondary"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            <i className="bi bi-chevron-left"></i> Previous
          </button>

          <div className="d-flex gap-1">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2">...</span>
              ) : (
                <button
                  key={page}
                  className={`btn ${
                    currentPage === page
                      ? 'btn-primary'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next <i className="bi bi-chevron-right"></i>
          </button>

          <span className="ms-3 text-muted">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </>
  );
};

export default PropertyGrid;
