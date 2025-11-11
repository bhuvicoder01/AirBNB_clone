import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockProperties } from '../data/mockData';
import { propertyAPI } from '../services/api';

const PropertyContext = createContext();

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within PropertyProvider');
  }
  return context;
};

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    checkIn: null,
    checkOut: null,
    adults: 1,
    children: 0,
    infants: 0,
    priceRange: [0, 1000],
    propertyTypes: [],
    amenities: []
  });

  const getProperties = async () => {
    const propertiesServer = await propertyAPI.getAll();
    // console.log("serverproperties"); // Moved before return for visibility
    setProperties(propertiesServer.data);
    localStorage.setItem('properties', JSON.stringify(propertiesServer.data));
    setLoading(false); // Ensure loading is cleared after fetch
    return propertiesServer;
  };

  useEffect(() => {
    const initializeProperties = async () => {
      try {
        const storedProperties = JSON.parse(localStorage.getItem('properties'));
        if (storedProperties && storedProperties.length > 0) {
          setProperties(storedProperties);
          setLoading(false);
          return; // Skip API if stored data exists and is valid
        }
      } catch (error) {
        console.error('Error loading stored properties:', error);
        setProperties(mockProperties);
        setLoading(false);
      }

      // Fetch from API if no valid stored data
      await getProperties();
    };

    // Removed arbitrary setTimeout – now async for better UX (loading stays true during fetch)
    initializeProperties();
  }, []);

  // Pure filtering function – no side effects (removed setFilters)
  // Now memoized with useCallback for stability
  const searchProperties = useCallback((searchFilters) => {
    let filtered = properties;

    if (searchFilters.location) {
      filtered = filtered.filter(p => 
        p.location?.city?.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
        p.location?.country?.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }

    if (searchFilters.priceRange) {
      filtered = filtered.filter(p => 
        p.price_per_night >= searchFilters.priceRange[0] &&
        p.price_per_night <= searchFilters.priceRange[1]
      );
    }

    if (searchFilters.propertyTypes && searchFilters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => 
        searchFilters.propertyTypes.includes(p.property_type)
      );
    }

    if (searchFilters.amenities && searchFilters.amenities.length > 0) {
      filtered = filtered.filter(p => 
        searchFilters.amenities.every(amenity => p.amenities?.includes(amenity))
      );
    }

    // TODO: Add filtering for dates (e.g., availability check) and guests
    // Example for guests (total = adults + children + infants):
    // if (searchFilters.adults !== undefined && searchFilters.children !== undefined && searchFilters.infants !== undefined) {
    //   const totalGuests = searchFilters.adults + searchFilters.children + searchFilters.infants;
    //   filtered = filtered.filter(p => p.max_guests >= totalGuests);
    // }
    // For dates: assume p.availability is an array of booked dates; check overlap, etc.

    return filtered;
  }, [properties]); // Only depends on properties (stable after load)

  const getPropertyById = async (id) => {
    // console.log(id);
    const property = (await propertyAPI.getById(id)).data;
    // console.log(property); // Fixed: log the property object, not .data (assuming it's already extracted)
    return property;
  };

  const value = {
    properties,
    loading,
    filters,
    setFilters, // Expose setter for components to update filters explicitly
    searchProperties,
    getPropertyById
  };

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};