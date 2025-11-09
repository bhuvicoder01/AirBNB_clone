import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Toast from '../common/Toast';
import Loading from '../common/Loading';
import Card from '../common/Card';
import { useProperty } from '../../contexts/PropertyContext';
import { propertyAPI } from '../../services/api';

const EditHostListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const {updateProperty,getPropertyById}=useProperty();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    address: '',
    city: '',
    state: '',
    country: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    amenities: [],
    images: []
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const property = await getPropertyById(id);
        if (!property) {
          setError('Property not found');
          return;
        }

        if (property.hostId !== user._id) {
          setError('Unauthorized to edit this property');
          navigate('/host/dashboard');
          return;
        }

        setFormData({
          title: property.title,
          description: property.description,
          type: property.property_type,
          address: property.address,
          city: property.location.city,
          state: property.location.state,
          country: property.location.country,
          price: property.price_per_night,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          maxGuests: property.max_guests,
          amenities: property.amenities || []
        });

        setExistingImages(property.images || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch property details');
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user._id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleRemoveExistingImage = (imageUrl) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          formDataToSend.append('amenities', JSON.stringify(formData.amenities));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append new images
      newImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      // Append existing images and images to delete
      formDataToSend.append('existingImages', JSON.stringify(existingImages));
      formDataToSend.append('imagesToDelete', JSON.stringify(imagesToDelete));

      await propertyAPI.update(id, formDataToSend);
      
      setToastMessage('Property updated successfully!');
      setShowToast(true);
      
      setTimeout(() => {
        navigate('/host/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update property');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const amenitiesList = [
    'Wifi', 'Kitchen', 'Free parking', 'TV', 'Air conditioning',
    'Heating', 'Washer', 'Dryer', 'Pool', 'Hot tub',
    'Gym', 'Elevator', 'Wheelchair accessible', 'Smoking allowed', 'Pets allowed'
  ];

  return (
    <div className="container mt-4">
      {showToast && (
        <Toast
          message={toastMessage || error}
          type={error ? 'error' : 'success'}
          onClose={() => setShowToast(false)}
        />
      )}

      <Card shadow>
        <h2 className="mb-4">Edit Listing</h2>
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
              <div className="col-md-4">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
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
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="room">Room</option>
                  <option value="hotel">Hotel</option>
                </select>
              </div>
              <div className="col-md-6">
                <Input
                  label="Price per night"
                  type="number"
                  name="price"
                  value={formData.price}
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
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
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
                      onChange={() => handleAmenityToggle(amenity)}
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
            <h4>Current Images</h4>
            <div className="row g-3 mb-3">
              {existingImages.map((image, index) => (
                <div key={index} className="col-md-3">
                  <div className="position-relative">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="img-fluid rounded"
                      style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                      onClick={() => handleRemoveExistingImage(image)}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h4>Add New Images</h4>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </div>
            {newImages.length > 0 && (
              <div className="row g-3">
                {newImages.map((image, index) => (
                  <div key={index} className="col-md-3">
                    <div className="position-relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New ${index + 1}`}
                        className="img-fluid rounded"
                        style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                        onClick={() => handleRemoveNewImage(index)}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="d-flex gap-2 justify-content-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/host/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                'Update Listing'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditHostListing;
