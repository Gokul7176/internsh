'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Please enter your email address.', 'Required');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
      success('Password reset instructions dispatched!', 'Check Email');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset link.';
      error(message, 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 max-w-md mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-light text-stone-900 dark:text-cream-50">Reset Password</h1>
        <p className="text-xs text-stone-500">Enter your email address to receive password recovery instructions.</p>
      </div>

      <div className="p-8 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-xl space-y-6">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Account Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Button type="submit" variant="gold" size="lg" className="w-full" isLoading={isLoading}>
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-stone-500">
              We have sent a password reset link to <strong className="text-stone-900 dark:text-white">{email}</strong>. Check your inbox and follow the instructions.
            </p>
          </div>
        )}

        <div className="pt-2 text-center">
          <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
