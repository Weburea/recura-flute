'use client';

import React, { useState, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  Info,
  Layers,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { OnboardingShell } from './onboarding-shell';
import Image from 'next/image';
import { UNIVERSAL_INTEGRATIONS, NICHE_INTEGRATIONS } from '@/config/integrations';

// Helper map for payment provider brand icons
const PAYMENT_LOGOS: Record<string, string> = {
  Paystack: 'https://res.cloudinary.com/weburea/image/upload/v1785123705/images/payment-icons/paystack.png',
  Flutterwave: 'https://res.cloudinary.com/weburea/image/upload/v1785123774/images/payment-icons/flutterwave.png',
  Monnify: 'https://res.cloudinary.com/weburea/image/upload/v1785123800/images/payment-icons/monnify.png',
};

// Single Recura icon mark (R symbol alone) URL
const RECURA_ICON_MARK = 'https://res.cloudinary.com/weburea/image/upload/v1783571840/logo_plan.svg';

// Default software integration brand icons for Hero nodes (Excludes payment processors)
const FALLBACK_HERO_NODES = [
  { id: 'gmail', name: 'Gmail', logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130775/images/integration-icons/gmail.png' },
  { id: 'slack', name: 'Slack', logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785129978/images/integration-icons/slack.svg' },
  { id: 'zapier', name: 'Zapier', logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130016/images/integration-icons/zapier.svg' },
  { id: 'notion', name: 'Notion', logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130041/images/integration-icons/notion.svg' },
];

// Flattened lookup map of all available integration brand logos
function getIntegrationLogoMap(): Record<string, { name: string; logoUrl: string }> {
  const map: Record<string, { name: string; logoUrl: string }> = {};

  UNIVERSAL_INTEGRATIONS.forEach(item => {
    map[item.id] = { name: item.name, logoUrl: item.logoUrl };
  });

  Object.values(NICHE_INTEGRATIONS).forEach(list => {
    list.forEach(item => {
      map[item.id] = { name: item.name, logoUrl: item.logoUrl };
    });
  });

  return map;
}

/**
 * Hero Animated Convergence Illustration (Shadcn UI Kit "Animated Beam" Style)
 * 1. Software-only integration nodes on left (never payment gateways).
 * 2. Responsive SVG Bezier curves that terminate 100% inside the right Recura box.
 * 3. Continuous staggered cascading light pulse animations and Recura receiver pulse.
 */
function AnimatedBeamConvergence({ connectedIntegrations }: { connectedIntegrations: Array<{ id: string; name: string; logoUrl: string }> }) {
  // Always populate 4 software integration nodes (user connected integrations + fallbacks for unfilled slots)
  const displayNodes = useMemo(() => {
    const merged = [...connectedIntegrations];
    FALLBACK_HERO_NODES.forEach(fallback => {
      if (merged.length < 4 && !merged.some(t => t.id === fallback.id)) {
        merged.push(fallback);
      }
    });
    return merged.slice(0, 4);
  }, [connectedIntegrations]);

  return (
    <div className="w-full h-44 sm:h-52 relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#180E33]/90 via-[#150A2E] to-[#0E0621] border border-purple-500/20 shadow-inner flex items-center justify-between px-4 sm:px-10 select-none">
      
      {/* Background Dot Mesh Grid & Glow Ambient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(#a28cff_1px,transparent_1px)] [background-size:18px_18px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* SVG Animated Beams (Precise coordinates terminating 100% inside the right Recura box) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none" viewBox="0 0 500 200">
        <defs>
          {/* Animated Traveling Gradient Beams */}
          <linearGradient id="beam-grad-stagger" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.3" />
          </linearGradient>

          {/* Glowing Path Filter */}
          <filter id="glow-stagger" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 4 Staggered Curved Bezier Connecting Beam Paths (Cascading 1 -> 2 -> 3 -> 4) */}
        {[
          { y: 32, delay: '0s' },
          { y: 76, delay: '0.6s' },
          { y: 124, delay: '1.2s' },
          { y: 168, delay: '1.8s' },
        ].map((beam, i) => {
          const pathD = `M 55,${beam.y} C 180,${beam.y} 300,100 425,100`;

          return (
            <g key={`beam-group-${i}`}>
              {/* Base Guide Path */}
              <path d={pathD} stroke="rgba(168,85,247,0.2)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
              
              {/* Animated Traveling Light Pulse Line */}
              <path d={pathD} stroke="url(#beam-grad-stagger)" strokeWidth="2.5" fill="none" strokeDasharray="40 160" filter="url(#glow-stagger)">
                <animate 
                  attributeName="stroke-dashoffset" 
                  from="200" 
                  to="0" 
                  dur="2.4s" 
                  begin={beam.delay}
                  repeatCount="indefinite" 
                />
              </path>
            </g>
          );
        })}
      </svg>

      {/* LEFT SIDE: 4 Software Integration Nodes */}
      <div className="flex flex-col justify-between h-full py-3.5 relative z-20">
        {displayNodes.map((node, i) => (
          <div 
            key={node.id + i}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white p-1 sm:p-1.5 border border-gray-200/90 shadow-md flex items-center justify-center shrink-0 transition-transform hover:scale-110"
            title={node.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={node.logoUrl} alt={node.name} className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
          </div>
        ))}
      </div>

      {/* RIGHT SIDE: Central 3D Embossed Box with Up & Down Shaking Animation when Beams Enter */}
      <div className="relative z-20 flex items-center justify-center">
        {/* Keyframe Definition for Up & Down Shaking Motion */}
        <style jsx>{`
          @keyframes recuraVibrate {
            0%, 100% { transform: translateY(0); }
            20% { transform: translateY(-4px); }
            40% { transform: translateY(4px); }
            60% { transform: translateY(-2px); }
            80% { transform: translateY(2px); }
          }
          .animate-recura-vibrate {
            animation: recuraVibrate 1.2s ease-in-out infinite;
          }
        `}</style>

        {/* Ambient Pulsing Glow Aura */}
        <div className="absolute -inset-3 rounded-2xl bg-purple-500/30 blur-xl animate-pulse pointer-events-none"></div>

        {/* 3D Embossed Container Box with Single Recura Mark Icon & Vertical Shaking Vibration */}
        <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-[#251A40] via-[#1A1230] to-[#120B24] border-2 border-purple-400/60 shadow-[0_12px_24px_rgba(147,51,234,0.4),inset_0_2px_4px_rgba(255,255,255,0.2)] flex items-center justify-center p-2.5 sm:p-3 relative transition-transform animate-recura-vibrate">
          <Image 
            src={RECURA_ICON_MARK} 
            alt="Recura" 
            width={32} 
            height={32} 
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain" 
            priority 
          />
        </div>
      </div>

    </div>
  );
}

function CompletionSummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Resolved Niche, Business Name, Payment Provider, and Software Integrations Data from storage/URL
  const { 
    nicheType, 
    businessName, 
    connectedPaymentObj,
    connectedIntegrations, 
    formData 
  } = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        nicheType: 'saas',
        businessName: 'Your business',
        connectedPaymentObj: null,
        connectedIntegrations: [],
        formData: {},
      };
    }

    const typeFromUrl = searchParams.get('type') || localStorage.getItem('recura_business_type') || sessionStorage.getItem('recura_business_type') || 'saas';
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsedFormData: Record<string, any> = {};
    try {
      const rawForm = localStorage.getItem('recura_step4_formdata') || sessionStorage.getItem('recura_step4_formdata');
      if (rawForm) parsedFormData = JSON.parse(rawForm);
    } catch {
      parsedFormData = {};
    }

    const name = parsedFormData.businessName || localStorage.getItem('recura_business_name') || sessionStorage.getItem('recura_business_name') || 'Your business';
    const paymentName = localStorage.getItem('recura_connected_payment') || sessionStorage.getItem('recura_connected_payment') || null;
    
    // Payment Object if connected
    const paymentObj = (paymentName && PAYMENT_LOGOS[paymentName]) 
      ? { id: 'payment', name: paymentName, logoUrl: PAYMENT_LOGOS[paymentName] }
      : null;

    // Connected Software Integration IDs
    let integrationIds: string[] = [];
    try {
      const rawIds = localStorage.getItem('recura_connected_integration_ids') || sessionStorage.getItem('recura_connected_integration_ids');
      if (rawIds) integrationIds = JSON.parse(rawIds);
    } catch {
      integrationIds = [];
    }

    // Map IDs to software integration brand objects
    const logoMap = getIntegrationLogoMap();
    const softwareIntegrations: Array<{ id: string; name: string; logoUrl: string }> = [];

    integrationIds.forEach(id => {
      if (logoMap[id]) {
        softwareIntegrations.push({ id, name: logoMap[id].name, logoUrl: logoMap[id].logoUrl });
      }
    });

    return {
      nicheType: typeFromUrl,
      businessName: name,
      connectedPaymentObj: paymentObj,
      connectedIntegrations: softwareIntegrations,
      formData: parsedFormData,
    };
  }, [searchParams]);

  // Combined Connected Items list for "WHAT'S CONNECTED" section (Payment + Software Integrations)
  const allConnectedItems = useMemo(() => {
    const items = [];
    if (connectedPaymentObj) items.push(connectedPaymentObj);
    items.push(...connectedIntegrations);
    return items;
  }, [connectedPaymentObj, connectedIntegrations]);

  // Tailored Niche Label & Subtext
  const { nicheLabel, subtext } = useMemo(() => {
    switch (nicheType) {
      case 'saas':
        return {
          nicheLabel: 'SaaS',
          subtext: 'Your SaaS workspace is configured. Most SaaS businesses send their first invoice within 24 hours.',
        };
      case 'agency':
        return {
          nicheLabel: 'Agency',
          subtext: 'Your Agency workspace is configured. Most agencies send their first invoice within 24 hours.',
        };
      case 'social_media':
        return {
          nicheLabel: 'Social Media Marketing',
          subtext: 'Your Social Media Marketing workspace is configured. Most agencies send their first invoice within 24 hours.',
        };
      case 'startup':
        return {
          nicheLabel: 'Startup',
          subtext: 'Your Startup workspace is configured. Most startups send their first invoice within 24 hours.',
        };
      case 'marketplaces':
      case 'ecommerce':
        return {
          nicheLabel: 'E-Commerce',
          subtext: 'Your E-Commerce workspace is configured. Most stores send their first invoice within 24 hours.',
        };
      default:
        return {
          nicheLabel: 'Business',
          subtext: 'Your workspace is configured. Most businesses send their first invoice within 24 hours.',
        };
    }
  }, [nicheType]);

  // Real Onboarding Recap Data for "YOUR SETUP" Section — concise wording & balanced columns
  const setupRecap = useMemo(() => {
    switch (nicheType) {
      case 'saas':
        return [
          { label: 'Active Customers', value: formData.monthlyOrders || formData.catalogSize || '0' },
          { label: 'Billing Model', value: formData.sellModel === 'own' ? 'Direct SaaS' : 'Marketplace & SaaS' },
          { label: 'Pricing Tiers', value: '3 Configured Tiers' },
        ];
      case 'agency':
        return [
          { label: 'Active Clients', value: formData.clientCount || '5 Clients' },
          { label: 'Services Listed', value: Array.isArray(formData.servicesList) ? `${formData.servicesList.length} Services` : '4 Services' },
          { label: 'Billing Model', value: formData.retainerModel || 'Monthly Retainer' },
        ];
      case 'social_media':
        return [
          { label: 'Active Campaigns', value: formData.campaignCount || '3 Campaigns' },
          { label: 'Services Listed', value: Array.isArray(formData.offeringsList) ? `${formData.offeringsList.length} Services` : '5 Services' },
          { label: 'Pricing Model', value: formData.pricingStructure || 'Monthly Package' },
        ];
      case 'startup':
        return [
          { label: 'Growth Stage', value: formData.startupStage || 'Seed Stage' },
          { label: 'Team Size', value: formData.teamSize || '8 Members' },
          { label: 'Monetization', value: formData.pricingModel || 'Freemium & Paid' },
        ];
      case 'marketplaces':
      case 'ecommerce':
        return [
          { label: 'Sales Channels', value: Array.isArray(formData.platforms) ? formData.platforms.join(', ') : 'Shopify Store' },
          { label: 'Catalog Size', value: formData.catalogSize ? `${formData.catalogSize} Products` : '120 Products' },
          { label: 'Monthly Volume', value: formData.monthlyOrders ? `${formData.monthlyOrders} Orders/mo` : '250 Orders/mo' },
        ];
      default:
        return [
          { label: 'Business Category', value: nicheLabel },
          { label: 'Primary Goal', value: formData.primaryGoal || 'Recurring Invoicing' },
          { label: 'Workspace Mode', value: 'Custom Setup' },
        ];
    }
  }, [nicheType, formData, nicheLabel]);

  const handleGoToDashboard = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/v1/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 5,
          businessType: nicheType,
          businessName,
          gateways: [connectedPaymentObj?.name].filter(Boolean),
          integrations: connectedIntegrations.map(i => i.id),
          metadata: {
            ...formData,
            logo_url: formData.logo || formData.logoUrl || formData.logo_url || null,
            website_url: formData.websiteUrl || formData.website_url || null,
            niche: nicheType,
          }
        }),
      });
      setIsLoading(false);
      router.push('/dashboard');
    } catch {
      setIsLoading(false);
      router.push('/dashboard');
    }
  };

  const handleEditDetails = () => {
    // Route back to Step 4 business details for editing
    router.push('/business-details');
  };

  return (
    <OnboardingShell step={5} maxWidth="3xl">
      <div className="w-full bg-white dark:bg-[#150A2E] rounded-[2.5rem] p-5 sm:p-7 lg:p-8 shadow-2xl shadow-purple-900/10 border border-purple-100/50 dark:border-white/10 space-y-4 sm:space-y-5">
        
        {/* 1. HERO SECTION — Animated Beam Convergence Illustration */}
        <AnimatedBeamConvergence connectedIntegrations={connectedIntegrations} />

        {/* Dynamic Headline & Tailored Subtext (Clean typography, NO EMOJIS) */}
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {businessName} is live
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xl">
            {subtext}
          </p>
        </div>

        {/* SECTION 1 — YOUR SETUP (Real Onboarding Recap with Balanced Grid Columns) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
            <Zap className="w-3.5 h-3.5 fill-purple-600/30" />
            <span>Your Setup</span>
          </div>

          {/* Clean Structured Recap Container with Equal Grid Columns */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent border border-purple-200/80 dark:border-purple-800/40 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center sm:text-left">
              {setupRecap.map((item, idx) => (
                <div key={idx} className="space-y-0.5 min-w-0">
                  <p className="text-[10px] font-extrabold text-gray-400 dark:text-gray-400 uppercase tracking-wider truncate">
                    {item.label}
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-purple-200 tracking-tight leading-snug break-words">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2 — WHAT'S CONNECTED (Real Branded Tool Cards & Filled Balanced Grid Layout) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
            <Layers className="w-3.5 h-3.5 fill-purple-600/30" />
            <span>What&apos;s Connected</span>
          </div>

          {allConnectedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allConnectedItems.map((tool) => (
                <div 
                  key={tool.id + tool.name}
                  className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/10 border border-purple-200/80 dark:border-purple-800/50 shadow-xs flex items-center justify-between gap-3 text-xs font-bold text-gray-900 dark:text-white"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Enlarged Brand Logo Badge Container with Solid White Background */}
                    <div className="w-10 sm:w-11 h-7 sm:h-8 rounded-lg bg-white p-1 flex items-center justify-center border border-gray-200/80 shrink-0 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={tool.logoUrl} alt={tool.name} className="max-h-5 sm:max-h-6 w-auto max-w-full object-contain" />
                    </div>
                    <span className="truncate">{tool.name}</span>
                  </div>

                  {/* Refined Violet/Purple Accent Badge Indicator */}
                  <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300/80 dark:border-purple-800/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" /> Connected
                  </span>
                </div>
              ))}

              {/* Complementary Onboarding Status Card when an odd number of items is connected */}
              {allConnectedItems.length % 2 !== 0 && (
                <div className="px-3.5 py-2.5 rounded-xl bg-purple-50/50 dark:bg-white/5 border border-purple-200/60 dark:border-white/10 flex items-center justify-between gap-3 text-xs font-bold text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 sm:w-11 h-7 sm:h-8 rounded-lg bg-purple-100 dark:bg-purple-950 p-1 flex items-center justify-center border border-purple-200/80 dark:border-purple-800 text-purple-700 dark:text-purple-300 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="truncate">Automated Payouts & Invoicing</span>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300/80 dark:border-purple-800/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" /> Active
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2.5">
              <Info className="w-4 h-4 text-purple-500 shrink-0" />
              <span>No tools connected yet — you can add these anytime from Settings.</span>
            </div>
          )}
        </div>

        {/* SECTION 3 — ACCOUNT CHECKLIST */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-3.5 h-3.5 fill-purple-600/30" />
            <span>Account Checklist</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-bold">
            {/* 1. Account verified */}
            <div className="flex items-center gap-2.5 text-purple-900 dark:text-purple-300">
              <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center shrink-0 border border-purple-300/80 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>Account verified</span>
            </div>

            {/* 2. Niche workspace configured */}
            <div className="flex items-center gap-2.5 text-purple-900 dark:text-purple-300">
              <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center shrink-0 border border-purple-300/80 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>{nicheLabel} workspace configured</span>
            </div>
          </div>
        </div>

        {/* Actions Container: Primary CTA & Secondary Back Link */}
        <div className="space-y-2 pt-1">
          {/* Primary CTA Button: Go to dashboard */}
          <button
            type="button"
            onClick={handleGoToDashboard}
            disabled={isLoading}
            className="w-full bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-gray-900/10 dark:shadow-purple-950/50 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Entering dashboard...</span>
              </>
            ) : (
              <>
                <span>Go to dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Secondary Back Link: Edit onboarding details */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleEditDetails}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-300 transition-colors py-1 px-3 rounded-lg hover:bg-purple-50 dark:hover:bg-white/5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Edit onboarding details</span>
            </button>
          </div>
        </div>

      </div>
    </OnboardingShell>
  );
}

export function CompletionSummary() {
  return (
    <Suspense fallback={
      <OnboardingShell step={5} maxWidth="3xl">
        <div className="w-full bg-white dark:bg-[#150A2E] rounded-[2.5rem] p-12 text-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
          <p className="text-sm font-bold">Preparing your workspace...</p>
        </div>
      </OnboardingShell>
    }>
      <CompletionSummaryContent />
    </Suspense>
  );
}
