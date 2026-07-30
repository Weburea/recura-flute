'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PasswordResetShellProps {
  children: React.ReactNode;
}

export function PasswordResetShell({ children }: PasswordResetShellProps) {
  return (
    <div className="min-h-screen w-full bg-[#F4F1FA] dark:bg-[#0D0518] relative overflow-x-hidden flex flex-col justify-between p-4 sm:p-6 selection:bg-purple-500 selection:text-white">
      {/* 1. Full-Viewport Bento Grid Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#a28cff_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* 2. Top Header Navigation (Recura Brand Logo) */}
      <header className="w-full max-w-5xl mx-auto px-4 py-4 flex items-center justify-between relative z-10 shrink-0">
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
      </header>

      {/* 3. Centered Main Viewport */}
      <main className="w-full max-w-md mx-auto relative z-10 flex flex-col justify-center flex-1 my-auto py-6">
        {children}
      </main>

      {/* 4. Footer */}
      <footer className="w-full text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 relative z-10 py-2">
        &copy; {new Date().getFullYear()} Recura Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
}
