'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

/**
 * Animated Recura Purple Success Badge with drawing checkmark & blinking light ring
 */
function AnimatedPurpleCheckIcon() {
  return (
    <div className="relative flex items-center justify-center mx-auto mb-2">
      {/* Outer Pulsing/Blinking Light Ring (No Drop Shadow) */}
      <motion.div 
        animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.65, 0.25] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-20 h-20 rounded-full bg-purple-500/20 dark:bg-purple-400/30"
      />

      {/* Recura Purple Circular Badge */}
      <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950/90 text-purple-600 dark:text-purple-400 flex items-center justify-center relative z-10 border-2 border-purple-300 dark:border-purple-700">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          {/* Animated Circle Ring */}
          <motion.circle 
            cx="12" 
            cy="12" 
            r="9" 
            stroke="currentColor" 
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          {/* Animated Checkmark Tick Drawing from Start to Finish */}
          <motion.path 
            d="M8.5 12.5L11 15L15.5 9" 
            stroke="currentColor" 
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
          />
        </svg>
      </div>
    </div>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  // Live password requirements
  const requirements = [
    { id: 'length', label: 'Minimum 8 characters', isMet: formData.password.length >= 8 },
    { id: 'capital', label: 'At least 1 capital letter', isMet: /[A-Z]/.test(formData.password) },
    { id: 'number', label: 'At least 1 number', isMet: /[0-9]/.test(formData.password) },
    { id: 'symbol', label: 'At least 1 special character', isMet: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  const allRequirementsMet = requirements.every(r => r.isMet);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const newErrors: Record<string, string> = {};

    if (!allRequirementsMet) {
      newErrors.password = 'Please meet all password requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const res = await fetch('/api/v1/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailParam,
            password: formData.password,
          }),
        });

        const data = await res.json();
        setIsLoading(false);

        if (!res.ok || !data.success) {
          setApiError(data.error || 'Failed to update password');
          return;
        }

        setIsSuccess(true);
      } catch {
        setIsLoading(false);
        setApiError('An unexpected error occurred.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#150A2E] rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-purple-900/10 border border-purple-100/50 dark:border-white/10 space-y-6 min-h-[380px] flex flex-col justify-center">
      
      {isSuccess ? (
        /* SUCCESS CONFIRMATION STATE */
        <div className="text-center space-y-6 py-4">
          
          <AnimatedPurpleCheckIcon />

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Password changed!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/sign-in"
              className="w-full bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-gray-900/10 dark:shadow-purple-950/50 flex items-center justify-center gap-2 group cursor-pointer text-sm"
            >
              <span>Back to sign in</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      ) : (
        /* FORM STATE */
        <>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Set a new password
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 font-medium leading-relaxed">
              Create a strong password for your Recura account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* New Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-extrabold text-gray-700 dark:text-gray-300 ml-1">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.password}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={handleChange}
                  className={cn(
                    "w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border text-xs sm:text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all",
                    errors.password ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 dark:border-white/10"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Dynamic Live Password Requirements */}
              <AnimatePresence>
                {(isPasswordFocused || formData.password.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2 pb-1 space-y-1.5 overflow-hidden"
                  >
                    {requirements.map((req) => (
                      <div key={req.id} className="flex items-center gap-2 text-[11px] font-semibold">
                        <div
                          className={cn(
                            "w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors",
                            req.isMet
                              ? "bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400"
                              : "bg-gray-100 dark:bg-white/10 text-gray-400"
                          )}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className={req.isMet ? "text-gray-700 dark:text-gray-200 font-bold" : "text-gray-400"}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {errors.password && <p className="text-red-500 text-[11px] font-bold ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-extrabold text-gray-700 dark:text-gray-300 ml-1">
                Confirm new password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={cn(
                    "w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border text-xs sm:text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all",
                    errors.confirmPassword ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 dark:border-white/10"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-[11px] font-bold ml-1">{errors.confirmPassword}</p>}
            </div>

            {apiError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold">
                {apiError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-gray-900/10 dark:shadow-purple-950/50 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 text-sm mt-2"
            >
              <span>{isLoading ? "Updating password..." : "Set new password"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </form>

          {/* Footer Back Link */}
          <div className="text-center pt-2">
            <Link 
              href="/sign-in"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </>
      )}

    </div>
  );
}

export function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="w-full bg-white dark:bg-[#150A2E] rounded-[2.5rem] p-12 text-center text-gray-400">
        <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin mx-auto mb-2"></div>
        <p className="text-xs font-bold">Loading Reset Password...</p>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
