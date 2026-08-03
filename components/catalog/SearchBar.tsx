'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  onClear: () => void;
}

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  const popularTags = ['Vitamin C', 'Ceramide', 'Niacinamide', 'SPF 50', 'Retinol', 'Salicylic Acid'];

  return (
    <div className="w-full space-y-3">
      <div className="relative w-full">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by product name, key ingredient, or skin concern..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-10 py-3 text-sm rounded-full bg-white/90 dark:bg-stone-900/90 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px] shrink-0">Popular Searches:</span>
        {popularTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onChange(tag)}
            className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-amber-950 hover:text-amber-900 dark:hover:text-amber-200 shrink-0 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
