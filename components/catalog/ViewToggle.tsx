import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
}

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
          viewMode === 'grid'
            ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
            : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
        }`}
        aria-label="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>

      <button
        onClick={() => onViewChange('list')}
        className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
          viewMode === 'list'
            ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
            : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
        }`}
        aria-label="List View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
