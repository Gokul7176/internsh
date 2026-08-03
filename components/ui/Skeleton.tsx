import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-stone-200/70 dark:bg-[#1B1B1B]', className)}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl p-4 border border-stone-200/80 dark:border-[#2A2A2A] bg-white/60 dark:bg-[#151515] shadow-sm flex flex-col gap-3 h-full">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <div className="flex justify-between items-start pt-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <div className="flex justify-between items-center pt-2 mt-auto">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}
