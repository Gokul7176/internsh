'use client';

import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';

export function CouponInput() {
  const [code, setCode] = useState('');
  const { appliedCoupon, applyCoupon, removeCoupon } = useCart();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    if (applyCoupon(code)) {
      setCode('');
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-emerald-900 dark:text-emerald-200">{appliedCoupon.code}</span>
          <span className="text-emerald-700 dark:text-emerald-300">
            ({appliedCoupon.discountPercent ? `${appliedCoupon.discountPercent}% OFF` : `$${appliedCoupon.discountAmount} OFF`})
          </span>
        </div>
        <button
          onClick={removeCoupon}
          className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1"
          aria-label="Remove promo code"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Promo code (e.g. GLOW20)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <Button type="submit" variant="secondary" size="sm" className="shrink-0">
        Apply
      </Button>
    </form>
  );
}
