import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helpText,
  icon,
  className = ''
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <div className="position-relative">
        {icon && (
          <span className="position-absolute top-50 start-0 translate-middle-y ms-3">
            <i className={`bi bi-${icon} text-muted`}></i>
          </span>
        )}
        
        <input
          type={type}
          className={`form-control ${icon ? 'ps-5' : ''} ${error ? 'is-invalid' : ''}`}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
        
        {error && (
          <div className="invalid-feedback">{error}</div>
        )}
      </div>
      
      {helpText && !error && (
        <div className="form-text">{helpText}</div>
      )}
    </div>
  );
};

export default Input;
