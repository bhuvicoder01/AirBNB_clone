import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Toast from '../common/Toast';
import { propertyAPI } from '../../services/api';

const NewListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    hostId:user?._id||'',
    title: '',
    description: '',
    location: {
      city: '',
      country: '',
      lat: '',
      lng: ''
    },
    price_per_night: '',
    property_type: '',
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    max_guests: 1,
    amenities: [],
    host: {
        id:user?._id||'',
      name: user?.name || '',
      avatar: user?.avatar?.url || '',
      superhost: false,
      response_time: '1 hour'
    }
  });

  const amenitiesList = [
    'Wi-Fi', 'Kitchen', 'Free parking', 'Air conditioning', 'Heating',
    'Washer', 'Dryer', 'TV', 'Pool', 'Hot tub', 'Gym', 'Breakfast',
    'Indoor fireplace', 'Hair dryer', 'Iron', 'Laptop-friendly workspace'
  ];

  const propertyTypes = [
    'Entire house', 'Entire apartment', 'Private room', 'Shared room',
    'Unique space', 'Boutique hotel'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAmenitiesChange = (amenity) => {
    setFormData(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData for both property data and images
      const formDataToSend = new FormData();

      // Add property data as a JSON string
      const propertyData = {
        ...formData,
        price_per_night: parseFloat(formData.price_per_night),
        bedrooms: parseInt(formData.bedrooms),
        beds: parseInt(formData.beds),
        bathrooms: parseInt(formData.bathrooms),
        max_guests: parseInt(formData.max_guests),
      };
      
      // Append property data
      formDataToSend.append('data', JSON.stringify(propertyData));

      // Append each image
      selectedImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await propertyAPI.create(formDataToSend);
      setShowToast(true);
      
      // Show success message
      setError(null);
      setShowToast(true);
      
      // Redirect immediately since images will upload in background
      navigate('/host/dashboard', { 
        state: { message: 'Property created! Images are being processed in the background.' }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {showToast && (
        <Toast
          message={error || 'Property created successfully!'}
          type={error ? 'error' : 'success'}
          onClose={() => {
            setShowToast(false);
            setError(null);
          }}
        />
      )}

      <Card shadow>
        <h2 className="mb-4">Create New Listing</h2>
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="mb-4">
            <h4>Basic Information</h4>
            <div className="row g-3">
              <div className="col-12">
                <Input
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="City"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="Country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-4">
            <h4>Property Details</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Property Type</label>
                <select
                  className="form-select"
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select type</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <Input
                  label="Price per night"
                  type="number"
                  name="price_per_night"
                  value={formData.price_per_night}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Bedrooms"
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Beds"
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Bathrooms"
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Max Guests"
                  type="number"
                  name="max_guests"
                  value={formData.max_guests}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-4">
            <h4>Amenities</h4>
            <div className="row g-3">
              {amenitiesList.map(amenity => (
                <div key={amenity} className="col-md-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenitiesChange(amenity)}
                    />
                    <label className="form-check-label" htmlFor={amenity}>
                      {amenity}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="mb-4">
            <h4>Property Images</h4>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required={selectedImages.length === 0}
              />
            </div>
            <div className="row g-3">
              {previewImages.map((url, index) => (
                <div key={index} className="col-md-3">
                  <div className="position-relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="img-fluid rounded"
                      style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                      onClick={() => removeImage(index)}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-grid gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating listing...
                </>
              ) : (
                'Create Listing'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewListing;
