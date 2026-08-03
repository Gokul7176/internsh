'use client';

import React from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Edit2, Trash2, Plus, AlertTriangle, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SafeImage } from '@/components/ui/SafeImage';
import { validateProduct } from '@/validators/productValidation';

interface ProductTableProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export function ProductTable({ products, onAddProduct, onEditProduct, onDeleteProduct }: ProductTableProps) {
  return (
    <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-[#F5F5F5]">
            Product Inventory Management ({products.length})
          </h3>
          <p className="text-xs text-stone-500 dark:text-[#777777]">Manage pricing, stock levels, and formulation details</p>
        </div>
        <Button onClick={onAddProduct} variant="gold" size="md">
          <Plus className="w-4 h-4" /> Add New Skincare Product
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-[#2A2A2A] text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-[#A0A0A0]">
              <th className="py-3 px-4">Product Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock Level</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-[#2A2A2A] text-xs">
            {products.map((rawProduct) => {
              const p = validateProduct(rawProduct);
              return (
                <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-[#1B1B1B] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                        <SafeImage src={p.images[0]} alt={p.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-900 dark:text-[#F5F5F5]">{p.name}</h4>
                        <p className="text-[10px] text-amber-700 dark:text-[#D4AF37] font-bold uppercase">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="cream" size="sm">
                      {p.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-900 dark:text-[#F5F5F5]">
                    {formatPrice(p.price)}
                  </td>
                  <td className="py-3 px-4">
                    {p.stock < 10 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                        <AlertTriangle className="w-3 h-3" /> Low ({p.stock})
                      </span>
                    ) : (
                      <span className="font-semibold text-stone-700 dark:text-[#A0A0A0]">{p.stock} units</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-900 dark:text-[#F5F5F5]">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      {p.rating}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => onEditProduct(p)}
                      className="p-1.5 rounded-lg border border-stone-300 dark:border-[#2A2A2A] text-stone-600 dark:text-[#A0A0A0] hover:bg-stone-100 dark:hover:bg-[#1B1B1B] dark:hover:text-[#F5F5F5]"
                      aria-label="Edit product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      aria-label="Delete product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
