'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, CreditCard, Wallet, CheckCircle } from 'lucide-react';
import { SocialButton } from './social-button';
import { CLOUDINARY_AVATARS } from './sign-up';
import { cn } from "@/lib/utils";

// 5 Business Category Models with 100% unique avatars & dynamic transaction cards
export const SIGN_IN_BUSINESS_MODELS = [
  {
    id: 'saas',
    label: 'SaaS',
    avatars: [
      CLOUDINARY_AVATARS.saas1,
      CLOUDINARY_AVATARS.saas2,
      CLOUDINARY_AVATARS.saas3,
      CLOUDINARY_AVATARS.profileIcon,
    ],
    cards: [
      { title: '+$89.00 USD', sub: 'AMARA O. — PREMIUM PLAN', status: 'Pending', type: 'amber' },
      { title: '$18,420.00', sub: 'SUB MRR VIA STRIPE', status: 'Active', type: 'emerald' },
      { title: '+$149.00 USD', sub: 'CHIDI E. — VIP PLAN', status: 'Completed', type: 'blue' },
    ]
  },
  {
    id: 'agencies',
    label: 'Agencies',
    avatars: [
      CLOUDINARY_AVATARS.agency1,
      CLOUDINARY_AVATARS.agency2,
      CLOUDINARY_AVATARS.agency3,
      CLOUDINARY_AVATARS.profileIcon,
    ],
    cards: [
      { title: '+$4,500.00', sub: 'APEX STUDIO — DESIGN RETAINER', status: 'Pending', type: 'amber' },
      { title: '$34,500.00', sub: 'MONTHLY RETAINERS VIA PAYSTACK', status: 'Received', type: 'emerald' },
      { title: '+$6,200.00', sub: 'NEXUS MEDIA — MARKETING RETAINER', status: 'Completed', type: 'blue' },
    ]
  },
  {
    id: 'social_media',
    label: 'Social Media',
    avatars: [
      CLOUDINARY_AVATARS.agency1,
      CLOUDINARY_AVATARS.agency2,
      CLOUDINARY_AVATARS.agency3,
      CLOUDINARY_AVATARS.profileIcon,
    ],
    cards: [
      { title: '+$3,500.00', sub: 'GLOW SKINCARE — INSTAGRAM CAMPAIGN', status: 'Pending', type: 'amber' },
      { title: '₦1,250,000.00', sub: 'PAYOUT VIA FLUTTERWAVE', status: 'Successful', type: 'emerald' },
      { title: '+$5,200.00', sub: 'URBAN APPAREL — META AD CAMPAIGN', status: 'Completed', type: 'blue' },
    ]
  },
  {
    id: 'startups',
    label: 'Startups',
    avatars: [
      CLOUDINARY_AVATARS.startup1,
      CLOUDINARY_AVATARS.startup2,
      CLOUDINARY_AVATARS.startup3,
      CLOUDINARY_AVATARS.profileIcon,
    ],
    cards: [
      { title: '+$149.00 USD', sub: 'LAUNCHPAD — GROWTH TIER', status: 'Pending', type: 'amber' },
      { title: '+42.5% MRR', sub: 'SEEDSTAGE CONVERSION RATE', status: 'Active', type: 'emerald' },
      { title: '+$99.00 USD', sub: 'DEVPULSE — PRO TIER', status: 'Completed', type: 'blue' },
    ]
  },
  {
    id: 'marketplaces',
    label: 'Marketplaces',
    avatars: [
      CLOUDINARY_AVATARS.marketplace1,
      CLOUDINARY_AVATARS.marketplace2,
      CLOUDINARY_AVATARS.marketplace3,
      CLOUDINARY_AVATARS.profileIcon,
    ],
    cards: [
      { title: '+$640.00 USD', sub: 'URBAN STORE — MERCHANT PAYOUT', status: 'Pending', type: 'amber' },
      { title: '₦15,000,000.00', sub: 'MONTHLY GMV VIA MONNIFY', status: 'Settled', type: 'emerald' },
      { title: '+$890.00 USD', sub: 'PIXEL CRAFT — MERCHANT PAYOUT', status: 'Completed', type: 'blue' },
    ]
  },
];

/**
 * Top Animation Illustration: Orbiting Avatars around Central Recura Node
 */
