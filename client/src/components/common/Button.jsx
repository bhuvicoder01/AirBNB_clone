import React from 'react';

const Button = ({ 
  children, 
  label='label',
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const getVariantClass = () => {
    const variants = {
      primary: 'btn-danger',
      secondary: 'btn-outline-dark',
      link: 'btn-link',
      success: 'btn-success',
      warning: 'btn-warning'
    };
    return variants[variant] || variants.primary;
  };

  const getSizeClass = () => {
    const sizes = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg'
    };
    return sizes[size] || sizes.md;
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${
        fullWidth ? 'w-100' : ''
      } ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading...
        </>
      ) : (
       children?children:label
      )}
    </button>
  );
};

export default Button;
