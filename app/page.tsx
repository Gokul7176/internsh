'use client';

import React from 'react';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BestSellers } from '@/components/home/BestSellers';
import { NewArrivals } from '@/components/home/NewArrivals';
import { Benefits } from '@/components/home/Benefits';
import { Testimonials } from '@/components/home/Testimonials';
import { Newsletter } from '@/components/home/Newsletter';
import { useProducts } from '@/hooks/useProducts';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function HomePage() {
  const { allProducts, loading } = useProducts();

  return (
    <div className="space-y-0">
      <Hero />
      <Categories />

      {loading ? (
        <section className="py-20 max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </section>
      ) : (
        <>
          <FeaturedProducts products={allProducts} />
          <BestSellers products={allProducts} />
          <NewArrivals products={allProducts} />
        </>
      )}

      <Benefits />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
