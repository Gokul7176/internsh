import React from 'react';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface StatCardsProps {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
}

export function StatCards({
  totalRevenue,
  totalOrders,
  totalCustomers,
  totalProducts,
  lowStockCount,
}: StatCardsProps) {
  const stats = [
    {
      title: 'Total Gross Revenue',
      value: formatPrice(totalRevenue),
      subtitle: '+18.4% from last month',
      icon: DollarSign,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Total Orders Placed',
      value: totalOrders.toString(),
      subtitle: 'Active processing & fulfillment',
      icon: ShoppingBag,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Active Customers',
      value: totalCustomers.toString(),
      subtitle: 'Registered profiles',
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Catalog Inventory',
      value: `${totalProducts} Products`,
      subtitle: lowStockCount > 0 ? `${lowStockCount} items low stock` : 'Optimal stock levels',
      icon: lowStockCount > 0 ? AlertTriangle : Package,
      color: lowStockCount > 0 ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-stone-500/10 text-stone-600 dark:text-stone-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {s.title}
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-stone-900 dark:text-white">{s.value}</div>
          <p className="text-xs text-stone-500 dark:text-stone-400">{s.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
