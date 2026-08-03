'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this information. Please try again.',
  onRetry,
}) => {
  return (
    <div className="min-h-[250px] p-8 rounded-3xl bg-[#151515] border border-[#EF4444]/30 flex flex-col items-center justify-center text-center space-y-4 shadow-sm animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="font-serif text-lg font-medium text-[#F5F5F5]">{title}</h3>
        <p className="text-xs text-[#A0A0A0] leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2 text-xs border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1B1B1B]">
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
};
