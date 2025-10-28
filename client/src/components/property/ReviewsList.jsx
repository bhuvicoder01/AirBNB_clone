import React, { useState } from 'react';
import Modal from '../common/Modal';

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    userName: 'Emily Chen',
    userAvatar: 'https://i.pravatar.cc/150?img=10',
    date: '2025-10-15',
    rating: 5,
    comment: 'Amazing place! The views were breathtaking and the host was very responsive. Would definitely stay here again.',
    hostResponse: 'Thank you for your kind words! We loved hosting you.'
  },
  {
    id: 2,
    userName: 'Michael Rodriguez',
    userAvatar: 'https://i.pravatar.cc/150?img=13',
    date: '2025-10-10',
    rating: 5,
    comment: 'Perfect location, spotlessly clean, and exactly as described. Highly recommend!',
    hostResponse: null
  },
  {
    id: 3,
    userName: 'Sarah Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=45',
    date: '2025-10-05',
    rating: 4,
    comment: 'Great stay overall. The property was beautiful but a bit far from downtown. Still worth it for the peace and quiet.',
    hostResponse: 'Thanks for your feedback! We appreciate your stay.'
  }
];

const ReviewsList = ({ propertyId, limit = 6 }) => {
  const [showAll, setShowAll] = useState(false);
  const reviews = mockReviews; // TODO: Fetch from API based on propertyId
  const displayReviews = showAll ? reviews : reviews.slice(0, limit);

  const RatingBar = ({ label, value }) => (
    <div className="mb-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <small className="text-muted">{label}</small>
        <small className="fw-semibold">{value}</small>
      </div>
      <div className="progress" style={{ height: '4px' }}>
        <div 
          className="progress-bar bg-dark" 
          style={{ width: `${(value / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <>
      <div className="reviews-list">
        {/* Rating Breakdown */}
        <div className="row mb-5">
          <div className="col-md-6">
            <RatingBar label="Cleanliness" value={4.9} />
            <RatingBar label="Accuracy" value={4.8} />
            <RatingBar label="Check-in" value={5.0} />
          </div>
          <div className="col-md-6">
            <RatingBar label="Communication" value={4.9} />
            <RatingBar label="Location" value={4.7} />
            <RatingBar label="Value" value={4.8} />
          </div>
        </div>

        {/* Reviews */}
        <div className="row g-4">
          {displayReviews.map((review) => (
            <div key={review.id} className="col-md-6">
              <div className="review-item">
                {/* User Info */}
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="rounded-circle me-3"
                    style={{ width: '48px', height: '48px' }}
                  />
                  <div>
                    <h6 className="mb-0">{review.userName}</h6>
                    <small className="text-muted">{review.date}</small>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-2">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bi bi-star${i < review.rating ? '-fill' : ''} ${
                        i < review.rating ? 'text-warning' : 'text-muted'
                      }`}
                    ></i>
                  ))}
                </div>

                {/* Comment */}
                <p className="text-muted mb-2">{review.comment}</p>

                {/* Host Response */}
                {review.hostResponse && (
                  <div className="ms-4 mt-3 p-3 bg-light rounded">
                    <p className="small fw-semibold mb-1">Response from host:</p>
                    <p className="small text-muted mb-0">{review.hostResponse}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {reviews.length > limit && !showAll && (
          <button
            className="btn btn-outline-dark mt-4"
            onClick={() => setShowAll(true)}
          >
            Show all {reviews.length} reviews
          </button>
        )}
      </div>
    </>
  );
};

export default ReviewsList;
