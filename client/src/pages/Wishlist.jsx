import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useProperty } from '../contexts/PropertyContext';
import { useLanguage } from '../contexts/LanguageContext';
import PropertyGrid from '../components/property/PropertyGrid';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const { properties } = useProperty();
  const { t } = useLanguage();
  // console.log(wishlist);
  // console.log(properties);

  // Safely get the wishlist array and properties array, defaulting to empty arrays
  const wishlistArray = (wishlist ) || [];
  const propertiesList = properties || [];

  // Create a Set of wishlisted property IDs for O(1) lookups
  const wishlistIds = new Set(wishlistArray.map(item => item?.propertyId));

  // Filter properties that are in the wishlist
  const wishlistedProperties = propertiesList.filter(property => wishlistIds.has(property._id));

  // console.log(wishlistedProperties);
  return (
    <div className="container mt-4">
      <h2 className="mb-4">{t('wishlist')}</h2>
      
      {wishlistedProperties.length > 0 ? (
        <PropertyGrid properties={wishlistedProperties} />
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
