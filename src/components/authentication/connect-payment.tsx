'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { OnboardingShell } from './onboarding-shell';
import Image from 'next/image';

interface PaymentGateway {
  id: string;
  name: string;
  badge: string;
  desc: string;
  logoUrl: string;
}

const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: 'paystack',
    name: 'Paystack',
    badge: 'Nigeria & Africa',
    desc: 'Cards, bank transfers, and mobile money across Nigeria and Africa.',
    logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785123705/images/payment-icons/paystack.png',
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    badge: 'Pan-African & Global',
    desc: 'Pan-African payments with global card support.',
    logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785123774/images/payment-icons/flutterwave.png',
  },
  {
    id: 'monnify',
    name: 'Monnify',
    badge: 'Nigeria & Virtual Accounts',
    desc: 'Bank transfers, cards, and virtual accounts — Nigerian-owned by Moniepoint.',
    logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785123800/images/payment-icons/monnify.png',
  },
];

export function ConnectPayment() {
  const [connectedProvider, setConnectedProvider] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConnect = (providerId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setConnectedProvider(providerId);
      if (typeof window !== 'undefined') {
        const gatewayObj = PAYMENT_GATEWAYS.find(g => g.id === providerId);
        if (gatewayObj) {
          localStorage.setItem('recura_connected_payment', gatewayObj.name);
          sessionStorage.setItem('recura_connected_payment', gatewayObj.name);
        }
      }
      setIsLoading(false);
    }, 600);
  };

  const getIntegrationsUrl = () => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const nicheType = searchParams.get('type') || localStorage.getItem('recura_business_type') || 'saas';
      const isShopify = searchParams.get('shopify') === 'true' || localStorage.getItem('recura_shopify_selected') === 'true';
      const queryParams = new URLSearchParams({
        type: nicheType,
        ...(isShopify ? { shopify: 'true' } : {}),
      }).toString();
      return `/connect-integrations?${queryParams}`;
    }
    return '/connect-integrations';
  };

  const handleFinish = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Route to Connect Integrations
      router.push(getIntegrationsUrl());
    }, 400);
  };

  return (
    <OnboardingShell step={5} maxWidth="xl">
      <div className="w-full bg-white dark:bg-[#150A2E] rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-purple-900/10 border border-purple-100/50 dark:border-white/10 space-y-5 sm:space-y-6">
        
        {/* Title & Subtitle */}
        <div className="space-y-1.5 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Connect a payment processor
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 font-medium leading-relaxed max-w-xl">
            Link your payment gateway to start receiving automated payouts, processing subscriptions, and syncing invoice data.
          </p>
        </div>

        {/* Payment Gateway Cards (Clean 3-Row Stack Layout: Title+Badge / Logo+Button / Description) */}
        <div className="space-y-3">
          {PAYMENT_GATEWAYS.map((gateway) => {
            const isConnected = connectedProvider === gateway.id;
            return (
              <div 
                key={gateway.id}
                className="p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 space-y-3 transition-all hover:border-purple-300 dark:hover:border-purple-800/50"
              >
                {/* ROW 1: Title (Left) + Badge (Right) */}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                    {gateway.name}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/40 shrink-0 whitespace-nowrap">
                    {gateway.badge}
                  </span>
                </div>

                {/* ROW 2: Logo Card (Left) + Connect Button (Right) */}
                <div className="flex items-center justify-between gap-3">
                  <div className="h-10 sm:h-11 px-3.5 py-1.5 rounded-xl bg-white dark:bg-white border border-gray-200/90 shadow-sm flex items-center justify-center shrink-0 min-w-[110px] sm:min-w-[130px]">
                    <Image 
                      src={gateway.logoUrl} 
                      alt={gateway.name} 
                      width={120} 
                      height={36} 
                      className="max-h-6 sm:max-h-7 w-auto object-contain"
                    />
                  </div>

                  {isConnected ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800 shrink-0">
                      <Check className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleConnect(gateway.id)}
                      disabled={isLoading}
                      className="bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer shrink-0 whitespace-nowrap"
                    >
                      Connect {gateway.name}
                    </button>
                  )}
                </div>

                {/* ROW 3: Full Description Spanning Across Bottom */}
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  {gateway.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Primary CTA Button */}
        <button
          type="button"
          onClick={handleFinish}
          disabled={isLoading}
          className="w-full bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-all shadow-xl shadow-gray-900/10 dark:shadow-purple-950/50 flex items-center justify-center gap-2 group cursor-pointer text-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Proceeding to integrations...</span>
            </>
          ) : (
            <>
              <span>Continue to integrations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Skip Link */}
        <div className="text-center pt-1 border-t border-gray-100 dark:border-white/5">
          <button
            type="button"
            onClick={() => router.push(getIntegrationsUrl())}
            className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors py-1 cursor-pointer"
          >
            <span>Skip for now, connect later from Settings →</span>
          </button>
        </div>

      </div>
    </OnboardingShell>
  );
}
