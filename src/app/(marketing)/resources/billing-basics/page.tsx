"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import { 
  BookOpen, LayoutDashboard, Receipt, Wallet, Database, Terminal, Video, MessageSquare, Search, Sparkles,
  Clock, ChevronRight, Download, Check, RefreshCw, Sliders, BarChart3, CheckCircle2, Users, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  { id: 'all', name: 'All resources', icon: BookOpen, path: '/resources' },
  { id: 'basics', name: 'Billing basics', icon: LayoutDashboard, path: '/resources/billing-basics' },
  { id: 'ops', name: 'Invoicing operations', icon: Receipt, path: '/resources/invoicing-operations' },
  { id: 'payments', name: 'Payment collection', icon: Wallet, path: '/resources/payment-collection' },
  { id: 'enterprise', name: 'Enterprise', icon: Database, path: '/resources/enterprise' },
  { id: 'devs', name: 'API & Developers', icon: Terminal, path: '/resources/api-developers' },
  { id: 'videos', name: 'Video tutorials', icon: Video, path: '/resources/video-tutorials' },
  { id: 'community', name: 'Community', icon: MessageSquare, path: '/resources/community' }
];

const GUIDES_LIST = [
  {
    title: "How recurring billing cycles work — monthly, annual, and usage-based",
    description: "Billing cycle types, proration triggers, and how Recura calculates each invoice automatically.",
    tag: "Core concepts",
    readTime: "8 min",
    icon: RefreshCw,
    iconBg: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
  },
  {
    title: "Proration explained: when and how Recura calculates mid-cycle charges",
    description: "Upgrades, downgrades, seat changes, and trial-to-paid conversions — how every proration scenario is handled.",
    tag: "Proration",
    readTime: "9 min",
    icon: Wallet,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
  },
  {
    title: "Designing usage-based pricing models that scale",
    description: "Metered billing, tiered consumption pricing, and hybrid plans — when to use each model and how to configure it.",
    tag: "Pricing",
    readTime: "9 min",
    icon: Sliders,
    iconBg: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
  },
  {
    title: "Free trial best practices: length, conversion triggers, and credit card requirements",
    description: "Data-backed decisions on trial design and how Recura automates trial-to-paid conversion flows.",
    tag: "Plan management",
    readTime: "7 min",
    icon: BarChart3,
    iconBg: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
  },
  {
    title: "Understanding subscription statuses: active, trialing, past due, cancelled, paused",
    description: "Every subscription state in Recura, what triggers each transition, and how to build workflows around status changes.",
    tag: "Core concepts",
    readTime: "6 min",
    icon: CheckCircle2,
    iconBg: "bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400"
  },
  {
    title: "Managing add-ons and quantity-based billing for SaaS teams",
    description: "Configure seat-based pricing, add-on products, and per-unit charges that adjust automatically when teams grow.",
    tag: "Plan management",
    readTime: "8 min",
    icon: Users,
    iconBg: "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
  }
];

