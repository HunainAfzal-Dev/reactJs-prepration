import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export type CardVariant = 'default' | 'glass' | 'gradient' | 'interactive' | 'bordered';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: CardVariant;
  hoverGlow?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-zinc-900/90 border-zinc-800 text-zinc-100',
  glass: 'glass-card text-zinc-100',
  gradient: 'bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border-zinc-800 text-zinc-100',
  interactive: 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 cursor-pointer text-zinc-100',
  bordered: 'bg-transparent border-zinc-800 text-zinc-100',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverGlow = false, children, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={variant === 'interactive' || hoverGlow ? { y: -2 } : undefined}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative rounded-2xl border p-5 shadow-xl transition-all duration-300 overflow-hidden',
          variantStyles[variant],
          hoverGlow && 'hover:shadow-indigo-500/10 hover:border-indigo-500/30',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn('text-lg font-semibold tracking-tight text-white font-outfit', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-xs text-zinc-400', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('pt-0', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex items-center pt-4 border-t border-zinc-800/60 mt-4', className)} {...props}>
    {children}
  </div>
);
