import { Product } from '@/types';

export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800';

export interface ValidatedProduct extends Product {
  isValidTitle: boolean;
  isValidPrice: boolean;
  isValidRating: boolean;
  displayTitle: string;
  displayPrice: string;
  safeImages: string[];
}

/**
 * Validates product object to ensure safe properties and prevent runtime errors.
 */
export function validateProduct(product: Partial<Product> | null | undefined): ValidatedProduct {
  const safeId = product?.id || `fallback-${Math.random().toString(36).substring(2, 9)}`;

  // Title validation
  const titleCandidate = product?.name || (product as unknown as { title?: string })?.title;
  const isValidTitle = typeof titleCandidate === 'string' && titleCandidate.trim().length > 0;
  const displayTitle = isValidTitle ? titleCandidate.trim() : 'Unavailable Product';

  // Price validation
  const price = product?.price;
  const isValidPrice = typeof price === 'number' && !isNaN(price) && price >= 0;
  const displayPrice = isValidPrice ? `₹${price.toLocaleString('en-IN')}` : 'Price N/A';

  // Rating validation
  const rating = product?.rating;
  const isValidRating = typeof rating === 'number' && !isNaN(rating) && rating >= 0 && rating <= 5;
  const reviewCount = typeof product?.reviewCount === 'number' && !isNaN(product.reviewCount) ? Math.max(0, product.reviewCount) : 0;

  // Image array validation
  let safeImages: string[] = [];
  if (Array.isArray(product?.images) && product.images.length > 0) {
    safeImages = product.images.filter((img) => typeof img === 'string' && img.trim().length > 0);
  }
  if (safeImages.length === 0) {
    safeImages = [DEFAULT_PRODUCT_IMAGE];
  }

  return {
    id: safeId,
    name: displayTitle,
    brand: product?.brand || 'Lumina',
    price: isValidPrice ? (price as number) : 0,
    originalPrice: typeof product?.originalPrice === 'number' && !isNaN(product.originalPrice) ? product.originalPrice : undefined,
    rating: isValidRating ? (rating as number) : 0,
    reviewCount,
    stock: typeof product?.stock === 'number' && !isNaN(product.stock) ? Math.max(0, product.stock) : 0,
    category: product?.category || 'serum',
    skinType: Array.isArray(product?.skinType) ? product.skinType : ['all'],
    images: safeImages,
    description: product?.description || 'No product description available.',
    ingredients: Array.isArray(product?.ingredients) ? product.ingredients : [],
    benefits: Array.isArray(product?.benefits) ? product.benefits : [],
    usage: (product?.usage === 'morning' || product?.usage === 'evening' || product?.usage === 'both') ? product.usage : 'both',
    volume: product?.volume || '50ml',
    isFeatured: Boolean(product?.isFeatured),
    isBestSeller: Boolean(product?.isBestSeller),
    isNewArrival: Boolean(product?.isNewArrival),
    createdAt: product?.createdAt || new Date().toISOString(),
    updatedAt: product?.updatedAt || new Date().toISOString(),
    isValidTitle,
    isValidPrice,
    isValidRating,
    displayTitle,
    displayPrice,
    safeImages,
  };
}
