'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { SocialButton } from './social-button';
import { AnimatedStepBadge } from './onboarding-shell';
import { cn } from "@/lib/utils";
import { AUTH_BYPASS_CONFIG, setupBypassSession } from '@/config/auth-bypass';

// All 16 Cloudinary CDN Avatar Assets
export const CLOUDINARY_AVATARS = {
  // Static Top-Right User Profile Badge
  profileIcon: 'https://res.cloudinary.com/weburea/image/upload/v1785018485/images/avatar/ellipse_1095.png',
  
  // SaaS Unique Avatars
  saas1: 'https://res.cloudinary.com/weburea/image/upload/v1785024437/images/avatar/ellipse_1093.png',
  saas2: 'https://res.cloudinary.com/weburea/image/upload/v1785018148/images/avatar/ellipse_1093_1.png',
  saas3: 'https://res.cloudinary.com/weburea/image/upload/v1785018219/images/avatar/ellipse_1093_2.png',
  
  // Agency Unique Avatars
  agency1: 'https://res.cloudinary.com/weburea/image/upload/v1785018312/images/avatar/ellipse_1093_3.png',
  agency2: 'https://res.cloudinary.com/weburea/image/upload/v1785018393/images/avatar/ellipse_1093_4.png',
  agency3: 'https://res.cloudinary.com/weburea/image/upload/v1785024789/images/avatar/ellipse_1093_5.png',
  
  // Enterprise Unique Avatars
  enterprise1: 'https://res.cloudinary.com/weburea/image/upload/v1785025049/images/avatar/ellipse_1093_6.png',
  enterprise2: 'https://res.cloudinary.com/weburea/image/upload/v1785025134/images/avatar/ellipse_1093_7.png',
  enterprise3: 'https://res.cloudinary.com/weburea/image/upload/v1785025293/images/avatar/ellipse_1093_8.png',
  
  // Startup Unique Avatars
  startup1: 'https://res.cloudinary.com/weburea/image/upload/v1785018573/images/avatar/ellipse_1095_1.png',
  startup2: 'https://res.cloudinary.com/weburea/image/upload/v1785019027/images/avatar/ellipse_1095_2.png',
  startup3: 'https://res.cloudinary.com/weburea/image/upload/v1785019111/images/avatar/ellipse_1095_3.png',
  
  // Marketplace Unique Avatars
  marketplace1: 'https://res.cloudinary.com/weburea/image/upload/v1785025432/images/avatar/ellipse_1095_4.png',
  marketplace2: 'https://res.cloudinary.com/weburea/image/upload/v1785025550/images/avatar/ellipse_1095_5.png',
  marketplace3: 'https://res.cloudinary.com/weburea/image/upload/v1785025654/images/avatar/ellipse_1095_6.png',
};

