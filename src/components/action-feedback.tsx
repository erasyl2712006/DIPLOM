import React from 'react';
    import { motion } from 'framer-motion';
    import { Chip } from '@heroui/react';

    interface ActionFeedbackProps {
      action: 'added' | 'updated' | 'deleted' | null;
      timeout?: number;
    }

    export const ActionFeedback: React.FC<ActionFeedbackProps> = ({ 
      action,
      timeout = 2000 
    }) => {
      const [visible, setVisible] = React.useState(action !== null);
      
      React.useEffect(() => {
        setVisible(action !== null);
        
        if (action) {
          const timer = setTimeout(() => {
            setVisible(false);
          }, timeout);
          
          return () => clearTimeout(timer);
        }
      }, [action, timeout]);
      
      if (!visible || !action) return null;
      
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute right-2 top-2 z-10"
        >
          <Chip
            color={action === 'added' ? 'success' : action === 'updated' ? 'primary' : 'danger'}
            variant="flat"
          >
            {action === 'added' ? 'Добавлено' : action === 'updated' ? 'Обновлено' : 'Удалено'}
          </Chip>
        </motion.div>
      );
    };