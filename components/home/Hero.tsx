import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-white dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      {/* Background ambient lighting glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-200/40 via-rose-100/30 to-amber-100/20 dark:from-amber-900/20 dark:via-stone-800/10 dark:to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/50 dark:border-amber-700/50 text-amber-900 dark:text-amber-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>AI-POWERED DERMATOLOGICAL PRECISION</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 dark:text-cream-50 leading-[1.15]">
            Pure Clinical Elegance <br />
            <span className="font-normal italic bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-200 bg-clip-text text-transparent">
              Customized for Your Skin
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Formulated with bio-compatible botanicals, active ceramides, and stabilized antioxidants. Experience skincare tailored by artificial intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link href="/recommendations">
              <Button size="lg" variant="gold" className="w-full sm:w-auto shadow-lg shadow-amber-600/20">
                <Sparkles className="w-4 h-4" /> Start AI Skin Diagnosis
              </Button>
            </Link>
            <Link href="/catalog">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Catalog <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-6 border-t border-stone-200/80 dark:border-stone-800/80 flex items-center justify-center lg:justify-start gap-6">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Customer" className="w-9 h-9 rounded-full border-2 border-white dark:border-stone-900 object-cover" />
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" alt="Customer" className="w-9 h-9 rounded-full border-2 border-white dark:border-stone-900 object-cover" />
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" alt="Customer" className="w-9 h-9 rounded-full border-2 border-white dark:border-stone-900 object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                ))}
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 ml-1">4.9/5</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Over 10,000+ radiant skin transformations</p>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Product Image Display */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Main Product Showcase Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200/60 dark:border-stone-800/60 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md p-4 group">
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000"
                alt="Lumina Hero Serum"
                className="w-full aspect-[4/5] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Glassmorphic Badge 1 */}
              <div className="absolute top-8 right-8 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-stone-200/50 dark:border-stone-700/50 flex items-center gap-3 animate-float">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">Dermatologist Tested</p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">100% Non-Comedogenic</p>
                </div>
              </div>

              {/* Floating Glassmorphic Badge 2 */}
              <div className="absolute bottom-8 left-8 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200/50 dark:border-stone-700/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-serif font-bold flex items-center justify-center">
                  15%
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 dark:text-stone-100">Pure Vitamin C + E</p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">Stabilized Antioxidant Elixir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
