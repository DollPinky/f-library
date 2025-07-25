'use client';

import React, { useState, useEffect } from 'react';

const AnimatedContainer = ({ 
  children, 
  className = '', 
  animation = 'fadeIn',
  delay = 0,
  duration = 300,
  stagger = 50,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-out';
    
    switch (animation) {
      case 'fadeIn':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;
      case 'slideInRight':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`;
      case 'slideInLeft':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`;
      case 'scaleIn':
        return `${baseClasses} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;
      case 'bounceIn':
        return `${baseClasses} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`;
      default:
        return `${baseClasses} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
    }
  };

  return (
    <div 
      className={`${getAnimationClasses()} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
      {...props}
    >
      {children}
    </div>
  );
};

// Staggered animation for lists
export const StaggeredList = ({ 
  children, 
  className = '', 
  stagger = 100,
  animation = 'fadeIn',
  ...props 
}) => {
  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child, index) => (
        <AnimatedContainer
          key={index}
          animation={animation}
          delay={index * stagger}
          className="mb-4 last:mb-0"
        >
          {child}
        </AnimatedContainer>
      ))}
    </div>
  );
};

// Page transition wrapper
export const PageTransition = ({ children, className = '' }) => {
  return (
    <AnimatedContainer
      animation="fadeIn"
      delay={100}
      duration={400}
      className={`min-h-screen ${className}`}
    >
      {children}
    </AnimatedContainer>
  );
};

// Card animation wrapper
export const AnimatedCard = ({ children, className = '', delay = 0 }) => {
  return (
    <AnimatedContainer
      animation="scaleIn"
      delay={delay}
      duration={300}
      className={`hover:scale-[1.02] hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {children}
    </AnimatedContainer>
  );
};

// Loading skeleton with animation
export const AnimatedSkeleton = ({ className = '', lines = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-sage-200 dark:bg-sage-700 rounded mb-3 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedContainer; 