import React from 'react';

const ProfileCard = ({ user, showEdit = true, onEdit }) => {
    
  return (
    <div className="card">
      <div className="card-body text-center">
        <img
          src={user?.avatar}
          alt={user?.name}
          className="rounded-circle mb-3"
          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
        />
        
        <h4 className="mb-1">{user?.name}</h4>
        <p className="text-muted mb-3">{user?.email}</p>
        
        <div className="d-flex justify-content-center gap-4 mb-3">
          <div className="text-center">
            <div className="fw-bold">
              <i className="bi bi-star-fill text-warning me-1"></i>
              {user?.rating || '5.0'}
            </div>
            <small className="text-muted">Rating</small>
          </div>
          <div className="text-center">
            <div className="fw-bold">{user?.reviewsCount || 0}</div>
            <small className="text-muted">Reviews</small>
          </div>
          <div className="text-center">
            <div className="fw-bold">{user?.tripsCount || 0}</div>
            <small className="text-muted">Trips</small>
          </div>
        </div>

        {user?.role === 'host' && (
          <span className="badge bg-danger mb-3">
            <i className="bi bi-award me-1"></i>
            Superhost
          </span>
        )}

        {showEdit && (
          <button className="btn btn-outline-dark w-100" onClick={onEdit}>
            <i className="bi bi-pencil me-2"></i>
            Edit Profile
          </button>
        )}

        <div className="mt-4 pt-4 border-top">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Member since</span>
            <span className="fw-semibold">2024</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Verified</span>
            <span>
              <i className="bi bi-patch-check-fill text-success"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
