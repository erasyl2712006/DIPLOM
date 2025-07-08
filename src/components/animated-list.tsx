import React from 'react';
    import { motion, AnimatePresence } from 'framer-motion';

    interface AnimatedListProps {
      items: any[];
      renderItem: (item: any, index: number) => React.ReactNode;
      keyExtractor: (item: any) => string;
      className?: string;
    }

    export const AnimatedList: React.FC<AnimatedListProps> = ({ 
      items, 
      renderItem, 
      keyExtractor,
      className 
    }) => {
      return (
        <div className={className}>
          <AnimatePresence initial={false}>
            {items.map((item, index) => (
              <motion.div
                key={keyExtractor(item)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  opacity: { duration: 0.2 }
                }}
                layout
              >
                {renderItem(item, index)}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      );
    };