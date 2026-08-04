'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface OnboardingShellProps {
  step: number;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  children: React.ReactNode;
}

export function AnimatedStepBadge({ step }: { step: number }) {
  return (
    <div className="relative overflow-hidden bg-white/90 dark:bg-white/10 border border-purple-200/50 dark:border-white/10 px-4 py-1.5 rounded-full shadow-xs backdrop-blur-md flex items-center gap-2">
      <span className="text-xs font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap relative z-10">
        Step {step} of 5
      </span>
      {/* Continuous River Flow / Ambient Wave Animation across the Badge */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/15 dark:via-purple-400/20 to-transparent animate-[shimmer_2.5s_infinite] pointer-events-none" />
    </div>
  );
}

export function OnboardingShell({ step, maxWidth = '3xl', children }: OnboardingShellProps) {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="min-h-screen w-full bg-[#F4F1FA] dark:bg-[#0D0518] relative overflow-x-hidden flex flex-col selection:bg-purple-500 selection:text-white">
      
      {/* 1. Full-Viewport Bento Grid Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#a28cff_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* 2. Top Header Navigation (SINGLE LOGO + ANIMATED STEP BADGE) */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between relative z-10 shrink-0">
        <Link href="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
          <Image 
            src="https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg" 
            alt="Recura" 
            width={110} 
            height={32} 
            className="w-auto h-6 dark:hidden object-contain" 
            priority 
          />
          <Image 
            src="https://res.cloudinary.com/weburea/image/upload/v1783571835/logo.svg" 
            alt="Recura" 
            width={110} 
            height={32} 
            className="w-auto h-6 hidden dark:block object-contain" 
            priority 
          />
        </Link>

        {/* Styled Animated Step Badge Indicator */}
        <AnimatedStepBadge step={step} />
      </header>

      {/* 3. Centered Main Viewport — min-h-0 allows flex children to shrink below content size on lg */}
      <main className={`w-full ${maxWidthClass} mx-auto px-4 py-4 relative z-10 flex flex-col justify-center flex-1 min-h-0`}>
        {children}
      </main>

      {/* 4. Bottom Spacer */}
      <footer className="py-4 shrink-0 relative z-10"></footer>

    </div>
  );
}
