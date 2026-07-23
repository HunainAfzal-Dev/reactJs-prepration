import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number; // ms
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toast: (options: Omit<ToastItem, 'id'>) => string;
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

const toastTypeStyles: Record<ToastType, { icon: React.ReactNode; border: string; bg: string }> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
  },
  info: {
    icon: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (options: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = {
        id,
        duration: 4000,
        type: 'info',
        ...options,
      };

      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => addToast({ title, message, type: 'success' }),
    [addToast]
  );
  const error = useCallback(
    (title: string, message?: string) => addToast({ title, message, type: 'error' }),
    [addToast]
  );
  const warning = useCallback(
    (title: string, message?: string) => addToast({ title, message, type: 'warning' }),
    [addToast]
  );
  const info = useCallback(
    (title: string, message?: string) => addToast({ title, message, type: 'info' }),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toast: addToast, success, error, warning, info, removeToast }}
    >
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence mode="sync">
          {toasts.map((item) => {
            const styles = toastTypeStyles[item.type || 'info'];

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={cn(
                  'pointer-events-auto relative bg-zinc-950/95 border rounded-2xl p-4 shadow-2xl backdrop-blur-2xl text-zinc-100 flex items-start gap-3 overflow-hidden',
                  styles.border,
                  styles.bg
                )}
              >
                {styles.icon}

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white font-outfit">{item.title}</h4>
                  {item.message && <p className="text-[11px] text-zinc-300 mt-0.5">{item.message}</p>}

                  {item.action && (
                    <button
                      type="button"
                      onClick={() => {
                        item.action?.onClick();
                        removeToast(item.id);
                      }}
                      className="mt-2 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                    >
                      {item.action.label}
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(item.id)}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Progress bar countdown */}
                {item.duration && item.duration > 0 && (
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: item.duration / 1000, ease: 'linear' }}
                    className={cn(
                      'absolute bottom-0 left-0 h-0.5 opacity-60',
                      item.type === 'success' && 'bg-emerald-400',
                      item.type === 'error' && 'bg-rose-400',
                      item.type === 'warning' && 'bg-amber-400',
                      item.type === 'info' && 'bg-indigo-400'
                    )}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
