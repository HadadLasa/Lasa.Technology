import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed top-24 right-4 z-50 animate-fade-in-down">
      <div 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md ${
          isSuccess 
            ? 'bg-green-50/90 dark:bg-green-900/50 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' 
            : 'bg-red-50/90 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
        }`}
      >
        {isSuccess ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <span className="text-sm font-medium pr-2">{toast.message}</span>
        <button 
          onClick={onClose}
          className={`p-1 rounded-full transition-colors ${
            isSuccess 
              ? 'hover:bg-green-100 dark:hover:bg-green-800' 
              : 'hover:bg-red-100 dark:hover:bg-red-800'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;