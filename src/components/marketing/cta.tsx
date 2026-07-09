'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

const checkmarks = [
  'No credit card required',
  '14-day free trial',
  'SOC 2 certified',
  'Cancel any time',
];

export function Cta() {
  return (
    <section className="py-24 bg-white dark:bg-transparent overflow-hidden relative border-t border-slate-200/40 dark:border-white/5">
      {/* Background Pattern using same lines SVG as Hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[550px] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.06),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_65%)]" />
        <Image
          src="https://res.cloudinary.com/weburea/image/upload/v1783571760/Grid_hero_lines.svg"
          alt="Background Pattern"
          fill
          className="object-contain opacity-75 dark:opacity-50 pointer-events-none"
        />
      </div>

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

        {/* Action Buttons styled identically to Hero */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          <div className="w-full sm:w-auto">
            <Button 
              variant="primary" 
              className="w-full px-8 py-6 text-lg rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-105 hover:-translate-y-0.5"
            >
              Start free trial
            </Button>
          </div>
          <div className="w-full sm:w-auto">
            <Button 
              variant="outline-brand" 
              className="group w-full px-8 py-6 text-lg rounded-xl font-bold transition-all hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Book a demo</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
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
