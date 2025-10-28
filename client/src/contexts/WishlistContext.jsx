import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const addToWishlist = (property) => {
    const updatedWishlist = [...wishlist, property];
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const removeFromWishlist = (propertyId) => {
    const updatedWishlist = wishlist.filter(p => p.id !== propertyId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const isInWishlist = (propertyId) => {
    return wishlist.some(p => p.id === propertyId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
