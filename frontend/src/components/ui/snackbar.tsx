import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface SnackbarProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const Snackbar = ({ message, type = 'info', duration = 5000, onClose }: SnackbarProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5" />;
      case 'error': return <AlertCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'error': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'warning': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      default: return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 z-[9999] transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
    }`}>
      <div className={`${getStyles()} px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-80 max-w-md`}>
        {getIcon()}
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Snackbar;