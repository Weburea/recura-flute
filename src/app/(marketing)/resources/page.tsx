"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, Clock, ChevronRight, Download, Check, Copy,
  LayoutDashboard, Users, Receipt, Wallet, BarChart3,
  Sliders, Database, RefreshCw, HelpCircle, CheckCircle2,
  FileText, Sparkles, BookOpen, Video, Terminal, MessageSquare,
  Mail, Phone, GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';

// Quick badges below search
const SEARCH_TAGS = ["Dunning automation", "Proration", "Tax compliance", "Webhooks", "Revenue recognition", "Migration"];

// Categories tabs
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

// ----------------------------------------------------
// New Resources Sections Data
// ----------------------------------------------------
const FORMATS = [
  {
    id: 'docs',
    title: 'Help documentation',
    desc: 'In-depth articles covering every Recura feature and module — from setting up your first subscription plan to configuring multi-entity revenue recognition. Organized by workflow, searchable, and updated with every release.',
    linkText: 'Browse docs',
    metrics: [
      { value: '340+', label: 'Articles' },
      { value: '24', label: 'Categories' },
      { value: 'Weekly', label: 'Updates' }
    ],
    icon: FileText,
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500',
    span: 'lg:col-span-2'
  },
  {
    id: 'videos',
    title: 'Video tutorials',
    desc: "Step-by-step screen recordings walking through Recura's dashboard, from your first integration to advanced revenue reporting.",
    linkText: 'Watch now',
    metrics: [
      { value: '85 videos', label: '' }
    ],
    icon: Video,
    iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-500',
    span: 'lg:col-span-1'
  },
  {
    id: 'api',
    title: 'API reference',
    desc: 'Complete REST API documentation with live request builders, response schemas, and SDKs in 5 languages.',
    linkText: 'View API',
    metrics: [
      { value: '120+ endpoints', label: '' }
    ],
    icon: Terminal,
    iconBg: 'bg-slate-900 text-white dark:bg-white/10 dark:text-white',
    span: 'lg:col-span-1'
  },
  {
    id: 'faqs',
    title: 'FAQs',
    desc: 'Quick answers to the most common questions about billing, plans, security, and account management.',
    linkText: 'Get answers',
    metrics: [
      { value: '180+ answers', label: '' }
    ],
    icon: HelpCircle,
    iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-500',
    span: 'lg:col-span-1'
  },
  {
    id: 'guides',
    title: 'Business guides',
    desc: 'Strategic playbooks on pricing models, churn reduction, and scaling recurring revenue from billing experts.',
    linkText: 'Explore',
    metrics: [
      { value: '60+ guides', label: '' }
    ],
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500',
    span: 'lg:col-span-1'
  },
  {
    id: 'forum',
    title: 'Community forum',
    desc: 'Connect with other Recura users, share workflows, and get answers directly from the product team.',
    linkText: 'Join now',
    metrics: [
      { value: '12K members', label: '' }
    ],
    icon: MessageSquare,
    iconBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-500',
    span: 'lg:col-span-1'
  },
  {
    id: 'blog',
    title: 'Blog',
    desc: 'Product updates, billing industry insights, and behind-the-scenes looks at how Recura is built.',
    linkText: 'Read blog',
    metrics: [
      { value: 'New weekly', label: '' }
    ],
    icon: Sparkles,
    iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-500',
    span: 'lg:col-span-1'
  },
  {
    id: 'migration',
    title: 'Migration center',
    desc: 'Step-by-step playbooks for moving from Stripe Billing, Chargebee, Zuora, or any custom billing system.',
    linkText: 'Start migrating',
    metrics: [
      { value: '8 platforms', label: '' }
    ],
    icon: RefreshCw,
    iconBg: 'bg-violet-50 dark:bg-violet-950/40 text-violet-500',
    span: 'lg:col-span-1'
  }
];

const GUIDE_CATEGORIES = [
  "All topics",
  "Billing basics",
  "Invoicing",
  "Payments",
  "Tax & compliance",
  "Revenue recognition",
  "Enterprise"
] as const;

const POPULAR_GUIDES = [
  {
    title: "How recurring billing cycles work — monthly, annual, and usage-based",
    desc: "A foundational walkthrough of billing cycle types, proration triggers, and how Recura calculates each invoice automatically.",
    category: "Billing basics",
    readTime: "8 min read",
    icon: RefreshCw,
    iconBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
  },
  {
    title: "Setting up automated invoice generation and delivery",
    desc: "Configure invoice templates, scheduling, tax line items, and multi-language delivery for your customer base.",
    category: "Invoicing",
    readTime: "6 min read",
    icon: Receipt,
    iconBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
  },
  {
    title: "Reducing involuntary churn with smart payment retries",
    desc: "Configure 11-step dunning sequences, card updater integrations, and intelligent retry timing based on decline codes.",
    category: "Payments",
    readTime: "12 min read",
    icon: Wallet,
    iconBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
  },
  {
    title: "Automated tax calculation: VAT, GST, and US sales tax",
    desc: "How Recura determines tax jurisdiction, applies the correct rate, and generates compliant tax reports automatically.",
    category: "Tax & compliance",
    readTime: "10 min read",
    icon: FileText,
    iconBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
  },
  {
    title: "ASC 606 revenue recognition for subscription businesses",
    desc: "A practical walkthrough of how Recura automates deferred revenue schedules and recognition entries to stay compliant.",
    category: "Revenue recognition",
    readTime: "14 min read",
    icon: BarChart3,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
  },
  {
    title: "Multi-entity billing for global enterprise organizations",
    desc: "Manage separate legal entities, currencies, and tax jurisdictions under one consolidated Recura account.",
    category: "Enterprise",
    readTime: "11 min read",
    icon: Database,
    iconBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
  },
  {
    title: "Designing usage-based pricing models that scale",
    desc: "Metered billing, tiered consumption pricing, and hybrid plans — when to use each model and how to configure it in Recura.",
    category: "Billing basics",
    readTime: "9 min read",
    icon: Sliders,
    iconBg: "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400"
  }
] as const;

const DEV_ENDPOINTS = [
  {
    id: 'list-subs',
    method: 'GET',
    path: '/v1/subscriptions',
    label: 'List subscriptions',
    filename: 'list-subscriptions.js',
    code: `// List all active subscriptions
const subscriptions = await recura.subscriptions.list({
  status: 'active',
  limit: 10
});

console.log(\`Found \${subscriptions.data.length} active subs\`);`
  },
  {
    id: 'create-sub',
    method: 'POST',
    path: '/v1/subscriptions',
    label: 'Create subscription',
    filename: 'create-subscription.js',
    code: `// Create a subscription with proration
const subscription = await recura.subscriptions.create({
  customer_id: 'cus_8f3a1b2c',
  plan_id: 'plan_growth_annual',
  proration_behavior: 'create_prorations',
  trial_period_days: 14,
  metadata: { source: 'self_serve_upgrade' }
});

// Response - 201 Created
// {
//   "id": "sub_4f8e2a1d",
//   "status": "trialing",
//   "current_period_end": "2026-01-28",
//   "mrr_impact": 299.00
// }`
  },
  {
    id: 'update-sub',
    method: 'PUT',
    path: '/v1/subscriptions/:id',
    label: 'Update plan',
    filename: 'update-subscription.js',
    code: `// Update plan (upgrade/downgrade)
const subscription = await recura.subscriptions.update(
  'sub_4f8e2a1d', 
  {
    plan_id: 'plan_enterprise_monthly',
    proration_behavior: 'always_invoice'
  }
);

console.log(\`New status: \${subscription.status}\`);`
  },
  {
    id: 'retrieve-inv',
    method: 'GET',
    path: '/v1/invoices/:id',
    label: 'Retrieve invoice',
    filename: 'retrieve-invoice.js',
    code: `// Retrieve invoice details and PDF URL
const invoice = await recura.invoices.retrieve(
  'inv_2048'
);

console.log(\`PDF: \${invoice.pdf_url}\`);`
  }
] as const;

