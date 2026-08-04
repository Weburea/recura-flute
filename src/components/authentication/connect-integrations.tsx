'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowRight, 
  Check, 
  Loader2, 
  Info
} from 'lucide-react';
import { OnboardingShell } from './onboarding-shell';
import { getIntegrationsForNiche } from '@/config/integrations';
import { cn } from '@/lib/utils';

function ConnectIntegrationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showUpgradeWarning, setShowUpgradeWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const FREE_PLAN_CAP = 2;

  const integrationsList = React.useMemo(() => {
    let typeFromUrl = searchParams.get('type');
    let shopifyFromUrl = searchParams.get('shopify') === 'true';

    if (!typeFromUrl && typeof window !== 'undefined') {
      typeFromUrl = localStorage.getItem('recura_business_type') || sessionStorage.getItem('recura_business_type');
    }
    if (!shopifyFromUrl && typeof window !== 'undefined') {
      shopifyFromUrl = localStorage.getItem('recura_shopify_selected') === 'true';
    }

    const finalNiche = typeFromUrl || 'saas';
    return getIntegrationsForNiche(finalNiche, shopifyFromUrl);
  }, [searchParams]);

  const toggleSelect = (id: string, alreadyConnected?: boolean) => {
    if (alreadyConnected) return;

    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
      setShowUpgradeWarning(false);
    } else {
      if (selectedIds.length >= FREE_PLAN_CAP) {
        setShowUpgradeWarning(true);
        return;
      }
      setSelectedIds(prev => [...prev, id]);
      setShowUpgradeWarning(false);
    }
  };

  const getSummaryUrl = (selectedList: string[]) => {
    if (typeof window !== 'undefined') {
      const typeFromUrl = searchParams.get('type') || localStorage.getItem('recura_business_type') || 'saas';
      localStorage.setItem('recura_integrations_count', selectedList.length.toString());
      sessionStorage.setItem('recura_integrations_count', selectedList.length.toString());
      localStorage.setItem('recura_connected_integration_ids', JSON.stringify(selectedList));
      sessionStorage.setItem('recura_connected_integration_ids', JSON.stringify(selectedList));
      return `/completion-summary?type=${typeFromUrl}`;
    }
    return '/completion-summary';
  };

  const handleFinish = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Route to Completion Summary (You're All Set) page
      router.push(getSummaryUrl(selectedIds));
    }, 450);
  };

  return (
    <OnboardingShell step={5} maxWidth="3xl">
      <div className="w-full bg-white dark:bg-[#150A2E] rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-2xl shadow-purple-900/10 border border-purple-100/50 dark:border-white/10 flex flex-col gap-6 sm:gap-8">
        
        {/* Header & Subtext */}
        <div className="space-y-1.5 text-center sm:text-left shrink-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Connector Integrations
            </h1>
            {/* Selection Counter Badge */}
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-3.5 py-1.5 rounded-full border border-purple-200 dark:border-purple-800/40">
              {selectedIds.length} of {FREE_PLAN_CAP} selected (Free plan)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 font-medium leading-relaxed max-w-xl">
            Link the apps you already use — you can add more later from Settings.
          </p>
        </div>

        {/* Free Plan Cap Inline Warning */}
        {showUpgradeWarning && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-start gap-3 shadow-xs animate-in fade-in duration-200 shrink-0">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Free plan allows 2 integrations.</p>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300 font-medium">
                Upgrade to connect more tools or uncheck a tool to select a different one.{' '}
                <a href="#upgrade" onClick={(e) => { e.preventDefault(); alert('Upgrade to Growth or Business plan to unlock up to 5+ integrations!'); }} className="underline font-bold hover:text-amber-950 dark:hover:text-white">
                  Upgrade plan →
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Integrations 2-Column Grid — mobile max-h-[330px] & sm max-h-[380px] guarantees internal card scrolling on mobile devices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[330px] sm:max-h-[380px] lg:max-h-none lg:flex-1 lg:min-h-0 overflow-y-auto pr-1 custom-scrollbar">
          {integrationsList.map((item) => {
            const isChecked = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id, item.alreadyConnected)}
                className={cn(
                  "p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none h-fit",
                  item.alreadyConnected && "opacity-60 bg-gray-50 dark:bg-white/5 border-gray-200/80 dark:border-white/5 cursor-not-allowed",
                  !item.alreadyConnected && isChecked && "bg-purple-50/60 dark:bg-purple-950/50 border-purple-500 ring-1 ring-purple-500/20",
                  !item.alreadyConnected && !isChecked && "bg-white dark:bg-white/5 border-gray-200/80 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-800/50"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  {/* Real Brand SVG Logo Container */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 p-2 transition-colors border",
                    isChecked
                      ? "bg-white dark:bg-white/10 border-purple-200 dark:border-purple-800"
                      : "bg-gray-50 dark:bg-white/5 border-gray-200/80 dark:border-white/10"
                  )}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.logoUrl} 
                      alt={item.name} 
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                      <span className="truncate">{item.name}</span>
                      {item.alreadyConnected && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-300/40">
                          Connected
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-gray-400 dark:text-gray-400 font-medium mt-0.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Checkbox Icon */}
                <div className="shrink-0 pl-1">
                  {item.alreadyConnected ? (
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <div className={cn(
                      "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                      isChecked
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "border-gray-300 dark:border-white/20"
                    )}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary CTA Button */}
        <button
          type="button"
          onClick={handleFinish}
          disabled={isLoading || selectedIds.length === 0}
          className="w-full bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-xl shadow-gray-900/10 dark:shadow-purple-950/50 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Connecting tools...</span>
            </>
          ) : (
            <>
              <span>{selectedIds.length > 0 ? `Connect ${selectedIds.length} Selected` : 'Connect Selected'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Skip Link */}
        <div className="text-center pt-2 border-t border-gray-100 dark:border-white/5 shrink-0">
          <Link
            href={getSummaryUrl([])}
            className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors py-1"
          >
            <span>Skip for now, connect later from Settings →</span>
          </Link>
        </div>

      </div>
    </OnboardingShell>
  );
}

export function ConnectIntegrations() {
  return (
    <Suspense fallback={
      <OnboardingShell step={5} maxWidth="3xl">
        <div className="w-full bg-white dark:bg-[#150A2E] rounded-[2.5rem] p-12 text-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
          <p className="text-sm font-bold">Loading integrations...</p>
        </div>
      </OnboardingShell>
    }>
      <ConnectIntegrationsContent />
    </Suspense>
  );
}
