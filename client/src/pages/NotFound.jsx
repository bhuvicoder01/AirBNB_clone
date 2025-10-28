import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container text-center" style={{ paddingTop: '100px' }}>
      <h1 className="display-1 fw-bold">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="text-muted mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-danger btn-lg">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
