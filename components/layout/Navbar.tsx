'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, User, Sparkles, Search, Menu, X, ShieldAlert, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from '@/components/ui/Badge';
import { SafeImage } from '@/components/ui/SafeImage';

export function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout, setDemoUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Catalog', href: '/catalog' },
    { name: 'AI Routine', href: '/recommendations', highlight: true },
    { name: 'Best Sellers', href: '/catalog?filter=bestsellers' },
    { name: 'New Arrivals', href: '/catalog?filter=new' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream-50/90 dark:bg-[#0B0B0C]/90 backdrop-blur-md border-b border-stone-200/50 dark:border-[#2A2A2A] shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 dark:text-[#F5F5F5]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#E7C765] flex items-center justify-center text-stone-950 font-serif text-lg font-bold shadow-md group-hover:scale-105 transition-transform">
              L
            </div>
            <span className="font-serif text-xl tracking-wider uppercase font-semibold text-stone-900 dark:text-[#F5F5F5]">
              Lumina<span className="font-sans text-xs lowercase text-amber-600 dark:text-[#D4AF37] tracking-normal ml-1">skincare</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
                pathname === link.href
                  ? 'text-amber-700 dark:text-[#D4AF37] font-semibold'
                  : 'text-stone-700 hover:text-amber-600 dark:text-[#A0A0A0] dark:hover:text-[#D4AF37]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {link.highlight && <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />}
                {link.name}
              </span>
              {pathname === link.href && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/catalog"
            className="p-2.5 rounded-full text-stone-700 dark:text-[#A0A0A0] hover:bg-stone-100 dark:hover:bg-[#1B1B1B] dark:hover:text-[#F5F5F5] transition-colors"
            aria-label="Search products"
          >
            <Search className="w-5 h-5" />
          </Link>

          <Link
            href="/dashboard?tab=wishlist"
            className="p-2.5 rounded-full text-stone-700 dark:text-[#A0A0A0] hover:bg-stone-100 dark:hover:bg-[#1B1B1B] dark:hover:text-[#F5F5F5] transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 dark:bg-[#D4AF37] text-white dark:text-[#0B0B0C] text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="p-2.5 rounded-full text-stone-700 dark:text-[#A0A0A0] hover:bg-stone-100 dark:hover:bg-[#1B1B1B] dark:hover:text-[#F5F5F5] transition-colors relative"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 dark:bg-[#D4AF37] text-white dark:text-[#0B0B0C] text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User / Profile menu */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="User profile menu"
                className="flex items-center gap-2 p-1.5 rounded-full border border-stone-300 dark:border-[#2A2A2A] hover:bg-stone-100 dark:hover:bg-[#1B1B1B] transition-colors"
              >
                {user.photoURL ? (
                  <SafeImage src={user.photoURL} alt={user.displayName} width={28} height={28} className="w-7 h-7 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-[#1B1B1B] text-amber-800 dark:text-[#D4AF37] border dark:border-[#2A2A2A] flex items-center justify-center font-semibold text-xs uppercase shrink-0">
                    {user.displayName.charAt(0)}
                  </div>
                )}
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-[#F5F5F5] border border-stone-300 dark:border-[#2A2A2A] rounded-full hover:bg-stone-100 dark:hover:bg-[#1B1B1B] transition-colors"
              >
                <User className="w-4 h-4" /> Sign In
              </Link>
            )}

            {/* Profile Dropdown */}
            {profileDropdownOpen && user && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#151515] rounded-2xl shadow-xl border border-stone-200 dark:border-[#2A2A2A] py-2 z-50 animate-scale-up">
                <div className="px-4 py-2 border-b border-stone-100 dark:border-[#2A2A2A]">
                  <p className="text-sm font-semibold text-stone-900 dark:text-[#F5F5F5] truncate">{user.displayName}</p>
                  <p className="text-xs text-stone-500 dark:text-[#A0A0A0] truncate">{user.email}</p>
                  {isAdmin && (
                    <Badge variant="gold" size="sm" className="mt-1">
                      Admin Access
                    </Badge>
                  )}
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-stone-700 dark:text-[#A0A0A0] hover:bg-stone-100 dark:hover:bg-[#1B1B1B] dark:hover:text-[#F5F5F5]"
                >
                  My Profile & Orders
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 dark:text-[#D4AF37] font-semibold hover:bg-amber-50 dark:hover:bg-[#1B1B1B]"
                  >
                    <ShieldAlert className="w-4 h-4" /> Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-t border-stone-100 dark:border-[#2A2A2A] mt-1"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream-50 dark:bg-[#0B0B0C] border-b border-stone-200 dark:border-[#2A2A2A] px-4 py-6 space-y-4 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-stone-800 dark:text-[#F5F5F5] hover:text-amber-600 py-1"
            >
              {link.name}
            </Link>
          ))}
          {!user ? (
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2.5 bg-stone-900 dark:bg-[#F5F5F5] text-white dark:text-[#0B0B0C] rounded-full text-sm font-semibold"
            >
              Sign In / Register
            </Link>
          ) : (
            <div className="pt-2 border-t border-stone-200 dark:border-[#2A2A2A] space-y-2">
              <div className="text-xs text-stone-500 dark:text-[#777777]">Demo Role Switcher:</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setDemoUser('customer');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-[#2A2A2A] text-stone-700 dark:text-[#F5F5F5]"
                >
                  Demo Customer
                </button>
                <button
                  onClick={() => {
                    setDemoUser('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-1.5 text-xs rounded-lg bg-[#D4AF37] text-stone-950 font-semibold"
                >
                  Demo Admin
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
