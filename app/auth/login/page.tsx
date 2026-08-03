'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock, Mail, User, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, googleSignIn, setDemoUser } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password.', 'Validation Error');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      success('Logged in successfully!', 'Welcome Back');
      router.push('/dashboard');
    } catch (err: any) {
      error(err.message || 'Failed to sign in.', 'Auth Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      success('Signed in with Google!', 'Welcome');
      router.push('/dashboard');
    } catch (err: any) {
      error('Google sign in failed.', 'Error');
    }
  };

  return (
    <div className="pt-32 pb-20 max-w-md mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-serif font-bold text-xl flex items-center justify-center mx-auto shadow-md">
          L
        </div>
        <h1 className="font-serif text-3xl font-light text-stone-900 dark:text-cream-50">Welcome Back</h1>
        <p className="text-xs text-stone-500">Sign in to manage your Lumina orders and AI skin diagnostics.</p>
      </div>

      <div className="p-8 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="flex justify-end text-xs">
            <Link href="/auth/forgot-password" className="text-amber-700 dark:text-amber-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="gold" size="lg" className="w-full" isLoading={isLoading}>
            Sign In to Account
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <span className="absolute inset-x-0 h-px bg-stone-200 dark:bg-stone-800" />
          <span className="relative px-3 bg-white dark:bg-stone-900 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Or continue with
          </span>
        </div>

        <Button onClick={handleGoogleSignIn} variant="outline" size="md" className="w-full">
          Sign In with Google
        </Button>

        {/* Quick Demo Access Bar */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2 text-center">
          <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Quick Demo Login:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setDemoUser('customer');
                success('Logged in as Demo Customer!', 'Demo Mode');
                router.push('/dashboard');
              }}
              className="flex-1 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold"
            >
              Demo Customer
            </button>

            <button
              onClick={() => {
                setDemoUser('admin');
                success('Logged in as Demo Admin!', 'Admin Demo');
                router.push('/admin');
              }}
              className="flex-1 py-2 text-xs rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center justify-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Demo Admin
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-stone-500">
        Don't have an account yet?{' '}
        <Link href="/auth/signup" className="font-bold text-amber-700 dark:text-amber-400 hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
}
