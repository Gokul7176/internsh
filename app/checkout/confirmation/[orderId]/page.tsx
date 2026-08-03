'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Order } from '@/types';
import { orderService } from '@/services/orderService';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight, Printer, Sparkles } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';
import { ErrorState } from '@/components/ui/ErrorState';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fire festive confetti animation on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#e7c765', '#22c55e', '#1c1917'],
      });
    } catch {
      // Ignored if confetti canvas fails
    }
  }, []);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      setLoading(true);
      const found = await orderService.getOrderById(orderId);
      setOrder(found || null);
      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-stone-200 dark:bg-[#1B1B1B] mx-auto" />
        <div className="h-6 w-64 bg-stone-200 dark:bg-[#1B1B1B] mx-auto rounded-lg" />
        <div className="h-4 w-48 bg-stone-200 dark:bg-[#1B1B1B] mx-auto rounded-lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24">
        <ErrorState
          title="Order Record Not Found"
          message={`We couldn't locate order details for reference ID "${orderId}".`}
        />
        <div className="text-center mt-6">
          <Link href="/catalog">
            <Button variant="gold" size="md">
              Return to Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-10 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center space-y-4 bg-white/70 dark:bg-[#151515] p-8 rounded-3xl border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Order Successfully Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-[#F5F5F5]">
            Thank You, {order.customerName}!
          </h1>
          <p className="text-xs text-stone-500 dark:text-[#A0A0A0]">
            Order reference <strong className="font-mono text-stone-900 dark:text-[#F5F5F5]">#{order.id}</strong> • Sent confirmation email to {order.customerEmail}
          </p>
        </div>
      </div>

      {/* Order Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Items */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-[#F5F5F5]">Items in This Order</h3>
          <div className="divide-y divide-stone-100 dark:divide-[#2A2A2A] space-y-3 pt-1">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 pt-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-stone-200/60 dark:border-[#2A2A2A]">
                  <SafeImage src={item.productImage} alt={item.productName} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-stone-900 dark:text-[#F5F5F5] truncate">{item.productName}</h4>
                  <p className="text-[11px] text-stone-500 dark:text-[#777777]">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <div className="text-xs font-bold text-stone-900 dark:text-[#F5F5F5]">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial & Shipping Info */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md shadow-sm space-y-3 text-xs">
            <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-[#F5F5F5] pb-2 border-b border-stone-100 dark:border-[#2A2A2A]">
              Payment Summary
            </h3>
            <div className="flex justify-between text-stone-600 dark:text-[#A0A0A0]">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900 dark:text-[#F5F5F5]">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount Applied</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600 dark:text-[#A0A0A0]">
              <span>Sales Tax (8%)</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-stone-600 dark:text-[#A0A0A0]">
              <span>Shipping</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="pt-3 border-t border-stone-200 dark:border-[#2A2A2A] flex justify-between text-sm font-bold">
              <span className="text-stone-900 dark:text-[#F5F5F5]">Total Paid</span>
              <span className="font-serif text-amber-700 dark:text-[#D4AF37]">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md shadow-sm space-y-2 text-xs">
            <h4 className="font-bold text-stone-900 dark:text-[#F5F5F5]">Shipping Destination</h4>
            <p className="text-stone-600 dark:text-[#A0A0A0]">{order.shippingAddress.fullName}</p>
            <p className="text-stone-600 dark:text-[#A0A0A0]">{order.shippingAddress.street}</p>
            <p className="text-stone-600 dark:text-[#A0A0A0]">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p className="text-stone-500 dark:text-[#777777] pt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button onClick={() => window.print()} variant="outline" size="md" className="gap-2 border-[#2A2A2A] text-[#F5F5F5]">
          <Printer className="w-4 h-4" /> Print Receipt
        </Button>
        <Link href="/catalog">
          <Button variant="gold" size="md" className="gap-2">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
