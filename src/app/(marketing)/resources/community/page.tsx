"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import { 
  BookOpen, LayoutDashboard, Receipt, Wallet, Database, Terminal, Video, MessageSquare, Search, Sparkles,
  Clock, ChevronRight, Check, FileText, MessageCircle, HelpCircle, GitFork, Users
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

const CHANNELS = [
  {
    title: "Slack Workspace",
    description: "Join 12,000+ developers and RevOps leaders in our Slack workspace. Ask real-time questions, troubleshoot webhooks, and share ideas.",
    stats: "9.4K members online",
    linkText: "Join Slack Chat",
    icon: MessageCircle
  },
  {
    title: "GitHub Discussions",
    description: "Explore community-built SDK extensions, share database schemas, and contribute to open-source Recura plugins.",
    stats: "240+ repositories",
    linkText: "Explore GitHub",
    icon: GitFork
  },
  {
    title: "Billing Roundtables",
    description: "Bi-weekly virtual meetups covering proration logic, revenue recognition standards, and enterprise billing migrations.",
    stats: "Every other Thursday",
    linkText: "Register next session",
    icon: Users
  }
];

const DISCUSSION_TOPICS = [
  {
    title: "Best practice for handling mid-cycle plan upgrades without confusing customers?",
    description: "We're seeing high support ticket volume around plan changes. Looking for the cleanest UX approach that Recura's proration handles automatically...",
    tag: "ANSWERED",
    replies: "14 replies",
    views: "342 views",
    time: "2 hours ago",
    avatars: [
      { initials: "SK", bg: "bg-purple-500" },
      { initials: "JM", bg: "bg-emerald-500" },
      { initials: "AL", bg: "bg-amber-500" }
    ]
  },
  {
    title: "Share your dunning email templates — what's your best-performing copy?",
    description: "After A/B testing 6 different dunning sequences, our recovery rate jumped from 61% to 88%. Here's what changed: subject line, timing, and tone...",
    tag: "DISCUSSION",
    replies: "38 replies",
    views: "1.2K views",
    time: "1 day ago",
    avatars: [
      { initials: "TR", bg: "bg-rose-500" },
      { initials: "MK", bg: "bg-blue-500" }
    ]
  },
  {
    title: "Multiple payment methods per customer — fallback logic?",
    description: "Is there a native way to configure backup payment methods in Recura, or do we need to handle that via API? Looking at enterprise customers who want corporate card + personal card fallback...",
    tag: "FEATURE REQUEST",
    replies: "22 replies",
    views: "890 views",
    time: "3 days ago",
    avatars: [
      { initials: "PL", bg: "bg-indigo-500" },
      { initials: "CM", bg: "bg-cyan-500" },
      { initials: "RO", bg: "bg-emerald-600" }
    ]
  },
  {
    title: "How to handle annual contracts with monthly drawdown against a committed amount?",
    description: "Enterprise customer signed an annual contract for $120K but wants to be invoiced $10K/month against it. How do I model this in Recura without creating 12 separate invoices manually?",
    tag: "ANSWERED",
    replies: "9 replies",
    views: "567 views",
    time: "5 days ago",
    avatars: [
      { initials: "NB", bg: "bg-amber-600" },
      { initials: "ES", bg: "bg-indigo-600" }
    ]
  },
  {
    title: "Recura changelog — June 2025: smart dunning v2, multi-entity GA, new analytics module",
    description: "The Recura team here. This month we shipped a completely rebuilt dunning engine with per-customer override support, general availability of multi-entity billing, and the new revenue analytics module...",
    tag: "ANNOUNCEMENT",
    replies: "47 replies",
    views: "3.4K views",
    time: "1 week ago",
    avatars: [
      { initials: "Re", bg: "bg-primary" }
    ]
  },
  {
    title: "My complete Recura + Salesforce + Slack automation — how I eliminated manual billing ops",
    description: "Sharing the full setup that reduced our billing ops time from 20 hours/month to under 2 hours. Recura webhooks -> Salesforce deals -> Slack digest. Zapier handles the glue...",
    tag: "WORKFLOW",
    replies: "61 replies",
    views: "2.1K views",
    time: "2 weeks ago",
    avatars: [
      { initials: "TA", bg: "bg-emerald-700" },
      { initials: "BK", bg: "bg-rose-600" },
      { initials: "SR", bg: "bg-purple-600" }
    ]
  }
];

