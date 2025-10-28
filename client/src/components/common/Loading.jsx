import React from 'react';

const Loading = ({ text = 'Loading...', fullPage = false }) => {
  const content = (
    <div className="text-center">
      <div className="spinner-border text-danger mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">{text}</span>
      </div>
      <p className="text-muted">{text}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        {content}
      </div>
    );
  }

  return (
    <div className="py-5">
      {content}
    </div>
  );
};

export default Loading;

// Skeleton loader for property cards
export const PropertyCardSkeleton = () => (
  <div className="property-card-skeleton">
    <div className="skeleton rounded-3 mb-2" style={{ height: '280px' }}></div>
    <div className="skeleton rounded mb-2" style={{ height: '20px', width: '60%' }}></div>
    <div className="skeleton rounded mb-2" style={{ height: '16px', width: '40%' }}></div>
    <div className="skeleton rounded" style={{ height: '16px', width: '30%' }}></div>
  </div>
);