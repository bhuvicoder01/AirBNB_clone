import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import PropertyGrid from '../components/property/PropertyGrid';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Wishlists</h2>
      
      {wishlist.length > 0 ? (
        <PropertyGrid properties={wishlist} />
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-heart fs-1 text-muted d-block mb-3"></i>
          <h4>No wishlists yet</h4>
          <p className="text-muted mb-4">
            As you search, click the heart icon to save your favorite places to stay
          </p>
          <Link to="/" className="btn btn-danger">
            Start exploring
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
