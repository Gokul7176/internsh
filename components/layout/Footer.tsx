import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, Leaf, Globe, MessageCircle, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-900 dark:bg-black text-stone-300 pt-16 pb-8 border-t border-stone-800">
      {/* Brand value highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-stone-800">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-amber-400 shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Clean Formulations</h4>
            <p className="text-xs text-stone-400">Botanical & Dermatologist tested</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-amber-400 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Eco-Luxe Express</h4>
            <p className="text-xs text-stone-400">Free shipping on orders ₹2,500+</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-amber-400 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">30-Day Guarantee</h4>
            <p className="text-xs text-stone-400">Hassle-free radiance promise</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Cruelty Free</h4>
            <p className="text-xs text-stone-400">100% Leaping Bunny certified</p>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 font-serif font-bold text-lg">
              L
            </div>
            <span className="font-serif text-xl tracking-wider uppercase font-semibold text-white">
              Lumina<span className="font-sans text-xs lowercase text-amber-400 tracking-normal ml-1">skincare</span>
            </span>
          </div>
          <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
            Elevating daily skincare routines with clinical purity, bio-compatible botanicals, and personalized AI skin intelligence.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="#" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 hover:text-amber-400 transition-colors" aria-label="Instagram">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 hover:text-amber-400 transition-colors" aria-label="Community">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 hover:text-amber-400 transition-colors" aria-label="Share">
              <Share2 className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">Shop Collections</h4>
          <ul className="space-y-2.5 text-sm text-stone-400">
            <li><Link href="/catalog?category=serum" className="hover:text-white transition-colors">Antioxidant Serums</Link></li>
            <li><Link href="/catalog?category=cleanser" className="hover:text-white transition-colors">Botanical Cleansers</Link></li>
            <li><Link href="/catalog?category=moisturizer" className="hover:text-white transition-colors">Barrier Moisture Creams</Link></li>
            <li><Link href="/catalog?category=sunscreen" className="hover:text-white transition-colors">Mineral Sunscreens</Link></li>
            <li><Link href="/catalog?category=exfoliant" className="hover:text-white transition-colors">AHA / BHA Exfoliants</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">AI Diagnostics</h4>
          <ul className="space-y-2.5 text-sm text-stone-400">
            <li><Link href="/recommendations" className="hover:text-white transition-colors">AI Routine Builder</Link></li>
            <li><Link href="/recommendations" className="hover:text-white transition-colors">Skin Type Quiz</Link></li>
            <li><Link href="/catalog" className="hover:text-white transition-colors">Ingredient Compatibility</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Customer Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-sm text-stone-400">
            <li><Link href="/dashboard?tab=orders" className="hover:text-white transition-colors">Track Order Timeline</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/dashboard?tab=profile" className="hover:text-white transition-colors">Account Profile</Link></li>
            <li><Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <p>© 2026 Lumina Skincare Inc. All rights reserved. Crafting luxury skincare through clinical AI precision.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-stone-400">Privacy Policy</a>
          <a href="#" className="hover:text-stone-400">Terms of Service</a>
          <a href="#" className="hover:text-stone-400">Sustainability</a>
        </div>
      </div>
    </footer>
  );
}
