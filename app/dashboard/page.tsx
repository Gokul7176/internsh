'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { orderService } from '@/services/orderService';
import { userService } from '@/services/userService';
import { Order, Product, SkinType } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { User, ShoppingBag, Heart, MapPin, Share2, RefreshCw, CheckCircle2, ChevronRight, ShieldAlert } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const { user, updateProfile, isAdmin, logout, setDemoUser } = useAuth();
  const { wishlist, removeFromWishlist, shareWishlistLink } = useWishlist();
  const { addToCart } = useCart();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

  // Edit Profile fields
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [skinType, setSkinType] = useState<SkinType>('combination');
  const [isUpdating, setIsUpdating] = useState(false);

  // Saved Address fields
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZip, setAddressZip] = useState('');

  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);

  if (user && user.uid !== syncedUserId) {
    setSyncedUserId(user.uid);
    setDisplayName(user.displayName);
    setPhone(user.phone || '');
    setSkinType(user.skinType || 'combination');
  }

  useEffect(() => {
    let isMounted = true;
    async function loadOrders() {
      if (!user) return;
      setLoadingOrders(true);
      const data = await orderService.getUserOrders(user.uid);
      if (isMounted) {
        setOrders(data);
        setLoadingOrders(false);
      }
    }
    loadOrders();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile({ displayName, phone, skinType });
      success('Your profile details have been saved!', 'Profile Updated');
    } catch (err) {
      error('Failed to update profile.', 'Error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !addressStreet || !addressCity || !addressState || !addressZip) return;

    try {
      await userService.saveAddress(user.uid, {
        label: 'Home',
        fullName: user.displayName,
        street: addressStreet,
        city: addressCity,
        state: addressState,
        zipCode: addressZip,
        country: 'United States',
        isDefault: true,
      });
      success('New shipping address saved!', 'Address Saved');
      setAddressStreet('');
      setAddressCity('');
      setAddressState('');
      setAddressZip('');
    } catch (err) {
      error('Failed to save address.', 'Error');
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.productId,
          name: item.productName,
          brand: 'Lumina Skincare',
          price: item.price,
          rating: 4.9,
          reviewCount: 20,
          stock: 50,
          category: 'serum',
          skinType: ['all'],
          images: [item.productImage],
          description: '',
          ingredients: [],
          benefits: [],
          usage: 'both',
          volume: '30ml',
          createdAt: '',
          updatedAt: '',
        },
        item.quantity
      );
    });
    success('All items added to your shopping bag!', 'Reorder Complete');
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Dashboard Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-500 text-stone-950 font-serif text-2xl font-bold flex items-center justify-center border-2 border-amber-400">
            {user?.displayName ? user.displayName.charAt(0) : 'U'}
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-light">
              Welcome back, {user?.displayName || 'Skincare Enthusiast'}
            </h1>
            <p className="text-xs text-stone-400 mt-1">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="gold" size="sm">
                Skin Profile: {user?.skinType || 'Combination'}
              </Badge>
              {isAdmin && (
                <Link href="/admin">
                  <Badge variant="stone" size="sm" className="bg-amber-600 text-white cursor-pointer">
                    <ShieldAlert className="w-3 h-3 mr-1" /> Admin Dashboard
                  </Badge>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Demo Switcher Quick Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setDemoUser('admin')}
            className="px-3.5 py-1.5 rounded-full bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-600 hover:text-white transition-colors"
          >
            Switch to Demo Admin
          </button>
          <Button onClick={logout} variant="outline" size="sm" className="text-white border-stone-700 hover:bg-stone-800">
            Sign Out
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <User className="w-4 h-4" /> Edit Profile
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Order History ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'wishlist'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Heart className="w-4 h-4" /> Saved Wishlist ({wishlist.length})
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'addresses'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4" /> Saved Addresses
        </button>
      </div>

      {/* Tab Content 1: Edit Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl p-8 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-cream-50">
            Personal Information & Diagnostic Preferences
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input label="Full Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            <Input label="Email Address" value={user?.email || ''} disabled helperText="Email address is linked to your Firebase Authentication account." />
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 019-2834" />

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
                Primary Skin Type Profile
              </label>
              <select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value as SkinType)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="dry">Dry</option>
                <option value="oily">Oily</option>
                <option value="combination">Combination</option>
                <option value="sensitive">Sensitive</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full mt-4" isLoading={isUpdating}>
              Save Profile Changes
            </Button>
          </form>
        </div>
      )}

      {/* Tab Content 2: Order History */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-white/60 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80 space-y-4">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-2xl text-stone-900 dark:text-white">No Orders Placed Yet</h3>
              <p className="text-xs text-stone-500">Explore our luxury skincare catalog to place your first order.</p>
              <Link href="/catalog">
                <Button variant="gold" size="sm">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                      ORDER #{o.id}
                    </span>
                    <p className="text-[10px] text-stone-400">Placed on {formatDate(o.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="gold">{o.status.toUpperCase()}</Badge>
                    <span className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                      {formatPrice(o.total)}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {o.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50">
                      <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">{item.productName}</h5>
                        <p className="text-[10px] text-stone-400">Qty: {item.quantity} • {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <Link href={`/checkout/confirmation/${o.id}`} className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1">
                    Track Live Timeline <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Button onClick={() => handleReorder(o)} variant="outline" size="sm">
                    <RefreshCw className="w-3.5 h-3.5" /> Reorder Items
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content 3: Wishlist Management */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-cream-50">
              Saved Formulations ({wishlist.length})
            </h3>
            {wishlist.length > 0 && (
              <Button onClick={shareWishlistLink} variant="outline" size="sm">
                <Share2 className="w-3.5 h-3.5" /> Share Wishlist Link
              </Button>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-white/60 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80 space-y-4">
              <Heart className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-2xl text-stone-900 dark:text-white">Your Wishlist is Empty</h3>
              <p className="text-xs text-stone-500">Tap the heart icon on any skincare card to save items here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 p-8 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-cream-50">
              Add New Address
            </h3>
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <Input label="Street Address" value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} placeholder="123 Luxury Lane" required />
              <div className="grid grid-cols-3 gap-3">
                <Input label="City" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} required />
                <Input label="State" value={addressState} onChange={(e) => setAddressState(e.target.value)} required />
                <Input label="Zip Code" value={addressZip} onChange={(e) => setAddressZip(e.target.value)} required />
              </div>
              <Button type="submit" variant="gold" size="md" className="w-full">
                Save Shipping Address
              </Button>
            </form>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-cream-50">
              Saved Address Book
            </h3>
            {user?.addresses && user.addresses.length > 0 ? (
              user.addresses.map((addr) => (
                <div key={addr.id} className="p-4 rounded-2xl bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-white">{addr.fullName}</span>
                    {addr.isDefault && <Badge variant="gold">Default</Badge>}
                  </div>
                  <p className="text-stone-600 dark:text-stone-300">{addr.street}</p>
                  <p className="text-stone-500">{addr.city}, {addr.state} {addr.zipCode}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 italic">No saved addresses yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 max-w-7xl mx-auto px-4 space-y-6">
        <ProductCardSkeleton />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
