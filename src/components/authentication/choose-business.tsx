'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Layers, 
  Briefcase, 
  Megaphone, 
  Rocket, 
  Store, 
  PlusCircle, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { OnboardingShell } from './onboarding-shell';

export const BUSINESS_TYPES = [
  {
    id: 'saas',
    shortName: 'SaaS',
    title: 'SaaS Business',
    desc: 'You charge people a monthly or yearly fee to use your software.',
    icon: Layers,
  },
  {
    id: 'agencies',
    shortName: 'Agencies',
    title: 'Agency & Retainers',
    desc: 'You do ongoing work for clients — design, marketing, dev, etc. — and get paid regularly.',
    icon: Briefcase,
  },
  {
    id: 'social_media',
    shortName: 'Social Media',
    title: 'Social Media Marketing',
    desc: 'You manage social accounts, run campaigns, and grow followers for clients or your own brand.',
    icon: Megaphone,
  },
  {
    id: 'startups',
    shortName: 'Startups',
    title: 'High-Growth Startup',
    desc: "You're early-stage, growing fast, and still figuring out pricing.",
    icon: Rocket,
  },
  {
    id: 'marketplaces',
    shortName: 'E-Commerce',
    title: 'E-Commerce',
    desc: "You sell products online — your own, or other sellers' on your platform.",
    icon: Store,
  },
  {
    id: 'other',
    shortName: 'Custom',
    title: 'Something else',
    desc: 'Start with our flexible billing & invoicing engine',
    icon: PlusCircle,
  },
];

export function ChooseBusiness() {
  const [selectedId, setSelectedId] = useState('saas');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const selectedBusiness = BUSINESS_TYPES.find(b => b.id === selectedId) || BUSINESS_TYPES[0];

  const handleContinue = () => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recura_business_type', selectedId);
      sessionStorage.setItem('recura_business_type', selectedId);
    }
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/business-details?type=${selectedId}`);
    }, 400);
  };

  return (
    <OnboardingShell step={3} maxWidth="4xl">
      <div className="w-full bg-white dark:bg-[#150A2E] rounded-[2.5rem] p-8 sm:p-10 lg:p-12 shadow-2xl shadow-purple-900/10 border border-purple-100/50 dark:border-white/10">
        
        {/* Header & Subtitle */}
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            What kind of business is this?
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 font-medium leading-relaxed max-w-2xl">
            We&apos;ll tailor your billing fields, invoice templates and dashboard around this — you can add more businesses later.
          </p>
        </div>

        {/* 2x3 Option Card Grid (No desktop scrollbar; clean 2-line flow) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8 max-sm:max-h-[55vh] max-sm:overflow-y-auto max-sm:pr-1 sm:overflow-visible sm:max-h-none custom-scrollbar">
          {BUSINESS_TYPES.map((item) => {
            const IconComp = item.icon;
            const isSelected = selectedId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "w-full text-left p-6 sm:p-7 rounded-[1.75rem] transition-all duration-200 flex items-start justify-between gap-4 group cursor-pointer relative overflow-hidden",
                  isSelected
                    ? "bg-[#6C5CE7] text-white border border-[#6C5CE7] shadow-sm"
                    : "bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-900 dark:text-white hover:border-purple-300 dark:hover:border-purple-800/50 hover:bg-gray-50/50 dark:hover:bg-white/10"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors mt-0.5",
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/60"
                  )}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-sm sm:text-base font-bold tracking-tight mb-1",
                      isSelected ? "text-white" : "text-gray-900 dark:text-white"
                    )}>
                      {item.title}
                    </h3>
                    <p className={cn(
                      "text-xs sm:text-[13px] leading-relaxed font-medium pr-1",
                      isSelected ? "text-purple-100" : "text-gray-400 dark:text-gray-400"
                    )}>
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Checked Circle / Empty Radio */}
                <div className="shrink-0 pt-0.5">
                  {isSelected ? (
                    <div className="w-5.5 h-5.5 rounded-full bg-white text-[#6C5CE7] flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5.5 h-5.5 rounded-full border-2 border-gray-200 dark:border-white/20" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Primary CTA Button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={isLoading}
          className="w-full bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold py-4.5 px-6 rounded-2xl transition-all shadow-xl shadow-gray-900/10 dark:shadow-purple-950/50 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 text-sm sm:text-base"
        >
          <span>{isLoading ? 'Saving choice...' : `Continue with ${selectedBusiness.shortName}`}</span>
          {!isLoading && <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />}
        </button>

      </div>
    </OnboardingShell>
  );
}
