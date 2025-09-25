import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface SnackbarProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'info': return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center space-x-3 p-4 rounded-lg border shadow-lg ${getBgColor()}`}>
      {getIcon()}
      <span className="text-sm font-medium text-gray-900">{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setSnackbar({ message, type });
  };

  const hideSnackbar = () => {
    setSnackbar(null);
  };

  const SnackbarComponent = snackbar ? (
    <Snackbar message={snackbar.message} type={snackbar.type} onClose={hideSnackbar} />
  ) : null;

  return { showSnackbar, SnackbarComponent };
};