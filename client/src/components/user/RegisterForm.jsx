import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'guest',
    agreedToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const { confirmPassword, agreedToTerms, ...userData } = formData;
      await onSubmit(userData);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
        </div>
        <div className="col-md-6">
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>
      </div>

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon="envelope"
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        helpText="Must be at least 8 characters"
        icon="lock"
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        icon="lock"
        required
      />

      <div className="mb-3">
        <label className="form-label">I want to</label>
        <div className="btn-group w-100" role="group">
          <input
            type="radio"
            className="btn-check"
            name="role"
            id="guest"
            value="guest"
            checked={formData.role === 'guest'}
            onChange={handleChange}
          />
          <label className="btn btn-outline-dark" htmlFor="guest">
            <i className="bi bi-person me-2"></i>
            Book a place
          </label>

          <input
            type="radio"
            className="btn-check"
            name="role"
            id="host"
            value="host"
            checked={formData.role === 'host'}
            onChange={handleChange}
          />
          <label className="btn btn-outline-dark" htmlFor="host">
            <i className="bi bi-house-door me-2"></i>
            Host my place
          </label>
        </div>
      </div>

      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="agreedToTerms"
          name="agreedToTerms"
          checked={formData.agreedToTerms}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="agreedToTerms">
          I agree to the{' '}
          <a href="#" className="text-decoration-none">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-decoration-none">Privacy Policy</a>
        </label>
        {errors.agreedToTerms && (
          <div className="text-danger small mt-1">{errors.agreedToTerms}</div>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
      >
        Sign up
      </Button>
    </form>
  );
};

export default RegisterForm;
