import React, { forwardRef, useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isClearable?: boolean;
  onClear?: () => void;
  inputSize?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'filled';
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-3.5 py-2.5 text-sm rounded-xl',
  lg: 'px-4 py-3 text-base rounded-xl',
};

const variantStyles = {
  default: 'bg-zinc-900/90 border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder:text-zinc-500',
  glass: 'bg-zinc-900/40 backdrop-blur-md border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder:text-zinc-500',
  filled: 'bg-zinc-800/80 border-transparent focus:border-indigo-500 focus:bg-zinc-900 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder:text-zinc-400',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isClearable,
      onClear,
      inputSize = 'md',
      variant = 'default',
      fullWidth = true,
      type = 'text',
      className,
      value,
      onChange,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-zinc-300 flex items-center justify-between">
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-zinc-400 pointer-events-none flex items-center justify-center shrink-0">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={inputType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              'w-full border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
              sizeStyles[inputSize],
              variantStyles[variant],
              leftIcon && (inputSize === 'sm' ? 'pl-8' : inputSize === 'lg' ? 'pl-11' : 'pl-10'),
              (rightIcon || isPassword || (isClearable && value)) &&
                (inputSize === 'sm' ? 'pr-8' : inputSize === 'lg' ? 'pr-11' : 'pr-10'),
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
              className
            )}
            {...props}
          />

          <div className="absolute right-3 flex items-center gap-1.5 text-zinc-400">
            {isClearable && value && !disabled && (
              <button
                type="button"
                onClick={onClear}
                className="hover:text-zinc-200 transition-colors p-0.5 rounded focus:outline-none"
                tabIndex={-1}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="hover:text-zinc-200 transition-colors p-0.5 rounded focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}

            {!isPassword && rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </div>
        </div>

        {(error || helperText) && (
          <p className={cn('text-xs', error ? 'text-rose-400 font-medium' : 'text-zinc-400')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
