'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Product } from '@/types';

interface NewArrivalsProps {
  products: Product[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const display = newArrivals.length > 0 ? newArrivals : products.slice(4, 8);

  return (
    <section className="py-20 bg-white dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> Fresh Innovations
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-cream-50 mt-1">
              New Skincare Launches
            </h2>
          </div>
          <Link
            href="/catalog?filter=new"
            className="text-sm font-semibold text-stone-900 dark:text-stone-100 hover:text-amber-600 flex items-center gap-1 group"
          >
            Explore New Arrivals <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {display.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
