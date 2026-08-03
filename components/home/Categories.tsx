'use client';

import React from 'react';
import Link from 'next/link';
import { ProductCategory } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';

interface CategoryItem {
  id: ProductCategory;
  name: string;
  count: string;
  image: string;
  description: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'serum',
    name: 'Targeted Serums',
    count: '8 Products',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    description: 'Antioxidants, Vitamin C & Retinol cell renewal',
  },
  {
    id: 'cleanser',
    name: 'Botanical Cleansers',
    count: '5 Products',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    description: 'pH-balanced purifying gels & milky elixirs',
  },
  {
    id: 'moisturizer',
    name: 'Barrier Moisture',
    count: '6 Products',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800',
    description: 'Essential Ceramides, Squalane & Hyaluronic Acid',
  },
  {
    id: 'sunscreen',
    name: 'Mineral Sunscreens',
    count: '4 Products',
    image: 'https://images.unsplash.com/photo-1567928269937-ae145459966c?auto=format&fit=crop&q=80&w=800',
    description: 'Zinc oxide broad-spectrum SPF 50 shields',
  },
  {
    id: 'exfoliant',
    name: 'AHA & BHA Exfoliants',
    count: '4 Products',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    description: 'Salicylic & Glycolic liquid pore resurfacing',
  },
  {
    id: 'eye-care',
    name: 'Peptide Eye Care',
    count: '3 Products',
    image: 'https://images.unsplash.com/photo-1608248597262-838d14f70d0a?auto=format&fit=crop&q=80&w=800',
    description: 'Depuffing caffeine & peptide eye serums',
  },
];

export function Categories() {
  return (
    <section className="py-20 bg-cream-50/50 dark:bg-[#151515]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-[#D4AF37]">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-[#F5F5F5] mt-1">
              Shop by Skincare Category
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-semibold text-stone-900 dark:text-[#F5F5F5] hover:text-[#D4AF37] flex items-center gap-1 group transition-colors"
          >
            View All Categories <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="group relative rounded-3xl overflow-hidden h-72 border border-stone-200/80 dark:border-[#2A2A2A] shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <SafeImage
                src={cat.image}
                alt={cat.name}
                fill
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-6 flex flex-col justify-end text-white z-10">
                <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
                  {cat.count}
                </span>
                <h3 className="font-serif text-2xl font-normal group-hover:text-[#E7C765] transition-colors flex items-center justify-between">
                  {cat.name}
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
