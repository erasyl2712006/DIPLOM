import React from 'react';
    import { motion } from 'framer-motion';

    export const TypingIndicator: React.FC = () => {
      return (
        <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-content2 inline-flex">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0.2,
              delay: 0
            }}
            className="w-2 h-2 rounded-full bg-primary-500"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0.2,
              delay: 0.2
            }}
            className="w-2 h-2 rounded-full bg-primary-500"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0.2,
              delay: 0.4
            }}
            className="w-2 h-2 rounded-full bg-primary-500"
          />
          <span className="text-xs text-default-500 ml-1">Печатает...</span>
        </div>
      );
    };