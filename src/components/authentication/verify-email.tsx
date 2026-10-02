'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Mail, ArrowLeft } from 'lucide-react';
import { cn } from "@/lib/utils";
import { OnboardingShell } from './onboarding-shell';
import { AUTH_BYPASS_CONFIG, setupBypassSession } from '@/config/auth-bypass';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || 'amaka@brightline-gym.com';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(47);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);



  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (error) setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ─── AUTH BYPASS: VERIFICATION BYPASS (DESIGN DEMO MODE) ───
    if (AUTH_BYPASS_CONFIG.enabled) {
      setIsLoading(true);
      setupBypassSession({ email: emailParam });
      setTimeout(() => {
        setIsLoading(false);
        router.push('/choose-business');
      }, 300);
      return;
    }

    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailParam,
          code: fullCode,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Verification failed');
        return;
      }

      router.push(data.redirectUrl || '/choose-business');
    } catch {
      setIsLoading(false);
      setError('An unexpected error occurred during verification.');
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailParam }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to resend verification code');
        return;
      }

      setTimer(60);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      setIsLoading(false);
      setError('An error occurred while resending the verification code.');
    }
  };

  return (
    <OnboardingShell step={2} maxWidth="lg">
      <div className="w-full bg-white dark:bg-[#150A2E] rounded-[2.5rem] p-9 sm:p-12 shadow-2xl shadow-purple-900/10 border border-purple-100/50 dark:border-white/10 space-y-7">
        
        {/* Top Purple Mail Icon Badge */}
        <div className="w-13 h-13 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2 border border-purple-100 dark:border-purple-800/40">
          <Mail className="w-5.5 h-5.5" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Verify your email
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 font-medium leading-relaxed">
            Enter the 6-digit code we sent to <br />
            <span className="font-bold text-gray-900 dark:text-white">{emailParam}</span>
          </p>
        </div>

        {/* 6-Digit Code Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex justify-center gap-2 sm:gap-3">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className={cn(
                  "w-11 h-13 sm:w-13 sm:h-15 text-center text-xl font-extrabold rounded-2xl border bg-gray-50/50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-4 transition-all",
                  error
                    ? "border-red-500/60 text-red-500 focus:ring-red-500/10"
                    : digit
                    ? "border-purple-600 dark:border-purple-400 bg-purple-50/20 dark:bg-purple-950/30 focus:ring-purple-600/10"
                    : "border-gray-200 dark:border-white/10 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-purple-600/10"
                )}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold text-center -mt-2">{error}</p>
          )}

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-gray-900/10 dark:shadow-purple-950/50 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 text-sm"
          >
            <span>{isLoading ? "Verifying..." : "Verify email"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Resend Code & Back to Signup Footer */}
        <div className="space-y-3 pt-1 text-center">
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-400">
            Didn&apos;t receive the code?{' '}
            {timer > 0 ? (
              <span className="text-gray-500 font-bold">Resend in 0:{timer.toString().padStart(2, '0')}</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
              >
                Resend code
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link 
              href="/sign-up"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Use a different email</span>
            </Link>

            {AUTH_BYPASS_CONFIG.enabled && (
              <button
                type="button"
                onClick={() => {
                  setupBypassSession({ email: emailParam });
                  router.push('/choose-business');
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                <span>Skip to onboarding (Preview) →</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </OnboardingShell>
  );
}

export function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F1FA] dark:bg-[#0D0518]">
        <div className="text-center text-gray-400">
          <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin mx-auto mb-2"></div>
          <p className="text-xs font-bold">Loading Verification...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
