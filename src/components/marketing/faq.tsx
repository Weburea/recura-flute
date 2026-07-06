'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'Can I migrate from my current billing tool?',
    answer: 'Yes. We offer fully assisted migrations from Stripe Billing, Chargebee, Recurly, or custom setups, importing customer profiles, active subscriptions, and card tokens with zero downtime.',
  },
  {
    question: 'Do you support usage-based pricing?',
    answer: 'Yes. Recura supports any combination of flat, tiered, per-seat, and metered billing. You can send real-time usage events via our API to automatically charge customers for what they use.',
  },
  {
    question: 'What payment gateways do you support?',
    answer: 'We support Stripe, PayPal, Adyen, Braintree, and direct bank transfers (ACH/SEPA). More gateways can be configured via our custom API integrations.',
  },
  {
    question: 'Is Recura SOC 2 compliant?',
    answer: 'Yes, Recura is SOC 2 Type II certified, PCI-DSS Level 1 compliant, and GDPR ready. All payment details are encrypted and stored in secure, tokenized vaults.',
  },
  {
    question: 'Can I white-label the customer portal?',
    answer: 'Absolutely. You can customize the domain, logo, brand colors, and email templates so your customers have a fully branded self-service billing experience.',
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white dark:bg-transparent overflow-hidden relative">
      {/* Animated Dotted Circle Pattern (top-right side) */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] pointer-events-none z-0 translate-x-[15%] -translate-y-[20%] overflow-hidden select-none">
        <style>{`
          @keyframes beehive-vibrate {
            0%, 100% { transform: scale(1) translate(0px, 0px); opacity: 0.55; }
            50% { transform: scale(1.08) translate(5px, -5px); opacity: 0.9; }
          }
          .animate-beehive {
            animation: beehive-vibrate 8s ease-in-out infinite;
          }
        `}</style>
        <div className="w-full h-full relative animate-beehive">
          <Image
            src="/images/landing/circle_Pattern.svg"
            alt="Circle Pattern"
            fill
            className="object-contain opacity-95 dark:opacity-90 filter saturate-[2] brightness-[1.05] drop-shadow-[0_0_15px_rgba(147,51,234,0.25)] dark:saturate-[2.5] dark:brightness-[1.5] dark:drop-shadow-[0_0_30px_rgba(168,85,247,0.65)]"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs tracking-wider uppercase mb-3 block">
            FAQ
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Common questions.
          </h2>
        </div>

        {/* Accordion Rows */}
        <div className="border-t border-slate-200/60 dark:border-white/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="border-b border-slate-200/60 dark:border-white/10 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
                >
                  <span className="font-bold text-slate-900 dark:text-white text-base md:text-lg pr-8 transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    {faq.question}
                  </span>
                  <ChevronDown className={cn(
                    'w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform duration-300 shrink-0',
                    isOpen && 'transform rotate-180 text-purple-600 dark:text-purple-400'
                  )} />
                </button>

                <div 
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-in-out',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Faq;
