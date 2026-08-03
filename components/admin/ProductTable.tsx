'use client';

import React from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Edit2, Trash2, Plus, AlertTriangle, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ProductTableProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export function ProductTable({ products, onAddProduct, onEditProduct, onDeleteProduct }: ProductTableProps) {
  return (
    <div className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-cream-50">
            Product Inventory Management ({products.length})
          </h3>
          <p className="text-xs text-stone-500">Manage pricing, stock levels, and formulation details</p>
        </div>
        <Button onClick={onAddProduct} variant="gold" size="md">
          <Plus className="w-4 h-4" /> Add New Skincare Product
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <th className="py-3 px-4">Product Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock Level</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 text-xs">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-xl shrink-0" />
                    <div>
                      <h4 className="font-semibold text-stone-900 dark:text-stone-100">{p.name}</h4>
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="cream" size="sm">
                    {p.category}
                  </Badge>
                </td>
                <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                  {formatPrice(p.price)}
                </td>
                <td className="py-3 px-4">
                  {p.stock < 10 ? (
                    <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                      <AlertTriangle className="w-3 h-3" /> Low ({p.stock})
                    </span>
                  ) : (
                    <span className="font-semibold text-stone-700 dark:text-stone-300">{p.stock} units</span>
                  )}
                </td>
                <td className="py-3 px-4 font-semibold text-stone-900 dark:text-stone-100">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {p.rating}
                  </div>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => onEditProduct(p)}
                    className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                    aria-label="Edit product"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteProduct(p.id)}
                    className="p-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                    aria-label="Delete product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
