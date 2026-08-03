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
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch, setFilters]);

  useEffect(() => {
    if (filterPreset === 'bestsellers') {
      setFilters((prev) => ({ ...prev, sortBy: 'rating' }));
    } else if (filterPreset === 'new') {
      setFilters((prev) => ({ ...prev, sortBy: 'newest' }));
    }
  }, [filterPreset, setFilters]);

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

      {/* Search & Top Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        <div className="w-full md:w-1/2">
          <SearchBar
            value={searchInput}
            onChange={(q) => setSearchInput(q)}
            onClear={() => {
              setSearchInput('');
              setFilters((prev) => ({ ...prev, search: '' }));
            }}
          />
        </div>

        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" /> Filters
          </button>

          <SortSelect
            sortBy={filters.sortBy}
            onSortChange={(sort) => setFilters((prev) => ({ ...prev, sortBy: sort }))}
          />

          <ViewToggle viewMode={viewMode} onViewChange={(mode) => setViewMode(mode)} />
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar - Desktop */}
        <div className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-28">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            availableBrands={availableBrands}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="md:hidden col-span-12 p-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl mb-4">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              resetFilters={() => {
                resetFilters();
                setMobileFilterOpen(false);
              }}
              availableBrands={availableBrands}
            />
          </div>
        )}

        {/* Product Grid / List Container */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-200/60 dark:border-stone-800/60">
            <span>
              Showing <strong className="text-stone-900 dark:text-stone-100">{products.length}</strong> formulations
            </span>
            {(filters.category !== 'all' || filters.brand !== 'all' || filters.skinType !== 'all' || filters.search) && (
              <button
                onClick={resetFilters}
                className="text-amber-700 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white/60 dark:bg-stone-900/60 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 p-8 space-y-4">
              <Sparkles className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-2xl text-stone-900 dark:text-cream-50">No Formulations Match Your Filter</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try adjusting your search query, price slider, or skin concern filters.
              </p>
              <Button onClick={resetFilters} variant="gold" size="sm" className="mt-2">
                Reset Catalog Filters
              </Button>
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 max-w-7xl mx-auto px-4 grid grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
