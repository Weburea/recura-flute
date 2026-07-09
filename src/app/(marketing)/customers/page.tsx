'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Quote, Compass, Shuffle, Wind, Zap, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';

const HERO_COMPANIES = [
  { name: 'Meridian Labs', icon: Compass, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
  { name: 'Loopify Finance', icon: Shuffle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
  { name: 'Arcflow Creative', icon: Wind, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/20' },
  { name: 'Nexlane', icon: Zap, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' },
  { name: 'Prism Health', icon: HeartPulse, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' },
];

const CASE_STUDIES = [
  {
    stage: 'SAAS • SERIES B • 120 EMPLOYEES',
    letter: 'M',
    bgLetter: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400',
    title: '3.2x revenue growth. How Meridian Labs turned billing chaos into a $12M ARR engine with Recura.',
    desc: "Meridian's finance team was buried under 40 hours of manual reconciliation every month. Recura's automated billing engine replaced it all — dunning, proration, revenue dashboards — giving them the clean data to close their Series B with confidence.",
    statValue: '3.2x',
    statLabel: 'Revenue growth in 18 months',
  },
  {
    stage: 'FINTECH • 65 EMPLOYEES',
    letter: 'L',
    bgLetter: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
    title: '99.8% billing accuracy at scale. How Loopify Finance eliminated billing errors across thousands of tiered subscribers.',
    desc: 'Complex tiered pricing was producing constant billing discrepancies. Recura\'s plan engine handled every edge case — and billing errors dropped to near zero overnight.',
    statValue: '99.8%',
    statLabel: 'Billing accuracy achieved',
  },
  {
    stage: 'AGENCY • 28 EMPLOYEES',
    letter: 'A',
    bgLetter: 'bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400',
    title: '+67% on-time payments. How Arcflow Creative stopped chasing clients and started growing.',
    desc: 'Manual retainer invoicing was costing them clients. Recura automated the entire cycle — on-time payments jumped within the first billing period.',
    statValue: '+67%',
    statLabel: 'On-time payment rate',
  },
  {
    stage: 'SAAS • 14 EMPLOYEES',
    letter: 'N',
    bgLetter: 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
    title: 'Live in one day. How Nexlane launched a full billing stack without a single line of custom code.',
    desc: "Their engineering team had zero bandwidth. Recura's no-code setup had them collecting recurring revenue before the sprint ended.",
    statValue: '1 day',
    statLabel: 'Time to go live',
  },
  {
    stage: 'HEALTHCARE • 200+ EMPLOYEES',
    letter: 'P',
    bgLetter: 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400',
    title: '$4.1M recovered. How Prism Health turned failed payments into a dunning machine.',
    desc: "Thousands of patient subscription plans meant failed payments were constant revenue leaks. Recura's smart dunning sequences sealed them shut.",
    statValue: '$4.1M',
    statLabel: 'Revenue recovered',
  },
  {
    stage: 'EDUCATION • 45 EMPLOYEES',
    letter: 'S',
    bgLetter: 'bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400',
    title: '+41% annual plan conversions. How Studystack made seasonal billing effortless.',
    desc: "Freemium upgrades, annual commitments, seasonal cohorts — Recura's flexible plan engine handled every billing scenario their product team could dream up.",
    statValue: '+41%',
    statLabel: 'Annual plan conversions',
  },
  {
    stage: 'ENTERPRISE • 500+ EMPLOYEES',
    letter: 'C',
    bgLetter: 'bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400',
    title: '18 hours saved per month. How Cloudburst Systems replaced two-day closes with 20-minute financial reporting.',
    desc: "Enterprise contracts, multi-currency billing, and custom reporting requirements had Cloudburst's RevOps team dreading month-end close. Recura's financial reporting layer turned a two-day ordeal into a 20-minute routine — and gave their finance team their weekends back.",
    statValue: '18 hrs',
    statLabel: 'Saved monthly on reporting',
  },
];

const TESTIMONIALS = [
  {
    initials: 'JK',
    name: 'James Kwon',
    title: 'VP of Engineering • Nexlane',
    website: 'nexlane.io',
    url: 'https://nexlane.io',
    icon: Zap,
    quote: "We evaluated six billing platforms. Recura was the only one that felt like it was actually built for how modern SaaS companies operate. The automation is genuinely intelligent — not just scheduled tasks dressed up as a feature."
  },
  {
    initials: 'RM',
    name: 'Rachel Moreau',
    title: 'Head of RevOps • Cloudburst Systems',
    website: 'cloudburst.io',
    url: '#',
    icon: Compass,
    quote: "Our RevOps team used to dread month-end close. With Recura's financial reporting layer, it takes 20 minutes instead of two days. The accuracy and speed are unprecedented."
  },
  {
    initials: 'TO',
    name: 'Taiwo Okafor',
    title: 'CEO • Loopify Finance',
    website: 'loopify.fm',
    url: '#',
    icon: Shuffle,
    quote: "The dunning sequences alone paid for the entire platform in month one. We recovered $180K in revenue that would have simply been lost. It is a game-changer for SaaS businesses."
  }
];

export default function CustomersPage() {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-swipe timer for Quote Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const activeTestimonial = TESTIMONIALS[activeIdx];
  const ActiveIcon = activeTestimonial.icon;

  const row1 = CASE_STUDIES.slice(0, 2);
  const row2 = CASE_STUDIES.slice(2, 5);
  const row3 = CASE_STUDIES.slice(5, 7);

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

        <div className="container relative z-10 mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
            {/* Left side info */}
            <div className="lg:col-span-7 text-left">
              {/* Customer Stories Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/50 dark:bg-white/5 dark:border-white/10 text-xs font-bold shadow-sm mb-6">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full inline-block animate-pulse" />
                <span className="text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  Customer Stories
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
                The billing platform behind the next generation of companies.
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-xl leading-relaxed">
                Discover how thousands of businesses use Recura to automate recurring revenue and scale without limits.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <Button className="w-full sm:w-auto px-8 py-6 rounded-full font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 transition-all duration-300">
                  Read the stories
                </Button>
                <Button className="w-full sm:w-auto px-8 py-6 rounded-full font-bold border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 flex items-center justify-center gap-1.5 transition-all duration-300">
                  <span>Book a demo</span>
                  <span className="text-sm">→</span>
                </Button>
              </div>
            </div>

            {/* Right side stats grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 block mb-1">$2.4B</span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-snug block">Revenue processed annually</span>
              </div>
              <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 block mb-1">98%</span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-snug block">Billing accuracy rate</span>
              </div>
              <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 block mb-1">4.2K</span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-snug block">Active businesses</span>
              </div>
              <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 block mb-1">+32%</span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-snug block">Average revenue growth</span>
              </div>
            </div>
          </div>

          {/* 5 Companies List in One Single Line */}
          <div className="border-t border-slate-200/60 dark:border-white/10 mt-16 pt-8 max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-center lg:justify-between gap-8 md:gap-12">
              {HERO_COMPANIES.map((company, index) => {
                const IconComp = company.icon;
                return (
                  <div key={index} className="flex items-center gap-2.5 opacity-60 hover:opacity-95 transition-opacity duration-300 select-none">
                    <div className={cn("p-2 rounded-xl flex items-center justify-center shadow-sm border border-slate-200/30 dark:border-white/5", company.color)}>
                      <IconComp className="w-5 h-5 shrink-0" />
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{company.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 bg-slate-50/50 dark:bg-transparent border-t border-slate-200/60 dark:border-white/10 overflow-hidden">
        <div className="container mx-auto px-6">
          {/* All Stories Divider Line */}
          <div className="relative mb-20 max-w-7xl mx-auto flex items-center justify-start text-left pt-12">
            <div className="flex items-center gap-4 w-full">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-purple-400 shrink-0">
                All Stories
              </span>
              <div className="h-px flex-1 bg-slate-200/60 dark:bg-purple-500/25" />
            </div>
          </div>

          {/* Asymmetric Cards Grid */}
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {/* Row 1: 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {row1.map((study, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 lg:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative group"
                >
                  <div className="flex flex-col gap-6">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest block uppercase">
                      {study.stage}
                    </span>
                    <div className={cn("w-10 h-10 rounded-xl font-black text-base flex items-center justify-center shadow-inner shrink-0", study.bgLetter)}>
                      {study.letter}
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold leading-snug text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mt-2">
                      {study.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                      {study.desc}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-white/5 pt-6 mt-6 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 block mb-0.5">{study.statValue}</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{study.statLabel}</span>
                    </div>
                    <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                      <span>Read case study</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {row2.map((study, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative group"
                >
                  <div className="flex flex-col gap-6">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest block uppercase">
                      {study.stage}
                    </span>
                    <div className={cn("w-10 h-10 rounded-xl font-black text-base flex items-center justify-center shadow-inner shrink-0", study.bgLetter)}>
                      {study.letter}
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold leading-snug text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mt-2">
                      {study.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                      {study.desc}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-white/5 pt-6 mt-6 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 block mb-0.5">{study.statValue}</span>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{study.statLabel}</span>
                    </div>
                    <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                      <span>Read case study</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 3: 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {row3.map((study, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 lg:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative group"
                >
                  <div className="flex flex-col gap-6">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest block uppercase">
                      {study.stage}
                    </span>
                    <div className={cn("w-10 h-10 rounded-xl font-black text-base flex items-center justify-center shadow-inner shrink-0", study.bgLetter)}>
                      {study.letter}
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold leading-snug text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mt-2">
                      {study.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                      {study.desc}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-white/5 pt-6 mt-6 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 block mb-0.5">{study.statValue}</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{study.statLabel}</span>
                    </div>
                    <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                      <span>Read case study</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote Carousel Section (Dark Theme Accent block) */}
      <section className="w-full py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.1),transparent_60%)] pointer-events-none" />
        
        <style>{`
          @keyframes fadeSlideUp {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-slide {
            animation: fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side active quote display */}
            <div className="lg:col-span-8 text-left flex flex-col items-start">
              <Quote className="w-16 h-16 text-purple-500/20 mb-8 rotate-180" strokeWidth={2.5} />
              
              {/* Stable container height to prevent layouts shifts */}
              <div className="w-full min-h-[220px] md:min-h-[140px] mb-10 overflow-hidden">
                <h2 
                  key={activeIdx}
                  className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-relaxed tracking-tight text-slate-100 animate-fade-slide"
                >
                  {`"${activeTestimonial.quote}"`}
                </h2>
              </div>

              {/* Author & link stacked/side layout */}
              <div key={`author-${activeIdx}`} className="flex items-center gap-4 animate-fade-slide">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {activeTestimonial.initials}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-white text-base leading-snug">{activeTestimonial.name}</span>
                    <span className="text-xs text-slate-400 mt-1 leading-snug">{activeTestimonial.title}</span>
                  </div>
                  <span className="text-slate-600 select-none">|</span>
                  <Link 
                    href={activeTestimonial.url} 
                    target="_blank" 
                    className="inline-flex items-center gap-1.5 text-purple-300 hover:text-purple-400 font-bold transition-all text-xs"
                  >
                    <ActiveIcon className="w-3.5 h-3.5 fill-purple-400 text-purple-400 animate-pulse" />
                    <span>{activeTestimonial.website}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right side sidebar list clicking navigation */}
            <div className="lg:col-span-4 flex flex-col gap-4 w-full">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left mb-2">More Customer Stories</span>
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={cn(
                    "p-5 rounded-2xl border text-left transition-all duration-300 flex items-center gap-4 w-full cursor-pointer focus:outline-none",
                    activeIdx === idx 
                      ? "bg-white/5 border-purple-500/50 shadow-md shadow-purple-500/5"
                      : "bg-transparent border-white/5 hover:bg-white/[0.02]"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center shrink-0 transition-colors duration-300",
                    activeIdx === idx ? "bg-purple-600 text-white" : "bg-white/10 text-slate-300"
                  )}>
                    {t.initials}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block leading-snug">{t.name}</span>
                    <span className="text-xs text-slate-400 font-medium block leading-snug mt-0.5">{t.website}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two smaller review cards */}
      <section className="py-24 bg-slate-50/50 dark:bg-transparent border-t border-slate-200/60 dark:border-white/10 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Review 1 */}
            <div className="bg-white dark:bg-white/[0.01] border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <p className="text-slate-600 dark:text-slate-300 text-base font-semibold leading-relaxed mb-8">
                {`"Our RevOps team used to dread month-end close. With Recura's financial reporting, it takes 20 minutes instead of two days."`}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center">
                  RM
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">Rachel Moreau</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block">Head of RevOps • Cloudburst Systems</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white dark:bg-white/[0.01] border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <p className="text-slate-600 dark:text-slate-300 text-base font-semibold leading-relaxed mb-8">
                {`"The dunning sequences alone paid for the entire platform in month one. We recovered $180K in revenue that would have simply been lost."`}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center">
                  TO
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">Taiwo Okafor</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block">CEO • Loopify Finance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
