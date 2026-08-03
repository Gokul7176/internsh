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
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      const data = await productService.getProductById(id);
      if (data) {
        setProduct(data);
        const all = await productService.getAllProducts();
        const related = all.filter((p) => p.id !== data.id && (p.category === data.category || p.brand === data.brand));
        setRelatedProducts(related.slice(0, 4));
      }
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductCardSkeleton />
        <div className="space-y-4">
          <ProductCardSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto text-center space-y-4">
        <h2 className="font-serif text-3xl text-stone-900 dark:text-white">Formulation Not Found</h2>
        <p className="text-xs text-stone-500">The product you requested does not exist or has been archived.</p>
        <Link href="/catalog">
          <Button variant="gold" size="md">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      {/* Main product overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6">
          <ImageGallery images={product.images} productName={product.name} isBestSeller={product.isBestSeller} />
        </div>

        {/* Right: Info & Purchase Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-700 dark:text-amber-400">
              {product.brand}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-cream-50">
              {product.name}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">{product.volume}</p>
          </div>

          {/* Rating score */}
          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} showScore count={product.reviewCount} size="md" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
              In Stock ({product.stock} available)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-serif font-bold text-stone-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {product.description}
          </p>

          {/* Skin Type compatibility badges */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Suitable For Skin Types:</span>
            <div className="flex flex-wrap gap-2">
              {product.skinType.map((st) => (
                <Badge key={st} variant="cream" size="sm">
                  {st}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="pt-4 space-y-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Quantity:</span>
              <div className="flex items-center gap-3 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-stone-600 dark:text-stone-300 hover:text-stone-900"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold min-w-[20px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="text-stone-600 dark:text-stone-300 hover:text-stone-900"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => addToCart(product, quantity)}
                variant="gold"
                size="lg"
                className="flex-1 shadow-lg shadow-amber-600/20"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Bag ({formatPrice(product.price * quantity)})
              </Button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-full border transition-all ${
                  isSaved
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600'
                    : 'border-stone-300 dark:border-stone-700 text-stone-600 hover:bg-stone-100'
                }`}
                aria-label="Save to wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Delivery & Assurance guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Free Express Shipping over $50</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>30-Day Radiance Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      <FrequentlyBought currentProduct={product} relatedProducts={relatedProducts} />

      {/* Ingredients & Usage */}
      <IngredientList ingredients={product.ingredients} benefits={product.benefits} usage={product.usage} />

      {/* Customer Reviews Section */}
      <ReviewSection productId={product.id} />

      {/* Related Products Carousel Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-stone-200 dark:border-stone-800">
          <h3 className="font-serif text-2xl font-normal text-stone-900 dark:text-cream-50">
            You May Also Love
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
