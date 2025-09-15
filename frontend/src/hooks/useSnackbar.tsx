import { useState, useCallback } from 'react';

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  id: number;
}

export const useSnackbar = () => {
  const [snackbars, setSnackbars] = useState<SnackbarState[]>([]);

  const showSnackbar = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now();
    setSnackbars(prev => [...prev, { message, type, id }]);
  }, []);

  const hideSnackbar = useCallback((id: number) => {
    setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
  }, []);

  return {
    snackbars,
    showSnackbar,
    hideSnackbar,
    showSuccess: (message: string) => showSnackbar(message, 'success'),
    showError: (message: string) => showSnackbar(message, 'error'),
    showWarning: (message: string) => showSnackbar(message, 'warning'),
    showInfo: (message: string) => showSnackbar(message, 'info'),
  };
};