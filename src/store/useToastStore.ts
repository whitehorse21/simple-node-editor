import { create } from 'zustand';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastStore {
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => string;
  removeToast: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    return id;
  },
  removeToast: (id: string) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },
}));

export default useToastStore;
