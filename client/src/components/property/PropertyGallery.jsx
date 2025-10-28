import React, { useState } from 'react';
import Modal from '../common/Modal';

const PropertyGallery = ({ images }) => {
  const [showGallery, setShowGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mainImage = images[0];
  const sideImages = images.slice(1, 5);

  return (
    <>
      <div className="property-gallery">
        <div className="row g-2">
          {/* Main Image */}
          <div className="col-md-6">
            <img
              src={mainImage}
              alt="Property main view"
              className="w-100 rounded-start cursor-pointer"
              style={{ height: '400px', objectFit: 'cover' }}
              onClick={() => {
                setCurrentIndex(0);
                setShowGallery(true);
              }}
            />
          </div>

          {/* Side Images Grid */}
          <div className="col-md-6">
            <div className="row g-2">
              {sideImages.map((image, index) => (
                <div key={index} className="col-6">
                  <div className="position-relative">
                    <img
                      src={image}
                      alt={`Property view ${index + 2}`}
                      className="w-100 cursor-pointer"
                      style={{ 
                        height: '196px', 
                        objectFit: 'cover',
                        borderRadius: index === 1 ? '0 8px 0 0' : index === 3 ? '0 0 8px 0' : '0'
                      }}
                      onClick={() => {
                        setCurrentIndex(index + 1);
                        setShowGallery(true);
                      }}
                    />
                    
                    {/* Show All Photos Button (on last image) */}
                    {index === sideImages.length - 1 && (
                      <button
                        className="btn btn-light position-absolute bottom-0 end-0 m-3"
                        onClick={() => setShowGallery(true)}
                      >
                        <i className="bi bi-grid-3x3-gap me-2"></i>
                        Show all photos
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Gallery Modal */}
      <Modal
        show={showGallery}
        onClose={() => setShowGallery(false)}
        title={`${currentIndex + 1} / ${images.length}`}
        size="xl"
      >
        <div className="gallery-modal">
          {/* Current Image */}
          <div className="text-center mb-4">
            <img
              src={images[currentIndex]}
              alt={`Property view ${currentIndex + 1}`}
              className="img-fluid rounded"
              style={{ maxHeight: '70vh' }}
            />
          </div>

          {/* Navigation */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            <button
              className="btn btn-outline-dark"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              <i className="bi bi-chevron-left"></i> Previous
            </button>
            <button
              className="btn btn-outline-dark"
              onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
              disabled={currentIndex === images.length - 1}
            >
              Next <i className="bi bi-chevron-right"></i>
            </button>
          </div>

          {/* Thumbnails */}
          <div className="row g-2">
            {images.map((image, index) => (
              <div key={index} className="col-2">
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-100 rounded cursor-pointer ${
                    index === currentIndex ? 'border border-3 border-dark' : ''
                  }`}
                  style={{ height: '80px', objectFit: 'cover' }}
                  onClick={() => setCurrentIndex(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PropertyGallery;
