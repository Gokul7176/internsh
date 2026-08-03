/**
 * Lumina Skincare - INR Currency Utility
 * Standardizes price formatting in Indian Rupees (INR - ₹) across the platform.
 */

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || typeof price !== 'number' || isNaN(price) || price < 0) {
    return '₹0';
  }

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `₹${Math.round(price)}`;
  }
}
