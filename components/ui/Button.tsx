import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full active:scale-[0.98]';

    const variants = {
      primary: 'bg-stone-900 text-cream-50 hover:bg-stone-800 dark:bg-[#F5F5F5] dark:text-[#0B0B0C] dark:hover:bg-white shadow-md hover:shadow-lg',
      secondary: 'bg-stone-200/80 text-stone-900 hover:bg-stone-300/80 dark:bg-[#1B1B1B] dark:text-[#F5F5F5] dark:hover:bg-[#202020] dark:border dark:border-[#2A2A2A]',
      outline: 'border border-stone-300 dark:border-[#2A2A2A] text-stone-900 dark:text-[#F5F5F5] hover:bg-stone-100 dark:hover:bg-[#1B1B1B]',
      ghost: 'text-stone-700 dark:text-[#A0A0A0] dark:hover:text-[#F5F5F5] hover:bg-stone-100 dark:hover:bg-[#1B1B1B]',
      gold: 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E7C765] hover:to-[#D4AF37] text-stone-950 font-semibold shadow-md hover:shadow-[#D4AF37]/20',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3.5 text-base gap-2.5',
      icon: 'p-2.5 rounded-full',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
