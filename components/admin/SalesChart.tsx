'use client';

import React from 'react';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';
import { validateProduct } from '@/validators/productValidation';

interface SalesChartProps {
  products: Product[];
}

export function SalesChart({ products }: SalesChartProps) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const salesData = [124000, 182000, 156000, 224000, 289000, 312000, 385000, 421000];
  const maxSale = Math.max(...salesData);

  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Monthly Sales Revenue Visualizer */}
      <div className="lg:col-span-8 p-6 rounded-3xl bg-white/80 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-[#F5F5F5]">
              Monthly Sales Performance
            </h3>
            <p className="text-xs text-stone-500 dark:text-[#777777]">Gross revenue trajectory for 2026</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
            +32% YOY Growth
          </span>
        </div>

        {/* Bar chart representation */}
        <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-stone-100 dark:border-[#2A2A2A]">
          {salesData.map((val, i) => {
            const heightPct = Math.round((val / maxSale) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-stone-100 dark:bg-[#1B1B1B] rounded-t-xl overflow-hidden h-40 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-[#D4AF37] to-[#E7C765] group-hover:from-[#E7C765] group-hover:to-[#D4AF37] transition-all rounded-t-xl"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-stone-500 dark:text-[#A0A0A0]">{months[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performing Products */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-white/80 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-[#F5F5F5]">
          Top Selling Formulations
        </h3>

        <div className="space-y-3">
          {topProducts.map((rawProduct) => {
            const p = validateProduct(rawProduct);
            return (
              <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 dark:bg-[#1B1B1B] border border-stone-200/50 dark:border-[#2A2A2A]">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <SafeImage src={p.images[0]} alt={p.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-stone-900 dark:text-[#F5F5F5] truncate">{p.name}</h4>
                  <p className="text-[10px] text-stone-400 dark:text-[#777777]">{p.category} • {formatPrice(p.price)}</p>
                </div>
                <span className="text-xs font-bold text-amber-700 dark:text-[#D4AF37] shrink-0">
                  {p.stock} in stock
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
