'use client';

import React from 'react';
import { ProductCategory, SkinType } from '@/types';
import { ProductFilters } from '@/hooks/useProducts';
import { Filter, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface FilterSidebarProps {
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  resetFilters: () => void;
  availableBrands: string[];
}

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'serum', label: 'Serums & Concentrates' },
  { id: 'cleanser', label: 'Cleansers' },
  { id: 'moisturizer', label: 'Moisturizers' },
  { id: 'sunscreen', label: 'Sunscreens (SPF 50)' },
  { id: 'exfoliant', label: 'AHA & BHA Exfoliants' },
  { id: 'mask', label: 'Clay & Hydration Masks' },
  { id: 'eye-care', label: 'Eye Serums' },
];

const SKIN_TYPES: { id: SkinType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Skin Types' },
  { id: 'dry', label: 'Dry' },
  { id: 'oily', label: 'Oily' },
  { id: 'combination', label: 'Combination' },
  { id: 'sensitive', label: 'Sensitive' },
  { id: 'normal', label: 'Normal' },
];

export function FilterSidebar({ filters, setFilters, resetFilters, availableBrands }: FilterSidebarProps) {
  return (
    <aside className="w-full space-y-8 p-6 rounded-3xl bg-white/70 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-[#2A2A2A]">
        <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-[#F5F5F5] flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4AF37]" /> Filter Catalog
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-stone-500 dark:text-[#777777] hover:text-[#D4AF37] dark:hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset All
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-[#F5F5F5]">Category</h4>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filters.category === cat.id
                  ? 'bg-amber-100 dark:bg-[#1B1B1B] text-amber-900 dark:text-[#D4AF37] font-bold border border-amber-300/60 dark:border-[#2A2A2A]'
                  : 'text-stone-600 dark:text-[#A0A0A0] hover:bg-stone-100 dark:hover:bg-[#1B1B1B]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skin Type Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-[#F5F5F5]">Skin Concern / Type</h4>
        <div className="flex flex-wrap gap-1.5">
          {SKIN_TYPES.map((st) => (
            <button
              key={st.id}
              onClick={() => setFilters((prev) => ({ ...prev, skinType: st.id }))}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filters.skinType === st.id
                  ? 'bg-stone-900 text-white dark:bg-[#F5F5F5] dark:text-[#0B0B0C] font-bold shadow-sm'
                  : 'bg-stone-100 dark:bg-[#1B1B1B] text-stone-700 dark:text-[#A0A0A0] hover:bg-stone-200 dark:hover:bg-[#202020]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Selection */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-[#F5F5F5]">Brand</h4>
        <select
          value={filters.brand}
          onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
          aria-label="Filter by brand"
          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-[#2A2A2A] bg-white dark:bg-[#1B1B1B] text-stone-900 dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]"
        >
          <option value="all">All Luxury Brands</option>
          {availableBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <h4 className="font-bold uppercase tracking-wider text-stone-900 dark:text-[#F5F5F5]">Max Price</h4>
          <span className="font-bold text-amber-700 dark:text-[#D4AF37]">{formatPrice(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min="499"
          max="5000"
          step="100"
          value={filters.maxPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
          aria-label="Filter by maximum price"
          className="w-full accent-[#D4AF37] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-stone-400 dark:text-[#777777]">
          <span>{formatPrice(499)}</span>
          <span>{formatPrice(5000)}+</span>
        </div>
      </div>
    </aside>
  );
}
