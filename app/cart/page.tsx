'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Trash2, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/components/cart/CartItem';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { ShippingProgressBar } from '@/components/cart/ShippingProgressBar';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { cart, itemCount, subtotal, freeShippingThreshold, amountNeededForFreeShipping, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 max-w-md mx-auto text-center px-4 space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-light text-stone-900 dark:text-cream-50">Your Bag is Empty</h2>
          <p className="text-xs text-stone-500">Discover personalized clinical formulations tailored for your skin type.</p>
        </div>
        <Link href="/catalog" className="block">
          <Button variant="gold" size="lg" className="w-full">
            Explore Skincare Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Shopping Bag
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-cream-50 mt-1">
            Your Selected Formulations ({itemCount})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Empty Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items list & shipping progress */}
        <div className="lg:col-span-7 space-y-6">
          <ShippingProgressBar
            subtotal={subtotal}
            threshold={freeShippingThreshold}
            amountNeeded={amountNeededForFreeShipping}
          />

          <div className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 sticky top-28">
          <OrderSummary showCheckoutButton />
        </div>
      </div>
    </div>
  );
}
