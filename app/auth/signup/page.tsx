'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock, Mail, User } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, googleSignIn } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      error('Please complete all form fields.', 'Validation Error');
      return;
    }
    if (!agreeTerms) {
      error('You must accept the terms of service.', 'Terms Unchecked');
      return;
    }

    setIsLoading(true);
    try {
      await signup(name, email, password);
      success('Account created successfully!', 'Welcome to Lumina');
      router.push('/dashboard');
    } catch (err: any) {
      error(err.message || 'Failed to create account.', 'Signup Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 max-w-md mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-serif font-bold text-xl flex items-center justify-center mx-auto shadow-md">
          L
        </div>
        <h1 className="font-serif text-3xl font-light text-stone-900 dark:text-cream-50">Create Account</h1>
        <p className="text-xs text-stone-500">Join Lumina Skincare for personalized AI skincare routines.</p>
      </div>

      <div className="p-8 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Sophia Laurent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

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
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="accent-amber-600 rounded cursor-pointer"
            />
            <label htmlFor="terms" className="cursor-pointer">
              I agree to the <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
            </label>
          </div>

          <Button type="submit" variant="gold" size="lg" className="w-full" isLoading={isLoading}>
            Create My Lumina Account
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <span className="absolute inset-x-0 h-px bg-stone-200 dark:bg-stone-800" />
          <span className="relative px-3 bg-white dark:bg-stone-900 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Or register with
          </span>
        </div>

        <Button onClick={googleSignIn} variant="outline" size="md" className="w-full">
          Sign Up with Google
        </Button>
      </div>

      <p className="text-center text-xs text-stone-500">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-bold text-amber-700 dark:text-amber-400 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
