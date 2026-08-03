'use client';

import React from 'react';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface OrderTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export function OrderTable({ orders, onUpdateStatus }: OrderTableProps) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return <Badge variant="warning">Order Placed</Badge>;
      case 'packed':
        return <Badge variant="cream">Packed</Badge>;
      case 'shipped':
        return <Badge variant="gold">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-6">
      <div>
        <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-cream-50">
          Customer Order Fulfillment ({orders.length})
        </h3>
        <p className="text-xs text-stone-500">Track shipments, manage order timelines, and update dispatch status</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Items Count</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Current Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 text-xs">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                  {o.id}
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-stone-900 dark:text-stone-100">{o.customerName}</div>
                  <div className="text-[10px] text-stone-400">{o.customerEmail}</div>
                </td>
                <td className="py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  {o.items.reduce((acc, i) => acc + i.quantity, 0)} items
                </td>
                <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                  {formatPrice(o.total)}
                </td>
                <td className="py-3 px-4">{getStatusBadge(o.status)}</td>
                <td className="py-3 px-4 text-stone-500">{formatDate(o.createdAt)}</td>
                <td className="py-3 px-4 text-right">
                  <select
                    value={o.status}
                    onChange={(e) => onUpdateStatus(o.id, e.target.value as OrderStatus)}
                    className="px-2.5 py-1 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="placed">Placed</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
