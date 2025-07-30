'use client';

import { motion } from 'framer-motion';
import { animationVariants } from '../providers/MotionProvider';

const AnimatedList = ({ 
  children, 
  className = "",
  variant = "staggerContainer",
  itemVariant = "staggerItem",
  delay = 0,
  staggerDelay = 0.1,
  ...props 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {Array.isArray(children) ? 
        children.map((child, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            custom={index}
          >
            {child}
          </motion.div>
        )) : 
        children
      }
    </motion.div>
  );
};

export default AnimatedList; 