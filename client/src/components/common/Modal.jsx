import React, { useEffect } from 'react';

const Modal = ({ 
  show, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md',
  centered = true 
}) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  const getSizeClass = () => {
    const sizes = {
      sm: 'modal-sm',
      md: '',
      lg: 'modal-lg',
      xl: 'modal-xl'
    };
    return sizes[size] || '';
  };

  return (
    <>
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        role="dialog"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      >
        <div 
          className={`modal-dialog ${getSizeClass()} ${centered ? 'modal-dialog-centered' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title">{title}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            
            <div className="modal-body">
              {children}
            </div>
            
            {footer && (
              <div className="modal-footer border-0">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
