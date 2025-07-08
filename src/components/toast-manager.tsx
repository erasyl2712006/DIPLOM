import React from 'react';
    import { Toast, addToast } from '@heroui/react';
    
    interface ToastOptions {
      title: string;
      description?: string;
      color?: 'success' | 'danger' | 'warning' | 'primary';
      duration?: number;
      position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    }
    
    export const showToast = (options: ToastOptions) => {
      const {
        title,
        description,
        color = 'primary',
        duration = 3000,
        position = 'top-right'
      } = options;
      
      addToast({
        title,
        description,
        color,
        timeout: duration,
        shouldShowTimeoutProgress: true,
      });
    };
    
    export const showSuccessToast = (title: string, description?: string) => {
      showToast({
        title,
        description,
        color: 'success'
      });
    };
    
    export const showErrorToast = (title: string, description?: string) => {
      showToast({
        title,
        description,
        color: 'danger',
        duration: 5000
      });
    };