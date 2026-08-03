import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold tracking-wide uppercase text-stone-600 dark:text-stone-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && <div className="absolute left-3.5 text-stone-400 pointer-events-none">{leftIcon}</div>}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 text-sm rounded-xl border bg-white/80 dark:bg-stone-900/80 text-stone-900 dark:text-stone-100 placeholder-stone-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              error ? 'border-rose-500 focus:ring-rose-500/50' : 'border-stone-300 dark:border-stone-700',
              className
            )}
            {...props}
          />
          {rightIcon && <div className="absolute right-3.5 text-stone-400">{rightIcon}</div>}
        </div>
        {error && <p className="text-xs text-rose-500 mt-0.5">{error}</p>}
        {!error && helperText && <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
