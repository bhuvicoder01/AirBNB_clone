import React, { createContext, useContext, useState, useEffect } from 'react';
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
    guests: 1,
    priceRange: [0, 1000],
    propertyTypes: [],
    amenities: []
  });

  const getProperties=async () => {
      const propertiesServer=await propertyAPI.getAll()
      // console.log("serverproperties")
      setProperties(propertiesServer.data)
      localStorage.setItem('properties',JSON.stringify(propertiesServer.data))
      return propertiesServer
      console.log(propertiesServer.data)
    }

  useEffect(() => {
   
    setTimeout(() => {
      try{ 
        const storedProperties=JSON.parse(localStorage.getItem('properties'))
      if(storedProperties){
        // console.log("storeed")
        setProperties(storedProperties);
        setLoading(false);
      }
    }
      catch(error){
        setProperties(mockProperties)
      }
      getProperties()      
    }, 500);
    
  }, []);

  const searchProperties = (searchFilters) => {
    setFilters({ ...filters, ...searchFilters });
    
    // TODO: Replace with actual API call
    // Mock filtering logic
    let filtered = mockProperties;

    if (searchFilters.location) {
      filtered = filtered.filter(p => 
        p.location.city.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
        p.location.country.toLowerCase().includes(searchFilters.location.toLowerCase())
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
        searchFilters.amenities.every(amenity => p.amenities.includes(amenity))
      );
    }

    return filtered;
  };

  const getPropertyById =async (id) => {
    console.log(id)
    const property=( await propertyAPI.getById(id)).data
    console.log(property.data)
    return property;
  };

  const value = {
    properties,
    loading,
    filters,
    searchProperties,
    getPropertyById
  };

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};