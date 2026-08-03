'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  isBestSeller?: boolean;
}

export function ImageGallery({ images, productName, isBestSeller }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [zoom, setZoom] = useState<boolean>(false);

  return (
    <div className="space-y-4">
      {/* Main selected image view with zoom */}
      <div
        className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-800/80 cursor-zoom-in group shadow-md"
        onClick={() => setZoom(!zoom)}
      >
        <img
          src={images[selectedImage] || images[0]}
          alt={productName}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            zoom ? 'scale-150' : 'group-hover:scale-105'
          }`}
        />
        {isBestSeller && (
          <Badge variant="gold" className="absolute top-4 left-4">
            Best Seller
          </Badge>
        )}
        <span className="absolute bottom-4 right-4 text-[10px] font-semibold text-stone-600 dark:text-stone-300 bg-white/80 dark:bg-stone-900/80 px-2.5 py-1 rounded-full backdrop-blur-md">
          Click image to {zoom ? 'reset' : 'zoom'}
        </span>
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`w-20 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                selectedImage === idx
                  ? 'border-amber-600 dark:border-amber-400 scale-95 shadow-sm'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${productName} thumbnail ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
