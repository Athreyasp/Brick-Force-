import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
}

const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.6,
  className = ''
}: ScrollRevealProps) => {
  const getInitialOffset = () => {
    switch (direction) {
      case 'up': return { y: 50, opacity: 0 };
      case 'down': return { y: -50, opacity: 0 };
      case 'left': return { x: 50, opacity: 0 };
      case 'right': return { x: -50, opacity: 0 };
      case 'none': return { opacity: 0 };
      default: return { y: 50, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialOffset()}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: duration, 
        delay: delay, 
        ease: [0.165, 0.84, 0.44, 1] // Elegant cubic bezier easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
