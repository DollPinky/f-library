'use client';

import { motion } from 'framer-motion';
import { animationVariants } from '../providers/MotionProvider';

const AnimatedPage = ({ 
  children, 
  className = "",
  variant = "pageTransition",
  delay = 0,
  duration = 0.3,
  ...props 
}) => {
  const customVariants = {
    hidden: { 
      opacity: 0, 
      x: 20,
      ...animationVariants[variant]?.hidden 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      ...animationVariants[variant]?.visible,
      transition: {
        ...animationVariants[variant]?.visible?.transition,
        delay,
        duration
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      ...animationVariants[variant]?.exit 
    }
  };

  return (
    <motion.div
      className={className}
      variants={customVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage; 