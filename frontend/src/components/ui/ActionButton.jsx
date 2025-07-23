import React from 'react';

const ActionButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-target';
  
  const variantClasses = {
    primary: 'bg-sage-600 hover:bg-sage-700 text-white focus:ring-sage-500',
    secondary: 'bg-sage-100 hover:bg-sage-200 text-sage-900 dark:bg-sage-800 dark:hover:bg-sage-700 dark:text-sage-100 focus:ring-sage-500',
    outline: 'border border-sage-200 hover:bg-sage-50 text-sage-700 dark:border-sage-700 dark:hover:bg-sage-800 dark:text-sage-300 focus:ring-sage-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500'
  };
  
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs sm:text-sm',
    md: 'px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base',
    lg: 'px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default ActionButton; 