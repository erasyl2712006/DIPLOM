import React from 'react';
import { motion } from 'framer-motion';

interface ChangeIndicatorProps {
  isChanged: boolean;
  type?: 'added' | 'updated' | 'deleted';
  duration?: number;
}

export const ChangeIndicator: React.FC<ChangeIndicatorProps> = ({ 
  isChanged, 
  type = 'updated',
  duration = 2
}) => {
  if (!isChanged) return null;
  
  const getColor = () => {
    switch (type) {
      case 'added': return 'bg-success-100';
      case 'deleted': return 'bg-danger-100';
      default: return 'bg-warning-100';
    }
  };

  return (
    <motion.div
      className={`absolute inset-0 ${getColor()} rounded-md z-0`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 0 }}
      transition={{ duration }}
    />
  );
};