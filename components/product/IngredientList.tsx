import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface IngredientListProps {
  ingredients: string[];
  benefits: string[];
  usage: string;
}

export function IngredientList({ ingredients, benefits, usage }: IngredientListProps) {
  return (
    <div className="space-y-8 py-6 border-t border-stone-200 dark:border-stone-800">
      {/* Key Benefits */}
      <div className="space-y-3">
        <h4 className="font-serif text-lg font-normal text-stone-900 dark:text-cream-50 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" /> Key Clinical Benefits
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/50 dark:border-stone-700/50">
              <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span className="text-xs text-stone-700 dark:text-stone-300 font-medium leading-relaxed">{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="space-y-2">
        <h4 className="font-serif text-lg font-normal text-stone-900 dark:text-cream-50">Directions for Use</h4>
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-3.5 rounded-2xl border border-amber-200/50 dark:border-amber-900/50">
          <span className="font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
            {usage === 'morning' ? 'Morning Routine' : usage === 'evening' ? 'Evening Routine' : 'Morning & Evening Routine'}
          </span>
          : Dispense 3-4 drops onto clean fingertips. Press gently into face, neck, and décolletage in an upward circular motion until absorbed.
        </p>
      </div>

      {/* Full Ingredient List Tag Cloud */}
      <div className="space-y-3">
        <h4 className="font-serif text-lg font-normal text-stone-900 dark:text-cream-50">Full Ingredient Breakdown</h4>
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ing, i) => (
            <Badge key={i} variant="cream" size="sm">
              {ing}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
