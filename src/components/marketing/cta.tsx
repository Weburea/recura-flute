'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const checkmarks = [
  'No credit card required',
  '14-day free trial',
  'SOC 2 certified',
  'Cancel any time',
];

export function Cta() {
  return (
    <section className="py-24 bg-white dark:bg-transparent overflow-hidden relative border-t border-slate-200/40 dark:border-white/5">
      {/* CSS grid overlay background */}
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(124, 58, 237, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(124, 58, 237, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          backgroundPosition: 'center center',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)',
        }}
      />

      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-100 dark:bg-purple-950/20 blur-[130px] rounded-full pointer-events-none z-0" />

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        {/* Label */}
        <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs tracking-wider uppercase mb-4 block">
          Get Started Today
        </span>

        {/* Heading */}
        <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
          Revenue that <span className="text-purple-600 dark:text-purple-400">runs itself.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Join 12,000+ businesses that simplified their billing. Up and running in under 15 minutes.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          <Button 
            className="w-full sm:w-auto py-6 px-8 rounded-full font-bold bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white transition-all duration-300 shadow-md shadow-purple-600/10 text-base"
          >
            Start free trial
          </Button>
          <Button 
            variant="outline"
            className="w-full sm:w-auto py-6 px-8 rounded-full font-bold bg-white dark:bg-transparent border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-1.5 text-base"
          >
            <span>Book a demo</span>
            <span className="text-sm">→</span>
          </Button>
        </div>

        {/* Checkmarks List */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-slate-500 dark:text-slate-400 text-sm font-semibold">
          {checkmarks.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" strokeWidth={3} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Cta;
