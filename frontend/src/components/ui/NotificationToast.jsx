import React, { useEffect, useState } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const NotificationToast = ({ 
  message, 
  type = 'info', 
  isVisible, 
  onClose, 
  duration = 5000,
  id = null 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Trigger entrance animation
      setIsAnimating(true);
      
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for exit animation
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      default:
        return <InformationCircleIcon className="w-5 h-5" />;
    }
  };

  const getClasses = () => {
    const baseClasses = 'flex items-center p-4 rounded-xl shadow-lg max-w-sm transform transition-all duration-300 ease-out';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/90 dark:border-emerald-700 dark:text-emerald-200`;
      case 'error':
        return `${baseClasses} bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-700 dark:text-red-200`;
      case 'warning':
        return `${baseClasses} bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/90 dark:border-amber-700 dark:text-amber-200`;
      default:
        return `${baseClasses} bg-sage-50 border border-sage-200 text-sage-800 dark:bg-sage-900/90 dark:border-sage-700 dark:text-sage-200`;
    }
  };

  return (
    <div 
      className={`${getClasses()} ${
        isAnimating 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      }`}
      style={{
        transform: isAnimating ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.95)',
        opacity: isAnimating ? 1 : 0,
      }}
    >
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 ml-3 text-current hover:opacity-75 focus:outline-none focus:opacity-75 transition-opacity duration-200"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

// Enhanced Notification Container
export const NotificationContainer = ({ notifications, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
          isVisible={notification.show}
          onClose={() => onClose(notification.id)}
          duration={notification.duration}
        />
      ))}
    </div>
  );
};

export default NotificationToast; 