'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src?: string | null;
  fallbackSrc?: string;
  className?: string;
  aspectRatio?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = FALLBACK_IMAGE_URL,
  alt = 'Lumina Product Image',
  className,
  fill,
  width,
  height,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props
}) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const validSrc = (!isError && src && typeof src === 'string' && src.trim() !== '') ? src.trim() : fallbackSrc;

  return (
    <div className={cn('relative overflow-hidden bg-stone-100 dark:bg-[#151515]', fill ? 'w-full h-full' : '', className)}>
      {isLoading && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 dark:from-[#1B1B1B] dark:via-[#2A2A2A] dark:to-[#1B1B1B]" />
      )}
      <Image
        src={validSrc}
        alt={alt || 'Lumina Product'}
        fill={fill}
        width={!fill ? (width || 400) : undefined}
        height={!fill ? (height || 400) : undefined}
        priority={priority}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsError(true);
          setIsLoading(false);
        }}
        className={cn(
          'transition-opacity duration-300 object-cover',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        {...props}
      />
    </div>
  );
};
