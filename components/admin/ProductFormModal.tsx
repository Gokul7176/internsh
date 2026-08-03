'use client';

import React, { useState } from 'react';
import { Product, ProductCategory } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Upload, X } from 'lucide-react';
import { cloudinaryService } from '@/services/cloudinaryService';
import { useToast } from '@/context/ToastContext';
import { SafeImage } from '@/components/ui/SafeImage';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Product | null;
}

export function ProductFormModal({ isOpen, onClose, onSubmit, initialData }: ProductFormModalProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Lumina Lab');
  const [price, setPrice] = useState('48');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('30');
  const [category, setCategory] = useState<ProductCategory>('serum');
  const [volume, setVolume] = useState('30ml / 1.0 fl. oz.');
  const [description, setDescription] = useState('');
  const [ingredientsText, setIngredientsText] = useState('Water/Aqua, Glycerin, Sodium Hyaluronate');
  const [benefitsText, setBenefitsText] = useState('Hydrates moisture barrier, Fades dark spots');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { success, error } = useToast();

  const [prevId, setPrevId] = useState<string | null>(null);

  if (isOpen && initialData && initialData.id !== prevId) {
    setPrevId(initialData.id);
    setName(initialData.name);
    setBrand(initialData.brand);
    setPrice(initialData.price.toString());
    setOriginalPrice(initialData.originalPrice ? initialData.originalPrice.toString() : '');
    setStock(initialData.stock.toString());
    setCategory(initialData.category);
    setVolume(initialData.volume || '30ml / 1.0 fl. oz.');
    setDescription(initialData.description);
    setIngredientsText(initialData.ingredients.join(', '));
    setBenefitsText(initialData.benefits.join(', '));
    setImages(initialData.images);
  } else if (isOpen && !initialData && prevId !== null) {
    setPrevId(null);
    setName('');
    setPrice('48');
    setStock('30');
    setDescription('');
    setImages(['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000']);
  }

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await cloudinaryService.uploadImage(file);
      setImages((prev) => [...prev, url]);
      success('Product image uploaded via Cloudinary!', 'Image Uploaded');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload image.';
      error(message, 'Upload Error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description || images.length === 0) {
      error('Please complete all required fields and provide at least 1 image.', 'Validation Error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        brand,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        stock: Number(stock),
        category,
        skinType: ['all', 'dry', 'oily', 'sensitive'],
        images,
        description,
        ingredients: ingredientsText.split(',').map((s) => s.trim()).filter(Boolean),
        benefits: benefitsText.split(',').map((s) => s.trim()).filter(Boolean),
        usage: 'both',
        volume,
        rating: initialData?.rating || 4.8,
        reviewCount: initialData?.reviewCount || 10,
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save product.';
      error(message, 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Skincare Product' : 'Add New Skincare Product'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Brand Name" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Sale Price (₹)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <Input label="Original Price (₹)" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="Optional" />
          <Input label="Inventory Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
            >
              <option value="serum">Serum</option>
              <option value="cleanser">Cleanser</option>
              <option value="moisturizer">Moisturizer</option>
              <option value="sunscreen">Sunscreen</option>
              <option value="exfoliant">Exfoliant</option>
              <option value="mask">Mask</option>
              <option value="eye-care">Eye Care</option>
            </select>
          </div>

          <Input label="Volume / Size" value={volume} onChange={(e) => setVolume(e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        <Input
          label="Ingredients (comma separated)"
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
        />

        <Input
          label="Key Benefits (comma separated)"
          value={benefitsText}
          onChange={(e) => setBenefitsText(e.target.value)}
        />

        {/* Cloudinary Image Upload */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
            Product Images (Cloudinary Integration)
          </label>
          <div className="flex flex-wrap gap-3 items-center">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200 dark:border-[#2A2A2A] group">
                <SafeImage src={img} alt="Product upload preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 z-10 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 flex flex-col items-center justify-center cursor-pointer transition-colors text-stone-400">
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-bold">Upload</span>
              <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <Button type="submit" variant="gold" size="lg" className="w-full mt-4" isLoading={isSubmitting || isUploading}>
          {initialData ? 'Update Skincare Product' : 'Create & Publish Product'}
        </Button>
      </form>
    </Modal>
  );
}
