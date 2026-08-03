import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SkincareChatbot } from '@/components/ai/SkincareChatbot';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'Lumina Skincare | AI-Powered Luxury Clinical Formulations',
  description: 'Production-quality retail platform for luxury skincare. Formulated with bio-compatible botanicals, active ceramides, and personalized Gemini AI routine intelligence.',
  keywords: ['skincare', 'luxury skincare', 'AI routine', 'Vitamin C', 'Ceramides', 'Niacinamide', 'Lumina Skincare'],
  openGraph: {
    title: 'Lumina Skincare | AI-Powered Luxury Clinical Formulations',
    description: 'Elevate your daily skincare routine with clinical purity and personalized AI skin intelligence.',
    url: 'https://lumina-skincare.vercel.app',
    siteName: 'Lumina Skincare',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Lumina Skincare Hero',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-cream-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col min-h-screen">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <SkincareChatbot />
                <Analytics />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