function highlightCode(code: string) {
  if (!code) return null;
  
  const tokens = code.split(/(\/\/.*|#.*|"[^"]*"|'[^']*'|\b(?:const|let|var|async|await|switch|case|break|return|import|package|func|default|type|struct|from|def|if|elif|else|in|class|and|or|not)\b|\b(?:list|create|update|retrieve|log)\b|[a-zA-Z_]\w*|[^\s\w]+|\s+)/g);
  
  return tokens.map((part, index) => {
    if (!part) return null;
    
    if (part.startsWith('//')) {
      return <span key={index} className="text-slate-500 font-normal italic">{part}</span>;
    }
    if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
      return <span key={index} className="text-[#c3e88d]">{part}</span>;
    }
    if (/^(const|let|var|async|await|switch|case|break|return|import|package|func|default|type|struct|from|def|if|elif|else|in|class|and|or|not)$/.test(part)) {
      return <span key={index} className="text-[#c792ea] font-bold">{part}</span>;
    }
    if (/^(list|create|update|retrieve|log)$/.test(part)) {
      return <span key={index} className="text-[#82aaff] font-semibold">{part}</span>;
    }
    return <span key={index} className="text-slate-400">{part}</span>;
  });
}

// CountUp Helper Component
function CountUp({ value, prefix = "", duration = 500 }: { value: number; prefix?: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  
  useEffect(() => {
    const start = prevValueRef.current;
    const end = value;
    prevValueRef.current = value;
    if (start === end) return;
    
    const range = end - start;
    let current = start;
    const increment = end > start ? Math.ceil(range / 15) : Math.floor(range / 15);
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / 15);
    
    return () => clearInterval(timer);
  }, [value, duration]);

  const formatNumber = (num: number) => {
    return prefix + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return <span>{formatNumber(displayValue)}</span>;
}

// ----------------------------------------------------
// Card 1: Billing Basics (Mini Dashboard Simulator)
// ----------------------------------------------------
function BillingBasicsSim() {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'invoices' | 'payments'>('invoices');
  const [growthScale, setGrowthScale] = useState<'standard' | 'high' | 'low'>('standard');

  // Auto-cycling active tab and settings
  useEffect(() => {
    const tabs: ('overview' | 'customers' | 'invoices' | 'payments')[] = ['invoices', 'overview', 'customers', 'payments'];
    const scales: ('standard' | 'high' | 'low')[] = ['standard', 'high', 'low'];
    
    let tabIdx = 0;
    let scaleIdx = 0;
    
    const interval = setInterval(() => {
      tabIdx = (tabIdx + 1) % tabs.length;
      setActiveTab(tabs[tabIdx]);
      
      // Periodically toggle custom mode and scales
      if (tabIdx === 0) {
        scaleIdx = (scaleIdx + 1) % scales.length;
        setGrowthScale(scales[scaleIdx]);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Dynamic values depending on config
  const getValues = () => {
    if (growthScale === 'high') {
      return {
        total: 56420.00,
        paid: 48250.00,
        overdue: 5120.00,
        unpaid: 3050.00,
        paidPct: 'w-[85.5%]',
        overduePct: 'w-[9.1%]',
        unpaidPct: 'w-[5.4%]'
      };
    }
    if (growthScale === 'low') {
      return {
        total: 8750.00,
        paid: 6500.00,
        overdue: 1250.00,
        unpaid: 1000.00,
        paidPct: 'w-[74.2%]',
        overduePct: 'w-[14.3%]',
        unpaidPct: 'w-[11.5%]'
      };
    }
    return {
      total: 24980.00,
      paid: 18760.00,
      overdue: 4120.00,
      unpaid: 2100.00,
      paidPct: 'w-[75.1%]',
      overduePct: 'w-[16.5%]',
      unpaidPct: 'w-[8.4%]'
    };
  };

  const currentValues = getValues();

  return (
    <div className="w-full bg-slate-50 dark:bg-black/40 rounded-t-2xl border-b border-slate-100 dark:border-white/5 p-4 select-none h-[280px] flex flex-col justify-between">
      {/* Simulation Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Interactive Dashboard Simulator
        </span>
      </div>

      {/* Settings Panel (Always visible) */}
      <div className="mb-3 p-2 bg-white dark:bg-[#150a2e] rounded-xl border border-slate-200/50 dark:border-white/10 flex items-center justify-between gap-2 animate-in slide-in-from-top-2 duration-200 shrink-0">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Scale growth model:</span>
        <div className="flex gap-1.5">
          {(['low', 'standard', 'high'] as const).map((scale) => (
            <button
              key={scale}
              onClick={() => setGrowthScale(scale)}
              className={cn(
                "px-2 py-0.5 rounded-md text-[9px] font-extrabold capitalize cursor-pointer",
                growthScale === scale
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-slate-600"
              )}
            >
              {scale}
            </button>
          ))}
        </div>
      </div>

      {/* Main Mini SaaS Simulator App */}
      <div className="bg-white dark:bg-[#0D0518] rounded-xl border border-slate-200/60 dark:border-white/10 overflow-hidden shadow-sm flex flex-1 min-h-0">
        {/* Simulator Sidebar */}
        <div className="w-[35%] border-r border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10 p-1.5 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[9px] font-black text-primary px-1 block mb-1">Recura</span>
            <div className="space-y-0.5">
              {([
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'invoices', label: 'Invoices', icon: Receipt },
                { id: 'payments', label: 'Payments', icon: Wallet }
              ] as const).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full text-left px-1.5 py-1 rounded-md flex items-center gap-1 text-[8.5px] font-bold transition-colors cursor-pointer whitespace-nowrap",
                    activeTab === item.id 
                      ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white" 
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  )}
                >
                  <item.icon className="w-2.5 h-2.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600 px-1">v2.1</span>
        </div>

        {/* Simulator Content Area */}
        <div className="w-[65%] p-3 flex flex-col justify-between overflow-y-auto no-scrollbar">
          {activeTab === 'invoices' && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <div className="flex items-end justify-between border-b border-slate-50 dark:border-white/5 pb-1">
                <div>
                  <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Invoices</span>
                  <h4 className="text-[11px] font-black text-slate-800 dark:text-white mt-0.5">Total billed</h4>
                </div>
                <div className="text-right text-[12px] font-black text-primary">
                  <CountUp value={currentValues.total} prefix="$" />
                </div>
              </div>

              {/* Ratios & progress bars */}
              <div className="space-y-1.5 text-[9px]">
                <div className="space-y-0.5">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Paid</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">
                      <CountUp value={currentValues.paid} prefix="$" />
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className={cn("bg-emerald-500 h-full rounded-full transition-all duration-500", currentValues.paidPct)} />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> Overdue</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">
                      <CountUp value={currentValues.overdue} prefix="$" />
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className={cn("bg-rose-500 h-full rounded-full transition-all duration-500", currentValues.overduePct)} />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Unpaid / Draft</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">
                      <CountUp value={currentValues.unpaid} prefix="$" />
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className={cn("bg-amber-500 h-full rounded-full transition-all duration-500", currentValues.unpaidPct)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Overview</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="p-1.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider block">MRR Model</span>
                  <span className="text-[12px] font-black text-slate-900 dark:text-white">
                    <CountUp value={currentValues.total * 4} prefix="$" />
                  </span>
                </div>
                <div className="p-1.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider block">Active Users</span>
                  <span className="text-[12px] font-black text-slate-900 dark:text-white">
                    {growthScale === 'high' ? "2,482" : growthScale === 'low' ? "410" : "1,284"}
                  </span>
                </div>
              </div>
              <div className="h-6 w-full mt-1 flex items-end justify-between gap-1.5">
                {[4, 6, 5, 8, 7, 9, 8, 12].map((h, i) => (
                  <div 
                    key={i} 
                    style={{ height: `${h * 8}%` }} 
                    className="bg-primary/20 dark:bg-primary/30 w-full rounded-sm transition-all duration-300 hover:bg-primary" 
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-1 animate-in fade-in duration-200 text-[8px]">
              <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1">Customers</span>
              {[
                { name: 'Wayne Enterprises', plan: 'Enterprise', status: 'Active', color: 'text-emerald-500' },
                { name: 'Stark Industries', plan: 'Enterprise', status: 'Trial', color: 'text-indigo-400' },
                { name: 'Acme Corp', plan: 'Starter', status: 'Overdue', color: 'text-rose-500' }
              ].map((cust) => (
                <div key={cust.name} className="flex items-center justify-between p-1 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{cust.name}</span>
                  <div className="flex gap-2 font-bold">
                    <span className="text-slate-400">{cust.plan}</span>
                    <span className={cust.color}>{cust.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-1 animate-in fade-in duration-200 text-[8px]">
              <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1">Payment logs</span>
              {[
                { id: '#INV-2048', amt: '$2,540.00', status: 'Succeeded', color: 'text-emerald-500', dot: 'bg-emerald-500' },
                { id: '#INV-2047', amt: '$4,120.00', status: 'Failed', color: 'text-rose-500', dot: 'bg-rose-500' },
                { id: '#INV-2046', amt: '$12,410.00', status: 'Retrying', color: 'text-amber-500', dot: 'bg-amber-500 animate-pulse' }
              ].map((log) => (
                <div key={log.id} className="flex items-center justify-between p-1">
                  <div className="flex items-center gap-1">
                    <span className={cn("w-1.5 h-1.5 rounded-full", log.dot)} />
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">{log.id}</span>
                  </div>
                  <span className="font-semibold text-slate-400">{log.amt}</span>
                  <span className={cn("font-bold", log.color)}>{log.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Card 2: Payment Collection (Interactive Dunning Sequence Player)
// ----------------------------------------------------
const DUNNING_STEPS = [
  { day: "Day 1", title: "Email 1 Sent", detail: "Friendly payment reminder", fee: 0, status: "Sent", overdueBadge: "Overdue" },
  { day: "Day 3", title: "Automated Retry", detail: "Retrying card... Failed (NSF)", fee: 0, status: "Decline", overdueBadge: "Overdue" },
  { day: "Day 7", title: "Email 2 + Fee", detail: "$50 late fee applied", fee: 50, status: "Sent", overdueBadge: "Overdue" },
  { day: "Day 14", title: "Final Notice", detail: "Suspension warning & 3DS challenge", fee: 50, status: "Pending 3DS", overdueBadge: "Critical" },
  { day: "Day 15", title: "Payment Cleared!", detail: "Payment received & recovered!", fee: 50, status: "Paid", overdueBadge: "Recovered" }
];

function DunningSim() {
  const [currentStep, setCurrentStep] = useState(0);

  // Auto-playing dunning sequence loop
  useEffect(() => {
    let activeStepIdx = 0;
    let timer: NodeJS.Timeout;

    const runDunningStep = () => {
      setCurrentStep(activeStepIdx);
      
      // If it's the final success step, stay for 4.5 seconds, otherwise 2.2 seconds
      const delay = activeStepIdx === DUNNING_STEPS.length - 1 ? 4500 : 2200;
      
      timer = setTimeout(() => {
        activeStepIdx = (activeStepIdx + 1) % DUNNING_STEPS.length;
        runDunningStep();
      }, delay);
    };

    runDunningStep();

    return () => clearTimeout(timer);
  }, []);

  const activeStep = DUNNING_STEPS[currentStep];
  const overdueAmount = activeStep.status === "Paid" ? 0 : (2540.00 + activeStep.fee);

  return (
    <div className="w-full bg-slate-50 dark:bg-black/40 rounded-t-2xl border-b border-slate-100 dark:border-white/5 p-4 select-none h-[280px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Automated Dunning Sequence
        </span>
        <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Live Simulation</span>
        </div>
      </div>

      {/* Overdue Payment Card Simulator */}
      <div className="bg-white dark:bg-[#0D0518] rounded-xl border border-slate-200/60 dark:border-white/10 p-3 flex-1 my-3 flex flex-col justify-between shadow-sm relative">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Payment Reminder</span>
            <h4 className="text-[11px] font-bold text-slate-800 dark:text-white mt-0.5">Invoice #INV-2048 is overdue</h4>
          </div>
          <span className={cn(
            "text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border tracking-wide uppercase",
            activeStep.status === "Paid" 
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/40"
              : activeStep.overdueBadge === "Critical"
                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/40 animate-pulse"
                : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/40"
          )}>
            {activeStep.overdueBadge}
          </span>
        </div>

        <div className="space-y-1 py-1">
          <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 leading-normal">
            {activeStep.status === "Paid" 
              ? "Success! Payment processed and subscription recovered." 
              : `Hi Acme Corp, this is a reminder that invoice #INV-2048 is overdue. Status: ${activeStep.detail}`}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-50 dark:border-white/5 pt-2">
          <div className="text-[9px] font-semibold text-slate-400 dark:text-slate-500">
            Dunning: <span className="font-extrabold text-primary">{activeStep.day}</span>
          </div>
          <div className="text-right text-[11px] font-black text-slate-800 dark:text-white">
            Amount Due: <span className={cn(activeStep.status === "Paid" ? "text-emerald-500" : "text-rose-500")}>
              <CountUp value={overdueAmount} prefix="$" />
            </span>
          </div>
        </div>
      </div>

      {/* Step Stepper Indicator */}
      <div className="mt-3 flex items-center justify-between gap-1 relative px-1">
        <div className="absolute top-[5px] left-3 right-3 h-[1px] bg-slate-200 dark:bg-white/5 z-0" />
        {DUNNING_STEPS.map((step, idx) => (
          <div
            key={idx}
            className="relative z-10 flex flex-col items-center gap-1"
          >
            <div className={cn(
              "w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-all duration-300",
              idx === currentStep 
                ? "bg-primary border-primary scale-110 shadow-sm" 
                : idx < currentStep 
                  ? "bg-emerald-500 border-emerald-500"
                  : "bg-white dark:bg-[#150a2e] border-slate-200 dark:border-white/10"
            )}>
              {idx < currentStep && <Check className="w-1.5 h-1.5 text-white" />}
            </div>
            <span className={cn(
              "text-[7px] font-bold tracking-tight",
              idx === currentStep ? "text-primary font-black" : "text-slate-400 dark:text-slate-600"
            )}>
              {step.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Card 3: Featured Guide (Metrics Area Chart Hover Tracker & Morphing)
// ----------------------------------------------------
const METRICS_DATA = {
  mrr: {
    label: "Recurring revenue",
    badge: "MRR",
    badgeColor: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200/40",
    prefix: "$",
    values: [85000, 92000, 105000, 112000, 120000, 128540],
    growth: ["+5.2%", "+8.2%", "+14.1%", "+6.6%", "+7.1%", "+12.4%"],
    points: "M 0 60 C 20 50, 40 55, 60 30 C 80 15, 100 20, 120 5 L 120 80 L 0 80 Z",
    stroke: "M 0 60 C 20 50, 40 55, 60 30 C 80 15, 100 20, 120 5",
    color: "#a855f7",
    colorClass: "from-purple-500/20 to-purple-500/0",
    dots: [[0, 60], [24, 52], [48, 51], [72, 33], [96, 21], [120, 5]]
  },
  churn: {
    label: "Net revenue churn",
    badge: "CHURN",
    badgeColor: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/40",
    prefix: "",
    values: [2.4, 2.1, 1.8, 1.6, 1.4, 1.2],
    growth: ["-8.3%", "-12.5%", "-14.2%", "-11.1%", "-12.5%", "-14.2%"],
    points: "M 0 10 C 20 20, 40 28, 60 40 C 80 50, 100 55, 120 62 L 120 80 L 0 80 Z",
    stroke: "M 0 10 C 20 20, 40 28, 60 40 C 80 50, 100 55, 120 62",
    color: "#f43f5e",
    colorClass: "from-rose-500/20 to-rose-500/0",
    dots: [[0, 10], [24, 17], [48, 30], [72, 42], [96, 52], [120, 62]]
  },
  ltv: {
    label: "Customer Lifetime Value",
    badge: "LTV",
    badgeColor: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/40",
    prefix: "$",
    values: [3100, 3250, 3500, 3800, 4100, 4250],
    growth: ["+3.1%", "+4.8%", "+7.6%", "+8.5%", "+7.8%", "+12.4%"],
    points: "M 0 68 C 20 62, 40 60, 60 52 C 80 40, 100 28, 120 18 L 120 80 L 0 80 Z",
    stroke: "M 0 68 C 20 62, 40 60, 60 52 C 80 40, 100 28, 120 18",
    color: "#3b82f6",
    colorClass: "from-blue-500/20 to-blue-500/0",
    dots: [[0, 68], [24, 63], [48, 59], [72, 50], [96, 32], [120, 18]]
  }
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function MetricsSim() {
  const [activeMetric, setActiveMetric] = useState<'mrr' | 'churn' | 'ltv'>('mrr');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Auto-cycling metrics and scanning dot positions
  useEffect(() => {
    const metrics: ('mrr' | 'churn' | 'ltv')[] = ['mrr', 'churn', 'ltv'];
    let metricIdx = 0;
    let dotIdx = 0;
    
    // Timer to scan chart points (updates tooltips)
    const dotInterval = setInterval(() => {
      setHoveredIdx(dotIdx);
      dotIdx = (dotIdx + 1) % 6;
    }, 1000);
    
    // Timer to change metric tabs
    const metricInterval = setInterval(() => {
      metricIdx = (metricIdx + 1) % metrics.length;
      setActiveMetric(metrics[metricIdx]);
      dotIdx = 0; // reset dot index
    }, 6000);
    
    return () => {
      clearInterval(dotInterval);
      clearInterval(metricInterval);
    };
  }, []);

  const mData = METRICS_DATA[activeMetric];
  const valueToDisplay = hoveredIdx !== null ? mData.values[hoveredIdx] : mData.values[5];
  const growthToDisplay = hoveredIdx !== null ? mData.growth[hoveredIdx] : mData.growth[5];
  const monthToDisplay = hoveredIdx !== null ? MONTHS[hoveredIdx] : "vs last month";

  return (
    <div className="w-full bg-slate-50 dark:bg-black/40 rounded-t-2xl border-b border-slate-100 dark:border-white/5 p-4 select-none h-[280px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Interactive Metric Grapher
        </span>
        <div className="flex gap-1 shrink-0">
          {(['mrr', 'churn', 'ltv'] as const).map((mKey) => (
            <button
              key={mKey}
              onClick={() => { setActiveMetric(mKey); setHoveredIdx(null); }}
              className={cn(
                "px-2 py-0.5 rounded text-[8px] font-extrabold uppercase cursor-pointer border transition-colors",
                activeMetric === mKey
                  ? `bg-primary border-primary text-white`
                  : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              {mKey}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Card */}
      <div className="bg-white dark:bg-[#0D0518] rounded-xl border border-slate-200/60 dark:border-white/10 p-3 flex-1 my-3 flex flex-col justify-between shadow-sm relative overflow-hidden group">
        
        {/* Metric Value Details */}
        <div className="flex justify-between items-start z-10">
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">{mData.label}</span>
            <h4 className="text-[14px] font-black text-slate-800 dark:text-white mt-0.5 flex items-baseline gap-1.5">
              <span>
                <CountUp value={valueToDisplay} prefix={mData.prefix} />
                {activeMetric === 'churn' && '%'}
              </span>
              <span className={cn(
                "text-[8px] font-black tracking-wide",
                growthToDisplay.startsWith('-') ? "text-rose-500" : "text-emerald-500"
              )}>
                {growthToDisplay}
              </span>
              <span className="text-[8px] font-bold text-slate-400 lowercase italic">
                {monthToDisplay}
              </span>
            </h4>
          </div>
          <span className={cn("text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider", mData.badgeColor)}>
            {mData.badge}
          </span>
        </div>

        {/* SVG Drawing Canvas with Custom Interactions */}
        <div className="relative h-24 mt-2 w-full flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 80" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="20" x2="120" y2="20" stroke="rgba(162, 140, 255, 0.05)" strokeWidth="0.5" strokeDasharray="2 2" />
            <line x1="0" y1="40" x2="120" y2="40" stroke="rgba(162, 140, 255, 0.05)" strokeWidth="0.5" strokeDasharray="2 2" />
            <line x1="0" y1="60" x2="120" y2="60" stroke="rgba(162, 140, 255, 0.05)" strokeWidth="0.5" strokeDasharray="2 2" />

            {/* Area Fill */}
            <path
              d={mData.points}
              fill={`url(#area-gradient-${activeMetric})`}
              className="transition-all duration-700 ease-in-out"
            />
            {/* Stroke Line */}
            <path
              d={mData.stroke}
              fill="none"
              stroke={mData.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-700 ease-in-out"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id={`area-gradient-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={mData.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={mData.color} stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Hover Vertical tracking line */}
            {hoveredIdx !== null && (
              <line 
                x1={mData.dots[hoveredIdx][0]} 
                y1="0" 
                x2={mData.dots[hoveredIdx][0]} 
                y2="80" 
                stroke={mData.color} 
                strokeWidth="0.5" 
                strokeDasharray="1 1" 
              />
            )}
          </svg>

          {/* HTML perfectly rounded dots to prevent stretch distortion */}
          {mData.dots.map((dot, idx) => {
            const leftPct = (idx / 5) * 100;
            const topPct = (dot[1] / 80) * 100;
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-200 z-20 flex items-center justify-center"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: isHovered ? '9px' : '5px',
                  height: isHovered ? '9px' : '5px',
                  backgroundColor: isHovered ? mData.color : '#FFFFFF',
                  border: `1.5px solid ${mData.color}`,
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between items-center text-[7px] font-bold text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-50 dark:border-white/5">
          {MONTHS.map((m, i) => (
            <span 
              key={m} 
              className={cn(
                "transition-colors",
                hoveredIdx === i ? "text-primary font-black" : ""
              )}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Card 4: Enterprise (Chargebee Migration checklist / radial ring)
// ----------------------------------------------------
const MIGRATION_STEPS = [
  "Connect Chargebee secure sandbox API keys",
  "Validate database schema mapping variables",
  "Preview migration: Dry run check validation",
  "Importing data packets into Recura tables"
];

function MigrationSim() {
  const [selectedData, setSelectedData] = useState({
    customers: true,
    subscriptions: true,
    invoices: true
  });
  
  const [isMigrating, setIsMigrating] = useState(false);
  const [mStep, setMStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Constants calculated based on checkboxes
  const selectedCount = Object.values(selectedData).filter(Boolean).length;
  const recordsToMigrate = selectedCount * 450;
  const estMinutes = selectedCount * 3.5;

  // Auto-running migration cycles
  useEffect(() => {
    let progressVal = 0;
    let timer: NodeJS.Timeout;
    
    const runMigrationCycle = () => {
      if (progressVal === 0) {
        // Start simulation: randomly toggle checkboxes for variety
        setSelectedData({
          customers: Math.random() > 0.3,
          subscriptions: Math.random() > 0.2,
          invoices: Math.random() > 0.4
        });
        setIsMigrating(true);
      }
      
      progressVal += 2;
      setProgress(progressVal);
      
      // Map progress to steps
      if (progressVal < 25) {
        setMStep(0);
      } else if (progressVal < 50) {
        setMStep(1);
      } else if (progressVal < 85) {
        setMStep(2);
      } else if (progressVal < 100) {
        setMStep(3);
      }
      
      if (progressVal >= 100) {
        setProgress(100);
        setMStep(4);
        setIsMigrating(false);
        
        // Wait 4 seconds in finished state before looping
        timer = setTimeout(() => {
          progressVal = 0;
          runMigrationCycle();
        }, 4000);
      } else {
        timer = setTimeout(runMigrationCycle, 50);
      }
    };
    
    runMigrationCycle();
    
    return () => clearTimeout(timer);
  }, []);

  // SVG Radial Ring Circle calculations
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full bg-slate-50 dark:bg-black/40 rounded-t-2xl border-b border-slate-100 dark:border-white/5 p-4 select-none h-[280px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Enterprise Migration workspace
        </span>
        <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Live Simulation</span>
        </div>
      </div>

      {/* Migration workspace sheet */}
      <div className="bg-white dark:bg-[#0D0518] rounded-xl border border-slate-200/60 dark:border-white/10 p-3 flex-1 mt-3 flex justify-between shadow-sm relative">
        {/* Checklist */}
        <div className="w-2/3 flex flex-col justify-between text-[8px]">
          <div className="space-y-1.5">
            {[0, 1, 2, 3].map((idx) => {
              const isDone = mStep > idx || mStep === 4;
              const isCurrent = mStep === idx && isMigrating;
              return (
                <div key={idx} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-semibold leading-normal">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full border flex items-center justify-center shrink-0",
                    isDone 
                      ? "bg-emerald-500 border-emerald-500" 
                      : isCurrent 
                        ? "border-primary animate-pulse" 
                        : "border-slate-200 dark:border-white/10"
                  )}>
                    {isDone && <Check className="w-1.5 h-1.5 text-white" />}
                  </div>
                  <span className={cn(
                    isDone ? "line-through text-slate-400 dark:text-slate-600" : "",
                    isCurrent ? "text-primary font-black" : ""
                  )}>
                    {MIGRATION_STEPS[idx]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[7px] font-bold text-slate-400 dark:text-slate-500 border-t border-slate-50 dark:border-white/5 pt-1.5">
            <span>Size: <strong className="text-slate-700 dark:text-slate-300">{recordsToMigrate} records</strong></span>
            <span>Est. duration: <strong className="text-slate-700 dark:text-slate-300">{estMinutes} mins</strong></span>
          </div>
        </div>

        {/* Radial progress ring and selector checks */}
        <div className="w-1/3 border-l border-slate-50 dark:border-white/5 pl-2.5 flex flex-col justify-between items-center text-center">
          {isMigrating || mStep === 4 ? (
            <div className="flex-1 flex flex-col justify-center items-center relative py-1 animate-in zoom-in-95 duration-200">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(162, 140, 255, 0.08)" strokeWidth="3" />
                <circle 
                  cx="20" 
                  cy="20" 
                  r={radius} 
                  fill="none" 
                  stroke="var(--color-primary)" 
                  strokeWidth="3" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-75"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black text-slate-800 dark:text-white">{progress}%</span>
                <span className="text-[5px] font-extrabold text-slate-400 tracking-wide uppercase">
                  {mStep === 4 ? "Done" : "Sync"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 py-1 justify-center items-start text-left w-full h-full text-[8px] font-bold text-slate-500 dark:text-slate-400">
              <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Select data:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedData.customers} 
                  onChange={(e) => setSelectedData(prev => ({ ...prev, customers: e.target.checked }))}
                  className="checkbox-custom accent-primary" 
                />
                <span>Customers</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedData.subscriptions} 
                  onChange={(e) => setSelectedData(prev => ({ ...prev, subscriptions: e.target.checked }))}
                  className="checkbox-custom accent-primary" 
                />
                <span>Subscriptions</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedData.invoices} 
                  onChange={(e) => setSelectedData(prev => ({ ...prev, invoices: e.target.checked }))}
                  className="checkbox-custom accent-primary" 
                />
                <span>Invoices</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Card 5: Tax & Compliance (VAT Report / region switcher)
// ----------------------------------------------------
const TAX_REGIONS = [
  { id: "eu", name: "EU (21%)", rate: 0.21, base: 231667 },
  { id: "uk", name: "UK (20%)", rate: 0.20, base: 231667 },
  { id: "us", name: "US (8.25%)", rate: 0.0825, base: 231667 },
  { id: "custom", name: "Custom (15%)", rate: 0.15, base: 231667 }
];

function TaxSim() {
  const [selectedRegion, setSelectedRegion] = useState("eu");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Auto-cycling regions and triggering simulated download
  useEffect(() => {
    const regions = ["eu", "uk", "us", "custom"];
    let regIdx = 0;
    let timer: NodeJS.Timeout;
    
    const cycleRegion = () => {
      const nextReg = regions[regIdx];
      setSelectedRegion(nextReg);
      
      // Auto-trigger download report on "us" region for visual interaction
      if (nextReg === "us") {
        setIsDownloading(true);
        setDownloaded(false);
        timer = setTimeout(() => {
          setIsDownloading(false);
          setDownloaded(true);
          
          // Wait after download, then advance region
          timer = setTimeout(() => {
            setDownloaded(false);
            regIdx = (regIdx + 1) % regions.length;
            cycleRegion();
          }, 2000);
        }, 1500);
      } else {
        // Advance normally after 3 seconds
        timer = setTimeout(() => {
          regIdx = (regIdx + 1) % regions.length;
          cycleRegion();
        }, 3000);
      }
    };
    
    cycleRegion();
    
    return () => clearTimeout(timer);
  }, []);

  const regionData = TAX_REGIONS.find(r => r.id === selectedRegion) || TAX_REGIONS[0];
  const collected = regionData.base * regionData.rate;
  const paid = collected * 0.662; // Constant deduction factor
  const due = collected - paid;

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloaded(false);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    }, 1800);
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-black/40 rounded-t-2xl border-b border-slate-100 dark:border-white/5 p-4 select-none h-[280px] flex flex-col justify-between">
      <div className="flex flex-col gap-2 mb-3 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block text-left">
          Interactive VAT compliance Calculator
        </span>
        <div className="flex gap-1 w-full justify-between">
          {TAX_REGIONS.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={cn(
                "flex-1 py-1 rounded text-[8px] font-extrabold cursor-pointer border transition-colors text-center",
                selectedRegion === reg.id
                  ? "bg-primary border-primary text-white"
                  : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              {reg.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tax Report display card */}
      <div className="bg-white dark:bg-[#0D0518] rounded-xl border border-slate-200/60 dark:border-white/10 p-3 flex-1 mt-3 flex flex-col justify-between shadow-sm relative">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={cn(
            "absolute top-3 right-3 px-2.5 py-1.5 rounded-md border text-[8px] font-extrabold flex items-center gap-1 cursor-pointer transition-all shadow-sm z-10 whitespace-nowrap",
            downloaded 
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200"
              : "bg-white dark:bg-[#150a2e] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
          )}
        >
          {isDownloading ? (
            <RefreshCw className="w-2.5 h-2.5 animate-spin text-primary" />
          ) : downloaded ? (
            <>
              <Check className="w-2.5 h-2.5 animate-sm" />
              <span>Success ✓</span>
            </>
          ) : (
            <>
              <Download className="w-2.5 h-2.5" />
              <span>Download Report</span>
            </>
          )}
        </button>

        {/* Report Stats */}
        <div className="w-full flex-1 flex flex-col justify-between text-[8px] mt-1">
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Compliance Worksheet</span>
            <h4 className="text-[11px] font-black text-slate-800 dark:text-white mt-0.5">VAT Report &bull; Q1 2026</h4>
          </div>

          <div className="space-y-1 py-1 font-semibold text-slate-500 dark:text-slate-400 max-w-[60%]">
            <div className="flex justify-between gap-4">
              <span>VAT Collected:</span>
              <strong className="text-slate-700 dark:text-slate-300">
                <CountUp value={collected} prefix="$" />
              </strong>
            </div>
            <div className="flex justify-between gap-4">
              <span>VAT Paid:</span>
              <strong className="text-slate-700 dark:text-slate-300">
                <CountUp value={paid} prefix="$" />
              </strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-50 dark:border-white/5 text-rose-500 font-extrabold text-[9px] gap-4">
              <span>VAT Due:</span>
              <span>
                <CountUp value={due} prefix="$" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Pulse Skeleton Loaders for wireframe mode
// ----------------------------------------------------
// ----------------------------------------------------
// Card 6: API & Developers (Console Terminal Webhook Simulator)
// ----------------------------------------------------
function ApiDevsSim() {
  const [activeTab, setActiveTab] = useState<'logs' | 'webhook' | 'keys'>('logs');
  const [logs, setLogs] = useState<string[]>([
    "Initializing webhooks...",
    "Listening on port 8080..."
  ]);

  useEffect(() => {
    const tabs: ('logs' | 'webhook' | 'keys')[] = ['logs', 'webhook', 'keys'];
    let tabIdx = 0;
    const interval = setInterval(() => {
      tabIdx = (tabIdx + 1) % tabs.length;
      setActiveTab(tabs[tabIdx]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab !== 'logs') return;
    
    const logsList = [
      "[INFO] Webhook received: invoice.payment_succeeded",
      "[INFO] Processing event payload for customer cus_8f3a...",
      "[SUCCESS] Webhook event handler returned 200 OK",
      "[INFO] Webhook received: customer.subscription.updated",
      "[INFO] MRR impact: +$299.00 calculated",
      "[SUCCESS] Webhook event handler returned 200 OK"
    ];

    let logIdx = 0;
    const logInterval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, logsList[logIdx]];
        if (next.length > 5) next.shift();
        return next;
      });
      logIdx = (logIdx + 1) % logsList.length;
    }, 1500);

    return () => clearInterval(logInterval);
  }, [activeTab]);

  return (
    <div className="w-full bg-slate-50 dark:bg-black/40 rounded-t-2xl border-b border-slate-100 dark:border-white/5 p-4 select-none h-[280px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Live Webhook Terminal
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Active Logs</span>
        </div>
      </div>

      <div className="bg-[#0A0D14] rounded-xl border border-white/10 p-3 flex-1 flex flex-col justify-between shadow-sm overflow-hidden text-left font-mono text-[9px] text-slate-300">
        <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-2 shrink-0">
          <div className="flex gap-1">
            {(['logs', 'webhook', 'keys'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-1.5 py-0.5 rounded text-[8px] font-bold tracking-tight cursor-pointer",
                  activeTab === tab 
                    ? "bg-white/10 text-white" 
                    : "text-slate-500 hover:text-slate-400"
                )}
              >
                {tab === 'logs' ? 'console' : tab === 'webhook' ? 'payload' : 'api_keys'}
              </button>
            ))}
          </div>
          <span className="text-[7px] text-slate-600">bash</span>
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
          {activeTab === 'logs' && (
            <div className="space-y-1 animate-in fade-in duration-200">
              {logs.map((log, idx) => (
                <div key={idx} className={cn(
                  "leading-tight",
                  log.startsWith("[SUCCESS]") ? "text-emerald-400" : log.startsWith("[INFO]") ? "text-slate-300" : "text-slate-500"
                )}>
                  {log}
                </div>
              ))}
              <div className="inline-block w-1 h-3 bg-primary ml-0.5 animate-pulse" />
            </div>
          )}

          {activeTab === 'webhook' && (
            <div className="space-y-1 text-[#82aaff] animate-in fade-in duration-200 leading-tight">
              <div>{"{"}</div>
              <div className="pl-3">{"\"id\": \"evt_9a2b1c8f\","}</div>
              <div className="pl-3">{"\"type\": \"invoice.payment_succeeded\","}</div>
              <div className="pl-3">{"\"created\": 1783982919,"}</div>
              <div className="pl-3">{"\"data\": { \"amount_paid\": 24980 }"}</div>
              <div>{"}"}</div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-1.5 animate-in fade-in duration-200 py-1 text-slate-400">
              <div className="flex justify-between items-center bg-white/5 p-1 rounded border border-white/5">
                <div>
                  <span className="text-[7px] text-slate-500 block">Live Publishable Key</span>
                  <span className="text-[8px] font-bold text-slate-300">pk_live_51M...3a9f</span>
                </div>
                <span className="text-[7px] text-emerald-400 font-bold uppercase tracking-wider">Active</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-1 rounded border border-white/5">
                <div>
                  <span className="text-[7px] text-slate-500 block">Live Secret Key</span>
                  <span className="text-[8px] font-bold text-slate-300">sk_live_51M...9d8e</span>
                </div>
                <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">Hidden</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Card 7: Community (Forum Q&A Thread Feed Simulator)
// ----------------------------------------------------
function CommunitySim() {
  const [activeIndex, setActiveIndex] = useState(0);

  const posts = [
    {
      author: "alex_billing",
      role: "Founder",
      topic: "Configuring multi-currency proration",
      replyCount: 3,
      latestReply: "recura_team: Make sure proration_behavior is set to create_prorations.",
      date: "2m ago"
    },
    {
      author: "sarah_revops",
      role: "RevOps VP",
      topic: "Uptime and response times during Q1 migration",
      replyCount: 5,
      latestReply: "stark_ind: Migration sync completed in under 4 minutes, highly stable.",
      date: "15m ago"
    },
    {
      author: "dev_tim",
      role: "Billing Eng",
      topic: "Handling webhook retry backoff delays",
      replyCount: 2,
      latestReply: "recura_team: Webhook retries follow an exponential backoff schedule.",
      date: "1h ago"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % posts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [posts.length]);

  const activePost = posts[activeIndex];

  return (
    <div className="w-full bg-slate-50 dark:bg-black/40 rounded-t-2xl border-b border-slate-100 dark:border-white/5 p-4 select-none h-[280px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Recura Community Forum
        </span>
        <div className="flex items-center gap-1 text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">
          <span>12.4K Members</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0D0518] rounded-xl border border-slate-200/60 dark:border-white/10 p-3 flex-1 my-3 flex flex-col justify-between shadow-sm relative text-left">
        <div className="flex justify-between items-start border-b border-slate-50 dark:border-white/5 pb-1.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center text-[7px] font-extrabold text-primary uppercase shrink-0">
                {activePost.author[0]}
              </span>
              <span className="text-[8px] font-bold text-slate-700 dark:text-slate-300 truncate">
                {activePost.author}
              </span>
              <span className="text-[6.5px] px-1 py-0.2 rounded bg-slate-100 dark:bg-white/5 text-slate-400 font-bold uppercase tracking-wider shrink-0">
                {activePost.role}
              </span>
            </div>
            <h4 className="text-[10px] font-bold text-slate-800 dark:text-white mt-1 leading-snug truncate">
              {activePost.topic}
            </h4>
          </div>
          <span className="text-[7px] text-slate-400 dark:text-slate-500 italic shrink-0 ml-2">
            {activePost.date}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-lg border border-slate-100 dark:border-white/5 my-2 flex-1 flex flex-col justify-center">
          <span className="text-[6.5px] font-black text-primary uppercase tracking-wide block mb-0.5">
            Latest Response
          </span>
          <p className="text-[8.5px] font-semibold text-slate-600 dark:text-slate-400 leading-normal">
            {activePost.latestReply}
          </p>
        </div>

        <div className="flex justify-between items-center text-[7.5px] font-bold text-slate-400 dark:text-slate-500 pt-1.5 border-t border-slate-50 dark:border-white/5 shrink-0">
          <span>Thread replies: <strong className="text-slate-600 dark:text-slate-300">{activePost.replyCount}</strong></span>
          <span className="text-primary hover:underline cursor-pointer flex items-center gap-0.5">
            View Thread <ChevronRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-2">
        {posts.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-300",
              idx === activeIndex ? "bg-primary scale-110" : "bg-slate-200 dark:bg-white/5"
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Pulse Skeleton Loaders for wireframe mode
// ----------------------------------------------------
function SkeletonPulseCard({ type }: { type: number }) {
  return (
    <div className="w-full bg-slate-50 dark:bg-black/40 rounded-t-2xl border-b border-slate-100 dark:border-white/5 p-4 animate-pulse select-none h-[280px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="w-24 h-2 bg-slate-200 dark:bg-white/5 rounded" />
        <div className="w-16 h-4 bg-slate-200 dark:bg-white/5 rounded" />
      </div>

      <div className="bg-white dark:bg-[#0D0518] rounded-xl border border-slate-200/60 dark:border-white/10 p-3 flex-1 mt-3 flex justify-between shadow-sm relative">
        {type === 1 && (
          // Dashboard Skeleton
          <div className="w-full flex gap-3">
            <div className="w-1/4 border-r border-slate-100 dark:border-white/5 pr-2 space-y-1.5">
              <div className="w-8 h-2 bg-slate-200 dark:bg-white/5 rounded" />
              <div className="w-10 h-2 bg-slate-200 dark:bg-white/5 rounded" />
              <div className="w-12 h-2.5 bg-slate-200 dark:bg-white/5 rounded" />
              <div className="w-10 h-2 bg-slate-200 dark:bg-white/5 rounded" />
            </div>
            <div className="w-3/4 space-y-2">
              <div className="w-12 h-2 bg-slate-200 dark:bg-white/5 rounded" />
              <div className="w-20 h-4 bg-slate-200 dark:bg-white/5 rounded" />
              <div className="space-y-1 pt-1">
                <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded" />
                <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded" />
              </div>
            </div>
          </div>
        )}

        {type === 2 && (
          // Dunning Timeline Skeleton
          <div className="w-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="w-16 h-1.5 bg-slate-200 dark:bg-white/5 rounded" />
                <div className="w-28 h-2.5 bg-slate-200 dark:bg-white/5 rounded" />
              </div>
              <div className="w-10 h-3 bg-slate-200 dark:bg-white/5 rounded" />
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded mt-2" />
            <div className="flex justify-between items-center mt-2 border-t border-slate-100 dark:border-white/5 pt-1.5">
              <div className="w-14 h-2 bg-slate-200 dark:bg-white/5 rounded" />
              <div className="w-20 h-2.5 bg-slate-200 dark:bg-white/5 rounded" />
            </div>
          </div>
        )}

        {type === 3 && (
          // Metric Graph Skeleton
          <div className="w-full flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="space-y-1">
                <div className="w-20 h-1.5 bg-slate-200 dark:bg-white/5 rounded" />
                <div className="w-24 h-3.5 bg-slate-200 dark:bg-white/5 rounded" />
              </div>
              <div className="w-10 h-3 bg-slate-200 dark:bg-white/5 rounded" />
            </div>
            <div className="w-full h-10 mt-2 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <path d="M 0 35 Q 25 25, 50 15 T 100 5 L 100 40 L 0 40 Z" fill="rgba(162, 140, 255, 0.03)" />
                <path d="M 0 35 Q 25 25, 50 15 T 100 5" fill="none" stroke="rgba(162, 140, 255, 0.1)" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        )}

        {type === 4 && (
          // Migration Sync Skeleton
          <div className="w-full flex">
            <div className="w-2/3 space-y-2">
              <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded" />
              <div className="w-11/12 h-2 bg-slate-200 dark:bg-white/5 rounded" />
              <div className="w-10/12 h-2 bg-slate-200 dark:bg-white/5 rounded" />
            </div>
            <div className="w-1/3 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-white/5 flex items-center justify-center">
                <div className="w-4 h-4 bg-slate-200 dark:bg-white/5 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {type === 5 && (
          // Tax calculator Skeleton
          <div className="w-full flex">
            <div className="w-2/3 space-y-2 justify-between flex flex-col py-1">
              <div className="space-y-1">
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/5 rounded" />
                <div className="w-20 h-2 bg-slate-200 dark:bg-white/5 rounded" />
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded" />
                <div className="w-11/12 h-1.5 bg-slate-100 dark:bg-white/5 rounded" />
              </div>
            </div>
            <div className="w-1/3 flex items-center justify-center">
              <div className="w-14 h-6 bg-slate-200 dark:bg-white/5 rounded" />
            </div>
          </div>
        )}

        {type === 6 && (
          // API & Developers Console Skeleton
          <div className="w-full flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-16 h-2 bg-slate-200 dark:bg-white/5 rounded" />
              <div className="w-8 h-2 bg-slate-200 dark:bg-white/5 rounded" />
            </div>
            <div className="w-full h-20 bg-slate-900 rounded-lg p-2.5 space-y-1.5 mt-2">
              <div className="w-2/3 h-2 bg-slate-800 rounded" />
              <div className="w-1/2 h-2 bg-slate-800 rounded" />
              <div className="w-3/4 h-2 bg-slate-800 rounded" />
            </div>
          </div>
        )}

        {type === 7 && (
          // Community forum Q&A Skeleton
          <div className="w-full flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-white/5" />
                <div className="w-12 h-2 bg-slate-200 dark:bg-white/5 rounded" />
              </div>
              <div className="w-8 h-2 bg-slate-200 dark:bg-white/5 rounded" />
            </div>
            <div className="w-full h-10 bg-slate-100 dark:bg-white/5 rounded-lg my-2" />
            <div className="flex justify-between mt-1">
              <div className="w-16 h-2 bg-slate-200 dark:bg-white/5 rounded" />
              <div className="w-10 h-2 bg-slate-200 dark:bg-white/5 rounded" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Responsive Carousel Settings & Custom Dragging Handlers
  const [visibleCards, setVisibleCards] = useState(5);
  const [activeDot, setActiveDot] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setVisibleCards(1);
      } else if (w < 1024) {
        setVisibleCards(2);
      } else if (w < 1280) {
        setVisibleCards(3);
      } else {
        setVisibleCards(5);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalCards = 7;
  const maxIndex = Math.max(0, totalCards - visibleCards);

  // Autoplay Effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDragging.current) return;
      const container = carouselRef.current;
      if (!container) return;
      
      const cardWidth = container.clientWidth / visibleCards;
      let nextIndex = activeDot + 1;
      if (nextIndex > totalCards - visibleCards) {
        nextIndex = 0;
      }
      container.scrollTo({
        left: nextIndex * cardWidth,
        behavior: 'smooth'
      });
      setActiveDot(nextIndex);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeDot, visibleCards]);

  // Update active dot on scroll (to sync drag/swipe scroll positions)
  const handleScroll = () => {
    const container = carouselRef.current;
    if (!container) return;
    const cardWidth = container.clientWidth / visibleCards;
    const index = Math.round(container.scrollLeft / cardWidth);
    if (index !== activeDot && index >= 0 && index <= maxIndex) {
      setActiveDot(index);
    }
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = carouselRef.current;
    if (!container) return;
    isDragging.current = true;
    startX.current = e.pageX - container.offsetLeft;
    scrollLeftStart.current = container.scrollLeft;
    container.style.cursor = 'grabbing';
    container.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const container = carouselRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    container.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const container = carouselRef.current;
    if (!container) return;
    container.style.cursor = 'grab';
    container.style.scrollBehavior = 'smooth';
    
    // Snap to nearest card
    const cardWidth = container.clientWidth / visibleCards;
    const nearestIdx = Math.round(container.scrollLeft / cardWidth);
    container.scrollTo({
      left: nearestIdx * cardWidth,
      behavior: 'smooth'
    });
    setActiveDot(nearestIdx);
  };

  // Touch Swipe Handlers (for mobile/tablet smooth dragging)
  const handleTouchStart = (e: React.TouchEvent) => {
    const container = carouselRef.current;
    if (!container) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX - container.offsetLeft;
    scrollLeftStart.current = container.scrollLeft;
    container.style.scrollBehavior = 'auto';
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const container = carouselRef.current;
    if (!container) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    container.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const container = carouselRef.current;
    if (!container) return;
    container.style.scrollBehavior = 'smooth';
    
    const cardWidth = container.clientWidth / visibleCards;
    const nearestIdx = Math.round(container.scrollLeft / cardWidth);
    container.scrollTo({
      left: nearestIdx * cardWidth,
      behavior: 'smooth'
    });
    setActiveDot(nearestIdx);
  };

  // Dot Click handler
  const handleDotClick = (idx: number) => {
    const container = carouselRef.current;
    if (!container) return;
    const cardWidth = container.clientWidth / visibleCards;
    container.scrollTo({
      left: idx * cardWidth,
      behavior: 'smooth'
    });
    setActiveDot(idx);
  };



  // Popular Guides Filter State
  const [selectedGuideCategory, setSelectedGuideCategory] = useState<string>('All topics');

  // REST API developer preview states
  const [activeIdx, setActiveIdx] = useState(1); // default to create-sub
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [codeState, setCodeState] = useState<'typing' | 'waiting' | 'deleting'>('typing');
  const [copied, setCopied] = useState(false);

  const currentEndpoint = DEV_ENDPOINTS[activeIdx];

  // Auto-typing animation effect for REST API preview
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (codeState === 'typing') {
      if (charIndex < currentEndpoint.code.length) {
        timer = setTimeout(() => {
          setDisplayText(currentEndpoint.code.substring(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        }, 15);
      } else {
        timer = setTimeout(() => {
          setCodeState('waiting');
        }, 0);
      }
    } else if (codeState === 'waiting') {
      timer = setTimeout(() => {
        setCodeState('deleting');
      }, 4000);
    } else if (codeState === 'deleting') {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          const nextIndex = Math.max(0, charIndex - 4);
          setDisplayText(currentEndpoint.code.substring(0, nextIndex));
          setCharIndex(nextIndex);
          if (nextIndex === 0) {
            setActiveIdx(prev => (prev + 1) % DEV_ENDPOINTS.length);
            setCodeState('typing');
          }
        }, 10);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, codeState, activeIdx, currentEndpoint.code]);

  const handleEndpointClick = (idx: number) => {
    if (idx === activeIdx) return;
    setCharIndex(0);
    setDisplayText('');
    setActiveIdx(idx);
    setCodeState('typing');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentEndpoint.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredGuides = POPULAR_GUIDES.filter((guide) => {
    if (selectedGuideCategory === "All topics") return true;
    return guide.category === selectedGuideCategory;
  });

  // Simulated Loader state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut ⌘K or Ctrl+K trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="bg-background min-h-screen pt-20">
      <Navbar />

      {/* Hero section */}
      <section className="relative pt-24 pb-16 overflow-hidden border-b border-slate-200/60 dark:border-white/10 text-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[450px] pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(162,140,255,0.06),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(162,140,255,0.12),transparent_65%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-4xl">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-4">Resources</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            Everything you need to master billing
          </h1>
          <p className="text-sm md:text-base font-semibold text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            Guides, API docs, video tutorials, and expert playbooks for subscription management, recurring billing, and revenue operations - built by the team behind Recura.
          </p>

          {/* Interactive Search Bar wrapper */}
          <div className="max-w-xl mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input 
              ref={searchInputRef}
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides, API docs, FAQs..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full pl-12 pr-16 py-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 font-semibold text-sm focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 text-slate-900 dark:text-white shadow-sm transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-[9px] font-black text-slate-400 dark:text-slate-300">
              ⌘K
            </div>

            {/* Quick search focus helper modal dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl z-20 text-left animate-in slide-in-from-top-2 duration-150">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Quick Filters</span>
                <div className="flex flex-wrap gap-1.5">
                  {SEARCH_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearch(tag)}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[9px] font-bold text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick tags badges below search */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {SEARCH_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearch(tag)}
                className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-primary/30 hover:text-primary transition-all cursor-pointer shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Categories Navigation tabs bar */}
      <section className="border-b border-slate-200/60 dark:border-white/10 bg-slate-50/50 dark:bg-black/10 select-none py-3 md:py-0">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Desktop tabs view */}
          <div className="hidden md:flex items-center gap-6 pt-4">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCat === cat.id;
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
                {CATEGORIES.find(c => c.id === selectedCat) && (
                  React.createElement((CATEGORIES.find(c => c.id === selectedCat) as any).icon, { className: "w-4 h-4 text-primary" })
                )}
                <span>{CATEGORIES.find(c => c.id === selectedCat)?.name || 'Select category'}</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform text-slate-405", dropdownOpen && "rotate-90")} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 z-30 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#150a2e] shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCat === cat.id;
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

      {/* Editor's Picks section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6 max-w-[1600px] relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left max-w-[1600px] mx-auto">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                Editor&apos;s picks — start here
              </h2>
            </div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed md:text-right">
              The seven guides every billing team reads first, hand-picked by the Recura team.
            </p>
          </div>

          {/* Skeletons vs Interactive Cards Carousel */}
          <div className="relative max-w-[1600px] mx-auto px-4">
            
            {/* Scrollable Viewport with Touch/Mouse Drag */}
            <div 
              ref={carouselRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="overflow-x-auto no-scrollbar scroll-smooth cursor-grab select-none"
            >
              <div className="flex -mx-2">
                
                {/* Card 1: Billing Basics */}
                <div className="w-[100%] sm:w-[50%] lg:w-[33.333333%] xl:w-[20%] shrink-0 px-2 flex">
                  <div className="w-full bg-white dark:bg-[#150a2e] rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-sm hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                    {isLoaded ? <BillingBasicsSim /> : <SkeletonPulseCard type={1} />}
                    <div className="p-5 text-left flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mb-2">Billing basics</span>
                        <Link href="/resources/billing-basics" className="text-base font-extrabold text-slate-900 dark:text-white leading-snug hover:text-primary transition-colors cursor-pointer block">
                          Proration explained: a complete guide
                        </Link>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>9 min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Invoicing Operations */}
                <div className="w-[100%] sm:w-[50%] lg:w-[33.333333%] xl:w-[20%] shrink-0 px-2 flex">
                  <div className="w-full bg-white dark:bg-[#150a2e] rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-sm hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                    {isLoaded ? <TaxSim /> : <SkeletonPulseCard type={5} />}
                    <div className="p-5 text-left flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-2">Invoicing operations</span>
                        <Link href="/resources/invoicing-operations" className="text-base font-extrabold text-slate-900 dark:text-white leading-snug hover:text-primary transition-colors cursor-pointer block">
                          VAT, GST and sales tax: a global compliance guide
                        </Link>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>11 min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Payment Collection */}
                <div className="w-[100%] sm:w-[50%] lg:w-[33.333333%] xl:w-[20%] shrink-0 px-2 flex">
                  <div className="w-full bg-white dark:bg-[#150a2e] rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-sm hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                    {isLoaded ? <DunningSim /> : <SkeletonPulseCard type={2} />}
                    <div className="p-5 text-left flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-2">Payment collection</span>
                        <Link href="/resources/payment-collection" className="text-base font-extrabold text-slate-900 dark:text-white leading-snug hover:text-primary transition-colors cursor-pointer block">
                          Building a dunning sequence that recovers revenue
                        </Link>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>12 min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Enterprise */}
                <div className="w-[100%] sm:w-[50%] lg:w-[33.333333%] xl:w-[20%] shrink-0 px-2 flex">
                  <div className="w-full bg-white dark:bg-[#150a2e] rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-sm hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                    {isLoaded ? <MigrationSim /> : <SkeletonPulseCard type={4} />}
                    <div className="p-5 text-left flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-2">Enterprise</span>
                        <Link href="/resources/enterprise" className="text-base font-extrabold text-slate-900 dark:text-white leading-snug hover:text-primary transition-colors cursor-pointer block">
                          Migrating from Chargebee to Recura: a checklist
                        </Link>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>7 min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 5: API & Developers */}
                <div className="w-[100%] sm:w-[50%] lg:w-[33.333333%] xl:w-[20%] shrink-0 px-2 flex">
                  <div className="w-full bg-white dark:bg-[#150a2e] rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-sm hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                    {isLoaded ? <ApiDevsSim /> : <SkeletonPulseCard type={6} />}
                    <div className="p-5 text-left flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-2">API &amp; Developers</span>
                        <Link href="/resources/api-developers" className="text-base font-extrabold text-slate-900 dark:text-white leading-snug hover:text-primary transition-colors cursor-pointer block">
                          Integrating Recura webhooks and APIs
                        </Link>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>10 min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 6: Video Tutorials */}
                <div className="w-[100%] sm:w-[50%] lg:w-[33.333333%] xl:w-[20%] shrink-0 px-2 flex">
                  <div className="w-full bg-white dark:bg-[#150a2e] rounded-2xl border-2 border-primary/40 dark:border-primary/55 shadow-[0_0_20px_rgba(162,140,255,0.06)] hover:shadow-[0_0_25px_rgba(162,140,255,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
                    {isLoaded ? <MetricsSim /> : <SkeletonPulseCard type={3} />}
                    <div className="p-5 text-left bg-gradient-to-b from-primary/[0.01] to-primary/[0.04] flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-2 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Video tutorial
                        </span>
                        <Link href="/resources/video-tutorials" className="text-base font-extrabold text-slate-900 dark:text-white leading-snug hover:text-primary transition-colors cursor-pointer block">
                          The complete guide to recurring revenue metrics
                        </Link>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>15 min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 7: Community */}
                <div className="w-[100%] sm:w-[50%] lg:w-[33.333333%] xl:w-[20%] shrink-0 px-2 flex">
                  <div className="w-full bg-white dark:bg-[#150a2e] rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-sm hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                    {isLoaded ? <CommunitySim /> : <SkeletonPulseCard type={7} />}
                    <div className="p-5 text-left flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block mb-2">Community</span>
                        <Link href="/resources/community" className="text-base font-extrabold text-slate-900 dark:text-white leading-snug hover:text-primary transition-colors cursor-pointer block">
                          Recura Community: scaling recurring revenue
                        </Link>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>8 min read</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Pagination Lines and Dots Indicator */}
            <div className="flex justify-center items-center gap-1.5 mt-8 select-none">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
                const isActive = activeDot === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300 cursor-pointer border-0",
                      isActive 
                        ? "w-8 bg-primary" 
                        : "w-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20"
                    )}
                  />
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Browse by Format section */}
      <section className="py-24 border-t border-slate-200/60 dark:border-white/10 bg-slate-50/30 dark:bg-black/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left max-w-5xl mx-auto">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Browse by format</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                Find the format that fits how you learn
              </h2>
            </div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed md:text-right">
              From deep-dive documentation to bite-sized video walkthroughs — every resource type Recura offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {FORMATS.map((format) => {
              const Icon = format.icon;
              return (
                <div 
                  key={format.id}
                  className={cn(
                    "bg-white dark:bg-[#150a2e] border border-slate-200/60 dark:border-white/10 rounded-3xl p-6.5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 group text-left",
                    format.span
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center p-2", format.iconBg)}>
                        <Icon className="w-5 h-5 shrink-0" />
                      </div>
                      <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                        Resource
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-primary transition-colors">
                      {format.title}
                    </h3>
                    <p className="text-[11.5px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400 mb-8">
                      {format.desc}
                    </p>
                  </div>

                  <div className="border-t border-slate-200/50 dark:border-white/5 pt-5 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-6">
                      {format.metrics.map((m, idx) => (
                        <div key={idx} className="text-left">
                          <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                            {m.value}
                          </span>
                          {m.label && (
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block leading-tight">
                              {m.label}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <Link href="#" className="text-xs font-bold text-primary hover:text-primary/95 transition-colors flex items-center gap-1 select-none">
                      <span>{format.linkText}</span>
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">&rarr;</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Guides section */}
      <section className="py-24 border-t border-slate-200/60 dark:border-white/10 bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left max-w-5xl mx-auto">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Popular guides</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                Read what your team needs this week
              </h2>
            </div>
          </div>

          {/* Filter tabs toolbar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -my-1 justify-start max-w-5xl mx-auto mb-10 select-none">
            {GUIDE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedGuideCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0",
                  selectedGuideCategory === cat
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-950 dark:border-white shadow-sm"
                    : "bg-[#F8F9FC] dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List of Guides */}
          <div className="max-w-5xl mx-auto flex flex-col gap-4">
            {filteredGuides.map((guide, idx) => {
              const Icon = guide.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 group text-left cursor-pointer"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5", guide.iconBg)}>
                      <Icon className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-white group-hover:text-primary transition-colors mb-1 leading-snug">
                        {guide.title}
                      </h4>
                      <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                        {guide.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-none border-slate-200/40 dark:border-white/5 w-full md:w-auto">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider whitespace-nowrap">
                        {guide.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {guide.readTime}
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary text-slate-400 transition-colors shrink-0">
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredGuides.length === 0 && (
              <div className="bg-slate-50/50 dark:bg-white/[0.01] border border-slate-200/60 dark:border-white/10 rounded-2xl p-12 text-center select-none">
                <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 block mb-1">No guides found</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 block">Try selecting another topic filter.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* For Developers REST API Section */}
      <section className="py-24 border-t border-slate-200/60 dark:border-white/10 bg-slate-50/30 dark:bg-black/10 overflow-hidden relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
            
            {/* Left Column: Endpoints and Text */}
            <div className="lg:col-span-5 flex flex-col justify-center text-left">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">
                For Developers
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                A complete REST API, fully documented
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                Every object in Recura — subscriptions, plans, customers, invoices, payments — is exposed via a predictable REST API. Browse live request builders, response schemas, and copy-paste code samples in 5 languages.
              </p>
              
              {/* Endpoint List */}
              <div className="space-y-2 mb-8">
                {DEV_ENDPOINTS.map((ep, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => handleEndpointClick(idx)}
                      className={cn(
                        "w-full p-3.5 rounded-xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer group/ep",
                        isActive
                          ? "bg-white dark:bg-[#150a2e] border-primary/30 shadow-sm"
                          : "bg-white/40 dark:bg-white/[0.01] border-slate-200/50 dark:border-white/5 hover:bg-white dark:hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase shrink-0 font-mono text-center w-12",
                          ep.method === 'GET' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' :
                          ep.method === 'POST' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' :
                          'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                        )}>
                          {ep.method}
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono tracking-tight">
                          {ep.path}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover/ep:text-primary transition-colors">
                        {ep.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button className="w-full sm:w-auto px-6 py-4.5 rounded-xl font-bold bg-primary hover:bg-primary/95 text-white text-xs shadow-md shadow-primary/10 transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
                  Read API docs
                </Button>
                <Button variant="outline" className="w-full sm:w-auto px-6 py-4.5 rounded-xl font-bold border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
                  Get API key &rarr;
                </Button>
              </div>
            </div>

            {/* Right Column: Code Editor Mockup */}
            <div className="lg:col-span-7 w-full flex items-center justify-center overflow-visible">
              <div className="w-full rounded-[24px] bg-[#0A0D14] border border-white/5 shadow-2xl overflow-hidden relative group text-left">
                <div className="px-4 py-3 md:px-6 md:py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between gap-3 md:gap-4 select-none">
                  {/* Three Dots */}
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  
                  {/* File Name */}
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mx-auto leading-none pr-12">
                    {currentEndpoint.filename}
                  </span>

                  {/* Copy Button */}
                  <button 
                    onClick={handleCopy}
                    className="shrink-0 flex items-center gap-1 px-2 py-1 md:px-2.5 md:py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-[9px] md:text-[10px] font-bold cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-6 md:p-8 overflow-hidden h-[340px] flex flex-col justify-start">
                  <pre className="text-[12px] font-medium leading-relaxed custom-scrollbar overflow-y-auto overflow-x-hidden pr-4 flex-1 text-slate-300 select-all">
                    {highlightCode(displayText)}
                    <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse" />
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Learn by Example section */}
      <section className="py-20 border-t border-slate-200/60 dark:border-white/10 bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-4">
              Learn by example
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
              See real analytics workflows inside Recura
            </h2>
            <p className="text-sm md:text-base font-semibold text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Every guide includes live product walkthroughs — so you&apos;re never reading theory disconnected from the dashboard you&apos;ll actually use.
            </p>
          </div>

          {/* Video Device Mockup (Frame styled matching the hero page) */}
          <div className="relative mx-auto w-full max-w-[1000px] px-0 select-none">
            <style>{`
              @keyframes rotate-gradient-learn {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .learn-glow-light {
                background: conic-gradient(from 0deg, transparent 46%, #A28CFF 48%, #ffffff 50%, #A28CFF 52%, transparent 54%);
              }
              .learn-glow-dark {
                background: conic-gradient(from 0deg, transparent 47%, #ffffff 49%, #ffffff 50%, #ffffff 51%, transparent 53%);
              }
            `}</style>
            
            <div className="relative overflow-hidden p-[5.5px] border-[2.5px] border-slate-900 dark:border-primary bg-slate-900 dark:bg-primary rounded-2xl shadow-2xl">
              {/* Background rotating conic gradient */}
              <div 
                className="absolute inset-[-150%] pointer-events-none z-0 block dark:hidden learn-glow-light"
                style={{
                  animation: 'rotate-gradient-learn 12s linear infinite',
                }}
              />
              <div 
                className="absolute inset-[-150%] pointer-events-none z-0 hidden dark:block learn-glow-dark"
                style={{
                  animation: 'rotate-gradient-learn 12s linear infinite',
                }}
              />
              
              {/* Inner bezel mask overlay */}
              <div className="absolute inset-[2px] bg-slate-900 dark:bg-primary rounded-[12px] z-10 pointer-events-none" />

              {/* Screen Content Wrapper */}
              <div className="relative z-20 rounded-xl overflow-hidden bg-slate-950">
                {/* Light Mode Video: plays analytics_dark.mp4 */}
                <video
                  src="https://res.cloudinary.com/weburea/video/upload/v1783741151/efy21lyxzgcgaggezxud.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto block dark:hidden"
                />
                {/* Dark Mode Video: plays analytics_light.mp4 */}
                <video
                  src="https://res.cloudinary.com/weburea/video/upload/v1783741189/qiik8ltjwb7vixknhrku.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto hidden dark:block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Need More Help? Support Section */}
      <section className="py-24 border-t border-slate-200/60 dark:border-white/10 bg-slate-50/30 dark:bg-black/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left max-w-7xl mx-auto">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Need more help?</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                Get support, however you prefer it
              </h2>
            </div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed md:text-right">
              Self-serve answers or a real human — whichever gets you unblocked fastest.
            </p>
          </div>

          {/* First Row: 4 Small Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-6">
            
            {/* Card 1: Live Chat */}
            <div className="bg-white dark:bg-[#150a2e] border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-primary flex items-center justify-center p-2.5 mb-6">
                  <MessageSquare className="w-5 h-5 shrink-0" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  Live chat support
                </h3>
                <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                  Talk to our support team in real time. Average response under 3 minutes.
                </p>
              </div>
            </div>

            {/* Card 2: Email Support */}
            <div className="bg-white dark:bg-[#150a2e] border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-primary flex items-center justify-center p-2.5 mb-6">
                  <Mail className="w-5 h-5 shrink-0 animate-pulse" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  Email support
                </h3>
                <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                  Detailed help for complex configuration questions. We reply within 24 hours.
                </p>
              </div>
            </div>

            {/* Card 3: Talk to Sales */}
            <div className="bg-white dark:bg-[#150a2e] border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-primary flex items-center justify-center p-2.5 mb-6">
                  <Phone className="w-5 h-5 shrink-0" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  Talk to sales
                </h3>
                <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                  Discuss enterprise plans, custom contracts, or migration support with our team.
                </p>
              </div>
            </div>

            {/* Card 4: Status Page */}
            <div className="bg-white dark:bg-[#150a2e] border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-primary flex items-center justify-center p-2.5 mb-6">
                  <HelpCircle className="w-5 h-5 shrink-0" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  Status page
                </h3>
                <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                  Real-time uptime monitoring and incident history for every Recura service.
                </p>
              </div>
            </div>

          </div>

          {/* Second Row: 2 Wider Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            
            {/* Card 5: Recura Community */}
            <div className="bg-white dark:bg-[#150a2e] border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 text-left hover:-translate-y-0.5 hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center p-2.5 mb-6">
                  <Users className="w-5 h-5 shrink-0 animate-bounce" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                  Recura Community
                </h3>
                <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400 mb-8">
                  Join 12,000+ billing professionals sharing workflows, plugin recipes, and real-world advice. Get unstuck faster by learning from teams who&apos;ve solved the same problem.
                </p>
              </div>

              <div className="border-t border-slate-200/50 dark:border-white/5 pt-6 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-base font-black text-primary block leading-none mb-1">12K+</span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Active members</span>
                </div>
                <div>
                  <span className="text-base font-black text-primary block leading-none mb-1">3,400+</span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Discussions</span>
                </div>
                <div>
                  <span className="text-base font-black text-primary block leading-none mb-1">94%</span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Questions answered</span>
                </div>
              </div>
            </div>

            {/* Card 6: Recura Academy */}
            <div className="bg-white dark:bg-[#150a2e] border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 text-left hover:-translate-y-0.5 hover:shadow-lg dark:hover:border-white/20 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center p-2.5 mb-6">
                  <GraduationCap className="w-5 h-5 shrink-0" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                  Recura Academy
                </h3>
                <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400 mb-8">
                  Structured courses on subscription billing, revenue operations, and SaaS financial metrics. Earn a certification recognized across the billing industry.
                </p>
              </div>

              <div className="border-t border-slate-200/50 dark:border-white/5 pt-6 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-base font-black text-primary block leading-none mb-1">14</span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Courses</span>
                </div>
                <div>
                  <span className="text-base font-black text-primary block leading-none mb-1">6 hrs</span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Avg completion</span>
                </div>
                <div>
                  <span className="text-base font-black text-primary block leading-none mb-1">Free</span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">For all customers</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Still Have Questions? CTA Section */}
      <section className="py-24 bg-[#0A0D14] dark:bg-[#07090e] border-t border-b border-white/5 relative overflow-hidden text-center">
        {/* Background Pattern using same lines SVG as Integrations CTA */}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 select-none">
            <Button className="w-full sm:w-auto px-8 py-5 rounded-xl font-bold bg-[#7A69BF] hover:bg-[#6858a7] text-white text-xs shadow-lg shadow-[#7A69BF]/10 transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer border-0">
              Talk to an expert
            </Button>
            <Button variant="outline" className="w-full sm:w-auto px-8 py-5 rounded-xl font-bold border-white/15 bg-transparent hover:bg-white/10 text-white hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
              Browse all resources
            </Button>
            <Button variant="outline" className="w-full sm:w-auto px-8 py-5 rounded-xl font-bold border-white/15 bg-transparent hover:bg-white/10 text-white hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
              Join the community
            </Button>
          </div>

          {/* Suffix Metrics Row */}
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
