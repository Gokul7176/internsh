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
    <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md shadow-sm space-y-6">
      <div>
        <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-[#F5F5F5]">
          Customer Order Fulfillment ({orders.length})
        </h3>
        <p className="text-xs text-stone-500 dark:text-[#777777]">Track shipments, manage order timelines, and update dispatch status</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-[#2A2A2A] text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-[#A0A0A0]">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Items Count</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Current Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-[#2A2A2A] text-xs">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-stone-50/50 dark:hover:bg-[#1B1B1B] transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-amber-700 dark:text-[#D4AF37]">
                  {o.id}
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-stone-900 dark:text-[#F5F5F5]">{o.customerName}</div>
                  <div className="text-[10px] text-stone-400 dark:text-[#777777]">{o.customerEmail}</div>
                </td>
                <td className="py-3 px-4 font-medium text-stone-700 dark:text-[#A0A0A0]">
                  {o.items.reduce((acc, i) => acc + i.quantity, 0)} items
                </td>
                <td className="py-3 px-4 font-bold text-stone-900 dark:text-[#F5F5F5]">
                  {formatPrice(o.total)}
                </td>
                <td className="py-3 px-4">{getStatusBadge(o.status)}</td>
                <td className="py-3 px-4 text-stone-500 dark:text-[#777777]">{formatDate(o.createdAt)}</td>
                <td className="py-3 px-4 text-right">
                  <select
                    value={o.status}
                    onChange={(e) => onUpdateStatus(o.id, e.target.value as OrderStatus)}
                    aria-label={`Update status for order ${o.id}`}
                    className="px-2.5 py-1 text-xs rounded-xl border border-stone-300 dark:border-[#2A2A2A] bg-white dark:bg-[#1B1B1B] text-stone-900 dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
