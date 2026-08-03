'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const OfflineState: React.FC = () => {
  const [isOffline, setIsOffline] = useState(() => (typeof window !== 'undefined' ? !navigator.onLine : false));

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 rounded-2xl bg-[#151515] border border-[#F59E0B]/40 text-[#F5F5F5] shadow-2xl flex items-center gap-3 animate-slide-up max-w-sm">
      <div className="p-2 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
        <WifiOff className="w-5 h-5" />
      </div>
      <div className="flex-1 text-xs">
        <p className="font-semibold text-[#F5F5F5]">You are offline</p>
        <p className="text-[#A0A0A0]">Please check your network connection.</p>
      </div>
      <Button
        onClick={() => window.location.reload()}
        variant="ghost"
        size="sm"
        className="text-xs text-[#D4AF37] hover:bg-[#1B1B1B] p-1.5"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};
