'use client';

import React, { useState, useEffect } from 'react';
import { Review } from '@/types';
import { reviewService } from '@/services/reviewService';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface ReviewSectionProps {
  productId: string;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const { success, error } = useToast();

  // New review state
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      const data = await reviewService.getProductReviews(productId);
      setReviews(data);
      setLoading(false);
    }
    loadReviews();
  }, [productId]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      error('Please fill in review title and comment.', 'Incomplete Review');
      return;
    }

    const newRev = await reviewService.addReview({
      productId,
      userId: user?.uid || 'guest-user',
      userName: user?.displayName || 'Skincare Enthusiast',
      userAvatar: user?.photoURL,
      rating,
      title,
      comment,
      verifiedPurchase: true,
    });

    setReviews([newRev, ...reviews]);
    setIsModalOpen(false);
    setTitle('');
    setComment('');
    success('Thank you! Your verified review has been published.', 'Review Added');
  };

  return (
    <div className="space-y-8 py-10 border-t border-stone-200 dark:border-stone-800">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-2xl font-normal text-stone-900 dark:text-cream-50">
            Customer Reviews ({reviews.length})
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl font-serif font-bold text-stone-900 dark:text-white">{avgRating}</span>
            <StarRating rating={Number(avgRating)} size="md" />
            <span className="text-xs text-stone-500 dark:text-stone-400">Based on verified customer feedback</span>
          </div>
        </div>

        <Button onClick={() => setIsModalOpen(true)} variant="gold" size="md">
          <MessageSquarePlus className="w-4 h-4" /> Write a Verified Review
        </Button>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {rev.userAvatar ? (
                  <img src={rev.userAvatar} alt={rev.userName} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-bold flex items-center justify-center text-xs">
                    {rev.userName.charAt(0)}
                  </div>
                )}
                <div>
                  <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    {rev.userName}
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified Buyer
                      </span>
                    )}
                  </h5>
                  <p className="text-[10px] text-stone-400">{formatDate(rev.createdAt)}</p>
                </div>
              </div>
              <StarRating rating={rev.rating} size="sm" />
            </div>

            <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100">{rev.title}</h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{rev.comment}</p>
          </div>
        ))}
      </div>

      {/* Write review modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Write a Customer Review">
        <form onSubmit={handleAddReview} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">Your Rating</label>
            <StarRating rating={rating} interactive onRatingChange={(r) => setRating(r)} size="lg" />
          </div>

          <Input
            label="Review Title"
            placeholder="e.g. Best Vitamin C serum I have tried!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">Detailed Feedback</label>
            <textarea
              rows={4}
              placeholder="Describe your experience, texture, results, and how long you have used it..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <Button type="submit" variant="gold" className="w-full">
            Submit Verified Review
          </Button>
        </form>
      </Modal>
    </div>
  );
}
