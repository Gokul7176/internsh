'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { productService } from '@/services/productService';
import { ImageGallery } from '@/components/product/ImageGallery';
import { IngredientList } from '@/components/product/IngredientList';
import { ReviewSection } from '@/components/product/ReviewSection';
import { FrequentlyBought } from '@/components/product/FrequentlyBought';
import { ProductCard } from '@/components/catalog/ProductCard';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      const data = await productService.getProductById(id);
      if (isMounted && data) {
        setProduct(data);
        const all = await productService.getAllProducts();
        if (isMounted) {
          const related = all.filter((p) => p.id !== data.id && (p.category === data.category || p.brand === data.brand));
          setRelatedProducts(related.slice(0, 4));
        }
      }
      if (isMounted) setLoading(false);
    }
    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ProductCardSkeleton />
          <div className="space-y-4">
            <ProductCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 max-w-md mx-auto text-center px-4 space-y-4">
        <h2 className="font-serif text-3xl text-stone-900 dark:text-cream-50">Product Not Found</h2>
        <p className="text-xs text-stone-500">The skincare formulation you requested could not be located in our catalog.</p>
        <Link href="/catalog">
          <Button variant="gold">Return to Skincare Catalog</Button>
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>
      </div>

      {/* Main product showcase grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery */}
        <div className="lg:col-span-6">
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="gold" size="sm">
                {product.brand}
              </Badge>
              <Badge variant="cream" size="sm">
                {product.category.toUpperCase()}
              </Badge>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-cream-50">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <StarRating rating={product.rating} size="sm" />
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{product.rating}</span>
              <span className="text-xs text-stone-400">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="font-serif text-3xl font-normal text-stone-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm line-through text-stone-400 font-light">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-xs text-stone-500">/ {product.volume}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed pt-2 border-t border-stone-200 dark:border-stone-800">
            {product.description}
          </p>

          {/* Benefits Tags */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">Key Benefits:</h4>
            <div className="flex flex-wrap gap-2">
              {product.benefits.map((benefit, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/60 text-amber-900 dark:text-amber-300 text-xs font-medium"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Add to Bag */}
          <div className="pt-4 space-y-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-full p-1 bg-stone-50 dark:bg-stone-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-stone-600 dark:text-stone-300"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-stone-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-stone-600 dark:text-stone-300"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button
                onClick={() => addToCart(product, quantity)}
                variant="gold"
                size="lg"
                className="flex-1 shadow-lg shadow-amber-600/20"
              >
                <ShoppingBag className="w-5 h-5" /> Add {quantity} to Shopping Bag
              </Button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-full border transition-colors shrink-0 ${
                  isSaved
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                    : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-amber-500'
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Shipping & Guarantee highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600 dark:text-[#D4AF37]" />
                <span className="dark:text-[#A0A0A0]">Free Express Shipping ₹2,500+</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>30-Day Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      <FrequentlyBought currentProduct={product} relatedProducts={relatedProducts} />

      {/* Ingredients & Clinical Details */}
      <IngredientList ingredients={product.ingredients} benefits={product.benefits} usage={product.usage} />

      {/* Customer Reviews Section */}
      <ReviewSection productId={product.id} />

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-stone-200 dark:border-stone-800">
          <h3 className="font-serif text-2xl font-normal text-stone-900 dark:text-cream-50">
            Complements Your Routine
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
