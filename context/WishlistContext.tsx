'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';
import { useToast } from './ToastContext';
import { safeGetStorage, safeSetStorage } from '@/lib/utils';

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  shareWishlistLink: () => string;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const WISHLIST_STORAGE_KEY = 'lumina_wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>(() =>
    safeGetStorage<Product[]>(WISHLIST_STORAGE_KEY, [])
  );
  const { success } = useToast();

  useEffect(() => {
    safeSetStorage(WISHLIST_STORAGE_KEY, wishlist);
  }, [wishlist]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      success(`Removed ${product.name} from your saved wishlist`, 'Wishlist Updated');
    } else {
      setWishlist((prev) => [...prev, product]);
      success(`Added ${product.name} to your saved wishlist`, 'Saved to Wishlist');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const shareWishlistLink = () => {
    if (typeof window === 'undefined') return '';
    const ids = wishlist.map((p) => p.id).join(',');
    const url = `${window.location.origin}/catalog?wishlist=${encodeURIComponent(ids)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
      success('Wishlist link copied to clipboard!', 'Share Wishlist');
    }
    return url;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        shareWishlistLink,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
