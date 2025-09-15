import React, { createContext, useContext } from 'react';
import { useSnackbar } from '@/hooks/useSnackbar';
import Snackbar from '@/components/ui/snackbar';

interface SnackbarContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useGlobalSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useGlobalSnackbar must be used within SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { snackbars, showSuccess, showError, showWarning, showInfo, hideSnackbar } = useSnackbar();

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      {snackbars.map((snackbar) => (
        <Snackbar
          key={snackbar.id}
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => hideSnackbar(snackbar.id)}
        />
      ))}
    </SnackbarContext.Provider>
  );
};