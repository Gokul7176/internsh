'use client';

import React from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

interface FrequentlyBoughtProps {
  currentProduct: Product;
  relatedProducts: Product[];
}

export function FrequentlyBought({ currentProduct, relatedProducts }: FrequentlyBoughtProps) {
  const { addToCart } = useCart();

  const bundleItem = relatedProducts.length > 0 ? relatedProducts[0] : null;
  if (!bundleItem) return null;

  const bundleTotal = currentProduct.price + bundleItem.price;
  const discountedTotal = bundleTotal * 0.85; // 15% bundle discount

  const handleAddBundle = () => {
    addToCart(currentProduct, 1);
    addToCart(bundleItem, 1);
  };

  return (
    <div className="p-6 rounded-3xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/60 space-y-4 my-8">
      <div className="flex items-center justify-between">
        <h4 className="font-serif text-lg font-normal text-stone-900 dark:text-cream-50">
          Frequently Bought Together
        </h4>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/80 px-2.5 py-0.5 rounded-full">
          Save 15% Bundle Discount
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Item 1 */}
        <div className="flex items-center gap-3 bg-white dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 flex-1">
          <img src={currentProduct.images[0]} alt={currentProduct.name} className="w-14 h-14 object-cover rounded-xl shrink-0" />
          <div className="min-w-0">
            <h5 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">{currentProduct.name}</h5>
            <p className="text-xs font-bold text-stone-900 dark:text-stone-100">{formatPrice(currentProduct.price)}</p>
          </div>
        </div>

        <Plus className="w-5 h-5 text-amber-600 shrink-0 hidden sm:block" />

        {/* Item 2 */}
        <div className="flex items-center gap-3 bg-white dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 flex-1">
          <img src={bundleItem.images[0]} alt={bundleItem.name} className="w-14 h-14 object-cover rounded-xl shrink-0" />
          <div className="min-w-0">
            <h5 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">{bundleItem.name}</h5>
            <p className="text-xs font-bold text-stone-900 dark:text-stone-100">{formatPrice(bundleItem.price)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-amber-200/50 dark:border-amber-900/50">
        <div>
          <span className="text-xs text-stone-500">Total Bundle Price: </span>
          <span className="text-lg font-bold text-stone-900 dark:text-white">{formatPrice(discountedTotal)}</span>
          <span className="text-xs text-stone-400 line-through ml-2">{formatPrice(bundleTotal)}</span>
        </div>

        <Button onClick={handleAddBundle} variant="gold" size="sm">
          <ShoppingBag className="w-4 h-4" /> Add 2 Items to Bag
        </Button>
      </div>
    </div>
  );
}
