'use client';

import { motion } from 'framer-motion';
import { animationVariants } from '../providers/MotionProvider';

const AnimatedCard = ({ 
  children, 
  className = "",
  variant = "scaleIn",
  delay = 0,
  hover = true,
  tap = true,
  ...props 
}) => {
  const customVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      ...animationVariants[variant]?.hidden 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      ...animationVariants[variant]?.visible,
      transition: {
        ...animationVariants[variant]?.visible?.transition,
        delay
      }
    },
    hover: hover ? animationVariants.hover : {},
    tap: tap ? animationVariants.tap : {}
  };

  return (
    <motion.div
      className={`bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-sage-200 dark:border-sage-700 shadow-soft ${className}`}
      variants={customVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard; 