'use client';

import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'We couldn’t find anything matching your request.',
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="min-h-[300px] p-8 rounded-3xl bg-[#151515] border border-[#2A2A2A] flex flex-col items-center justify-center text-center space-y-4 shadow-sm animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-[#1B1B1B] text-[#D4AF37] border border-[#2A2A2A] flex items-center justify-center">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="font-serif text-xl font-medium text-[#F5F5F5]">{title}</h3>
        <p className="text-xs text-[#A0A0A0] leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="mt-2 text-xs border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1B1B1B]">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
