'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';

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

const COMPARISON_FEATURES = [
  {
    category: 'Billing & Invoicing',
    features: [
      { name: 'Unlimited invoices', basic: true, growth: true, business: true },
      { name: 'Recurring billing', basic: true, growth: true, business: true },
      { name: 'Auto tax calculation', basic: null, growth: true, business: true },
      { name: 'White-label invoices', basic: null, growth: null, business: true },
    ]
  },
  {
    category: 'Payments',
    features: [
      { name: 'Payment gateways', basic: '2', growth: 'All', business: 'Custom' },
      { name: 'Automated dunning', basic: null, growth: true, business: true },
      { name: 'Multi-currency', basic: null, growth: true, business: true },
    ]
  },
  {
    category: 'Analytics',
    features: [
      { name: 'Revenue dashboard', basic: 'Basic', growth: 'Advanced', business: 'Custom' },
      { name: 'MRR & churn tracking', basic: null, growth: true, business: true },
    ]
  },
  {
    category: 'Team & Support',
    features: [
      { name: 'Team members', basic: '2', growth: '5', business: 'Unlimited' },
      { name: 'Role-based permissions', basic: null, growth: true, business: true },
      { name: 'Support level', basic: 'Email', growth: 'Priority Chat', business: 'Dedicated' },
      { name: 'SLA guarantee', basic: null, growth: null, business: '99.99%' },
    ]
  }
];

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annually'>('monthly');

  return (
    <main className="bg-background min-h-screen pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-white dark:bg-transparent pt-20 pb-16 overflow-hidden">
        {/* Background Grid Lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[550px] z-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.06),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_65%)]" />
          <Image
            src="https://res.cloudinary.com/weburea/image/upload/v1783571760/Grid_hero_lines.svg"
            alt="Background Pattern"
            fill
            className="object-contain opacity-75 dark:opacity-50 pointer-events-none"
            priority
          />
        </div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          {/* Transparent Pricing Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/50 dark:bg-white/5 dark:border-white/10 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
              <span className="text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                Transparent Pricing
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
            The right plan for <br />
            <span className="text-purple-600 dark:text-purple-400">every business</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
            No hidden fees. Cancel anytime. 14-day free trial on all plans.
          </p>

          {/* Toggle Option Container */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex p-1 bg-slate-100 dark:bg-white/[0.03] rounded-full border border-slate-200/60 dark:border-white/10 shadow-inner">
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
        </div>

        {/* Cards Grid */}
        <div className="container mx-auto px-6 relative z-10">
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

      {/* Comparison Table Section */}
      <section className="py-24 bg-slate-50/50 dark:bg-transparent border-t border-slate-200/60 dark:border-white/10 overflow-hidden">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/50 dark:bg-white/5 dark:border-white/10 text-xs font-bold shadow-sm mb-4">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full inline-block animate-pulse" />
              <span className="text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                Compare Plans
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Everything side by side
            </h2>
          </div>

          {/* Comparison Table */}
          <div className="max-w-6xl mx-auto overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/[0.01] shadow-sm">
            <table className="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-white/10">
                  <th className="p-6 font-bold text-slate-800 dark:text-slate-200 w-[40%] text-base">Feature</th>
                  <th className="p-6 font-bold text-center text-slate-800 dark:text-slate-200 w-[20%] text-base">Basic</th>
                  <th className="p-6 font-bold text-center bg-purple-600 dark:bg-purple-700 text-white w-[20%] text-base">Growth</th>
                  <th className="p-6 font-bold text-center text-slate-800 dark:text-slate-200 w-[20%] text-base">Business</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((categoryGroup, index) => (
                  <React.Fragment key={index}>
                    {/* Category Group Title Row */}
                    <tr>
                      <td 
                        colSpan={4} 
                        className="bg-purple-50/80 dark:bg-purple-950/20 px-6 py-3 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 border-b border-slate-200/60 dark:border-white/10"
                      >
                        {categoryGroup.category}
                      </td>
                    </tr>
                    {/* Features Row */}
                    {categoryGroup.features.map((feature, fIndex) => (
                      <tr 
                        key={fIndex} 
                        className="border-b border-slate-200/60 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors"
                      >
                        <td className="p-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          {feature.name}
                        </td>
                        
                        {/* Basic Value */}
                        <td className="p-6 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {feature.basic === true ? (
                            <Check className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mx-auto" strokeWidth={3} />
                          ) : feature.basic === null ? (
                            <span className="text-slate-300 dark:text-slate-600">—</span>
                          ) : (
                            <span>{feature.basic}</span>
                          )}
                        </td>

                        {/* Growth Value (Highlighted Column) */}
                        <td className="p-6 text-center text-sm font-semibold bg-purple-50/30 dark:bg-purple-900/10 text-slate-700 dark:text-slate-200 border-x border-purple-100/50 dark:border-purple-900/20">
                          {feature.growth === true ? (
                            <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto" strokeWidth={3} />
                          ) : feature.growth === null ? (
                            <span className="text-slate-300 dark:text-slate-600">—</span>
                          ) : (
                            <span>{feature.growth}</span>
                          )}
                        </td>

                        {/* Business Value */}
                        <td className="p-6 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {feature.business === true ? (
                            <Check className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mx-auto" strokeWidth={3} />
                          ) : feature.business === null ? (
                            <span className="text-slate-300 dark:text-slate-600">—</span>
                          ) : (
                            <span>{feature.business}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
