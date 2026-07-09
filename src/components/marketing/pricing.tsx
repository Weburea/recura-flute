'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLANS = [
  {
    name: 'Basic',
    label: 'BASIC',
    description: 'For small teams just getting started with billing.',
    monthlyPrice: 29,
    annualPrice: 23,
    features: [
      'Up to 100 customers',
      'Unlimited invoices',
      '2 payment gateways',
      'Basic analytics dashboard',
      'Email support',
    ],
    highlight: false,
    buttonText: 'Get started free',
  },
  {
    name: 'Growth',
    label: 'GROWTH',
    description: 'For growing businesses scaling recurring revenue.',
    monthlyPrice: 49,
    annualPrice: 39,
    features: [
      'Up to 1,000 customers',
      'All payment gateways',
      'Automated dunning & retries',
      'Advanced analytics & MRR',
      '5 team members',
      'Priority chat support',
    ],
    highlight: true,
    badge: 'Most Popular',
    buttonText: 'Start free trial',
  },
  {
    name: 'Business',
    label: 'BUSINESS',
    description: 'For large teams with advanced enterprise needs.',
    monthlyPrice: 999,
    annualPrice: 799,
    features: [
      'Unlimited customers',
      'Custom integrations',
      'Dedicated account manager',
      'SLA & uptime guarantee',
      'White-label invoicing',
    ],
    highlight: false,
    buttonText: 'Contact sales',
  },
];

export function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'annually'>('monthly');

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-transparent overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs tracking-wider uppercase mb-3 block">
            Transparent Pricing
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            The right plan for <br className="hidden sm:block" />
            <span className="text-purple-600 dark:text-purple-400">every business</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            No hidden fees. Cancel anytime. 14-day free trial on all plans.
          </p>
        </div>

        {/* Toggle Option Container */}
        <div className="flex justify-center mb-20">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-white/[0.03] rounded-full border border-slate-200/60 dark:border-white/10">
            <button
              onClick={() => setBilling('monthly')}
              className={cn(
                'px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300',
                billing === 'monthly'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annually')}
              className={cn(
                'px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-1.5',
                billing === 'annually'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              <span>Annual</span>
              <span className={cn(
                'text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider transition-colors',
                billing === 'annually'
                  ? 'bg-white text-purple-600'
                  : 'bg-emerald-500 text-white'
              )}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto items-stretch">
          {PLANS.map((plan) => {
            const price = billing === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
            return (
              <div
                key={plan.name}
                className={cn(
                  'rounded-3xl p-8 lg:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative',
                  plan.highlight
                    ? 'bg-purple-600 dark:bg-purple-700 text-white shadow-xl shadow-purple-600/15 md:-translate-y-4 md:scale-[1.03] z-10 border-2 border-purple-500/50 dark:border-purple-600'
                    : 'bg-white dark:bg-white/[0.02] text-slate-900 dark:text-white border border-slate-200/60 dark:border-white/10 shadow-sm'
                )}
              >
                {/* Popular Badge */}
                {plan.highlight && plan.badge && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {plan.badge}
                  </div>
                )}

                {/* Card Top section */}
                <div>
                  <span className={cn(
                    'text-xs font-bold tracking-widest uppercase mb-4 block',
                    plan.highlight ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                  )}>
                    {plan.label}
                  </span>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                      ${price}
                    </span>
                    <span className={cn(
                      'text-sm font-medium',
                      plan.highlight ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                    )}>
                      /month
                    </span>
                  </div>

                  {/* Description */}
                  <p className={cn(
                    'text-sm leading-relaxed mb-6',
                    plan.highlight ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                  )}>
                    {plan.description}
                  </p>

                  {/* Button CTA */}
                  <div className="mb-6">
                    {plan.highlight ? (
                      <Button 
                        className="w-full py-6 rounded-full font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 flex items-center justify-center gap-1.5 transition-all duration-300"
                      >
                        <span>{plan.buttonText}</span>
                        <span className="text-sm">→</span>
                      </Button>
                    ) : (
                      <Button 
                        className="w-full py-6 rounded-full font-bold bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/40 border border-transparent flex items-center justify-center gap-1.5 transition-all duration-300"
                      >
                        <span>{plan.buttonText}</span>
                        {plan.name === 'Business' && <span className="text-sm">→</span>}
                      </Button>
                    )}
                  </div>

                  {/* Divider */}
                  <div className={cn(
                    'h-px w-full mb-6',
                    plan.highlight ? 'bg-white/20' : 'bg-slate-200/60 dark:bg-white/10'
                  )} />

                  {/* Features List */}
                  <ul className="space-y-4 mb-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className={cn(
                          'w-4 h-4 shrink-0 mt-0.5',
                          plan.highlight 
                            ? 'text-white' 
                            : 'text-emerald-500 dark:text-emerald-400'
                        )} strokeWidth={3} />
                        <span className={cn(
                          'text-sm font-medium',
                          plan.highlight ? 'text-white/95' : 'text-slate-600 dark:text-slate-300'
                        )}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
