'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${widthMap[maxWidth]} bg-white dark:bg-[#151515] rounded-3xl shadow-2xl border border-stone-200 dark:border-[#2A2A2A] p-6 relative overflow-hidden transition-all duration-300 transform scale-100 max-h-[90vh] flex flex-col`}
      >
        {title && (
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-[#2A2A2A] mb-4">
            <h3 className="text-xl font-semibold text-stone-900 dark:text-[#F5F5F5]">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-[#F5F5F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-100 dark:bg-[#1B1B1B] text-stone-500 hover:text-stone-900 dark:hover:text-[#F5F5F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="overflow-y-auto flex-1 pr-1">{children}</div>
      </div>
    </div>
  );
}
