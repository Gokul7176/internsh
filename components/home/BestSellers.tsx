'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Product } from '@/types';

interface BestSellersProps {
  products: Product[];
}

export function BestSellers({ products }: BestSellersProps) {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-20 bg-cream-50/60 dark:bg-stone-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> Customer Favorites
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-cream-50 mt-1">
              Best Selling Formulas
            </h2>
          </div>
          <Link
            href="/catalog?filter=bestsellers"
            className="text-sm font-semibold text-stone-900 dark:text-stone-100 hover:text-amber-600 flex items-center gap-1 group"
          >
            Shop All Best Sellers <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
