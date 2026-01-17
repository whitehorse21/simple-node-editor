import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  const typeStyles = {
    success: 'border-l-4 border-l-emerald-500',
    error: 'border-l-4 border-l-red-500',
    info: 'border-l-4 border-l-blue-500',
    warning: 'border-l-4 border-l-amber-500',
  };

  const iconColors = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-amber-500',
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-lg min-w-[250px] max-w-[400px] pointer-events-auto animate-[toastSlideIn_0.3s_ease-out] ${typeStyles[type]}`}>
      <span className={`text-lg font-bold flex-shrink-0 ${iconColors[type]}`}>{icons[type]}</span>
      <span className="flex-1 text-sm text-gray-800">{message}</span>
      <button 
        className="bg-transparent border-none text-xl text-gray-500 cursor-pointer p-0 w-5 h-5 flex items-center justify-center flex-shrink-0 rounded transition-all hover:bg-gray-100 hover:text-gray-800"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
