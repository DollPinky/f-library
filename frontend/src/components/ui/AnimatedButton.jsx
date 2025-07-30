'use client';

import { motion } from 'framer-motion';
import { animationVariants } from '../providers/MotionProvider';

const AnimatedButton = ({ 
  children, 
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "left",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-sage-600 hover:bg-sage-700 dark:bg-sage-500 dark:hover:bg-sage-600 text-white focus:ring-sage-500",
    secondary: "bg-sage-100 hover:bg-sage-200 dark:bg-sage-800 dark:hover:bg-sage-700 text-sage-700 dark:text-sage-300 focus:ring-sage-500",
    outline: "border border-sage-200 hover:bg-sage-50 dark:border-sage-700 dark:hover:bg-sage-800 text-sage-700 dark:text-sage-300 focus:ring-sage-500",
    ghost: "text-sage-600 dark:text-sage-400 hover:bg-sage-100 dark:hover:bg-sage-800 focus:ring-sage-500",
    danger: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white focus:ring-red-500"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const iconClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  const iconSpacing = {
    sm: "space-x-2",
    md: "space-x-2",
    lg: "space-x-3"
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={`flex items-center ${iconSpacing[size]}`}>
          <motion.div
            className={`${iconClasses[size]} border-2 border-current border-t-transparent rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span>Đang tải...</span>
        </div>
      );
    }

    if (Icon) {
      if (iconPosition === "left") {
        return (
          <div className={`flex items-center ${iconSpacing[size]}`}>
            <Icon className={iconClasses[size]} />
            <span>{children}</span>
          </div>
        );
      } else {
        return (
          <div className={`flex items-center ${iconSpacing[size]}`}>
            <span>{children}</span>
            <Icon className={iconClasses[size]} />
          </div>
        );
      }
    }

    return children;
  };

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      variants={animationVariants.hover}
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
};

export default AnimatedButton; 