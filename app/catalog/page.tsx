'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { ProductCard } from '@/components/catalog/ProductCard';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';
import { SortSelect } from '@/components/catalog/SortSelect';
import { SearchBar } from '@/components/catalog/SearchBar';
import { ViewToggle } from '@/components/catalog/ViewToggle';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProductCategory } from '@/types';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as ProductCategory) || 'all';
  const filterPreset = searchParams.get('filter');

  const {
    products,
    loading,
    filters,
    setFilters,
    resetFilters,
    availableBrands,
  } = useProducts(initialCategory);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');

  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: debouncedSearch }));
    }
  }, [debouncedSearch, filters.search, setFilters]);

  useEffect(() => {
    if (filterPreset === 'bestsellers' && filters.sortBy !== 'rating') {
      setFilters((prev) => ({ ...prev, sortBy: 'rating' }));
    } else if (filterPreset === 'new' && filters.sortBy !== 'newest') {
      setFilters((prev) => ({ ...prev, sortBy: 'newest' }));
    }
  }, [filterPreset, filters.sortBy, setFilters]);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Catalog Header */}
      <div className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          <Sparkles className="w-3.5 h-3.5" /> Luxury Clinical Catalog
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 dark:text-cream-50">
          Explore Lumina Skincare Formulations
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 max-w-2xl">
          Discover bio-compatible botanical elixirs, active ceramide creams, and antioxidant serums designed for every skin type.
        </p>
      </div>

      {/* Control Toolbar: Search, Filters Mobile Trigger, Sorting & View Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onClear={() => setSearchInput('')}
          />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <SortSelect
            sortBy={filters.sortBy}
            onSortChange={(val) => setFilters((prev) => ({ ...prev, sortBy: val }))}
          />

          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-28">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            availableBrands={availableBrands}
          />
        </div>

        {/* Mobile Filter Drawer Overlay */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="w-4/5 max-w-xs h-full bg-white dark:bg-stone-950 p-6 overflow-y-auto space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200 dark:border-stone-800">
                <h3 className="font-serif text-lg font-semibold">Filter Catalog</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-xs font-bold text-stone-500"
                >
                  Close
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
                availableBrands={availableBrands}
              />
            </div>
          </div>
        )}

        {/* Products Grid / List Stream */}
        <div className="lg:col-span-9 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 space-y-4">
              <Sparkles className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-cream-50">
                  No Matching Formulations Found
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try broadening your price range, clearing search terms, or resetting category filters.
                </p>
              </div>
              <Button onClick={resetFilters} variant="gold" size="sm" className="gap-2">
                <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
