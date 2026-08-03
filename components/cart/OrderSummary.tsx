'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { CouponInput } from './CouponInput';

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
}

export function OrderSummary({ showCheckoutButton = true }: OrderSummaryProps) {
  const { subtotal, tax, shippingFee, discount, total, appliedCoupon } = useCart();

  return (
    <div className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-6">
      <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-cream-50 pb-3 border-b border-stone-200 dark:border-stone-800">
        Order Summary
      </h3>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between text-stone-600 dark:text-stone-300">
          <span>Bag Subtotal</span>
          <span className="font-semibold text-stone-900 dark:text-white">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
            <span>Promo Discount ({appliedCoupon?.code})</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-stone-600 dark:text-stone-300">
          <span>Estimated Sales Tax (8%)</span>
          <span className="font-semibold text-stone-900 dark:text-white">{formatPrice(tax)}</span>
        </div>

        <div className="flex justify-between text-stone-600 dark:text-stone-300">
          <span>Eco-Luxe Express Shipping</span>
          <span className="font-semibold text-stone-900 dark:text-white">
            {shippingFee === 0 ? <strong className="text-emerald-600 uppercase">FREE</strong> : formatPrice(shippingFee)}
          </span>
        </div>

        <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-between text-sm">
          <span className="font-bold text-stone-900 dark:text-white">Total Amount</span>
          <span className="font-serif text-xl font-bold text-amber-700 dark:text-amber-400">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <CouponInput />
      </div>

      {showCheckoutButton && (
        <Link href="/checkout" className="block w-full">
          <Button variant="gold" size="lg" className="w-full shadow-lg shadow-amber-600/20">
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      )}

      <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Encrypted 256-Bit SSL Checkout Security</span>
      </div>
    </div>
  );
}
