import React from 'react';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

interface SalesChartProps {
  products: Product[];
}

export function SalesChart({ products }: SalesChartProps) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const salesData = [12400, 18200, 15600, 22400, 28900, 31200, 38500, 42100];
  const maxSale = Math.max(...salesData);

  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Monthly Sales Revenue Visualizer */}
      <div className="lg:col-span-8 p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-cream-50">
              Monthly Sales Performance
            </h3>
            <p className="text-xs text-stone-500">Gross revenue trajectory for 2026</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
            +32% YOY Growth
          </span>
        </div>

        {/* Bar chart representation */}
        <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-stone-100 dark:border-stone-800">
          {salesData.map((val, i) => {
            const heightPct = Math.round((val / maxSale) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-t-xl overflow-hidden h-40 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-amber-600 to-amber-400 group-hover:from-amber-500 group-hover:to-amber-300 transition-all rounded-t-xl"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-stone-500">{months[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performing Products */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-cream-50">
          Top Selling Formulations
        </h3>

        <div className="space-y-3">
          {topProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/50 dark:border-stone-700/50">
              <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">{p.name}</h4>
                <p className="text-[10px] text-stone-400">{p.category} • {formatPrice(p.price)}</p>
              </div>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 shrink-0">
                {p.stock} in stock
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
