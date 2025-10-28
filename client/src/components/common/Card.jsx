import React from 'react';

const Card = ({ 
  children, 
  title, 
  footer, 
  className = '',
  bodyClassName = '',
  shadow = false 
}) => {
  return (
    <div className={`card ${shadow ? 'shadow-sm' : ''} ${className}`}>
      {title && (
        <div className="card-header">
          <h5 className="card-title mb-0">{title}</h5>
        </div>
      )}
      
      <div className={`card-body ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
