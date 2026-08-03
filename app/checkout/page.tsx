'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { orderService } from '@/services/orderService';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Truck, CreditCard, Lock, Home } from 'lucide-react';
import { UserAddress } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, tax, shippingFee, discount, total, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { error, success } = useToast();

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hasSyncedUser, setHasSyncedUser] = useState(false);

  if (user?.addresses && user.addresses.length > 0 && !hasSyncedUser) {
    setHasSyncedUser(true);
    const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
    setFullName(defaultAddr.fullName);
    setStreet(defaultAddr.street);
    setCity(defaultAddr.city);
    setState(defaultAddr.state);
    setZipCode(defaultAddr.zipCode);
    setCountry(defaultAddr.country);
  }

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 max-w-md mx-auto text-center px-4 space-y-4">
        <h2 className="font-serif text-3xl text-stone-900 dark:text-white">Your Bag is Empty</h2>
        <Button onClick={() => router.push('/catalog')} variant="gold">
          Return to Catalog
        </Button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !street || !city || !state || !zipCode) {
      error('Please complete all required shipping fields.', 'Missing Information');
      return;
    }

    setIsSubmitting(true);
    try {
      const shippingAddress: UserAddress = {
        id: 'addr-' + Date.now(),
        label: 'Shipping Address',
        fullName,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: true,
      };

      const order = await orderService.createOrder({
        userId: user?.uid || 'guest-user',
        customerName: fullName,
        customerEmail: email,
        items: cart.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          productImage: i.product.images[0],
          price: i.product.price,
          quantity: i.quantity,
        })),
        subtotal,
        tax,
        shippingFee,
        discount,
        total,
        couponCode: appliedCoupon?.code,
        shippingAddress,
        paymentMethod,
      });

      clearCart();
      success('Order placed successfully!', 'Confirmation');
      router.push(`/checkout/confirmation/${order.id}`);
    } catch (err) {
      error('Failed to place order. Please try again.', 'Order Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Secure Express Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 dark:text-cream-50 mt-1">
          Finalize Your Order
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address */}
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-cream-50 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600" /> Shipping Address
            </h3>

            {user?.addresses && user.addresses.length > 0 && (
              <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50 flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Home className="w-4 h-4" /> Using Saved Address
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <Input label="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="123 Luxury Lane, Suite 400" required />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
              <Input label="State / Province" value={state} onChange={(e) => setState(e.target.value)} required />
              <Input label="Zip / Postal Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
            </div>

            <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
          </div>

          {/* Payment Method */}
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-cream-50 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-600" /> Payment Information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Credit / Debit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600'
                }`}
              >
                Apple Pay / Google Pay
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <Input label="Cardholder Name" defaultValue={fullName} />
              <Input label="Card Number" placeholder="4532 •••• •••• 8910" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry Date" placeholder="MM/YY" />
                <Input label="CVC / CVV" placeholder="123" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary & Submission */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <OrderSummary showCheckoutButton={false} />

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full shadow-xl shadow-amber-600/20"
            isLoading={isSubmitting}
          >
            <Lock className="w-4 h-4" /> Complete & Pay Order
          </Button>

          <p className="text-[11px] text-stone-400 text-center">
            By clicking Complete Order, you agree to Lumina Skincare&apos;s Terms of Service and 30-Day Money Back Guarantee.
          </p>
        </div>
      </form>
    </div>
  );
}
