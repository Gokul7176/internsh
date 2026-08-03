import { db, isFirebaseConfigured } from '@/lib/firebase';
import { Review } from '@/types';
import { INITIAL_REVIEWS } from '@/lib/mockData';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { safeGetStorage, safeSetStorage } from '@/lib/utils';

const STORAGE_KEY = 'lumina_reviews';

function getLocalReviews(): Review[] {
  return safeGetStorage<Review[]>(STORAGE_KEY, INITIAL_REVIEWS);
}

function saveLocalReviews(reviews: Review[]): void {
  safeSetStorage(STORAGE_KEY, reviews);
}

export const reviewService = {
  async getProductReviews(productId: string): Promise<Review[]> {
    if (isFirebaseConfigured()) {
      try {
        const colRef = collection(db, 'reviews');
        const q = query(colRef, where('productId', '==', productId));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Review[];
        }
      } catch (err) {
        console.warn('Firestore getProductReviews error:', err);
      }
    }
    const all = getLocalReviews();
    return all.filter((r) => r.productId === productId);
  },

  async addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const timestamp = new Date().toISOString();
    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Math.random().toString(36).substring(2, 7),
      createdAt: timestamp,
    };

    if (isFirebaseConfigured()) {
      try {
        const colRef = collection(db, 'reviews');
        const docRef = await addDoc(colRef, newReview);
        newReview.id = docRef.id;
      } catch (err) {
        console.warn('Firestore addReview error:', err);
      }
    }

    const current = getLocalReviews();
    saveLocalReviews([newReview, ...current]);
    return newReview;
  }
};
