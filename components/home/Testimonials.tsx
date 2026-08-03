'use client';

import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';

export function Testimonials() {
  const reviews = [
    {
      name: 'Sophia Laurent',
      role: 'Verified Buyer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      title: 'The AI Routine Builder was spot on!',
      comment: 'I answered 5 quick questions about my combination skin and dark spots. The Vitamin C serum & Ceramide cream recommendation literally transformed my skin tone in 3 weeks!',
      product: 'Cellular Radiance Vitamin C Serum',
    },
    {
      name: 'Dr. Marcus Vance',
      role: 'Cosmetic Dermatologist',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      title: 'Flawless formulations & barrier protection',
      comment: 'As a dermatologist, I am extraordinarily picky. Lumina’s 5-Ceramide repair ratio and 15% L-Ascorbic Acid stability are top-tier clinical grade.',
      product: 'Aura Barrier Repair Ceramide Cream',
    },
    {
      name: 'Elena Rostova',
      role: 'Verified Buyer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      title: 'No white-cast mineral SPF 50!',
      comment: 'Finding a Zinc Oxide sunscreen that doesn’t leave a ghost-white layer was impossible until Invisible Dew SPF 50. It leaves a gorgeous dew-drop glow.',
      product: 'Invisible Dew SPF 50',
    },
  ];

  return (
    <section className="py-24 bg-cream-50/50 dark:bg-[#151515]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-[#D4AF37]">
            Real Stories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-[#F5F5F5]">
            Loved by Over 10,000+ Radiant Customers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white/80 dark:bg-[#1B1B1B] border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-stone-200 dark:text-[#2A2A2A]" />
                </div>
                <h3 className="font-semibold text-stone-900 dark:text-[#F5F5F5] text-base">{rev.title}</h3>
                <p className="text-xs text-stone-600 dark:text-[#A0A0A0] leading-relaxed italic">&quot;{rev.comment}&quot;</p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-stone-100 dark:border-[#2A2A2A]">
                <SafeImage
                  src={rev.avatar}
                  alt={rev.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-[#F5F5F5] flex items-center gap-1">
                    {rev.name} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </h4>
                  <p className="text-[10px] text-stone-400 dark:text-[#777777]">{rev.role} • {rev.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