// 5 Target Business Types with 100% unique Cloudinary avatars for each business model
export const TARGET_BUSINESSES = [
  {
    id: 'saas',
    label: 'SaaS',
    badge: 'SaaS Business',
    title: 'Subscription MRR, automated',
    sub: '312 active subscriptions',
    metric1Label: 'MRR',
    metric1Value: '$18,420',
    metric2Label: 'CHURN RATE',
    metric2Value: '3.1%',
    customers: [
      { name: 'Amara O.', desc: 'Premium plan', amount: '+$89', avatar: CLOUDINARY_AVATARS.saas1 },
      { name: 'Chidi E.', desc: 'VIP plan', amount: '+$149', avatar: CLOUDINARY_AVATARS.saas2 },
      { name: 'Femi A.', desc: 'Basic plan', amount: '+$39', avatar: CLOUDINARY_AVATARS.saas3 },
    ]
  },
  {
    id: 'agencies',
    label: 'Agencies',
    badge: 'Digital Agency',
    title: 'Client retainers & invoicing',
    sub: '18 active retainers',
    metric1Label: 'Monthly Retainers',
    metric1Value: '$34,500',
    metric2Label: 'ON-TIME PAYMENTS',
    metric2Value: '98.4%',
    customers: [
      { name: 'Apex Studio', desc: 'Design Retainer', amount: '+$4,500', avatar: CLOUDINARY_AVATARS.agency1 },
      { name: 'Nexus Media', desc: 'Marketing Retainer', amount: '+$6,200', avatar: CLOUDINARY_AVATARS.agency2 },
      { name: 'Vanguard Tech', desc: 'Dev Support', amount: '+$3,800', avatar: CLOUDINARY_AVATARS.agency3 },
    ]
  },
  {
    id: 'social_media',
    label: 'Social Media',
    badge: 'Social Media Co.',
    title: 'Campaign & retainer billing',
    sub: '38 active campaigns',
    metric1Label: 'MONTHLY REVENUE',
    metric1Value: '$42,500',
    metric2Label: 'CLIENT RETENTION',
    metric2Value: '96.2%',
    customers: [
      { name: 'Glow Skincare', desc: 'Instagram & TikTok', amount: '+$3,500', avatar: CLOUDINARY_AVATARS.agency1 },
      { name: 'Urban Apparel', desc: 'Meta Ad Campaign', amount: '+$5,200', avatar: CLOUDINARY_AVATARS.agency2 },
      { name: 'Pulse Fitness', desc: 'Content Creation', amount: '+$2,800', avatar: CLOUDINARY_AVATARS.agency3 },
    ]
  },
  {
    id: 'startups',
    label: 'Startups',
    badge: 'Early Startup',
    title: 'Rapid growth billing',
    sub: '142 trial conversions',
    metric1Label: 'MRR Growth',
    metric1Value: '+42.5%',
    metric2Label: 'TRIAL CONV.',
    metric2Value: '14.2%',
    customers: [
      { name: 'LaunchPad', desc: 'Growth Tier', amount: '+$149', avatar: CLOUDINARY_AVATARS.startup1 },
      { name: 'Seedling App', desc: 'Starter Tier', amount: '+$49', avatar: CLOUDINARY_AVATARS.startup2 },
      { name: 'DevPulse', desc: 'Pro Tier', amount: '+$99', avatar: CLOUDINARY_AVATARS.startup3 },
    ]
  },
  {
    id: 'marketplaces',
    label: 'Marketplaces',
    badge: 'E-Commerce Marketplace',
    title: 'Merchant payouts & GMV',
    sub: '850 active merchants',
    metric1Label: 'Monthly GMV',
    metric1Value: '$98,400',
    metric2Label: 'TAKE RATE',
    metric2Value: '8.5%',
    customers: [
      { name: 'Urban Store', desc: 'Merchant Payout', amount: '+$640', avatar: CLOUDINARY_AVATARS.marketplace1 },
      { name: 'Pixel Craft', desc: 'Merchant Payout', amount: '+$890', avatar: CLOUDINARY_AVATARS.marketplace2 },
      { name: 'Moda Goods', desc: 'Merchant Payout', amount: '+$420', avatar: CLOUDINARY_AVATARS.marketplace3 },
    ]
  }
];

