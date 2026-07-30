"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import { 
  BookOpen, LayoutDashboard, Receipt, Wallet, Database, Terminal, Video, MessageSquare, Search, Sparkles,
  Clock, ChevronRight, Download, Check, FileText, Building2, ShieldCheck, CheckCircle2, Monitor, Sliders, Shield
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

const FEATURED_CARDS = [
  {
    id: 'multi-entity',
    title: "Multi-entity billing",
    description: "Manage billing across multiple legal entities, subsidiaries, and regional offices from a single consolidated Recura account. Separate tax jurisdictions, currencies, and financial reporting per entity.",
    guidesCount: "8 guides",
    icon: Building2
  },
  {
    id: 'contracts',
    title: "Contract management",
    description: "Custom pricing agreements, milestone billing, minimum commit contracts, and ELA structures. Recura handles every non-standard contract term without custom engineering.",
    guidesCount: "6 guides",
    icon: FileText
  }
];

const GUIDES_LIST = [
  {
    title: "ASC 606 revenue recognition for subscription businesses",
    description: "How Recura automates deferred revenue schedules, recognition entries, and audit-ready reporting to stay GAAP compliant.",
    tag: "Revenue recognition",
    readTime: "14 min",
    icon: CheckCircle2,
    iconBg: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
  },
  {
    title: "Multi-entity billing for global enterprise organizations",
    description: "Manage separate legal entities, currencies, and tax jurisdictions under one consolidated Recura account.",
    tag: "Multi-entity",
    readTime: "11 min",
    icon: Monitor,
    iconBg: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
  },
  {
    title: "Migrating from Chargebee, Stripe Billing, or Zuora to Recura",
    description: "Zero-downtime migration playbook covering data mapping, subscription continuity, and historical revenue preservation.",
    tag: "Migration",
    readTime: "18 min",
    icon: Sliders,
    iconBg: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
  },
  {
    title: "Security, access control, and audit logging in Recura",
    description: "SSO configuration, role-based permissions, API key scoping, and full audit trail setup for enterprise security requirements.",
    tag: "Security",
    readTime: "9 min",
    icon: Shield,
    iconBg: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
  }
];

export default function EnterprisePage() {
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const activeCat = 'enterprise';
  const activeCategory = CATEGORIES.find(cat => cat.id === activeCat);

  const filteredGuides = GUIDES_LIST.filter(guide => 
    guide.title.toLowerCase().includes(search.toLowerCase()) ||
    guide.description.toLowerCase().includes(search.toLowerCase()) ||
    guide.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="bg-background min-h-screen pt-20">
      <Navbar />

      {/* Hero section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-[#F3F2FA] dark:bg-[#0f0d14] text-left border-b border-slate-200/50 dark:border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[450px] pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_65%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <span className="text-[10px] font-bold text-[#7A69BF] uppercase tracking-widest block mb-4">
            — Enterprise
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4 max-w-3xl">
            Billing infrastructure for complex organizations
          </h1>
          
          <p className="text-sm md:text-base font-semibold text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
            Multi-entity structures, custom contract terms, ERP integrations, and compliance frameworks — built for revenue operations teams managing billing at scale.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-8">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              28 guides
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              SOC 2 Type II certified
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button className="px-6 py-5 rounded-xl font-bold bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer border-0">
              Talk to enterprise sales
            </Button>
            <Button variant="outline" className="px-6 py-5 rounded-xl font-bold border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer bg-white dark:bg-transparent">
              Download compliance brief
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

      {/* Featured 2 Cards Grid Section */}
      <section className="py-16 bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {FEATURED_CARDS.map((card) => {
              const IconComp = card.icon;
              return (
                <div 
                  key={card.id} 
                  className="p-6 rounded-2xl border border-slate-200/50 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/15 bg-white dark:bg-[#150a2e] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left"
                >
                  <div>
                    {/* Circle icon marker */}
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-[#7A69BF] dark:text-[#a28cff] flex items-center justify-center p-2.5 mb-6">
                      <IconComp className="w-5 h-5 shrink-0" />
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                      {card.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4 text-[10px] font-bold">
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {card.guidesCount}
                    </span>
                    <span className="text-slate-400 group-hover:text-slate-600 flex items-center gap-1">
                      Explore <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
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
              placeholder="Search enterprise billing..."
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
          <span className="text-[10px] font-bold text-[#A28CFF] uppercase tracking-widest block mb-4">
            Still Have Questions?
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Our billing experts are<br />one message away
          </h2>
          <p className="text-sm md:text-base font-semibold text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            Whether you&apos;re evaluating Recura or already a customer, our team is ready to help you get the most out of automated billing.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 select-none">
            <Button className="w-full sm:w-auto px-8 py-5 rounded-xl font-bold bg-[#7A69BF] hover:bg-[#6858a7] text-white text-xs shadow-lg shadow-[#7A69BF]/10 transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer border-0">
              Talk to an expert
            </Button>
            <Link href="/resources">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-5 rounded-xl font-bold border-white/15 bg-transparent hover:bg-white/10 text-white hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
                Browse all resources
              </Button>
            </Link>
            <Link href="/resources/community">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-5 rounded-xl font-bold border-white/15 bg-transparent hover:bg-white/10 text-white hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
                Join the community
              </Button>
            </Link>
          </div>

          {/* Footer Sub-badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-bold text-slate-400 tracking-wide uppercase">
            <span>340+ help articles</span>
            <span className="text-white/25">•</span>
            <span>120+ API endpoints</span>
            <span className="text-white/25">•</span>
            <span>24/7 chat support</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
