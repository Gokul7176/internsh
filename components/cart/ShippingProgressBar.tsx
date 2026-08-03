import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ShippingProgressBarProps {
  subtotal: number;
  threshold: number;
  amountNeeded: number;
}

export function ShippingProgressBar({ subtotal, threshold, amountNeeded }: ShippingProgressBarProps) {
  const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-stone-800 dark:text-stone-200">
        <span className="flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          {amountNeeded > 0 ? (
            <span>Add <strong className="text-amber-700 dark:text-amber-300">{formatPrice(amountNeeded)}</strong> for Free Express Shipping</span>
          ) : (
            <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> You've unlocked Free Express Shipping!
            </span>
          )}
        </span>
        <span className="text-[11px] text-stone-500">{percentage}%</span>
      </div>

      <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
