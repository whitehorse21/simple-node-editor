import React from 'react';
import Toast from './Toast';
import type { ToastType } from './Toast';

interface ToastState {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastState[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-20 right-5 z-[2000] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
