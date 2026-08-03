import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, ProductCategory, SkinType } from '@/types';
import { productService } from '@/services/productService';

export interface ProductFilters {
  category: ProductCategory | 'all';
  brand: string | 'all';
  skinType: SkinType | 'all';
  minPrice: number;
  maxPrice: number;
  search: string;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'rating';
}

export function useProducts(initialCategory: ProductCategory | 'all' = 'all') {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ProductFilters>({
    category: initialCategory,
    brand: 'all',
    skinType: 'all',
    minPrice: 0,
    maxPrice: 150,
    search: '',
    sortBy: 'newest',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load products';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    productService.getAllProducts().then(
      (data) => {
        if (isMounted) {
          setProducts(data);
          setError(null);
          setLoading(false);
        }
      },
      (err: unknown) => {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to load products';
          setError(message);
          setLoading(false);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute unique brands available
  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(products.map((p) => p.brand)));
    return brands.sort();
  }, [products]);

  // Compute filtered and sorted product list
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (filters.category !== 'all' && product.category !== filters.category) {
          return false;
        }

        // Brand filter
        if (filters.brand !== 'all' && product.brand !== filters.brand) {
          return false;
        }

        // Skin type filter
        if (
          filters.skinType !== 'all' &&
          !product.skinType.includes(filters.skinType) &&
          !product.skinType.includes('all')
        ) {
          return false;
        }

        // Price range filter
        if (product.price < filters.minPrice || product.price > filters.maxPrice) {
          return false;
        }

        // Search query
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchCategory = product.category.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchIng = product.ingredients.some((ing) => ing.toLowerCase().includes(q));

          if (!matchName && !matchBrand && !matchCategory && !matchDesc && !matchIng) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-low') {
          return a.price - b.price;
        }
        if (filters.sortBy === 'price-high') {
          return b.price - a.price;
        }
        if (filters.sortBy === 'rating') {
          return b.rating - a.rating;
        }
        // Default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, filters]);

  const resetFilters = () => {
    setFilters({
      category: 'all',
      brand: 'all',
      skinType: 'all',
      minPrice: 0,
      maxPrice: 150,
      search: '',
      sortBy: 'newest',
    });
  };

  return {
    products: filteredProducts,
    allProducts: products,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    availableBrands,
    refreshProducts: fetchProducts,
  };
}
