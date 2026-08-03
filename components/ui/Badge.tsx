import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'cream' | 'stone' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'cream', size = 'sm', className }: BadgeProps) {
  const base = 'inline-flex items-center font-medium rounded-full tracking-wide';

  const variants = {
    gold: 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-700/60',
    cream: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700',
    stone: 'bg-stone-900 text-white dark:bg-white dark:text-stone-900',
    success: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800',
    danger: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800',
    outline: 'border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs uppercase font-semibold',
  };

  return <span className={cn(base, variants[variant], sizes[size], className)}>{children}</span>;
}
