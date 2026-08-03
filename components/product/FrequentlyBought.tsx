'use client';

import React from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { SafeImage } from '@/components/ui/SafeImage';
import { validateProduct } from '@/validators/productValidation';

interface FrequentlyBoughtProps {
  currentProduct: Product;
  relatedProducts: Product[];
}

export function FrequentlyBought({ currentProduct: rawCurrent, relatedProducts }: FrequentlyBoughtProps) {
  const { addToCart } = useCart();
  const currentProduct = validateProduct(rawCurrent);

  const bundleItem = relatedProducts.length > 0 ? validateProduct(relatedProducts[0]) : null;
  if (!bundleItem) return null;

  const bundleTotal = currentProduct.price + bundleItem.price;
  const discountedTotal = bundleTotal * 0.85; // 15% bundle discount

  const handleAddBundle = () => {
    addToCart(currentProduct, 1);
    addToCart(bundleItem, 1);
  };

  return (
    <div className="p-6 rounded-3xl bg-amber-50/40 dark:bg-[#151515] border border-amber-200/60 dark:border-[#2A2A2A] space-y-4 my-8">
      <div className="flex items-center justify-between">
        <h4 className="font-serif text-lg font-normal text-stone-900 dark:text-[#F5F5F5]">
          Frequently Bought Together
        </h4>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#D4AF37] bg-amber-100 dark:bg-[#1B1B1B] px-2.5 py-0.5 rounded-full border dark:border-[#2A2A2A]">
          Save 15% Bundle Discount
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Item 1 */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#1B1B1B] p-3 rounded-2xl border border-stone-200 dark:border-[#2A2A2A] flex-1 w-full">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
            <SafeImage src={currentProduct.images[0]} alt={currentProduct.name} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <h5 className="text-xs font-semibold text-stone-900 dark:text-[#F5F5F5] truncate">{currentProduct.name}</h5>
            <p className="text-xs font-bold text-stone-900 dark:text-[#F5F5F5]">{formatPrice(currentProduct.price)}</p>
          </div>
        </div>

        <Plus className="w-5 h-5 text-[#D4AF37] shrink-0 hidden sm:block" />

        {/* Item 2 */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#1B1B1B] p-3 rounded-2xl border border-stone-200 dark:border-[#2A2A2A] flex-1 w-full">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
            <SafeImage src={bundleItem.images[0]} alt={bundleItem.name} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <h5 className="text-xs font-semibold text-stone-900 dark:text-[#F5F5F5] truncate">{bundleItem.name}</h5>
            <p className="text-xs font-bold text-stone-900 dark:text-[#F5F5F5]">{formatPrice(bundleItem.price)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-amber-200/50 dark:border-[#2A2A2A]">
        <div>
          <span className="text-xs text-stone-500 dark:text-[#A0A0A0]">Total Bundle Price: </span>
          <span className="text-lg font-bold text-stone-900 dark:text-[#F5F5F5]">{formatPrice(discountedTotal)}</span>
          <span className="text-xs text-stone-400 dark:text-[#777777] line-through ml-2">{formatPrice(bundleTotal)}</span>
        </div>

        <Button onClick={handleAddBundle} variant="gold" size="sm">
          <ShoppingBag className="w-4 h-4" /> Add 2 Items to Bag
        </Button>
      </div>
    </div>
  );
}
