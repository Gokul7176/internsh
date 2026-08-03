import React from 'react';
import { ShieldCheck, Cpu, Droplet, Sparkles } from 'lucide-react';

export function Benefits() {
  const benefits = [
    {
      icon: Cpu,
      title: 'Gemini AI Intelligence',
      description: 'Personalized algorithms analyze your unique skin concerns to build ideal morning & evening routines.',
    },
    {
      icon: Droplet,
      title: 'Clinical Bio-Purity',
      description: 'Zero harsh parabens, artificial dyes, or fragrance fillers. Formulated for maximum skin barrier tolerance.',
    },
    {
      icon: ShieldCheck,
      title: 'Dermatologist Certified',
      description: 'Rigorously tested by independent clinical trials for efficacy, safety, and non-comedogenic protection.',
    },
    {
      icon: Sparkles,
      title: 'Ethical & Eco-Luxe',
      description: '100% Leaping Bunny cruelty-free with recyclable frosted amber glass packaging.',
    },
  ];

  return (
    <section className="py-24 bg-stone-900 text-stone-100 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">The Lumina Difference</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-white">
            Why Dermatologists & Aestheticians Choose Lumina
          </h2>
          <p className="text-sm text-stone-400">
            Blending clean botanical science with next-generation AI customization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-stone-800/60 border border-stone-700/60 backdrop-blur-md hover:border-amber-500/50 transition-colors group space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <b.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-normal text-white">{b.title}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