function OrbitingAvatarsIllustration({ avatars }: { avatars: string[] }) {
  return (
    <div className="w-full h-56 relative flex items-center justify-center overflow-visible p-2 select-none">
      {/* Ambient Glow Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-purple-500/15 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Concentric Dashed Orbit Rings (High-visibility stroke) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 220">
        <circle cx="170" cy="110" r="48" stroke="rgba(168,85,247,0.35)" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
        <circle cx="170" cy="110" r="92" stroke="rgba(168,85,247,0.25)" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
      </svg>

      {/* Central Recura Icon Mark Node */}
      <div className="w-13 h-13 rounded-full bg-[#150B2D] border-2 border-purple-500/60 shadow-[0_0_24px_rgba(168,85,247,0.4)] flex items-center justify-center relative z-20">
        <Image 
          src="https://res.cloudinary.com/weburea/image/upload/v1783571840/logo_plan.svg" 
          alt="Recura" 
          width={28} 
          height={28} 
          className="w-7 h-7 object-contain" 
          priority 
        />
      </div>

      {/* Orbiting Avatar Nodes */}
      <div className="absolute inset-0 flex items-center justify-center animate-[spin_28s_linear_infinite] pointer-events-none">
        {/* Avatar 1 */}
        <div className="absolute -translate-x-20 -translate-y-14 w-10 h-10 rounded-full border-2 border-purple-400/90 overflow-hidden shadow-lg bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatars[0]} alt="User Avatar" className="w-full h-full object-cover" />
        </div>
        {/* Avatar 2 */}
        <div className="absolute translate-x-20 -translate-y-14 w-10 h-10 rounded-full border-2 border-purple-400/90 overflow-hidden shadow-lg bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatars[1]} alt="User Avatar" className="w-full h-full object-cover" />
        </div>
        {/* Avatar 3 */}
        <div className="absolute -translate-x-20 translate-y-14 w-10 h-10 rounded-full border-2 border-purple-400/90 overflow-hidden shadow-lg bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatars[2]} alt="User Avatar" className="w-full h-full object-cover" />
        </div>
        {/* Avatar 4 */}
        <div className="absolute translate-x-20 translate-y-14 w-10 h-10 rounded-full border-2 border-purple-400/90 overflow-hidden shadow-lg bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatars[3]} alt="User Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}

/**
 * Bottom Animation Illustration: Smooth Professional Roll-Over Spotlight Cards
 */
function StackedTransactionCardsIllustration({ 
  cards,
  activeSpotlightIndex
}: { 
  cards: Array<{ title: string; sub: string; status: string; type: string }>;
  activeSpotlightIndex: number;
}) {
  return (
    <div className="w-full relative h-48 flex flex-col justify-center items-center select-none overflow-hidden py-1">
      <div className="w-full max-w-sm relative flex flex-col items-center justify-center space-y-2.5">
        {cards.map((card, idx) => {
          const isHighlighted = idx === activeSpotlightIndex;

          return (
            <motion.div
              key={`${card.title}-${idx}`}
              layout
              initial={false}
              animate={{
                scale: isHighlighted ? 1.04 : 0.94,
                opacity: isHighlighted ? 1 : 0.75,
                y: isHighlighted ? 0 : 0,
              }}
              transition={{
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1], // Professional smooth cubic bezier
              }}
              className={cn(
                "w-full transition-all duration-500",
                isHighlighted 
                  ? "p-3.5 rounded-2xl bg-white/95 dark:bg-[#1A1033]/90 backdrop-blur-xl border-2 border-purple-500 shadow-xl shadow-purple-900/20 flex items-center justify-between relative z-20"
                  : "w-11/12 p-2.5 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-md border border-gray-200/60 dark:border-white/10 shadow-xs flex items-center justify-between z-10"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                  isHighlighted 
                    ? "w-8 h-8 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 shadow-xs"
                    : "w-6 h-6 bg-gray-100 dark:bg-white/10 text-gray-400"
                )}>
                  {card.type === 'amber' ? <CreditCard className={isHighlighted ? "w-4 h-4" : "w-3.5 h-3.5"} />
                   : card.type === 'emerald' ? <Wallet className={isHighlighted ? "w-4 h-4" : "w-3.5 h-3.5"} />
                   : <CheckCircle2 className={isHighlighted ? "w-4 h-4" : "w-3.5 h-3.5"} />}
                </div>
                <div>
                  <p className={cn(
                    "font-extrabold text-gray-900 dark:text-white tracking-tight transition-all duration-300",
                    isHighlighted ? "text-xs" : "text-[11px]"
                  )}>
                    {card.title}
                  </p>
                  <p className={cn(
                    "font-bold text-gray-400 uppercase tracking-wider transition-all duration-300",
                    isHighlighted ? "text-[10px]" : "text-[9px]"
                  )}>
                    {card.sub}
                  </p>
                </div>
              </div>
              <span className={cn(
                "font-bold rounded-full border shrink-0 transition-all duration-300",
                isHighlighted ? "text-[10px] px-2.5 py-1 shadow-xs" : "text-[9px] px-2 py-0.5 opacity-80",
                card.type === 'amber' ? "bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                : card.type === 'emerald' ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                : "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              )}>
                {card.status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboardingComplete = searchParams.get('onboarding') === 'complete';

  // Read industry passed from onboarding URL parameters if present
  const industryParam = searchParams.get('industry') || searchParams.get('niche') || searchParams.get('businessType');
  const initialCategory = SIGN_IN_BUSINESS_MODELS.find(
    b => b.id === industryParam?.toLowerCase() || b.label.toLowerCase() === industryParam?.toLowerCase()
  )?.id || 'saas';

  const [activeCategoryId, setActiveCategoryId] = useState(initialCategory);
  const [activeSpotlightIndex, setActiveSpotlightIndex] = useState(0);

  // Synchronized Loop: Roll spotlight through Card 0 -> Card 1 -> Card 2, THEN switch category model!
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSpotlightIndex((currentCardIndex) => {
        // If current card index is 0 or 1, advance to next card (0 -> 1 -> 2)
        if (currentCardIndex < 2) {
          return currentCardIndex + 1;
        }

        // If card index reached 2, reset card index to 0 AND advance category tab!
        setActiveCategoryId((currentCatId) => {
          const catIndex = SIGN_IN_BUSINESS_MODELS.findIndex(b => b.id === currentCatId);
          const nextCatIndex = (catIndex + 1) % SIGN_IN_BUSINESS_MODELS.length;
          return SIGN_IN_BUSINESS_MODELS[nextCatIndex].id;
        });

        return 0;
      });
    }, 2000); // 2.0s per card spotlight (6.0s total per category)

    return () => clearInterval(interval);
  }, []);

  const activeCategory = SIGN_IN_BUSINESS_MODELS.find(b => b.id === activeCategoryId) || SIGN_IN_BUSINESS_MODELS[0];

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = 'Work email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        setIsLoading(false);

        if (!res.ok || !data.success) {
          setApiError(data.error || 'Invalid credentials');
          return;
        }

        router.push(data.redirectUrl || '/dashboard');
      } catch {
        setIsLoading(false);
        setApiError('An unexpected error occurred during sign in.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F1FA] dark:bg-[#0D0518]">
      
      {/* ========================================================== */}
      {/* LEFT SIDE (Desktop Only): Branding, 2 Animations & Tagline */}
      {/* ========================================================== */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F4F1FA] dark:bg-[#130A24] p-8 lg:p-12 flex-col justify-between relative overflow-hidden border-r border-purple-100/60 dark:border-white/5">
        
        {/* Bento Grid Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#a28cff_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Recura Brand Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
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

        {/* Unified Left Content Container */}
        <div className="w-full max-w-lg mx-auto space-y-6 my-auto relative z-10">
          
          {/* Dynamic Glassmorphic Left Illustration Showcase Card (Matching Sign-Up Transparency) */}
          <div className="w-full bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-purple-900/10 border border-purple-100/60 dark:border-white/10 space-y-4">
            
            {/* Top Browser Header Pill Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="bg-white/80 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-full px-4 py-1 text-[11px] font-medium text-gray-400 dark:text-gray-400 tracking-wide backdrop-blur-xs">
                app.recura.io/dashboard
              </div>
              <div className="w-5"></div>
            </div>

            {/* Dynamic Content Swap with Framer Motion AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategoryId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-4"
              >
                {/* Animation 1: Orbiting Avatars around Central Recura Node */}
                <OrbitingAvatarsIllustration avatars={activeCategory.avatars} />

                {/* Animation 2: Roll-Over Spotlight Transaction Cards */}
                <StackedTransactionCardsIllustration 
                  cards={activeCategory.cards} 
                  activeSpotlightIndex={activeSpotlightIndex}
                />
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Tagline & Business Category Filter Pills (Aligned with Card) */}
          <div className="space-y-4 pt-1">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                One platform. <br />
                <span className="text-purple-600 dark:text-purple-400">Five businesses.</span>
              </h2>
              <p className="mt-2 text-xs lg:text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed font-medium">
                Recura reshapes its workflows, fields and language around the business you run — so setup takes hours, not months.
              </p>
            </div>

            {/* Business Category Pills */}
            <div className="flex flex-wrap gap-2">
              {SIGN_IN_BUSINESS_MODELS.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setActiveSpotlightIndex(0);
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                    activeCategoryId === cat.id
                      ? "bg-[#1A1829] text-white dark:bg-purple-600 dark:text-white shadow-md"
                      : "bg-white/80 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 border border-gray-200/80 dark:border-white/10"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================== */}
      {/* RIGHT SIDE: Sign-In Form                                  */}
      {/* ========================================================== */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-[#0D0518] p-6 sm:p-12 lg:p-16 flex flex-col justify-between min-h-screen lg:min-h-0 relative">
        
        {/* Mobile Header with Recura Logo */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <Link href="/">
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
          <a href="mailto:support@recura.io" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
            Need help?
          </a>
        </div>

        {/* Desktop Top Right Navigation Header */}
        <div className="hidden lg:flex items-center justify-end mb-8">
          <a href="mailto:support@recura.io" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
            Need help?
          </a>
        </div>

        {/* Main Form Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          
          {/* Onboarding Complete Success Notification Banner */}
          {isOnboardingComplete && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-start gap-3 shadow-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-950 dark:text-emerald-100">Account setup complete!</p>
                <p className="mt-0.5 text-emerald-800 dark:text-emerald-300 font-medium">
                  Please sign in with the credentials you just created to access your business dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Form Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Hi, welcome back!
            </h1>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              Sign in to your Recura workspace to continue.
            </p>
          </div>

          {/* Social Buttons: Google and GitHub */}
          <div className="grid grid-cols-2 gap-3">
            <SocialButton label="Google" onClick={() => window.location.href = '/api/auth/oauth/google'} />
            <SocialButton label="GitHub" onClick={() => window.location.href = '/api/auth/oauth/github'} />
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t border-gray-200 dark:border-white/10" />
            <span className="absolute bg-white dark:bg-[#0D0518] px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              or sign in with email
            </span>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Work Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-extrabold text-gray-700 dark:text-gray-300 ml-1">
                Work email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@business.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border text-xs sm:text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all",
                    errors.email ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 dark:border-white/10"
                  )}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[11px] font-bold ml-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-extrabold text-gray-700 dark:text-gray-300 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={formData.password}
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
              {errors.password && <p className="text-red-500 text-[11px] font-bold ml-1">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-white/20 dark:bg-white/5 cursor-pointer" 
                />
                <span className="font-semibold text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-purple-600 dark:text-purple-400 hover:underline font-bold">
                Forgot password?
              </Link>
            </div>

            {/* API Error Notification */}
            {apiError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold">
                {apiError}
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-gray-900/10 dark:shadow-purple-950/50 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 text-sm"
            >
              <span>{isLoading ? "Signing in..." : "Sign in"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Bottom Prompt: Don't have an account? Sign up */}
          <p className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 pt-2">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
              Sign up
            </Link>
          </p>

        </div>

        {/* Footer info */}
        <div className="mt-8 text-center lg:text-left text-[11px] font-medium text-gray-400 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Recura Technologies Inc. All rights reserved.
        </div>
      </div>

    </div>
  );
}

export function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F1FA] dark:bg-[#0D0518]">
        <div className="text-center text-gray-400">
          <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin mx-auto mb-2"></div>
          <p className="text-xs font-bold">Loading Sign In...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