export function SignUp() {
  const [activeBusinessId, setActiveBusinessId] = useState('saas');
  const router = useRouter();
  
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

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ─── AUTH BYPASS: DIRECT ONBOARDING TRANSITION (DESIGN DEMO MODE) ───
    if (AUTH_BYPASS_CONFIG.enabled) {
      setIsLoading(true);
      setupBypassSession({
        fullName: formData.fullName.trim() || undefined,
        email: formData.email.trim() || undefined,
      });

      setTimeout(() => {
        setIsLoading(false);
        router.push(AUTH_BYPASS_CONFIG.onboardingEntryRoute);
      }, 300);
      return;
    }

    setApiError('');
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Work email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the Terms and Privacy Policy';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const res = await fetch('/api/v1/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        setIsLoading(false);

        if (!res.ok || !data.success) {
          setApiError(data.error || 'Failed to create account');
          return;
        }

        // On success, redirect to verify-email
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } catch {
        setIsLoading(false);
        setApiError('An unexpected error occurred. Please try again.');
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
      {/* LEFT SIDE (Desktop Only): Logo, Mockup Card & Copy Below   */}
      {/* ========================================================== */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F4F1FA] dark:bg-[#130A24] p-8 lg:p-12 flex-col justify-between relative overflow-hidden border-r border-purple-100/60 dark:border-white/5">
        
        {/* Bento Grid Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#a28cff_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
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

        {/* 1. Floating Mockup Browser Card (Positioned TOP on Desktop with Glassmorphism Transparency) */}
        <div className="w-full max-w-lg mx-auto bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-purple-900/10 border border-purple-100/60 dark:border-white/10 transition-all duration-300 my-auto">
          
          {/* Top Browser Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200/50 dark:border-white/10">
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
                  <span className="inline-block bg-purple-50/80 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold text-xs px-3 py-1 rounded-full mb-2 border border-purple-100/80 dark:border-purple-800/50 backdrop-blur-xs">
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
                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-gray-100 dark:border-white/10">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    {activeBusiness.metric1Label}
                  </span>
                  <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                    {activeBusiness.metric1Value}
                  </span>
                </div>
                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-gray-100 dark:border-white/10">
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

        {/* 2. Headline & Copy Section (Positioned BELOW Mockup Card) */}
        <div className="max-w-lg mx-auto w-full pt-6 space-y-3">
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
      {/* RIGHT SIDE: Clean Sign-Up Form (Full Width on Mobile)      */}
      {/* ========================================================== */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-[#0D0518] p-6 sm:p-12 lg:p-16 flex flex-col justify-between min-h-screen lg:min-h-0">
        
        {/* Top Header: Logo on Left for Mobile ONLY (Hidden on Desktop), Step 1 of 5 on Right */}
        <div className="flex items-center justify-between lg:justify-end mb-6 sm:mb-8">
          <Link href="/" className="lg:hidden flex items-center gap-2 group hover:opacity-90 transition-opacity">
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
          <AnimatedStepBadge step={1} />
        </div>

        {/* Main Form Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Start billing the way your business actually works. No card required.
            </p>
          </div>

          {/* Designer Team Preview Mode Badge */}
          {AUTH_BYPASS_CONFIG.enabled && (
            <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-semibold text-purple-900 dark:text-purple-200 text-[11px] sm:text-xs">
                  Designer Preview: Auth bypassed. Click below to demo onboarding steps.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setupBypassSession({
                    fullName: formData.fullName.trim() || undefined,
                    email: formData.email.trim() || undefined,
                  });
                  router.push(AUTH_BYPASS_CONFIG.onboardingEntryRoute);
                }}
                className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shrink-0 transition-colors cursor-pointer"
              >
                Fast Track →
              </button>
            </div>
          )}

          {/* Social Auth Buttons (Google & GitHub) */}
          <div className="grid grid-cols-2 gap-3.5 pt-2">
            <SocialButton label="Google" onClick={() => window.location.href = '/api/v1/auth/oauth/google'} />
            <SocialButton label="GitHub" onClick={() => window.location.href = '/api/v1/auth/oauth/github'} />
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/80 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-[#0D0518] px-4 text-gray-400 dark:text-gray-400 font-medium">
                or continue with email
              </span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                Full name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors w-4 h-4" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Amaka Uche"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={cn(
                    "w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-600/10 transition-all",
                    errors.fullName && "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  )}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs font-bold mt-1">{errors.fullName}</p>}
            </div>

            {/* Work Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                Work email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors w-4 h-4" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@business.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-600/10 transition-all",
                    errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  )}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    "w-full pl-11 pr-11 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-600/10 transition-all",
                    errors.password && "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-400 font-medium mt-1">
                Use 8+ characters with a number and a symbol.
              </p>
              {errors.password && <p className="text-red-500 text-xs font-bold mt-1">{errors.password}</p>}
            </div>

            {/* Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-purple-600 border-gray-300 dark:border-white/20 focus:ring-purple-500"
                />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-600 dark:text-purple-400 hover:underline font-bold">Terms</Link>
                  {' '}&{' '}
                  <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline font-bold">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-xs font-bold mt-1">{errors.agreeToTerms}</p>}
            </div>

            {/* API Error Notification */}
            {apiError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold">
                {apiError}
              </div>
            )}

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#111827] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-gray-900/10 dark:shadow-purple-950/50 flex items-center justify-center gap-2 group mt-2 disabled:opacity-50 cursor-pointer"
            >
              <span>
                {isLoading 
                  ? 'Entering onboarding...' 
                  : AUTH_BYPASS_CONFIG.enabled 
                    ? 'Continue to onboarding process' 
                    : 'Create account'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </form>

          {/* Footer Link */}
          <div className="text-center pt-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

        </div>

        {/* Bottom Empty Spacer for balance */}
        <div className="hidden lg:block"></div>

      </div>

    </div>
  );
}