export default function BillingBasicsPage() {
  const [search, setSearch] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const activeCat = 'basics';
  const activeCategory = CATEGORIES.find(cat => cat.id === activeCat);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1500);
  };

  const filteredGuides = GUIDES_LIST.filter(guide => 
    guide.title.toLowerCase().includes(search.toLowerCase()) ||
    guide.description.toLowerCase().includes(search.toLowerCase()) ||
    guide.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="bg-background min-h-screen pt-20">
      <Navbar />

      {/* Hero section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-[#FCF9F2] dark:bg-[#12110f] text-left border-b border-slate-200/50 dark:border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[450px] pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(218,165,32,0.04),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(218,165,32,0.08),transparent_65%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <span className="text-[10px] font-bold text-[#C2780E] dark:text-[#E0A94F] uppercase tracking-widest block mb-4">
            — Billing Basics
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4 max-w-3xl">
            The foundations of subscription billing
          </h1>
          
          <p className="text-sm md:text-base font-semibold text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
            Start here. Everything you need to understand subscription models, billing cycles, proration, and recurring revenue — before you configure a single setting.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-8">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              48 guides
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Beginner to advanced
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button className="px-6 py-5 rounded-xl font-bold bg-[#C2780E] hover:bg-[#A06207] text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer border-0">
              Start learning
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="px-6 py-5 rounded-xl font-bold border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer bg-white dark:bg-transparent"
            >
              {downloading ? (
                "Preparing PDF..."
              ) : downloadSuccess ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  PDF Downloaded
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  Download PDF guide
                </span>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Categories Navigation tabs bar */}
      <section className="border-b border-slate-200/60 dark:border-white/10 bg-slate-50/50 dark:bg-black/10 select-none py-3 md:py-0">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Desktop tabs view */}
          <div className="hidden md:flex items-center gap-6 pt-4">
            {CATEGORIES.map((cat) => {
              const isActive = activeCat === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={cat.path}
                  className={cn(
                    "pb-3.5 -mb-px flex items-center gap-2 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer",
                    isActive
                      ? "text-primary border-primary"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border-transparent"
                  )}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile custom dropdown view */}
          <div className="md:hidden relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#150a2e] font-bold text-xs text-slate-850 dark:text-white cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2">
                {activeCategory && <activeCategory.icon className="w-4 h-4 text-primary" />}
                <span>{activeCategory ? activeCategory.name : 'Select category'}</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform text-slate-405", dropdownOpen && "rotate-90")} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 z-30 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#150a2e] shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCat === cat.id;
                  return (
                    <Link
                      key={cat.id}
                      href={cat.path}
                      onClick={() => setDropdownOpen(false)}
                      className={cn(
                        "w-full px-4 py-3 flex items-center gap-3 text-xs font-bold transition-colors cursor-pointer",
                        isActive
                          ? "bg-slate-50 dark:bg-white/5 text-primary"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                      )}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span>{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Guide Section */}
      <section className="py-16 bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Featured Card Wrapper */}
          <div className="rounded-3xl border border-slate-200/60 dark:border-white/15 overflow-hidden bg-white dark:bg-[#150a2e] shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Column: Text */}
            <div className="p-8 lg:p-12 flex flex-col justify-between text-left">
              <div>
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mb-4">
                  Featured Guide
                </span>
                
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                  The complete guide to recurring revenue metrics: MRR, ARR, churn, NRR
                </h2>
                
                <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  Understand every metric that matters for subscription businesses. From calculating MRR correctly to interpreting net revenue retention — this guide explains it all in plain language.
                </p>
              </div>

              {/* Tags & Read Time */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/40">
                  Revenue metrics
                </span>
                <span className="px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                  MRR
                </span>
                <span className="px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                  Churn
                </span>
                <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  15 min read
                </span>
              </div>
            </div>

            {/* Right Column: Premium scaled-down Device Video Mockup */}
            <div className="bg-[#F8F9FC] dark:bg-white/[0.01] border-l border-slate-200/50 dark:border-white/5 p-8 flex items-center justify-center relative overflow-hidden select-none">
              
              <style>{`
                @keyframes rotate-gradient-featured {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .glow-light-featured {
                  background: conic-gradient(from 0deg, transparent 46%, #C2780E 48%, #ffffff 50%, #C2780E 52%, transparent 54%);
                }
                .glow-dark-featured {
                  background: conic-gradient(from 0deg, transparent 47%, #ffffff 49%, #ffffff 50%, #ffffff 51%, transparent 53%);
                }
              `}</style>

              {/* Small Device Bezel Container */}
              <div className="relative w-full max-w-[420px] p-[4.5px] border-[2px] border-slate-900 dark:border-primary bg-slate-900 dark:bg-primary rounded-xl shadow-xl">
                {/* Rotating Border Gradient */}
                <div 
                  className="absolute inset-[-150%] pointer-events-none z-0 block dark:hidden glow-light-featured"
                  style={{
                    animation: 'rotate-gradient-featured 10s linear infinite',
                  }}
                />
                <div 
                  className="absolute inset-[-150%] pointer-events-none z-0 hidden dark:block glow-dark-featured"
                  style={{
                    animation: 'rotate-gradient-featured 10s linear infinite',
                  }}
                />
                
                {/* Inner bezel mask */}
                <div className="absolute inset-[1.5px] bg-slate-900 dark:bg-primary rounded-[9px] z-10 pointer-events-none" />

                {/* Device Inner screen */}
                <div className="relative z-20 rounded-lg overflow-hidden bg-slate-950">
                  <video
                    src="https://res.cloudinary.com/weburea/video/upload/v1783741189/qiik8ltjwb7vixknhrku.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* List of Guides Section */}
      <section className="py-12 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 max-w-5xl">
          
          {/* Search filter in container */}
          <div className="max-w-xl mx-auto mb-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search billing basics..."
              className="w-full pl-12 pr-16 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 font-semibold text-sm focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 text-slate-900 dark:text-white shadow-sm transition-all"
            />
          </div>

          <div className="space-y-4">
            {filteredGuides.length > 0 ? (
              filteredGuides.map((guide, idx) => {
                const IconComponent = guide.icon;
                return (
                  <div 
                    key={idx}
                    className="group p-5 rounded-2xl border border-slate-200/50 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 bg-white dark:bg-[#150a2e] hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-5 text-left cursor-pointer"
                  >
                    {/* Left side circular icon */}
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center p-3 shrink-0 transition-transform group-hover:scale-105 duration-300", guide.iconBg)}>
                      <IconComponent className="w-6 h-6 shrink-0" />
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-primary transition-colors mb-1">
                        {guide.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2 sm:line-clamp-1">
                        {guide.description}
                      </p>
                    </div>

                    {/* Right side tag and actions */}
                    <div className="flex items-center gap-4 shrink-0 sm:self-center self-start">
                      <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-wider uppercase bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                        {guide.tag}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        {guide.readTime}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 transition-transform group-hover:translate-x-1 duration-200 shrink-0" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400 dark:text-slate-600">
                No guides found matching your filter criteria.
              </div>
            )}
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-center items-center gap-2 mt-12 select-none">
            <button className="w-9 h-9 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs bg-slate-950 text-white cursor-pointer hover:bg-slate-900">
              1
            </button>
            <button className="w-9 h-9 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
              2
            </button>
            <button className="w-9 h-9 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
              3
            </button>
            <button className="w-9 h-9 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Still Have Questions Banner Section */}
      <section className="py-24 bg-[#0A0D14] dark:bg-[#07090e] border-t border-b border-white/5 relative overflow-hidden text-center">
        {/* Background Pattern using same lines SVG as main page */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[550px] z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(162,140,255,0.12),transparent_65%)]" />
          <Image
            src="https://res.cloudinary.com/weburea/image/upload/v1783571760/Grid_hero_lines.svg"
            alt="Background Pattern"
            fill
            className="object-contain opacity-35 pointer-events-none"
            priority
          />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-4xl">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-4">
            Still Have Questions?
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Our billing experts are one message away
          </h2>
          <p className="text-sm md:text-base font-semibold text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            Whether you&apos;re evaluating Recura or already a customer, our team is ready to help you get the most out of automated billing.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
            <Button className="px-6 py-5 rounded-xl font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer border-0">
              Talk to an expert
            </Button>
            <Link href="/resources">
              <Button variant="outline" className="px-6 py-5 rounded-xl font-bold border-white/15 bg-transparent hover:bg-white/10 text-white hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
                Browse all resources
              </Button>
            </Link>
            <Link href="/resources/community">
              <Button variant="outline" className="px-6 py-5 rounded-xl font-bold border-white/15 bg-transparent hover:bg-white/10 text-white hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
                Join the community
              </Button>
            </Link>
          </div>

          {/* Footer Sub-badges */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>340+ help articles</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span>120+ API endpoints</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span>24/7 chat support</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
