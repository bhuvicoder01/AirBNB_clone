import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userAPI } from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem('wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Fetch wishlist from backend
  const getUsersWishlist = async () => {
    if (!user?._id) {
      setWishlist([]);
      return [];
    }
    try {
      const response = await userAPI.getUsersWishList(user._id);
      const data = response?.data;
      const list = Array.isArray(data?.wishlist)
        ? data.wishlist
        : Array.isArray(data?.wishList)
        ? data.wishList
        : Array.isArray(data)
        ? data
        : [];
      setWishlist(list);
      localStorage.setItem('wishlist', JSON.stringify(list));
      return list;
    } catch (err) {
      console.error(err);
      setWishlist([]);
      return [];
    }
  };

  // Load wishlist on mount or user change
  useEffect(() => {
    // call inside effect to avoid returning a promise directly
    if (!user?._id) {
      setWishlist([]);
      return;
    }
    getUsersWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Add property to wishlist
  const addToWishlist = async (property) => {
    if (!user?._id || !property?._id) return;
    const newWish = {
      userId: user._id,
      propertyId: property._id,
    };
    try {
      const response = await userAPI.addToWishlist(newWish);
      const data = response?.data;
      let updatedList = Array.isArray(wishlist) ? [...wishlist] : [];

      if (Array.isArray(data?.wishlist)) {
        updatedList = data.wishlist;
      } else if (Array.isArray(data?.wishList)) {
        updatedList = data.wishList;
      } else if (Array.isArray(data)) {
        updatedList = data;
      } else if (data) {
        // API returned a single item (created wishlist item)
        const newItem = data.wish || data;
        const newItemPropertyId = newItem?.propertyId ?? newItem?.property?._id ?? newItem?.propertyId ?? newWish.propertyId;
        const exists = updatedList.some((w) => {
          const id = w?.propertyId ?? w?._id ?? w?.property?._id ?? w;
          return id === newItemPropertyId;
        });
        if (!exists) {
          // prefer storing the returned object when possible
          updatedList = [newItem, ...updatedList];
        }
      } else {
        // fallback: optimistically add the constructed item
        const exists = updatedList.some((w) => {
          const id = w?.propertyId ?? w?._id ?? w?.property?._id ?? w;
          return id === newWish.propertyId;
        });
        if (!exists) {
          updatedList = [{ propertyId: newWish.propertyId, userId: newWish.userId }, ...updatedList];
        }
      }

      setWishlist(updatedList);
      localStorage.setItem('wishlist', JSON.stringify(updatedList));
    } catch (err) {
      console.error(err);
    }
  };

  // Remove property from wishlist
  const removeFromWishlist = async (propertyId, userId = user?._id) => {
    if (!propertyId) return;
    try {
      await userAPI.removeFromWishList(propertyId, userId);
      const updatedList = (wishlist || []).filter((w) => {
        const id = w?.propertyId ?? w?._id ?? w?.property?._id ?? w;
        return id !== propertyId;
      });
      setWishlist(updatedList);
      localStorage.setItem('wishlist', JSON.stringify(updatedList));
    } catch (err) {
      console.error(err);
    }
  };

  // Check if property exists in wishlist
  const isInWishlist = (propertyId) => {
    if (!propertyId) return false;
    return (wishlist || []).some((w) => {
      const id = w?.propertyId ?? w?._id ?? w?.property?._id ?? w;
      return id === propertyId;
    });
  };

  // Clear
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
  };

  const value = {
    wishlist,
    getUsersWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
