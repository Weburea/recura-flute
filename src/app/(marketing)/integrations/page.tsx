"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Compass, Shuffle, Wind, Zap, HeartPulse,
  Search, ArrowRight, Puzzle, Check, Sparkles, HelpCircle,
  Copy, Shield, KeyRound, Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';

const HERO_COMPANIES = [
  { name: 'Xero', role: 'Accounting', iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571963/xero_box.svg', bg: 'bg-[#13B5EA]' },
  { name: 'Stripe', role: 'Payments', iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571953/stripe_box.svg', bg: 'bg-[#635BFF]' },
  { name: 'HubSpot', role: 'CRM', iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571779/hubspot_box.svg', bg: 'bg-[#FF7A59]' },
  { name: 'Salesforce', role: 'CRM', iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571934/salesforce_box.svg', bg: 'bg-[#00A1E0]' },
  { name: 'Slack', role: 'Notifications', iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571943/slack_box.svg', bg: 'bg-[#4A154B]' },
  { name: 'QuickBooks', role: 'Accounting', iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571798/quickbooks_box.svg', bg: 'bg-[#2CA01C]' },
];

const INTEGRATIONS_DIRECTORY = [
  {
    name: 'Stripe',
    desc: 'Sync Recura subscriptions bidirectionally with Stripe — plan upgrades, coupon codes, trial management, payment method vaults, and real-time webhook delivery. Handle SCA, 3DS2, and card decline logic automatically with Recura\'s smart dunning on top.',
    category: 'Payments',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571953/stripe_box.svg',
    status: 'live',
    featured: true,
    tags: ['Webhook sync', 'Dunning automation', '3DS2 ready', 'Multi-currency', 'Proration']
  },
  {
    name: 'Salesforce',
    desc: 'Push subscription data into Salesforce Opportunities and Accounts. Trigger workflows when plans change, trials expire, or invoices go unpaid. Keep your sales team in the loop without manual data entry.',
    category: 'CRM',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571934/salesforce_box.svg',
    status: 'live',
    featured: true,
    tags: ['Bi-directional sync', 'Opportunity mapping', 'Custom objects']
  },
  {
    name: 'QuickBooks Online',
    desc: 'Auto-generate QuickBooks invoices from Recura billing events. Reconcile payments, map chart of accounts, sync customer records, and produce tax-ready reports without leaving your accounting workflow.',
    category: 'ERP',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571798/quickbooks_box.svg',
    status: 'popular',
    tags: ['Invoice sync', 'Tax mapping', 'Auto-reconcile']
  },
  {
    name: 'HubSpot',
    desc: 'Sync subscription lifecycle events to HubSpot Deals and Contacts. Build automated nurture sequences that trigger on trial starts, renewals, and churn risk — keeping marketing and billing perfectly aligned.',
    category: 'CRM',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571779/hubspot_box.svg',
    status: 'live',
    tags: ['Deal sync', 'Lifecycle triggers', 'MRR properties']
  },
  {
    name: 'Xero',
    desc: 'Connect Recura to Xero for automated invoice creation, payment matching, and bank reconciliation. GST/VAT calculations are handled automatically based on customer location and tax rules.',
    category: 'ERP',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571963/xero_box.svg',
    status: 'live',
    tags: ['VAT/GST auto', 'Bank rec', 'Multi-entity']
  },
  {
    name: 'Slack',
    desc: 'Deliver real-time billing alerts to your team\'s Slack channels. New subscriptions, failed payments, churn events, and MRR milestones — your team always knows what\'s happening.',
    category: 'CRM',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571943/slack_box.svg',
    status: 'live',
    tags: ['Custom alerts', 'Channel routing', 'MRR digest']
  },
  {
    name: 'Chargebee',
    desc: 'Migrating from Chargebee? Recura\'s one-click importer moves all your subscriptions, plans, customers, and billing history with zero downtime and full data fidelity.',
    category: 'ERP',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571771/Chargebee.svg',
    status: 'live',
    tags: ['Zero downtime', 'History import', 'Plan mapping']
  },
  {
    name: 'AWS Marketplace',
    desc: 'List your SaaS on AWS Marketplace and let Recura handle metered billing, entitlement checks, and AWS usage-based pricing — without a single line of marketplace-specific billing code.',
    category: 'ERP',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571769/AWS%20Marketplace.svg',
    status: 'live',
    tags: ['Metered billing', 'Entitlements', 'CPPO support']
  },
  {
    name: 'PayPal Braintree',
    desc: 'Accept PayPal, Venmo, Google Pay, and Apple Pay alongside card payments. Braintree\'s vault syncs subscription details automatically for secure, recurring processing.',
    category: 'Payments',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571786/PayPal%20Braintree.svg',
    status: 'live',
    tags: ['Wallet payments', 'Vault sync', 'Retry logic']
  },
  {
    name: 'Zapier',
    desc: 'Connect Recura to 5,000+ apps via Zapier. Build automated workflows — create CRM leads, trigger onboarding emails, update spreadsheets, or log invoices to custom databases.',
    category: 'ERP',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571969/Zapier_int.svg',
    status: 'popular',
    tags: ['5,000+ apps', 'No-code', 'Multi-step Zaps']
  },
  {
    name: 'Google Analytics 4',
    desc: 'Push Recura revenue events to GA4 as e-commerce conversions. Track subscription signups, upgrades, and cancellations to measure acquisition funnel health.',
    category: 'Analytics',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571775/Google%20Analytics%204.svg',
    status: 'live',
    tags: ['Revenue events', 'LTV attribution', 'GA4 native']
  }
];

const CATEGORIES = ['All', 'Payments', 'CRM', 'Analytics', 'ERP'];
const STATUS_FILTERS = ['All Status', 'Live', 'Popular'];

const PAYMENT_GATEWAYS = [
  {
    name: 'Stripe',
    desc: 'Cards, wallets, SEPA, and 135+ currencies with smart retry logic. Favorable for global scaling.',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571946/Stripe.svg',
    status: 'Connected',
    featured: false
  },
  {
    name: 'PayPal',
    desc: 'PayPal, Venmo, Google Pay, and Apple Pay via vault-based billing. Favorable for international checkouts.',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571788/PayPal.svg',
    status: 'Connected',
    featured: false
  },
  {
    name: 'Flutterwave',
    desc: 'Enterprise-grade acquiring with local payment methods. Favorable for merchants in Nigeria and African countries.',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571773/Flutterwave.svg',
    status: 'Featured',
    featured: true
  },
  {
    name: 'Paystack',
    desc: 'Direct debit across UK, EU, and Australia. Favorable for modern businesses in Nigeria and West Africa.',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571790/Paystack.svg',
    status: 'Connected',
    featured: false
  },
  {
    name: 'Razorpay',
    desc: 'India\'s leading gateway with UPI, Netbanking, and EMI support. Favorable for merchants in India and Asia.',
    iconPath: 'https://res.cloudinary.com/weburea/image/upload/v1783571800/razorpay.svg',
    status: 'Available',
    featured: false
  }
];

const CODE_TABS = [
  {
    id: 'js',
    name: 'recura-webhook.js',
    lang: 'js',
    code: `// Recura Webhook - Node.js/Express
const express = require('express');
const app = express();

app.post('/webhooks/recura', async (req, res) => {
  const event = recura.webhooks.verify(
    req.body, 
    process.env.RECURA_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'subscription.created':
      await crm.createDeal(event.data);
      break;
    case 'payment.failed':
      await dunning.startSequence(event.data);
      break;
  }
  res.json({ received: true });
});`
  },
  {
    id: 'py',
    name: 'slack-notifier.py',
    lang: 'py',
    code: `# Recura Slack Alerts - Python/Flask
from flask import Flask, request, jsonify
import recura

app = Flask(__name__)

@app.route('/webhooks/alerts', methods=['POST'])
def handle_alert():
    event = recura.Webhook.construct_event(
        request.data,
        request.headers.get('Recura-Signature')
    )
    
    if event.type == "mrr.milestone_reached":
        slack.send_message(
            channel="#revenue",
            text=f"🚀 New MRR: \${event.data.mrr}"
        )
    return jsonify(success=True)`
  },
  {
    id: 'go',
    name: 'salesforce-sync.go',
    lang: 'go',
    code: `// Recura Salesforce Sync - Go/http
package main

import (
	"encoding/json"
	"net/http"
	"github.com/recura/recura-go"
)

func handleSync(w http.ResponseWriter, r *http.Request) {
	event, err := recura.VerifyWebhook(r)
	if err != nil {
		http.Error(w, "Invalid signature", 400)
		return
	}

	if event.Type == "customer.created" {
		var customer recura.Customer
		json.Unmarshal(event.Data, &customer)
		salesforce.SyncAccount(customer)
	}
	w.WriteHeader(http.StatusOK)
}`
  }
];

function highlightCode(code: string, lang: string) {
  if (!code) return null;
  
  const tokens = code.split(/(\/\/.*|#.*|"[^"]*"|'[^']*'|\b(?:const|let|var|async|await|switch|case|break|return|import|package|func|default|type|struct|from|def|if|elif|else|in|class|and|or|not)\b|\b(?:post|verify|createDeal|startSequence|grant|create_ticket|send_message|construct_event|VerifyWebhook|SyncAccount|Error|WriteHeader|Write|route|handle_alert|jsonify|get|Unmarshal)\b|[a-zA-Z_]\w*|[^\s\w]+|\s+)/g);
  
  return tokens.map((part, index) => {
    if (!part) return null;
    
    if (part.startsWith('//') || part.startsWith('#')) {
      return <span key={index} className="text-slate-500 font-normal italic">{part}</span>;
    }
    if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
      return <span key={index} className="text-[#c3e88d]">{part}</span>;
    }
    if (/^(const|let|var|async|await|switch|case|break|return|import|package|func|default|type|struct|from|def|if|elif|else|in|class|and|or|not)$/.test(part)) {
      return <span key={index} className="text-[#c792ea] font-bold">{part}</span>;
    }
    if (/^(post|verify|createDeal|startSequence|grant|create_ticket|send_message|construct_event|VerifyWebhook|SyncAccount|Error|WriteHeader|Write|route|handle_alert|jsonify|get|Unmarshal)$/.test(part)) {
      return <span key={index} className="text-[#82aaff] font-semibold">{part}</span>;
    }
    return <span key={index} className="text-slate-400">{part}</span>;
  });
}

export function CodingPreview() {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [state, setState] = useState<'typing' | 'waiting' | 'deleting'>('typing');
  const [copied, setCopied] = useState(false);

  const currentTab = CODE_TABS[activeTabIdx];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (state === 'typing') {
      if (charIndex < currentTab.code.length) {
        timer = setTimeout(() => {
          setDisplayText(currentTab.code.substring(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        }, 15);
      } else {
        timer = setTimeout(() => {
          setState('waiting');
        }, 0);
      }
    } else if (state === 'waiting') {
      timer = setTimeout(() => {
        setState('deleting');
      }, 4000);
    } else if (state === 'deleting') {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          const nextIndex = Math.max(0, charIndex - 4);
          setDisplayText(currentTab.code.substring(0, nextIndex));
          setCharIndex(nextIndex);
          if (nextIndex === 0) {
            setActiveTabIdx(prev => (prev + 1) % CODE_TABS.length);
            setState('typing');
          }
        }, 10);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, state, activeTabIdx, currentTab.code]);

  const handleTabClick = (idx: number) => {
    if (idx === activeTabIdx) return;
    setCharIndex(0);
    setDisplayText('');
    setActiveTabIdx(idx);
    setState('typing');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-[24px] bg-[#0A0D14] border border-white/5 shadow-2xl overflow-hidden relative group text-left">
      <div className="px-4 py-3 md:px-6 md:py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between gap-4">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        
        <div className="flex gap-2">
          {CODE_TABS.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(idx)}
              className={cn(
                "text-[10px] font-bold px-3 py-1 rounded-md transition-colors cursor-pointer select-none",
                idx === activeTabIdx 
                  ? "bg-white/10 text-white border border-white/5" 
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <button 
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-[10px] font-bold"
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
        <pre className="text-[12px] font-medium leading-relaxed custom-scrollbar overflow-y-auto overflow-x-hidden pr-4 flex-1 text-slate-300">
          {highlightCode(displayText, currentTab.lang)}
          <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse" />
        </pre>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const filteredIntegrations = INTEGRATIONS_DIRECTORY.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus === 'Live') {
      matchesStatus = item.status === 'live';
    } else if (selectedStatus === 'Popular') {
      matchesStatus = item.status === 'popular';
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getHoverDetails = (nodeName: string) => {
    switch (nodeName) {
      case 'Xero':
        return 'Sync ledger entries, invoices, and bank reconciliation statements automatically.';
      case 'Stripe':
        return 'Process card payments, sync customer payment profiles, and dunning retries.';
      case 'HubSpot':
        return 'Sync contact lifecycle stages and deal pipelines from billing events.';
      case 'Salesforce':
        return 'Enterprise accounts sync, custom invoice mapping, and contract lifecycle events.';
      case 'Slack':
        return 'Real-time alerts in Slack channels for paid invoices and failed charges.';
      case 'QuickBooks':
        return 'Sync sales receipts, general ledgers, tax rules, and invoice collections.';
      default:
        return '';
    }
  };

  return (
    <main className="bg-background min-h-screen pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-white dark:bg-transparent pt-20 pb-16 overflow-hidden border-b border-slate-200/60 dark:border-white/10">
        {/* Background Grid Lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[550px] z-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(162,140,255,0.06),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(162,140,255,0.12),transparent_65%)]" />
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
            
            {/* Left side text and stats */}
            <div className="lg:col-span-6 text-left">
              {/* Integrations Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/50 dark:bg-white/5 dark:border-white/10 text-xs font-bold shadow-sm mb-6">
                <span className="w-1.5 h-1.5 bg-primary rounded-full inline-block animate-pulse" />
                <span className="text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  Integrations
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
                Connect every tool your business already uses.
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-xl">
                Recura plugs directly into your CRM, accounting software, payment gateways, and analytics stack — so your billing data flows where you need it, automatically.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                <Button 
                  onClick={() => {
                    const el = document.getElementById('directory');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-6 rounded-full font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 transition-all duration-300 cursor-pointer"
                >
                  Browse integrations
                </Button>
                <Button className="w-full sm:w-auto px-8 py-6 rounded-full font-bold border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 flex items-center justify-center gap-1.5 transition-all duration-300">
                  <span>Read the docs</span>
                  <span className="text-sm">→</span>
                </Button>
              </div>

              {/* Stats column block */}
              <div className="grid grid-cols-3 gap-6 border-t border-slate-200/60 dark:border-white/10 pt-8">
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-primary block mb-1">120+</span>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide uppercase leading-normal">Native integrations</span>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-primary block mb-1">REST</span>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide uppercase leading-normal">API &amp; webhooks</span>
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-primary block mb-1">No-code</span>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide uppercase leading-normal">Setup in minutes</span>
                </div>
              </div>
            </div>

            {/* Right side connection graph */}
            <div className="lg:col-span-6 w-full flex items-center justify-center overflow-visible py-2 sm:py-8">
              <div className="relative w-[600px] h-[500px] shrink-0 scale-[0.68] sm:scale-[0.85] md:scale-[0.9] lg:scale-100 origin-center transition-all duration-300 overflow-visible select-none my-[-70px] sm:my-0">
                
                {/* CSS Keyframes for Orbit Rotations */}
                <style>{`
                  @keyframes rotateRight {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                  }
                  @keyframes rotateLeft {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(-360deg); }
                  }
                  .animate-rotate-right {
                    animation: rotateRight 24s linear infinite;
                  }
                  .animate-rotate-left {
                    animation: rotateLeft 28s linear infinite;
                  }
                `}</style>

                {/* Rotating Orbit Circles (Highly visible purple in both light and dark modes) */}
                {/* Inner Orbit Circle */}
                <div className="absolute left-1/2 top-1/2 w-[200px] h-[200px] rounded-full border border-dashed border-primary/50 dark:border-primary/40 animate-rotate-left pointer-events-none z-0" />
                {/* Outer Orbit Circle */}
                <div className="absolute left-1/2 top-1/2 w-[380px] h-[380px] rounded-full border border-dashed border-primary/30 dark:border-primary/25 animate-rotate-right pointer-events-none z-0" />

                {/* Outer SVG Lines and Pulse Animations */}
                <svg 
                  viewBox="0 0 600 500" 
                  className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Connecting Lines (Highly visible primary strokes) */}
                  <line x1="300" y1="250" x2="100" y2="80" className="stroke-primary/50 dark:stroke-primary/45 stroke-[1.5px]" strokeDasharray="4 4" />
                  <line x1="300" y1="250" x2="500" y2="80" className="stroke-primary/50 dark:stroke-primary/45 stroke-[1.5px]" strokeDasharray="4 4" />
                  <line x1="300" y1="250" x2="80" y2="240" className="stroke-primary/50 dark:stroke-primary/45 stroke-[1.5px]" strokeDasharray="4 4" />
                  <line x1="300" y1="250" x2="520" y2="240" className="stroke-primary/50 dark:stroke-primary/45 stroke-[1.5px]" strokeDasharray="4 4" />
                  <line x1="300" y1="250" x2="100" y2="400" className="stroke-primary/50 dark:stroke-primary/45 stroke-[1.5px]" strokeDasharray="4 4" />
                  <line x1="300" y1="250" x2="500" y2="400" className="stroke-primary/50 dark:stroke-primary/45 stroke-[1.5px]" strokeDasharray="4 4" />

                  {/* Pulse particles travelling along connector lines (SVG animateMotion) */}
                  <circle r="4.5" fill="var(--color-primary)" className="shadow-lg shadow-primary/50">
                    <animateMotion path="M 300 250 L 100 80" dur="2.8s" repeatCount="indefinite" />
                  </circle>
                  <circle r="4.5" fill="var(--color-primary)" className="shadow-lg shadow-primary/50">
                    <animateMotion path="M 300 250 L 500 80" dur="3.4s" repeatCount="indefinite" />
                  </circle>
                  <circle r="4.5" fill="var(--color-primary)" className="shadow-lg shadow-primary/50">
                    <animateMotion path="M 300 250 L 80 240" dur="4.2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="4.5" fill="var(--color-primary)" className="shadow-lg shadow-primary/50">
                    <animateMotion path="M 300 250 L 520 240" dur="2.6s" repeatCount="indefinite" />
                  </circle>
                  <circle r="4.5" fill="var(--color-primary)" className="shadow-lg shadow-primary/50">
                    <animateMotion path="M 300 250 L 100 400" dur="3.1s" repeatCount="indefinite" />
                  </circle>
                  <circle r="4.5" fill="var(--color-primary)" className="shadow-lg shadow-primary/50">
                    <animateMotion path="M 300 250 L 500 400" dur="3.7s" repeatCount="indefinite" />
                  </circle>
                </svg>

                {/* Centered Recura core node (Horizontal capsule with dynamic light/dark background and double faint box shadow) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-36 h-20 rounded-2xl bg-white dark:bg-[#0D0518]/90 border border-slate-200 dark:border-primary/50 flex flex-col items-center justify-center shadow-[0_0_0_6px_rgba(162,140,255,0.05),0_0_25px_rgba(162,140,255,0.12)] dark:shadow-[0_0_0_6px_rgba(162,140,255,0.15),0_0_30px_rgba(162,140,255,0.3)] select-none">
                  <span className="text-base font-black tracking-tight text-primary">Recura</span>
                </div>

                {/* Xero Node (Top Left) */}
                <div 
                  onMouseEnter={() => setHoveredNode('Xero')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="absolute left-[40px] top-[40px] z-10 flex items-center gap-3.5 px-4.5 py-3 rounded-2xl bg-white dark:bg-[#150a2e] border border-slate-200/80 dark:border-white/10 hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571963/xero_box.svg" alt="Xero" width={28} height={28} className="w-7 h-7 object-contain shrink-0" />
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">Xero</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block">Accounting</span>
                  </div>
                </div>

                {/* Stripe Node (Top Right) */}
                <div 
                  onMouseEnter={() => setHoveredNode('Stripe')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="absolute right-[40px] top-[40px] z-10 flex items-center gap-3.5 px-4.5 py-3 rounded-2xl bg-white dark:bg-[#150a2e] border border-slate-200/80 dark:border-white/10 hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571953/stripe_box.svg" alt="Stripe" width={28} height={28} className="w-7 h-7 object-contain shrink-0" />
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">Stripe</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block">Payments</span>
                  </div>
                </div>

                {/* HubSpot Node (Mid Left) */}
                <div 
                  onMouseEnter={() => setHoveredNode('HubSpot')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="absolute left-[20px] top-[200px] z-10 flex items-center gap-3.5 px-4.5 py-3 rounded-2xl bg-white dark:bg-[#150a2e] border border-slate-200/80 dark:border-white/10 hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571779/hubspot_box.svg" alt="HubSpot" width={28} height={28} className="w-7 h-7 object-contain shrink-0" />
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">HubSpot</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block">CRM</span>
                  </div>
                </div>

                {/* Salesforce Node (Mid Right) */}
                <div 
                  onMouseEnter={() => setHoveredNode('Salesforce')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="absolute right-[20px] top-[200px] z-10 flex items-center gap-3.5 px-4.5 py-3 rounded-2xl bg-white dark:bg-[#150a2e] border border-slate-200/80 dark:border-white/10 hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571934/salesforce_box.svg" alt="Salesforce" width={28} height={28} className="w-7 h-7 object-contain shrink-0" />
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">Salesforce</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block">CRM</span>
                  </div>
                </div>

                {/* Slack Node (Bottom Left) */}
                <div 
                  onMouseEnter={() => setHoveredNode('Slack')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="absolute left-[40px] bottom-[40px] z-10 flex items-center gap-3.5 px-4.5 py-3 rounded-2xl bg-white dark:bg-[#150a2e] border border-slate-200/80 dark:border-white/10 hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571943/slack_box.svg" alt="Slack" width={28} height={28} className="w-7 h-7 object-contain shrink-0" />
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">Slack</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block">Notifications</span>
                  </div>
                </div>

                {/* QuickBooks Node (Bottom Right) */}
                <div 
                  onMouseEnter={() => setHoveredNode('QuickBooks')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="absolute right-[40px] bottom-[40px] z-10 flex items-center gap-3.5 px-4.5 py-3 rounded-2xl bg-white dark:bg-[#150a2e] border border-slate-200/80 dark:border-white/10 hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571798/quickbooks_box.svg" alt="QuickBooks" width={28} height={28} className="w-7 h-7 object-contain shrink-0" />
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">QuickBooks</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase block">Accounting</span>
                  </div>
                </div>

                {/* Hover-based Cloud Thinking Tooltips (Positioned next to respective hovered nodes - HIDDEN on mobile/tablet viewport sizes) */}
                {hoveredNode === 'Xero' && (
                  <div className="hidden lg:block absolute left-[20px] top-[105px] w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-primary/30 text-slate-800 dark:text-white rounded-2xl p-4.5 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-200 select-none text-left">
                    <div className="absolute -top-1.5 left-12 w-3 h-3 rotate-45 bg-white dark:bg-slate-900 border-l border-t border-slate-200 dark:border-primary/30" />
                    <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-1">Xero Sync</span>
                    <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-300">
                      {getHoverDetails('Xero')}
                    </p>
                  </div>
                )}

                {hoveredNode === 'Stripe' && (
                  <div className="hidden lg:block absolute right-[20px] top-[105px] w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-primary/30 text-slate-800 dark:text-white rounded-2xl p-4.5 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-200 select-none text-left">
                    <div className="absolute -top-1.5 right-12 w-3 h-3 rotate-45 bg-white dark:bg-slate-900 border-l border-t border-slate-200 dark:border-primary/30" />
                    <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-1">Stripe Sync</span>
                    <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-300">
                      {getHoverDetails('Stripe')}
                    </p>
                  </div>
                )}

                {hoveredNode === 'HubSpot' && (
                  <div className="hidden lg:block absolute left-[10px] top-[265px] w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-primary/30 text-slate-800 dark:text-white rounded-2xl p-4.5 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-200 select-none text-left">
                    <div className="absolute -top-1.5 left-12 w-3 h-3 rotate-45 bg-white dark:bg-slate-900 border-l border-t border-slate-200 dark:border-primary/30" />
                    <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-1">HubSpot Sync</span>
                    <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-300">
                      {getHoverDetails('HubSpot')}
                    </p>
                  </div>
                )}

                {hoveredNode === 'Salesforce' && (
                  <div className="hidden lg:block absolute right-[10px] top-[265px] w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-primary/30 text-slate-800 dark:text-white rounded-2xl p-4.5 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-200 select-none text-left">
                    <div className="absolute -top-1.5 right-12 w-3 h-3 rotate-45 bg-white dark:bg-slate-900 border-l border-t border-slate-200 dark:border-primary/30" />
                    <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-1">Salesforce Sync</span>
                    <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-300">
                      {getHoverDetails('Salesforce')}
                    </p>
                  </div>
                )}

                {hoveredNode === 'Slack' && (
                  <div className="hidden lg:block absolute left-[20px] bottom-[105px] w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-primary/30 text-slate-800 dark:text-white rounded-2xl p-4.5 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-200 select-none text-left">
                    <div className="absolute -bottom-1.5 left-12 w-3 h-3 rotate-45 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-primary/30" />
                    <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-1">Slack Alerts</span>
                    <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-300">
                      {getHoverDetails('Slack')}
                    </p>
                  </div>
                )}

                {hoveredNode === 'QuickBooks' && (
                  <div className="hidden lg:block absolute right-[20px] bottom-[105px] w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-primary/30 text-slate-800 dark:text-white rounded-2xl p-4.5 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-200 select-none text-left">
                    <div className="absolute -bottom-1.5 right-12 w-3 h-3 rotate-45 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-primary/30" />
                    <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-1">QuickBooks Sync</span>
                    <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-300">
                      {getHoverDetails('QuickBooks')}
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Section */}
      <section id="directory" className="py-24 bg-[#F8F9FC] dark:bg-transparent overflow-hidden border-b border-slate-200/60 dark:border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Header text */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left max-w-5xl mx-auto">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">All Integrations</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                Every tool your revenue stack depends on
              </h2>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed md:text-right">
              From payment gateways to ERP systems — connect once and let your data flow.
            </p>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-7xl mx-auto mb-12 bg-white dark:bg-white/[0.01] border border-slate-200/60 dark:border-white/10 rounded-2xl p-4 shadow-sm">
            {/* Category selection tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    selectedCategory === cat 
                      ? "bg-primary text-white shadow-md shadow-primary/10"
                      : "bg-[#F8F9FC] dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right side: Search Box and Status Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {/* Status Filters Toggle */}
              <div className="flex items-center bg-[#F8F9FC] dark:bg-white/5 p-1 rounded-xl border border-slate-200/30 dark:border-white/10 shrink-0">
                {STATUS_FILTERS.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                      selectedStatus === status
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Input Search Box */}
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search integrations..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-0 focus:border-primary/50 bg-[#F8F9FC] dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Integrations catalog grid (Unified 12-column grid that flows naturally) */}
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            
            {/* Grid of Cards (Both featured and regular cards rendered together) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Conditional Featured Layout for All + Default view */}
              {selectedCategory === 'All' && !search && selectedStatus === 'All Status' ? (
                <>
                  {/* Stripe Featured Card (lg:col-span-2) */}
                  <div className="md:col-span-2 bg-[#F8F9FC] dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2.5 mb-5">
                          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-[9px] font-black uppercase text-primary tracking-wider">
                            MOST POPULAR
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                            LIVE
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight group-hover:text-primary transition-colors">
                          Stripe
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
                          Payment Gateway • Billing • Subscriptions
                        </span>
                        <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400 mb-6">
                          Sync Recura subscriptions bidirectionally with Stripe — plan upgrades, coupon codes, trial management, payment method vaults, and real-time webhook delivery. Handle SCA, 3DS2, and card decline logic automatically with Recura&apos;s smart dunning on top.
                        </p>
                        
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {['Webhook sync', 'Dunning automation', '3DS2 ready', 'Multi-currency', 'Proration'].map((t) => (
                            <span key={t} className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200/30 dark:border-white/5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-200/50 dark:border-white/5 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <Button className="px-6 py-4.5 rounded-xl font-bold bg-primary hover:bg-primary/95 text-white text-xs shadow-md shadow-primary/10">
                          Connect Stripe
                        </Button>
                        <span className="text-[10px] font-bold text-slate-400 tracking-wide">
                          Used by 3,200+ customers
                        </span>
                      </div>
                    </div>

                    {/* Icon Block */}
                    <div className="hidden md:flex items-center justify-center shrink-0 w-32 h-32 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/20 dark:border-white/5 self-center">
                      <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571953/stripe_box.svg" alt="Stripe" width={64} height={64} className="w-16 h-16 object-contain" />
                    </div>
                  </div>

                  {/* Salesforce Card (lg:col-span-1) */}
                  <div className="bg-[#F8F9FC] dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571934/salesforce_box.svg" alt="Salesforce" width={32} height={32} className="w-8 h-8 object-contain" />
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                          LIVE
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 tracking-tight group-hover:text-primary transition-colors">
                        Salesforce
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
                        CRM • SALES CLOUD
                      </span>
                      <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400 mb-6">
                        Push subscription data into Salesforce Opportunities and Accounts. Trigger workflows when plans change, trials expire, or invoices go unpaid. Keep your sales team in the loop without manual data entry.
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {['Bi-directional sync', 'Opportunity mapping', 'Custom objects'].map((t) => (
                          <span key={t} className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200/30 dark:border-white/5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-200/50 dark:border-white/5 pt-5 flex items-center justify-between">
                      <Link href="#" className="text-xs font-bold text-primary hover:text-primary/95 transition-colors inline-flex items-center gap-1">
                        <span>Connect</span>
                        <span>→</span>
                      </Link>
                      <span className="text-[9px] font-bold text-slate-400">
                        1,800+ customers
                      </span>
                    </div>
                  </div>

                  {/* Rest of the catalog grid (flowing naturally under Stripe and Salesforce featured row) */}
                  {filteredIntegrations.filter(item => !item.featured).map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-[#F8F9FC] dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-5">
                          {item.iconPath ? (
                            <div className="p-2 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center border border-slate-200/30 dark:border-white/5 group-hover:scale-105 transition-transform duration-300">
                              <Image src={item.iconPath} alt={item.name} width={24} height={24} className="w-6 h-6 object-contain" />
                            </div>
                          ) : null}
                          
                          <div className="flex items-center gap-1.5">
                            {item.status === 'popular' && (
                              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-[9px] font-black uppercase text-primary tracking-wider">
                                POPULAR
                              </span>
                            )}
                            {item.status === 'live' && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                                LIVE
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1 tracking-tight group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
                          {item.category}
                        </span>
                        <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400 mb-6">
                          {item.desc}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {item.tags?.map((t) => (
                            <span key={t} className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200/30 dark:border-white/5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-200/50 dark:border-white/5 pt-4 mt-5 flex items-center justify-between">
                        <Link href="#" className="text-xs font-bold text-primary hover:text-primary/95 transition-colors inline-flex items-center gap-1">
                          {item.status === 'new' ? <span>Migrate</span> : <span>Connect</span>}
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                /* Search / Filtered standard grid */
                filteredIntegrations.map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-[#F8F9FC] dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                  >
                    <div>
                      {/* Badge and Icon */}
                      <div className="flex items-center justify-between gap-4 mb-5">
                        {item.iconPath ? (
                          <div className="p-2 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center border border-slate-200/30 dark:border-white/5 group-hover:scale-105 transition-transform duration-300">
                            <Image src={item.iconPath} alt={item.name} width={24} height={24} className="w-6 h-6 object-contain" />
                          </div>
                        ) : null}
                        
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                          item.status === 'live' || item.status === 'popular'
                            ? "bg-primary/10 text-primary"
                            : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                        )}>
                          {item.status}
                        </span>
                      </div>

                      {/* Header */}
                      <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 tracking-tight group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      {/* Description */}
                      <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </p>
                    </div>

                    <div className="border-t border-slate-200/50 dark:border-white/5 pt-4 mt-5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                      <Link href="#" className="inline-flex items-center gap-1 text-[10px] font-black text-primary hover:text-primary/95 transition-colors">
                        <span>Setup sync</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))
              )}

              {filteredIntegrations.length === 0 && (
                <div className="col-span-full bg-white dark:bg-white/[0.01] border border-slate-200/60 dark:border-white/10 rounded-2xl p-12 text-center select-none">
                  <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400 block mb-1">No integrations found</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">Try refining your search terms or selecting another category.</span>
                </div>
              )}
            </div>

            {/* Stripe + Recura Deep Integration Banner Showcase Section (Move to the very bottom of the directory) */}
            {selectedCategory === 'All' && !search && selectedStatus === 'All Status' && (
              <div className="bg-slate-50/50 dark:bg-white/[0.01] border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12 text-left relative overflow-hidden">
                {/* Subtle loading light pulse strip on top of the banner to make it feel alive */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 animate-[pulse_3s_infinite]" />

                {/* Left side text details */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571953/stripe_box.svg" alt="Stripe" width={36} height={36} className="w-9 h-9 object-contain" />
                      <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-[9px] font-black uppercase text-primary tracking-wider">
                        DEEP INTEGRATION
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">
                      Stripe + Recura
                    </h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-6">
                      PAYMENT GATEWAY • REAL-TIME SYNC
                    </span>
                    <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 mb-8 max-w-xl">
                      When a customer upgrades on your app, Recura instantly updates Stripe with the correct proration, generates the invoice, and posts the event to your analytics — all in under 200ms.
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-3 mb-8">
                      {[
                        'Real-time webhook processing at sub-200ms latency',
                        'Smart dunning with 11-step retry sequences',
                        'Proration calculations handled automatically',
                        'SCA / 3DS2 compliance built in',
                        'Multi-currency settlement across 135+ currencies'
                      ].map((bullet) => (
                        <div key={bullet} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-slate-200/50 dark:border-white/5 pt-6">
                    <Button className="px-6 py-4.5 rounded-xl font-bold bg-primary hover:bg-primary/95 text-white text-xs shadow-md shadow-primary/10">
                      Connect Stripe
                    </Button>
                    <Link href="#" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center gap-1">
                      <span>View docs</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>

                {/* Right: iPad Mockup Frame displaying stripe_payment.png */}
                <div className="lg:col-span-5 w-full flex items-center justify-center overflow-visible">
                  <div className="relative w-full max-w-[380px] aspect-[4/5.2] rounded-[32px] bg-slate-950 p-2.5 border-4 border-slate-900 dark:border-white/10 shadow-2xl shadow-primary/20 select-none">
                    {/* Front camera notch */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-slate-950 rounded-full z-20 border border-slate-900" />
                    
                    {/* Browser Screen */}
                    <div className="w-full h-full rounded-[20px] overflow-hidden bg-white dark:bg-[#0D0518] relative border border-slate-200/50 dark:border-white/5 flex flex-col">
                      {/* Header Bar */}
                      <div className="h-6 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200/60 dark:border-white/5 flex items-center px-3 gap-1 select-none shrink-0 relative">
                        {/* Loading light pulse bar */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-pink-500 to-primary animate-[pulse_2.2s_infinite]" />
                        
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 mx-auto leading-none pr-6">
                          recura.com • stripe-sync
                        </span>
                      </div>
                      
                      {/* Screenshot Image (fits in well without being cropped) */}
                      <div className="relative w-full flex-1 bg-[#F8F9FC] dark:bg-slate-950 p-1.5">
                        <div className="relative w-full h-full rounded-lg overflow-hidden">
                          <Image 
                            src="https://res.cloudinary.com/weburea/image/upload/v1783571827/stripe_payment.png" 
                            alt="Stripe Recura Sync Dashboard Mockup" 
                            fill 
                            className="object-contain" 
                            sizes="380px"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </section>

      {/* Payment Gateways Section */}
      <section className="py-24 bg-[#F8F9FC] dark:bg-transparent overflow-hidden border-t border-slate-200/60 dark:border-white/10 text-left">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-3">
              Payment Gateways
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Every payment method your customers expect
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
              Accept cards, wallets, bank transfers, and local payment methods worldwide — all managed from a single Recura dashboard.
            </p>
          </div>

          {/* Grid of 5 Gateways (Expanded to max-w-7xl) */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {PAYMENT_GATEWAYS.map((gateway) => (
              <div 
                key={gateway.name}
                className={cn(
                  "border rounded-3xl p-6 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group",
                  gateway.featured 
                    ? "bg-primary/10 border-primary/30 shadow-primary/5 shadow-sm"
                    : "bg-[#F8F9FC] dark:bg-white/[0.02] border-slate-200/50 dark:border-white/5 shadow-sm"
                )}
              >
                <div>
                  {/* Logo block */}
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-slate-200/20 dark:border-white/5 flex items-center justify-center p-2 mb-6 shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Image 
                      src={gateway.iconPath} 
                      alt={gateway.name} 
                      width={32} 
                      height={32} 
                      className="w-8 h-8 object-contain" 
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2 tracking-tight group-hover:text-primary transition-colors">
                    {gateway.name}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400 mb-6">
                    {gateway.desc}
                  </p>
                </div>

                {/* Status indicator row */}
                <div className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0 animate-pulse" />
                  <span>{gateway.status}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-transparent overflow-hidden border-y-2 border-dotted border-primary/30 relative text-left">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Section Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16 max-w-7xl mx-auto">
            <div className="lg:col-span-7">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">
                How it works
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                From connection to<br className="hidden sm:inline" /> automation in minutes
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-8">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed lg:text-right max-w-md ml-auto">
                No engineers needed. Every integration is configured through Recura&apos;s visual connector — point, click, and your data flows.
              </p>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Step 1 */}
            <div className="bg-[#F4F5F9]/55 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
              <div>
                <span className="text-[11px] font-bold text-primary/70 tracking-wider block mb-3 uppercase">Step 01</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">Connect your tools</h3>
                <p className="text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400 mb-6">
                  Browse the integration directory, click Connect, and authenticate with OAuth in one click. Your credentials are encrypted at rest with AES-256 and never stored in plain text.
                </p>
              </div>
              <div className="space-y-3.5 border-t border-slate-200/55 dark:border-white/5 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Browse 120+ native connectors</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">One-click OAuth — no API keys to manage</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Data encrypted end-to-end</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F4F5F9]/55 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
              <div>
                <span className="text-[11px] font-bold text-primary/70 tracking-wider block mb-3 uppercase">Step 02</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">Map your data fields</h3>
                <p className="text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400 mb-6">
                  Use Recura&apos;s visual field mapper to define exactly which subscription events trigger which actions in your connected tools — no custom code, no middleware.
                </p>
              </div>
              <div className="space-y-3.5 border-t border-slate-200/55 dark:border-white/5 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Drag-and-drop field mapping</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Smart defaults for common use cases</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Test with live data before going live</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F4F5F9]/55 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
              <div>
                <span className="text-[11px] font-bold text-primary/70 tracking-wider block mb-3 uppercase">Step 03</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">Set your triggers</h3>
                <p className="text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400 mb-6">
                  Define what fires when. New signup, plan upgrade, failed payment, trial expiry, churn — choose any billing lifecycle event as an automation trigger and map it to any action in your connected tools.
                </p>
              </div>
              <div className="space-y-3.5 border-t border-slate-200/55 dark:border-white/5 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">40+ billing lifecycle trigger events</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Conditional logic and branching</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Real-time webhook delivery</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#F4F5F9]/55 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
              <div>
                <span className="text-[11px] font-bold text-primary/70 tracking-wider block mb-3 uppercase">Step 04</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">Monitor and iterate</h3>
                <p className="text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400 mb-6">
                  Watch your integration health in real time. Every event is logged with full payloads, retry status, and error traces — so your team can debug issues in seconds, not hours.
                </p>
              </div>
              <div className="space-y-3.5 border-t border-slate-200/55 dark:border-white/5 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Full event log with payload inspection</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Automatic retry with exponential backoff</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Slack / email alerts on integration errors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Intelligence Section */}
      <section className="py-24 bg-white dark:bg-transparent overflow-hidden border-b-2 border-dotted border-primary/30 relative text-left">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
            
            {/* Left Column: Text and Details Grid */}
            <div className="lg:col-span-6">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">
                Revenue Intelligence
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
                Analytics that connect across every integration
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-xl">
                When Recura is connected to your entire stack, you get a single source of truth for revenue intelligence — attribution, cohort analysis, forecasting, and churn prediction, all in one place.
              </p>

              {/* 2x2 Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Feature 1 */}
                <div className="bg-[#F8F9FC] dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <h3 className="text-xl font-black text-primary mb-1">
                    Real-time
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed text-slate-400 dark:text-slate-500">
                    Revenue data across all connected tools
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-[#F8F9FC] dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1">
                    360°
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed text-slate-400 dark:text-slate-500">
                    Customer view across CRM, billing, and support
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-[#F8F9FC] dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1">
                    50+
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed text-slate-400 dark:text-slate-500">
                    Pre-built revenue metric dashboards
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-[#F8F9FC] dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1">
                    CSV / API
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed text-slate-400 dark:text-slate-500">
                    Export to any BI tool — Looker, Tableau, Metabase
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Rotated Tablet Mockup Frame displaying Video */}
            <div className="lg:col-span-6 w-full flex items-center justify-center overflow-visible">
              <div className="relative w-full max-w-[600px] aspect-[1.6/1] rounded-[32px] bg-slate-950 p-2.5 border-4 border-slate-900 dark:border-white/10 shadow-2xl shadow-primary/20 select-none overflow-hidden">
                {/* Front camera notch - positioned vertically on the left side to represent a rotated landscape tablet */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-16 bg-slate-950 rounded-full z-20 border border-slate-900" />
                
                {/* Browser/Dashboard Screen */}
                <div className="w-full h-full rounded-[20px] overflow-hidden bg-white dark:bg-[#0D0518] relative border border-slate-200/50 dark:border-white/5 flex flex-col">
                  {/* Header Bar */}
                  <div className="h-6 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200/60 dark:border-white/5 flex items-center px-3 gap-1 select-none shrink-0 relative pl-4">
                    {/* Loading light pulse bar */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-pink-500 to-primary animate-[pulse_2.2s_infinite]" />
                    
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 mx-auto leading-none pr-12">
                      recura.com • revenue-intelligence-dashboard
                    </span>
                  </div>
                  
                  {/* Video Showcase Element */}
                  <div className="relative w-full flex-1 bg-[#F8F9FC] dark:bg-slate-950 overflow-hidden">
                    <video 
                      src="https://res.cloudinary.com/weburea/video/upload/v1783568301/analytics_screen_gxqtzo.mp4" 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-fill"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* For Developers Section */}
      <section className="py-24 bg-[#F8F9FC] dark:bg-transparent overflow-hidden border-b-2 border-dotted border-primary/30 relative text-left">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
            
            {/* Left Column: Code Preview */}
            <div className="lg:col-span-6 w-full flex items-center justify-center overflow-visible">
              <CodingPreview />
            </div>

            {/* Right Column: Title and 3 Feature Cards */}
            <div className="lg:col-span-6">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">
                For Developers
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
                Build exactly the integration you need
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-xl">
                Recura&apos;s REST API and webhook system give developers full control. Subscribe to any billing lifecycle event and build custom integrations into any tool in your stack — with typed SDKs for Node.js, Python, Ruby, Go, and PHP.
              </p>

              {/* List of 3 Feature Cards */}
              <div className="space-y-4">
                {/* Webhook signatures */}
                <div className="flex gap-4 p-5 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-white/[0.02] shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Webhook signatures</h4>
                    <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                      Every webhook is signed with HMAC-SHA256. Verify authenticity in one line with any of our SDKs.
                    </p>
                  </div>
                </div>

                {/* Idempotency keys */}
                <div className="flex gap-4 p-5 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-white/[0.02] shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Idempotency keys</h4>
                    <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                      Pass an idempotency key to safely retry any write request without risk of duplicate operations.
                    </p>
                  </div>
                </div>

                {/* Typed SDKs */}
                <div className="flex gap-4 p-5 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-white/[0.02] shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Typed SDKs in 5 languages</h4>
                    <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                      Node.js, Python, Ruby, Go, and PHP SDKs — auto-generated from our OpenAPI spec, always in sync with the API.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Integrations CTA Section */}
      <section className="py-24 bg-[#0A0D14] text-white overflow-hidden relative text-center">
        {/* Background Pattern using same lines SVG as Hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[550px] z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_65%)]" />
          <Image
            src="https://res.cloudinary.com/weburea/image/upload/v1783571760/Grid_hero_lines.svg"
            alt="Background Pattern"
            fill
            className="object-contain opacity-40 pointer-events-none"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          {/* Label */}
          <span className="text-primary font-bold text-xs tracking-widest uppercase mb-4 block">
            Start Integrating Today
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight max-w-2xl mx-auto">
            Connect your entire revenue stack in minutes
          </h2>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            120+ native integrations, a full REST API, and no-code workflows — Recura connects to everything your business already runs on.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-12">
            <div className="w-full sm:w-auto">
              <Button 
                className="w-full px-6 py-4.5 rounded-xl font-bold bg-primary hover:bg-primary/95 text-white text-xs shadow-md shadow-primary/10 transition-all hover:scale-105 hover:-translate-y-0.5"
              >
                Browse all integrations
              </Button>
            </div>
            <div className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="w-full px-6 py-4.5 rounded-xl font-bold border-white/10 hover:bg-white/5 text-slate-300 text-xs transition-all hover:scale-105 hover:-translate-y-0.5"
              >
                Read the docs
              </Button>
            </div>
            <div className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="w-full px-6 py-4.5 rounded-xl font-bold border-white/10 hover:bg-white/5 text-slate-300 text-xs transition-all hover:scale-105 hover:-translate-y-0.5"
              >
                Talk to an engineer
              </Button>
            </div>
          </div>

          {/* Checklist Row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>120+ native connectors</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span>REST API & webhooks</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span>SOC 2 Type II certified</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
