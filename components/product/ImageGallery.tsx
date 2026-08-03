'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { SafeImage } from '@/components/ui/SafeImage';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  isBestSeller?: boolean;
}

export function ImageGallery({ images, productName, isBestSeller }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [zoom, setZoom] = useState<boolean>(false);

  const safeImages = Array.isArray(images) && images.length > 0 ? images : [];
  const currentImg = safeImages[selectedImage] || safeImages[0] || '';

  return (
    <div className="space-y-4">
      {/* Main selected image view with zoom */}
      <div
        className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] cursor-zoom-in group shadow-md"
        onClick={() => setZoom(!zoom)}
      >
        <SafeImage
          src={currentImg}
          alt={productName}
          fill
          priority
          className={`w-full h-full object-cover transition-transform duration-500 ${
            zoom ? 'scale-150' : 'group-hover:scale-105'
          }`}
        />
        {isBestSeller && (
          <Badge variant="gold" className="absolute top-4 left-4 z-10">
            Best Seller
          </Badge>
        )}
        <span className="absolute bottom-4 right-4 z-10 text-[10px] font-semibold text-stone-600 dark:text-[#A0A0A0] bg-white/80 dark:bg-[#0B0B0C]/80 px-2.5 py-1 rounded-full backdrop-blur-md">
          Click image to {zoom ? 'reset' : 'zoom'}
        </span>
      </div>

      {/* Thumbnails list */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              aria-label={`View ${productName} thumbnail ${idx + 1}`}
              className={`relative w-20 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                selectedImage === idx
                  ? 'border-amber-600 dark:border-[#D4AF37] scale-95 shadow-sm'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <SafeImage src={img} alt={`${productName} thumbnail ${idx}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
