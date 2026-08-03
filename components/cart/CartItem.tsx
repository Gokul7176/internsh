'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-stone-200/80 dark:border-stone-800/80 last:border-b-0">
      {/* Product Thumbnail */}
      <Link href={`/product/${product.id}`} className="shrink-0 w-20 aspect-square rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
          {product.brand}
        </span>
        <Link href={`/product/${product.id}`} className="block">
          <h4 className="font-serif text-sm font-medium text-stone-900 dark:text-cream-50 hover:text-amber-600 truncate">
            {product.name}
          </h4>
        </Link>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{product.volume}</p>
        <div className="text-sm font-bold text-stone-900 dark:text-white mt-1 sm:hidden">
          {formatPrice(product.price * quantity)}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700 shrink-0">
        <button
          onClick={() => updateQuantity(item.id, quantity - 1)}
          className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white p-0.5"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 min-w-[20px] text-center">
          {quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, quantity + 1)}
          className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white p-0.5"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Price & Delete */}
      <div className="hidden sm:block text-right shrink-0 min-w-[80px]">
        <div className="text-sm font-bold text-stone-900 dark:text-white">
          {formatPrice(product.price * quantity)}
        </div>
        <div className="text-[10px] text-stone-400">
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
