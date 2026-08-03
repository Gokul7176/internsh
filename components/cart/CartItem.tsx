'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { SafeImage } from '@/components/ui/SafeImage';
import { validateProduct } from '@/validators/productValidation';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const product = validateProduct(item.product);
  const quantity = item.quantity;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-stone-200/80 dark:border-[#2A2A2A] last:border-b-0">
      {/* Product Thumbnail */}
      <Link href={`/product/${product.id}`} className="shrink-0 relative w-20 aspect-square rounded-2xl overflow-hidden bg-stone-100 dark:bg-[#151515] border border-stone-200/60 dark:border-[#2A2A2A]">
        <SafeImage src={product.images[0]} alt={product.name} fill className="object-cover" />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-[#D4AF37] tracking-wider">
          {product.brand}
        </span>
        <Link href={`/product/${product.id}`} className="block">
          <h4 className="font-serif text-sm font-medium text-stone-900 dark:text-[#F5F5F5] hover:text-[#D4AF37] truncate transition-colors">
            {product.name}
          </h4>
        </Link>
        <p className="text-xs text-stone-500 dark:text-[#777777] mt-0.5">{product.volume}</p>
        <div className="text-sm font-bold text-stone-900 dark:text-[#F5F5F5] mt-1 sm:hidden">
          {formatPrice(product.price * quantity)}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-2 bg-stone-100 dark:bg-[#1B1B1B] px-2.5 py-1 rounded-full border border-stone-200 dark:border-[#2A2A2A] shrink-0">
        <button
          onClick={() => updateQuantity(item.id, quantity - 1)}
          className="text-stone-600 dark:text-[#A0A0A0] hover:text-stone-900 dark:hover:text-[#F5F5F5] p-0.5 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs font-bold text-stone-900 dark:text-[#F5F5F5] min-w-[20px] text-center">
          {quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, quantity + 1)}
          className="text-stone-600 dark:text-[#A0A0A0] hover:text-stone-900 dark:hover:text-[#F5F5F5] p-0.5 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Price & Delete */}
      <div className="hidden sm:block text-right shrink-0 min-w-[80px]">
        <div className="text-sm font-bold text-stone-900 dark:text-[#F5F5F5]">
          {formatPrice(product.price * quantity)}
        </div>
        <div className="text-[10px] text-stone-400 dark:text-[#777777]">
          {formatPrice(product.price)} each
        </div>
      </div>

      <button
        onClick={() => removeFromCart(item.id)}
        className="p-2 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shrink-0"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
