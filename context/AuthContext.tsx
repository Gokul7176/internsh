'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  signInWithPopup,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { UserProfile, UserRole } from '@/types';
import { userService } from '@/services/userService';
import { safeGetStorage, safeSetStorage } from '@/lib/utils';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const CURRENT_USER_KEY = 'lumina_current_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() =>
    safeGetStorage<UserProfile | null>(CURRENT_USER_KEY, null)
  );
  const [loading, setLoading] = useState<boolean>(() => Boolean(isFirebaseConfigured()));

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        let profile = await userService.getUserProfile(fbUser.uid);
        if (!profile) {
          profile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Customer',
            photoURL: fbUser.photoURL || undefined,
            role: fbUser.email === 'admin@luminaskincare.com' ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await userService.createUserProfile(profile);
        }
        setUser(profile);
        safeSetStorage(CURRENT_USER_KEY, profile);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    if (isFirebaseConfigured()) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      // Local fallback auth
      const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
      const mockProfile: UserProfile = {
        uid: 'user-' + Math.random().toString(36).substring(2, 7),
        email,
        displayName: email.split('@')[0],
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(mockProfile);
      safeSetStorage(CURRENT_USER_KEY, mockProfile);
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    if (isFirebaseConfigured()) {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfile = {
        uid: res.user.uid,
        email,
        displayName: name,
        role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await userService.createUserProfile(newProfile);
      setUser(newProfile);
      safeSetStorage(CURRENT_USER_KEY, newProfile);
    } else {
      const mockProfile: UserProfile = {
        uid: 'user-' + Math.random().toString(36).substring(2, 7),
        email,
        displayName: name,
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(mockProfile);
      safeSetStorage(CURRENT_USER_KEY, mockProfile);
    }
  };

  const googleSignIn = async () => {
    if (isFirebaseConfigured()) {
      await signInWithPopup(auth, googleProvider);
    } else {
      const mockProfile: UserProfile = {
        uid: 'google-user-' + Math.random().toString(36).substring(2, 7),
        email: 'alex.skincare@gmail.com',
        displayName: 'Alex Rivers',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(mockProfile);
      safeSetStorage(CURRENT_USER_KEY, mockProfile);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured()) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setFirebaseUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  };

  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured()) {
      await sendPasswordResetEmail(auth, email);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = await userService.updateUserProfile(user.uid, updates);
    if (updated) {
      setUser(updated);
      safeSetStorage(CURRENT_USER_KEY, updated);
    }
  };

  const setDemoUser = (role: UserRole) => {
    const demoProfile: UserProfile = {
      uid: role === 'admin' ? 'admin-001' : 'customer-001',
      email: role === 'admin' ? 'admin@luminaskincare.com' : 'emma.luxe@gmail.com',
      displayName: role === 'admin' ? 'Lumina Admin' : 'Emma Luxe',
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(demoProfile);
    safeSetStorage(CURRENT_USER_KEY, demoProfile);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAdmin,
        login,
        signup,
        googleSignIn,
        logout,
        resetPassword,
        updateProfile,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
