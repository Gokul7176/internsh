'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      error('Please enter a valid email address.', 'Invalid Email');
      return;
    }
    setSubmitted(true);
    success('Thank you for subscribing to Lumina Skincare Journal!', '15% Off Code Sent');
    setEmail('');
  };

  return (
    <section className="py-20 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Exclusive Privileges</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-light">
          Unlock 15% Off Your First Order
        </h2>
        <p className="text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
          Subscribe to the Lumina Skincare Journal for early access to clinical formulation launches, AI skin tips, and exclusive promo codes.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm rounded-full bg-stone-800/80 border border-stone-700 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <Button type="submit" variant="gold" size="lg" className="shrink-0">
              Subscribe
            </Button>
          </form>
        ) : (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-sm font-semibold animate-fade-in">
            <CheckCircle2 className="w-5 h-5" /> You&apos;re subscribed! Use promo code <span className="underline font-bold">WELCOME10</span> at checkout.
          </div>
        )}
      </div>
    </section>
  );
}
