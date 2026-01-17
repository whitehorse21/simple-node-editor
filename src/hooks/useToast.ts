import useToastStore from '../store/useToastStore';

export const useToast = () => {
  const toasts = useToastStore((state) => state.toasts);
  const showToast = useToastStore((state) => state.showToast);
  const removeToast = useToastStore((state) => state.removeToast);

  return { toasts, showToast, removeToast };
};
