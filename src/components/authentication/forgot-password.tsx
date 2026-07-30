'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import { cn } from "@/lib/utils";

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Work email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to send reset code');
        return;
      }

      router.push(`/verify-code?email=${encodeURIComponent(data.email)}`);
    } catch {
      setIsLoading(false);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#150A2E] rounded-[2.5rem] p-8 sm:p-11 shadow-2xl shadow-purple-900/10 border border-purple-100/50 dark:border-white/10 space-y-6">
      
      {/* Top Icon Badge */}
      <div className="w-13 h-13 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2 border border-purple-100 dark:border-purple-800/40">
        <KeyRound className="w-6 h-6" />
      </div>

      {/* Header */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Reset your password
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
          Enter the email linked to your account and we&apos;ll send you a 6-digit code to reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-extrabold text-gray-700 dark:text-gray-300 ml-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              id="email"
              type="email"
              placeholder="amaka@brightline-gym.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className={cn(
                "w-full pl-10 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border text-xs sm:text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all",
                error ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 dark:border-white/10"
              )}
            />
          </div>
          {error && <p className="text-red-500 text-[11px] font-bold ml-1">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-gray-900/10 dark:shadow-purple-950/50 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 text-sm"
        >
          <span>{isLoading ? 'Sending reset code...' : 'Send reset code'}</span>
          {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      {/* Bottom Link */}
      <div className="text-center pt-1">
        <Link 
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to login</span>
        </Link>
      </div>

    </div>
  );
}
