'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon } from '@/types';
import { INITIAL_COUPONS } from '@/lib/mockData';
import { useToast } from './ToastContext';
import { safeGetStorage, safeSetStorage } from '@/lib/utils';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'lumina_cart_items';
const COUPON_STORAGE_KEY = 'lumina_cart_coupon';
const FREE_SHIPPING_THRESHOLD = 50;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() =>
    safeGetStorage<CartItem[]>(CART_STORAGE_KEY, [])
  );
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() =>
    safeGetStorage<Coupon | null>(COUPON_STORAGE_KEY, null)
  );
  const { success, error } = useToast();

  // Save cart to localStorage
  useEffect(() => {
    safeSetStorage(CART_STORAGE_KEY, cart);
  }, [cart]);

  // Save coupon to localStorage
  useEffect(() => {
    if (appliedCoupon) {
      safeSetStorage(COUPON_STORAGE_KEY, appliedCoupon);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = Math.min(newQty, product.stock || 99);
        return updated;
      }
      return [...prev, { id: 'item-' + Math.random().toString(36).substring(2, 7), product, quantity }];
    });
    success(`Added ${product.name} to your bag`, 'Added to Bag');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: Math.min(quantity, item.product.stock || 99) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const applyCoupon = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find((c) => c.code === formatted && c.isActive);

    if (!found) {
      error('Invalid promo coupon code.', 'Coupon Error');
      return false;
    }

    if (subtotal < found.minPurchase) {
      error(`Coupon ${formatted} requires a minimum order of $${found.minPurchase}.`, 'Minimum Order Required');
      return false;
    }

    setAppliedCoupon(found);
    success(`Promo coupon ${formatted} applied!`, 'Discount Applied');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minPurchase) {
    if (appliedCoupon.discountPercent) {
      discount = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount) {
      discount = appliedCoupon.discountAmount;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shippingFee = discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0 ? 0 : 8;
  const tax = discountedSubtotal * 0.08; // 8% estimated tax
  const total = discountedSubtotal + tax + shippingFee;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        tax,
        shippingFee,
        discount,
        total,
        appliedCoupon,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
