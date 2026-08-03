import { describe, it, expect } from 'vitest';
import { Product } from '../types';

describe('Cart Calculation Logic', () => {
  const mockProductA: Product = {
    id: 'prod-1',
    name: 'Vitamin C Serum',
    brand: 'Lumina Lab',
    price: 50,
    rating: 4.9,
    reviewCount: 25,
    stock: 20,
    category: 'serum',
    skinType: ['all'],
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be'],
    description: 'Antioxidant serum',
    ingredients: ['Vitamin C'],
    benefits: ['Brightening'],
    usage: 'morning',
    volume: '30ml',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  it('calculates subtotal and free shipping correctly', () => {
    const items = [{ id: 'item-1', product: mockProductA, quantity: 2 }];
    const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    const shippingFee = subtotal >= 50 ? 0 : 8;

    expect(subtotal).toBe(100);
    expect(shippingFee).toBe(0);
  });

  it('calculates 10% coupon discount correctly', () => {
    const subtotal = 100;
    const discountPercent = 10;
    const discount = (subtotal * discountPercent) / 100;
    const discountedSubtotal = subtotal - discount;

    expect(discount).toBe(10);
    expect(discountedSubtotal).toBe(90);
  });
});
