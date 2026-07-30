'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { CLOUDINARY_AVATARS, TARGET_BUSINESSES } from './sign-up';

interface OnboardingLayoutProps {
  step: number;
  children: React.ReactNode;
}

export function OnboardingLayout({ step, children }: OnboardingLayoutProps) {
  const [activeBusinessId, setActiveBusinessId] = useState('saas');

  // Auto-switch tabs every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBusinessId(currentId => {
        const currentIndex = TARGET_BUSINESSES.findIndex(b => b.id === currentId);
        const nextIndex = (currentIndex + 1) % TARGET_BUSINESSES.length;
        return TARGET_BUSINESSES[nextIndex].id;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeBusiness = TARGET_BUSINESSES.find(b => b.id === activeBusinessId) || TARGET_BUSINESSES[0];

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F1FA] dark:bg-[#0D0518]">
      
      {/* ========================================================== */}
      {/* LEFT SIDE (Desktop Only): Bento Grid Overlay, Logo & Card  */}
      {/* ========================================================== */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F4F1FA] dark:bg-[#130A24] p-8 lg:p-12 flex-col justify-between relative overflow-hidden border-r border-purple-100/60 dark:border-white/5">
        
        {/* Bento Grid Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#a28cff_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Recura Brand Header with Homepage Link */}
        <div className="flex items-center gap-2 mb-6 relative z-10">
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
        </div>

        {/* 1. Floating Mockup Browser Card */}
        <div className="w-full max-w-lg mx-auto bg-white/90 dark:bg-[#1A1033]/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl shadow-purple-900/10 border border-purple-100/50 dark:border-white/10 transition-all duration-300 my-auto relative z-10">
          
          {/* Top Browser Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-white/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-full px-4 py-1 text-[11px] font-medium text-gray-400 dark:text-gray-400 tracking-wide">
              app.recura.io/dashboard
            </div>
            <div className="w-5"></div>
          </div>

          {/* Dynamic Card Content with Smooth Fade Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBusinessId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* Badge & Mockup Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold text-xs px-3 py-1 rounded-full mb-2 border border-purple-100 dark:border-purple-800/50">
                    {activeBusiness.badge}
                  </span>
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-snug">
                    {activeBusiness.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {activeBusiness.sub}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-purple-500 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={CLOUDINARY_AVATARS.profileIcon} 
                    alt="User Profile" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50/80 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    {activeBusiness.metric1Label}
                  </span>
                  <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                    {activeBusiness.metric1Value}
                  </span>
                </div>
                <div className="bg-gray-50/80 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    {activeBusiness.metric2Label}
                  </span>
                  <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                    {activeBusiness.metric2Value}
                  </span>
                </div>
              </div>

              {/* Merchant Activity List (Infinite Vertical Marquee) */}
              <div className="merchant-list-viewport">
                <div className="merchant-list-track">
                  {[...activeBusiness.customers, ...activeBusiness.customers].map((cust, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 overflow-hidden shrink-0 border border-purple-200 dark:border-purple-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={cust.avatar} alt={cust.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">{cust.name}</h4>
                          <span className="text-[11px] text-gray-400 dark:text-gray-400 font-medium">{cust.desc}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40">
                        {cust.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 2. Headline & Copy Section */}
        <div className="max-w-lg mx-auto w-full pt-6 space-y-3 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            One platform. <br />
            <span className="text-purple-600 dark:text-purple-400">Five businesses.</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-md">
            Recura reshapes its workflows, fields and language around the business you run — so setup takes hours, not months.
          </p>

          {/* Business Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {TARGET_BUSINESSES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActiveBusinessId(b.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm",
                  activeBusinessId === b.id
                    ? "bg-gray-900 text-white dark:bg-purple-600 dark:text-white scale-105 shadow-md"
                    : "bg-white dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/20 border border-gray-200/80 dark:border-white/10"
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================== */}
      {/* RIGHT SIDE: Onboarding Form Container                      */}
      {/* ========================================================== */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-[#0D0518] p-6 sm:p-12 lg:p-16 flex flex-col justify-between min-h-screen lg:min-h-0">
        
        {/* Top Header: Logo on Left for Mobile, Step Indicator on Right */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link href="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
            <Image 
              src="https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg" 
              alt="Recura" 
              width={100} 
              height={28} 
              className="w-auto h-6 dark:hidden object-contain" 
              priority 
            />
            <Image 
              src="https://res.cloudinary.com/weburea/image/upload/v1783571835/logo.svg" 
              alt="Recura" 
              width={100} 
              height={28} 
              className="w-auto h-6 hidden dark:block object-contain" 
              priority 
            />
          </Link>
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-400">Step {step} of 5</span>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          {children}
        </div>

        {/* Bottom Empty Spacer for visual balance */}
        <div className="hidden lg:block"></div>

      </div>

    </div>
  );
}
