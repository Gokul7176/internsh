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
import { Skeleton } from '@/components/ui/Skeleton';
import { SafeImage } from '@/components/ui/SafeImage';

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
    let isMounted = true;
    async function loadReviews() {
      setLoading(true);
      const data = await reviewService.getProductReviews(productId);
      if (isMounted) {
        setReviews(data);
        setLoading(false);
      }
    }
    loadReviews();
    return () => {
      isMounted = false;
    };
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
    <div className="space-y-8 py-10 border-t border-stone-200 dark:border-[#2A2A2A]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-2xl font-normal text-stone-900 dark:text-[#F5F5F5]">
            Customer Reviews ({reviews.length})
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl font-serif font-bold text-stone-900 dark:text-[#F5F5F5]">{avgRating}</span>
            <StarRating rating={Number(avgRating)} size="md" />
            <span className="text-xs text-stone-500 dark:text-[#777777]">Based on verified customer feedback</span>
          </div>
        </div>

        <Button onClick={() => setIsModalOpen(true)} variant="gold" size="md">
          <MessageSquarePlus className="w-4 h-4" /> Write a Verified Review
        </Button>
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white/70 dark:bg-[#1B1B1B] border border-stone-200/80 dark:border-[#2A2A2A] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {rev.userAvatar ? (
                    <SafeImage src={rev.userAvatar} alt={rev.userName} width={36} height={36} className="w-9 h-9 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-[#151515] text-amber-800 dark:text-[#D4AF37] border dark:border-[#2A2A2A] font-bold flex items-center justify-center text-xs shrink-0">
                      {rev.userName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-[#F5F5F5] flex items-center gap-1.5">
                      {rev.userName}
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified Buyer
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-stone-400 dark:text-[#777777]">{formatDate(rev.createdAt)}</p>
                  </div>
                </div>
                <StarRating rating={rev.rating} size="sm" />
              </div>

              <h4 className="font-semibold text-sm text-stone-900 dark:text-[#F5F5F5]">{rev.title}</h4>
              <p className="text-xs text-stone-600 dark:text-[#A0A0A0] leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Write review modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Write a Customer Review">
        <form onSubmit={handleAddReview} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-[#A0A0A0] block mb-1">Your Rating</label>
            <StarRating rating={rating} interactive onRatingChange={(r) => setRating(r)} size="lg" />
          </div>

          <Input
            label="Review Title"
            placeholder="e.g. Best Vitamin C serum I have tried!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-[#A0A0A0] block">Detailed Feedback</label>
            <textarea
              rows={4}
              placeholder="Describe your experience, texture, results, and how long you have used it..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 dark:border-[#2A2A2A] bg-white dark:bg-[#151515] text-stone-900 dark:text-[#F5F5F5] placeholder-stone-400 dark:placeholder-[#777777] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]"
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
