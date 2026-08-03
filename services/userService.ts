import { db, isFirebaseConfigured } from '@/lib/firebase';
import { UserProfile, UserAddress } from '@/types';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const PROFILE_KEY = 'lumina_user_profile';

export const userService = {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as UserProfile;
        }
      } catch (err) {
        console.warn('Firestore getUserProfile error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PROFILE_KEY + '_' + uid);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    return null;
  },

  async createUserProfile(profile: UserProfile): Promise<UserProfile> {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'users', profile.uid);
        await setDoc(docRef, profile, { merge: true });
      } catch (err) {
        console.warn('Firestore createUserProfile error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_KEY + '_' + profile.uid, JSON.stringify(profile));
    }
    return profile;
  },

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const timestamp = new Date().toISOString();

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, { ...updates, updatedAt: timestamp });
      } catch (err) {
        console.warn('Firestore updateUserProfile error:', err);
      }
    }

    let current = await this.getUserProfile(uid);
    if (current) {
      const updated = { ...current, ...updates, updatedAt: timestamp };
      if (typeof window !== 'undefined') {
        localStorage.setItem(PROFILE_KEY + '_' + uid, JSON.stringify(updated));
      }
      return updated;
    }
    return null;
  },

  async saveAddress(uid: string, address: Omit<UserAddress, 'id'>): Promise<UserAddress[]> {
    const userProfile = await this.getUserProfile(uid);
    const newAddress: UserAddress = {
      ...address,
      id: 'addr-' + Math.random().toString(36).substring(2, 7),
    };

    const currentAddresses = userProfile?.addresses || [];
    let updatedAddresses = [...currentAddresses];

    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }

    updatedAddresses.push(newAddress);
    await this.updateUserProfile(uid, { addresses: updatedAddresses });
    return updatedAddresses;
  }
};