export default function CommunityPage() {
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const activeCat = 'community';
  const activeCategory = CATEGORIES.find(cat => cat.id === activeCat);

  const filteredTopics = DISCUSSION_TOPICS.filter(topic => 
    topic.title.toLowerCase().includes(search.toLowerCase()) ||
    topic.description.toLowerCase().includes(search.toLowerCase()) ||
    topic.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="bg-background min-h-screen pt-20">
      <Navbar />

      {/* Hero section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-[#FAF9FF] dark:bg-[#0e0d16] text-left border-b border-slate-200/50 dark:border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[450px] pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.04),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.08),transparent_65%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-widest block mb-4">
            — Community
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4 max-w-3xl">
            Connect with billing experts around the world
          </h1>
          
          <p className="text-sm md:text-base font-semibold text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
            Ask questions, share custom billing strategies, and connect with 12,000+ developers and revenue operations professionals building on Recura.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-8">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              12,000+ members
            </span>
            <span className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-slate-400" />
              40+ integrations shared
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              24h average response
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button className="px-6 py-5 rounded-xl font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer border-0">
              Join our Slack community
            </Button>
            <Button variant="outline" className="px-6 py-5 rounded-xl font-bold border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer bg-white dark:bg-transparent">
              Browse forum topics
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

      {/* Featured Community Channels Section */}
      <section className="py-16 bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {CHANNELS.map((chan, idx) => {
              const IconComp = chan.icon;
              return (
                <div 
                  key={idx} 
                  className="p-6 rounded-2xl border border-slate-200/50 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/15 bg-white dark:bg-[#150a2e] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left"
                >
                  <div>
                    {/* Icon container */}
                    <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/20 text-[#7C3AED] dark:text-[#a78bfa] flex items-center justify-center p-2.5 mb-6">
                      <IconComp className="w-5 h-5 shrink-0" />
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                      {chan.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                      {chan.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4 text-[10px] font-bold">
                    <span className="text-[#7C3AED] dark:text-[#a78bfa]">
                      {chan.stats}
                    </span>
                    <span className="text-slate-400 group-hover:text-slate-600 flex items-center gap-1">
                      {chan.linkText} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Discussion List Section */}
      <section className="py-12 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 max-w-5xl">
          
          {/* Search filter in container */}
          <div className="max-w-xl mx-auto mb-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search community discussions..."
              className="w-full pl-12 pr-16 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 font-semibold text-sm focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 text-slate-900 dark:text-white shadow-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic, idx) => (
                <div 
                  key={idx}
                  className="group p-6 rounded-2xl border border-slate-200/50 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 bg-white dark:bg-[#150a2e] hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Card Top: Tag and Avatars */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Tag */}
                      <span className={cn(
                        "text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5",
                        topic.tag === 'ANSWERED' && "text-emerald-500",
                        topic.tag === 'DISCUSSION' && "text-[#7C3AED] dark:text-[#a78bfa]",
                        topic.tag === 'FEATURE REQUEST' && "text-blue-500",
                        topic.tag === 'ANNOUNCEMENT' && "text-indigo-500",
                        topic.tag === 'WORKFLOW' && "text-teal-500"
                      )}>
                        {topic.tag === 'ANSWERED' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        {topic.tag}
                      </span>

                      {/* Avatars Stack */}
                      <div className="flex items-center -space-x-1.5">
                        {topic.avatars.map((av, avIdx) => (
                          <div 
                            key={avIdx} 
                            className={cn(
                              "w-6.5 h-6.5 rounded-full border border-white dark:border-[#150a2e] flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-sm",
                              av.bg
                            )}
                          >
                            {av.initials}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Middle: Title and Description */}
                    <h3 className="text-sm md:text-base font-extrabold text-slate-800 dark:text-white leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {topic.title}
                    </h3>
                    <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-3">
                      {topic.description}
                    </p>
                  </div>

                  {/* Card Bottom: Metadata */}
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 border-t border-slate-100 dark:border-white/5 pt-4">
                    <span>{topic.replies}</span>
                    <span>•</span>
                    <span>{topic.views}</span>
                    <span>•</span>
                    <span>{topic.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-400 dark:text-slate-600">
                No discussion threads found matching your search.
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

      {/* Newsletter Subscription Banner */}
      <section className="py-16 bg-white dark:bg-transparent border-t border-slate-100 dark:border-white/5">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-[#0B0D14] dark:bg-[#080a0f] rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 text-left border border-white/5">
            <div className="relative z-10 max-w-xl">
              <h3 className="text-xl md:text-2xl font-black text-white mb-2">
                Get the weekly billing digest
              </h3>
              <p className="text-xs md:text-sm font-semibold text-slate-400 leading-relaxed">
                Top community discussions, new guides, and product updates — delivered every Tuesday.
              </p>
            </div>
            
            <div className="relative z-10 w-full md:w-auto shrink-0 flex flex-col sm:flex-row gap-3">
              <input 
                type="email"
                placeholder="name@company.com"
                className="w-full sm:w-64 px-4 py-3 rounded-xl bg-white/5 border border-white/10 font-semibold text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
              />
              <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs transition-all shadow-md shadow-primary/10 cursor-pointer border-0">
                Subscribe
              </button>
            </div>

            {/* Subtle background glow */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
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
