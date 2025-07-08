import React from 'react';
    import { motion, AnimatePresence } from 'framer-motion';

    interface AnimationWrapperProps {
      children: React.ReactNode;
      isVisible?: boolean;
      animation?: 'fadeIn' | 'slideIn' | 'scale' | 'none';
      duration?: number;
      delay?: number;
      className?: string;
    }

    export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
      children,
      isVisible = true,
      animation = 'fadeIn',
      duration = 0.3,
      delay = 0,
      className = ''
    }) => {
      const variants = {
        fadeIn: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration, delay } }
        },
        slideIn: {
          hidden: { x: -20, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration, delay } }
        },
        scale: {
          hidden: { scale: 0.95, opacity: 0 },
          visible: { scale: 1, opacity: 1, transition: { duration, delay } }
        },
        none: {
          hidden: {},
          visible: {}
        }
      };

      return (
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={variants[animation]}
              className={className}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      );
    };