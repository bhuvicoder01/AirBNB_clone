import React, { useEffect } from 'react';

const Toast = ({ 
  show, 
  onClose, 
  message, 
  type = 'success', 
  duration = 3000,
  position = 'top-right' 
}) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getTypeClass = () => {
    const types = {
      success: 'bg-success',
      error: 'bg-danger',
      warning: 'bg-warning',
      info: 'bg-info'
    };
    return types[type] || types.success;
  };

  const getIcon = () => {
    const icons = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || icons.success;
  };

  const getPositionClass = () => {
    const positions = {
      'top-right': 'top-0 end-0',
      'top-left': 'top-0 start-0',
      'bottom-right': 'bottom-0 end-0',
      'bottom-left': 'bottom-0 start-0',
      'top-center': 'top-0 start-50 translate-middle-x'
    };
    return positions[position] || positions['top-right'];
  };

  return (
    <div 
      className={`position-fixed ${getPositionClass()} p-3`} 
      style={{ zIndex: 9999 }}
    >
      <div className={`toast show ${getTypeClass()} text-white`} role="alert">
        <div className="toast-body d-flex align-items-center">
          <i className={`bi bi-${getIcon()} fs-5 me-3`}></i>
          <div className="flex-grow-1">{message}</div>
          <button 
            type="button" 
            className="btn-close btn-close-white ms-2" 
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Toast;

// Toast Container Hook
export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type, show: true }]);
  };

  const hideToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    hideToast
  };
};
