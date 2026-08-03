import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortSelectProps {
  sortBy: 'newest' | 'price-low' | 'price-high' | 'rating';
  onSortChange: (sortBy: 'newest' | 'price-low' | 'price-high' | 'rating') => void;
}

export function SortSelect({ sortBy, onSortChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-stone-400 shrink-0" />
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as any)}
        className="px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 bg-white/80 dark:bg-stone-900/80 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <option value="newest">Sort by: Newest Additions</option>
        <option value="rating">Sort by: Highest Rated</option>
        <option value="price-low">Sort by: Price Low to High</option>
        <option value="price-high">Sort by: Price High to Low</option>
      </select>
    </div>
  );
}
