import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple' | 'accent';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulseDot?: boolean;
  outline?: boolean;
  onRemove?: () => void;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, { filled: string; outline: string; dot: string }> = {
  success: {
    filled: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    outline: 'bg-transparent text-emerald-400 border-emerald-500/50',
    dot: 'bg-emerald-400',
  },
  warning: {
    filled: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    outline: 'bg-transparent text-amber-400 border-amber-500/50',
    dot: 'bg-amber-400',
  },
  error: {
    filled: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    outline: 'bg-transparent text-rose-400 border-rose-500/50',
    dot: 'bg-rose-400',
  },
  info: {
    filled: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    outline: 'bg-transparent text-sky-400 border-sky-500/50',
    dot: 'bg-sky-400',
  },
  neutral: {
    filled: 'bg-zinc-800 text-zinc-300 border-zinc-700/60',
    outline: 'bg-transparent text-zinc-400 border-zinc-700',
    dot: 'bg-zinc-400',
  },
  purple: {
    filled: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    outline: 'bg-transparent text-purple-400 border-purple-500/50',
    dot: 'bg-purple-400',
  },
  accent: {
    filled: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    outline: 'bg-transparent text-indigo-400 border-indigo-500/50',
    dot: 'bg-indigo-400',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px] font-semibold gap-1 rounded-md',
  md: 'px-2.5 py-1 text-xs font-semibold gap-1.5 rounded-lg',
  lg: 'px-3 py-1.5 text-sm font-semibold gap-2 rounded-xl',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  pulseDot = false,
  outline = false,
  onRemove,
  children,
  className,
  ...props
}) => {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center border transition-colors select-none tracking-wide',
        outline ? styles.outline : styles.filled,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
          {pulseDot && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
                styles.dot
              )}
            />
          )}
          <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', styles.dot)} />
        </span>
      )}

      <span>{children}</span>

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-white/10 rounded p-0.5 transition-colors focus:outline-none ml-0.5"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
