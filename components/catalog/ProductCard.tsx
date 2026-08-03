'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Badge } from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSaved = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  if (viewMode === 'list') {
    return (
      <div className="group rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-5 items-center">
        <div className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discountPercent && (
            <Badge variant="gold" className="absolute top-2 left-2">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        <div className="flex-1 space-y-2 w-full">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-900 dark:text-stone-100">{product.rating}</span>
              <span className="text-stone-400">({product.reviewCount})</span>
            </div>
          </div>

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-lg font-normal text-stone-900 dark:text-cream-50 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-2 pt-1">
            {product.skinType.slice(0, 3).map((st) => (
              <Badge key={st} variant="cream" size="sm">
                {st}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex sm:flex-col justify-between items-end gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-stone-200 dark:border-stone-800 pt-3 sm:pt-0">
          <div className="text-right">
            <div className="text-lg font-bold text-stone-900 dark:text-white">{formatPrice(product.price)}</div>
            {product.originalPrice && (
              <div className="text-xs text-stone-400 line-through">{formatPrice(product.originalPrice)}</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2.5 rounded-full border transition-colors ${
                isSaved
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600'
                  : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
            </button>

            <button
              onClick={() => addToCart(product, 1)}
              className="px-4 py-2.5 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-950 font-medium text-xs flex items-center gap-2 hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-3xl p-4 border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative">
      {/* Image container */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-4">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </Link>

        {/* Wishlist toggle */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 ${
            isSaved
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:scale-110'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {discountPercent && <Badge variant="gold">-{discountPercent}%</Badge>}
          {product.isBestSeller && <Badge variant="stone">Best Seller</Badge>}
          {product.isNewArrival && !product.isBestSeller && <Badge variant="gold">New</Badge>}
        </div>

        {/* Quick Add overlay button */}
        <button
          onClick={() => addToCart(product, 1)}
          className="absolute bottom-3 left-3 right-3 py-2.5 px-4 rounded-xl bg-stone-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-stone-900 font-medium text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 transform translate-y-2 group-hover:translate-y-0 shadow-lg"
        >
          <ShoppingBag className="w-4 h-4" /> Quick Add to Bag
        </button>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
              {product.brand}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-900 dark:text-stone-100">{product.rating}</span>
            </div>
          </div>

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-base font-normal text-stone-900 dark:text-cream-50 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">{product.volume}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80">
          <div>
            <span className="text-base font-bold text-stone-900 dark:text-white">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through ml-1.5">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="sm:hidden p-2.5 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
