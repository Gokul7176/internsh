'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { orderService } from '@/services/orderService';
import { userService } from '@/services/userService';
import { productService } from '@/services/productService';
import { Product, Order, UserProfile, OrderStatus } from '@/types';
import { StatCards } from '@/components/admin/StatCards';
import { SalesChart } from '@/components/admin/SalesChart';
import { ProductTable } from '@/components/admin/ProductTable';
import { OrderTable } from '@/components/admin/OrderTable';
import { UserTable } from '@/components/admin/UserTable';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { ShieldAlert, Package, ShoppingBag, Users, LayoutDashboard, Plus, Lock } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAdmin, setDemoUser } = useAuth();
  const { products, refreshProducts } = useProducts();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      setLoadingData(true);
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders);

      // Dummy users for admin table view
      const demoUsersList: UserProfile[] = [
        {
          uid: 'user-001',
          email: 'emma.luxe@gmail.com',
          displayName: 'Emma Luxe',
          role: 'customer',
          skinType: 'combination',
          createdAt: '2026-01-10T00:00:00.000Z',
          updatedAt: '2026-01-10T00:00:00.000Z',
        },
        {
          uid: 'user-002',
          email: 'sophia.l@laurent.fr',
          displayName: 'Sophia Laurent',
          role: 'customer',
          skinType: 'dry',
          createdAt: '2026-01-15T00:00:00.000Z',
          updatedAt: '2026-01-15T00:00:00.000Z',
        },
        {
          uid: 'user-003',
          email: 'admin@luminaskincare.com',
          displayName: 'Lumina Administrator',
          role: 'admin',
          skinType: 'normal',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ];
      setUsers(demoUsersList);
      setLoadingData(false);
    }
    loadAdminData();
  }, []);

  // Gated Access Check
  if (!user || !isAdmin) {
    return (
      <div className="pt-32 pb-20 max-w-md mx-auto text-center px-4 space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-light text-stone-900 dark:text-cream-50">Admin Authentication Required</h2>
          <p className="text-xs text-stone-500">
            You must be logged in with an administrator account to access product inventory, revenue metrics, and order fulfillment.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Button onClick={() => setDemoUser('admin')} variant="gold" size="lg" className="w-full">
            Log in as Demo Administrator
          </Button>
          <Link href="/" className="block">
            <Button variant="outline" size="sm" className="w-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculations for KPI Cards
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 124500);
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  const handleCreateOrUpdateProduct = async (productData: any) => {
    if (editingProduct) {
      await productService.updateProduct(editingProduct.id, productData);
      success(`Updated product ${productData.name}`, 'Inventory Saved');
    } else {
      await productService.createProduct(productData);
      success(`Created new product ${productData.name}`, 'Product Published');
    }
    refreshProducts();
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to remove this product from the catalog?')) {
      await productService.deleteProduct(id);
      refreshProducts();
      success('Product deleted successfully.', 'Deleted');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await orderService.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      success(`Order #${orderId} status changed to ${newStatus.toUpperCase()}`, 'Status Updated');
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Lumina Enterprise Admin Portal
          </div>
          <h1 className="font-serif text-3xl font-light">Management Dashboard</h1>
          <p className="text-xs text-stone-400">Live analytics, inventory controls, and order dispatching.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} variant="gold" size="md">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Revenue Overview
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Package className="w-4 h-4" /> Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Users className="w-4 h-4" /> Users ({users.length})
        </button>
      </div>

      {/* Tab 1: Revenue Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <StatCards
            totalRevenue={totalRevenue}
            totalOrders={orders.length + 42}
            totalCustomers={users.length + 120}
            totalProducts={products.length}
            lowStockCount={lowStockCount}
          />
          <SalesChart products={products} />
        </div>
      )}

      {/* Tab 2: Products */}
      {activeTab === 'products' && (
        <ProductTable
          products={products}
          onAddProduct={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          onEditProduct={(p) => {
            setEditingProduct(p);
            setIsModalOpen(true);
          }}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {/* Tab 3: Orders */}
      {activeTab === 'orders' && (
        <OrderTable orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
      )}

      {/* Tab 4: Users */}
      {activeTab === 'users' && (
        <UserTable users={users} />
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleCreateOrUpdateProduct}
        initialData={editingProduct}
      />
    </div>
  );
}
