import React, { useEffect } from 'react';

const NotificationToast = ({ message, type = 'info', isVisible, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getClasses = () => {
    const baseClasses = 'fixed top-4 right-4 z-50 flex items-center p-4 rounded-xl shadow-lg max-w-sm transform transition-all duration-300';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:border-emerald-700 dark:text-emerald-200`;
      case 'error':
        return `${baseClasses} bg-red-50 border border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200`;
      case 'warning':
        return `${baseClasses} bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-200`;
      default:
        return `${baseClasses} bg-sage-50 border border-sage-200 text-sage-800 dark:bg-sage-900 dark:border-sage-700 dark:text-sage-200`;
    }
  };

  return (
    <div className={getClasses()}>
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-3 text-current hover:opacity-75 focus:outline-none focus:opacity-75"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default NotificationToast; 