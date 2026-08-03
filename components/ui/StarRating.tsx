import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (newRating: number) => void;
  showScore?: boolean;
  count?: number;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'sm',
  interactive = false,
  onRatingChange,
  showScore = false,
  count,
}: StarRatingProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = rating >= starValue;
          const isHalf = rating >= starValue - 0.5 && rating < starValue;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            >
              <Star
                className={`${sizeMap[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-stone-200 dark:fill-stone-800 text-stone-300 dark:text-stone-700'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showScore && <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 ml-1">{rating.toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-stone-500 dark:text-stone-400">({count})</span>}
    </div>
  );
}
