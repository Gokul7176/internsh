'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Order } from '@/types';
import { orderService } from '@/services/orderService';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Package, Truck, Home, ArrowRight, Printer, Sparkles } from 'lucide-react';

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
        colors: ['#d97706', '#f59e0b', '#78350f', '#fbbf24'],
      });
    } catch {}

    async function loadOrder() {
      if (!orderId) return;
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-stone-500">Retrieving your order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto text-center space-y-4">
        <h2 className="font-serif text-3xl text-stone-900 dark:text-white">Order Details Not Found</h2>
        <Link href="/catalog">
          <Button variant="gold">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Confirmation Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-stone-900 via-stone-950 to-stone-900 text-white text-center space-y-4 relative overflow-hidden shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center mx-auto text-2xl shadow-lg animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Order Confirmed</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light">Thank You for Your Order!</h1>
        <p className="text-sm text-stone-300 max-w-md mx-auto">
          We have received your order <strong className="text-amber-400 font-mono">#{order.id}</strong>. An eco-luxe confirmation receipt has been dispatched to <span className="underline">{order.customerEmail}</span>.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-800 text-stone-300 hover:text-white text-xs font-medium border border-stone-700"
          >
            <Printer className="w-3.5 h-3.5" /> Print Receipt
          </button>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-cream-50 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" /> Order Tracking Timeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {order.timeline.map((step, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center space-y-2 relative transition-all ${
                step.completed
                  ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300/80 dark:border-amber-700/80'
                  : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                  step.completed ? 'bg-amber-600 text-white' : 'bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                {idx + 1}
              </div>
              <h4 className="font-semibold text-xs text-stone-900 dark:text-stone-100">{step.title}</h4>
              <p className="text-[10px] text-stone-500 leading-tight">{step.description}</p>
              {step.timestamp && (
                <p className="text-[9px] font-mono text-amber-700 dark:text-amber-400">{formatDate(step.timestamp)}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Items */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-cream-50">Items in This Order</h3>
          <div className="divide-y divide-stone-100 dark:divide-stone-800 space-y-3 pt-1">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 pt-3">
                <img src={item.productImage} alt={item.productName} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">{item.productName}</h4>
                  <p className="text-[11px] text-stone-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <div className="text-xs font-bold text-stone-900 dark:text-white">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address & Pricing Summary */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-cream-50">Shipping Destination</h3>
          <div className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800 p-3 rounded-2xl">
            <p className="font-bold text-stone-900 dark:text-white">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount ({order.couponCode}):</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Shipping:</span>
              <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between font-bold text-sm text-stone-900 dark:text-white">
              <span>Total Paid:</span>
              <span className="text-amber-700 dark:text-amber-400 font-serif text-base">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/dashboard?tab=orders" className="block w-full">
              <Button variant="gold" size="md" className="w-full">
                View in Order History <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
