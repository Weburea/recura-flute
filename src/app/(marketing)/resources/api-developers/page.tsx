"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import { 
  BookOpen, LayoutDashboard, Receipt, Wallet, Database, Terminal, Video, MessageSquare, Search, Sparkles,
  Clock, ChevronRight, Download, Check, Copy, Code, Shield, RefreshCw, Phone
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

const SDKS = [
  {
    name: "Node.js",
    version: "v4.2.1",
    width: 32,
    height: 32,
    body: `<path d="M16 20.003v2h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2v-2h4v-2h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2Z"/><path d="m16 3.003l-12 7v14l4 2h6v-13.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v11.5H8l-2-1.034V11.15l10-5.833l10 5.833v11.703l-10 5.833l-1.745-1.022L13 29.253l3 1.75l12-7v-14Z"/>`
  },
  {
    name: "Python",
    version: "v3.1.8",
    width: 24,
    height: 24,
    body: `<path d="M9.86 2A2.86 2.86 0 0 0 7 4.86v1.68h4.29c.39 0 .71.57.71.96H4.86A2.86 2.86 0 0 0 2 10.36v3.781a2.86 2.86 0 0 0 2.86 2.86h1.18v-2.68a2.85 2.85 0 0 1 2.85-2.86h5.25c1.58 0 2.86-1.271 2.86-2.851V4.86A2.86 2.86 0 0 0 14.14 2zm-.72 1.61c.4 0 .72.12.72.71s-.32.891-.72.891c-.39 0-.71-.3-.71-.89s.32-.711.71-.711"/><path d="M17.959 7v2.68a2.85 2.85 0 0 1-2.85 2.859H9.86A2.85 2.85 0 0 0 7 15.389v3.75a2.86 2.86 0 0 0 2.86 2.86h4.28A2.86 2.86 0 0 0 17 19.14v-1.68h-4.291c-.39 0-.709-.57-.709-.96h7.14A2.86 2.86 0 0 0 22 13.64V9.86A2.86 2.86 0 0 0 19.14 7zM8.32 11.513l-.004.004l.038-.004zm6.54 7.276c.39 0 .71.3.71.89a.71.71 0 0 1-.71.71c-.4 0-.72-.12-.72-.71s.32-.89.72-.89"/>`
  },
  {
    name: "Ruby",
    version: "v2.8.0",
    width: 24,
    height: 24,
    body: `<path d="M18.041 3.177c2.24.382 2.879 1.919 2.843 3.527V6.67l-1.013 13.266l-13.132.897h.008c-1.093-.044-3.518-.151-3.634-3.545l1.217-2.222l2.462 5.74l2.097-6.77l-.045.009l.018-.018l6.85 2.186L13.945 9.3l6.53-.409l-5.144-4.212l2.71-1.51v.009M3.113 17.252v.017zM6.916 6.874c2.63-2.622 6.033-4.168 7.34-2.844c1.297 1.306-.072 4.523-2.702 7.135c-2.666 2.613-6.015 4.248-7.322 2.933c-1.306-1.324.036-4.612 2.675-7.224z"/>`
  },
  {
    name: "Go",
    version: "v1.5.2",
    width: 32,
    height: 32,
    body: `<path d="M2 12h4v2H2zm-2 4h6v2H0zm4 4h2v2H4zm16.954-5H14v3h3.239a4.42 4.42 0 0 1-3.531 2a2.65 2.65 0 0 1-2.053-.858a2.86 2.86 0 0 1-.628-2.28A4.515 4.515 0 0 1 15.292 13a2.73 2.73 0 0 1 1.749.584l2.962-1.185A5.6 5.6 0 0 0 15.292 10a7.526 7.526 0 0 0-7.243 6.5a5.614 5.614 0 0 0 5.659 6.5a7.526 7.526 0 0 0 7.243-6.5a6.4 6.4 0 0 0 .003-1.5"/><path d="M26.292 10a7.526 7.526 0 0 0-7.243 6.5a5.614 5.614 0 0 0 5.659 6.5a7.526 7.526 0 0 0 7.243-6.5a5.614 5.614 0 0 0-5.659-6.5m2.681 6.137A4.515 4.515 0 0 1 24.708 20a2.65 2.65 0 0 1-2.053-.858a2.86 2.86 0 0 1-.628-2.28A4.515 4.515 0 0 1 26.292 13a2.65 2.65 0 0 1 2.053.858a2.86 2.86 0 0 1 .628 2.28Z"/>`
  },
  {
    name: "Laravel",
    version: "v3.0.2",
    width: 32,
    height: 32,
    body: `<path d="M31.963 9.12c-.008-.03-.023-.056-.034-.085a1 1 0 0 0-.07-.156a2 2 0 0 0-.162-.205a1 1 0 0 0-.088-.072a1 1 0 0 0-.083-.068l-.044-.02l-.035-.024l-6-3a1 1 0 0 0-.894 0l-6 3l-.035.024l-.044.02a1 1 0 0 0-.083.068a.7.7 0 0 0-.187.191a1 1 0 0 0-.064.086a1 1 0 0 0-.069.156c-.01.029-.026.055-.034.085a1 1 0 0 0-.037.265v5.382l-4 2V5.385a1 1 0 0 0-.037-.265c-.008-.03-.023-.056-.034-.085a1 1 0 0 0-.07-.156a1 1 0 0 0-.063-.086a.7.7 0 0 0-.187-.191a1 1 0 0 0-.083-.068l-.044-.02l-.035-.024l-6-3a1 1 0 0 0-.894 0l-6 3l-.035.024l-.044.02a1 1 0 0 0-.083.068a1 1 0 0 0-.088.072a1 1 0 0 0-.1.119a1 1 0 0 0-.063.086a1 1 0 0 0-.069.156c-.01.029-.026.055-.034.085A1 1 0 0 0 0 5.385v19a1 1 0 0 0 .553.894l6 3l6 3c.014.007.03.005.046.011a.9.9 0 0 0 .802 0c.015-.006.032-.004.046-.01l12-6a1 1 0 0 0 .553-.895v-5.382l5.447-2.724a1 1 0 0 0 .553-.894v-6a1 1 0 0 0-.037-.265M9.236 21.385l4.211-2.106h.001L19 16.503l3.764 1.882L13 23.267ZM24 13.003v3.764l-4-2v-3.764Zm1-5.5l3.764 1.882L25 11.267l-3.764-1.882ZM8 19.767V9.003l4-2v10.764ZM7 3.503l3.764 1.882L7 7.267L3.236 5.385Zm-5 3.5l4 2v16.764l-4-2Zm6 16l4 2v3.764l-4-2Zm16 .764l-10 5v-3.764l10-5Zm6-9l-4 2v-3.764l4-2Z"/>`
  },
  {
    name: "Java",
    version: "v1.4.0",
    width: 32,
    height: 32,
    body: `<path d="M4 26h24v2H4zM28 4H7a1 1 0 0 0-1 1v13a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-4h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 8h-4V6h4Z"/>`
  },
  {
    name: "Rust",
    version: "v1.1.5",
    width: 32,
    height: 32,
    body: `<path d="m30 12l-4-2V6h-4l-2-4l-4 2l-4-2l-2 4H6v4l-4 2l2 4l-2 4l4 2v4h4l2 4l4-2l4 2l2-4h4v-4l4-2l-2-4ZM6 16a9.9 9.9 0 0 1 .842-4H10v8H6.842A9.9 9.9 0 0 1 6 16m10 10a9.98 9.98 0 0 1-7.978-4H16v-2h-2v-2h4c.819.819.297 2.308 1.179 3.37a1.89 1.89 0 0 0 1.46.63h3.34A9.98 9.98 0 0 1 16 26m-2-12v-2h4a1 1 0 0 1 0 2Zm11.158 6H24a2.006 2.006 0 0 1-2-2a2 2 0 0 0-2-2a3 3 0 0 0 3-3q0-.08-.004-.161A3.115 3.115 0 0 0 19.83 10H8.022a9.986 9.986 0 0 1 17.136 10"/>`
  },
  {
    name: "TypeScript",
    version: "v2.1.0",
    width: 16,
    height: 16,
    body: `<path d="M2 2v12h12V2zm4 6h3v1H8v4H7V9H6zm5 0h2v1h-2v1h1a1.003 1.003 0 0 1 1 1v1a1.003 1.003 0 0 1-1 1h-2v-1h2v-1h-1a1.003 1.003 0 0 1-1-1V9a1.003 1.003 0 0 1 1-1"/>`
  },
  {
    name: "C#",
    version: "v1.8.4",
    width: 32,
    height: 32,
    body: `<path d="M30 14v-2h-2V8h-2v4h-2V8h-2v4h-2v2h2v2h-2v2h2v4h2v-4h2v4h2v-4h2v-2h-2v-2Zm-4 2h-2v-2h2Zm-12.437 6A5.57 5.57 0 0 1 8 16.437v-2.873A5.57 5.57 0 0 1 13.563 8H18V2h-4.437A11.563 11.563 0 0 0 2 13.563v2.873A11.564 11.564 0 0 0 13.563 28H18v-6Z"/>`
  },
  {
    name: "Swift",
    version: "v2.0.1",
    width: 24,
    height: 24,
    body: `<path d="M17.087 19.721c-2.36 1.36-5.59 1.5-8.86.1a13.8 13.8 0 0 1-6.23-5.32c.67.55 1.46 1 2.3 1.4c3.37 1.57 6.73 1.46 9.1 0c-3.37-2.59-6.24-5.96-8.37-8.71c-.45-.45-.78-1.01-1.12-1.51c8.28 6.05 7.92 7.59 2.41-1.01c4.89 4.94 9.43 7.74 9.43 7.74c.16.09.25.16.36.22c.1-.25.19-.51.26-.78c.79-2.85-.11-6.12-2.08-8.81c4.55 2.75 7.25 7.91 6.12 12.24c-.03.11-.06.22-.05.39c2.24 2.83 1.64 5.78 1.35 5.22c-1.21-2.39-3.48-1.65-4.62-1.17"/>`
  },
  {
    name: "Kotlin",
    version: "v1.2.0",
    width: 24,
    height: 24,
    body: `<defs><linearGradient id="SVGO9IkJb7f" x1="1.725" x2="22.185" y1="22.67" y2="1.982" gradientTransform="translate(1.306 1.129)scale(.89324)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7c4dff"/><stop offset=".5" stop-color="#d500f9"/><stop offset="1" stop-color="#ef5350"/></linearGradient></defs><path fill="url(#SVGO9IkJb7f)" d="M2.975 2.976v18.048h18.05v-.03l-4.478-4.511l-4.48-4.515l4.48-4.515l4.443-4.477z"/>`
  },
  {
    name: "PHP",
    version: "v2.4.5",
    width: 24,
    height: 24,
    body: `<path d="M12 18.08c-6.63 0-12-2.72-12-6.08s5.37-6.08 12-6.08S24 8.64 24 12s-5.37 6.08-12 6.08m-5.19-7.95c.54 0 .91.1 1.09.31c.18.2.22.56.13 1.03c-.1.53-.29.87-.58 1.09q-.42.33-1.29.33h-.87l.53-2.76zm-3.5 5.55h1.44l.34-1.75h1.23c.54 0 .98-.06 1.33-.17c.35-.12.67-.31.96-.58c.24-.22.43-.46.58-.73c.15-.26.26-.56.31-.88c.16-.78.05-1.39-.33-1.82c-.39-.44-.99-.65-1.82-.65H4.59zm7.25-8.33l-1.28 6.58h1.42l.74-3.77h1.14c.36 0 .6.06.71.18s.13.34.07.66l-.57 2.93h1.45l.59-3.07c.13-.62.03-1.07-.27-1.36c-.3-.27-.85-.4-1.65-.4h-1.27L12 7.35zM18 10.13c.55 0 .91.1 1.09.31c.18.2.22.56.13 1.03c-.1.53-.29.87-.57 1.09c-.29.22-.72.33-1.3.33h-.85l.5-2.76zm-3.5 5.55h1.44l.34-1.75h1.22c.55 0 1-.06 1.35-.17c.35-.12.65-.31.95-.58c.24-.22.44-.46.58-.73c.15-.26.26-.56.32-.88c.15-.78.04-1.39-.34-1.82c-.36-.44-.99-.65-1.82-.65h-2.75z"/>`
  }
];

const ENDPOINTS = [
  { method: "GET", path: "/v1/subscriptions", desc: "List all subscriptions with pagination, filtering, and search", auth: "BEARER" },
  { method: "POST", path: "/v1/subscriptions", desc: "Create a new subscription with trial, proration, and plan options", auth: "BEARER" },
  { method: "PUT", path: "/v1/subscriptions/:id", desc: "Update plan, quantity, billing interval, or add-ons", auth: "BEARER" },
  { method: "GET", path: "/v1/invoices", desc: "List invoices by status, date range, or customer ID", auth: "BEARER" },
  { method: "POST", path: "/v1/invoices/:id/pay", desc: "Attempt payment on an outstanding invoice", auth: "BEARER" },
  { method: "GET", path: "/v1/customers/:id", desc: "Retrieve a customer with subscription and payment method history", auth: "BEARER" },
  { method: "DEL", path: "/v1/subscriptions/:id", desc: "Cancel a subscription immediately or at period end", auth: "BEARER" }
];

const GUIDES_LIST = [
  {
    title: "Webhooks: subscribing to billing lifecycle events",
    description: "Set up endpoints, verify signatures, handle retries, and build idempotent event processors for every billing event.",
    tag: "Webhooks",
    readTime: "11 min",
    icon: Code,
    iconBg: "bg-slate-900 text-white dark:bg-white/10 dark:text-white"
  },
  {
    title: "Authentication: API keys, OAuth 2.0, and key scoping",
    description: "Best practices for API key management, rotating secrets, and restricting key permissions to minimum required scopes.",
    tag: "Auth",
    readTime: "8 min",
    icon: Shield,
    iconBg: "bg-slate-900 text-white dark:bg-white/10 dark:text-white"
  },
  {
    title: "Idempotency keys: safely retrying API requests",
    description: "How to use idempotency keys to prevent duplicate subscriptions, payments, and customers during network failures.",
    tag: "Best practices",
    readTime: "6 min",
    icon: RefreshCw,
    iconBg: "bg-slate-900 text-white dark:bg-white/10 dark:text-white"
  }
];

const QUICKSTART_CODE = `// Install: npm install @recura/sdk
import { Recura } from '@recura/sdk';
const client = new Recura({ apiKey: process.env.RECURA_API_KEY });

// Create a subscription
const sub = await client.subscriptions.create({
  customer_id: 'cus_8f3a1b2c',
  plan_id: 'plan_growth_annual',
  trial_days: 14
});
console.log(sub.id);`;

export default function ApiDevelopersPage() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const activeCat = 'devs';

  const handleCopy = () => {
    navigator.clipboard.writeText(QUICKSTART_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredGuides = GUIDES_LIST.filter(guide => 
    guide.title.toLowerCase().includes(search.toLowerCase()) ||
    guide.description.toLowerCase().includes(search.toLowerCase()) ||
    guide.tag.toLowerCase().includes(search.toLowerCase())
  );

  const activeCategory = CATEGORIES.find(cat => cat.id === activeCat);

  return (
    <main className="bg-background min-h-screen pt-20">
      <Navbar />

      {/* Hero section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-[#0B0C10] text-left border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[450px] pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_60%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <span className="text-[10px] font-bold text-[#7A69BF] uppercase tracking-widest block mb-4">
            — API & Developers
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4 max-w-3xl">
            Build anything on top of Recura
          </h1>
          
          <p className="text-sm md:text-base font-semibold text-slate-400 max-w-2xl leading-relaxed mb-8">
            A complete REST API with 120+ endpoints, typed SDKs in 5 languages, webhook documentation, and integration guides for every major platform.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-slate-500 mb-8">
            <span className="flex items-center gap-2">
              <Code className="w-4 h-4 text-slate-600" />
              120+ endpoints
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-600" />
              SDK in 5 languages
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-600" />
              Webhook delivery
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button className="px-6 py-5 rounded-xl font-bold bg-[#7A69BF] hover:bg-[#6858a7] text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer border-0">
              Get API key
            </Button>
            <Button variant="outline" className="px-6 py-5 rounded-xl font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
              View full reference
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

      {/* SDKs & Libraries Section */}
      <section className="py-16 bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="relative mb-10 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200 dark:border-white/5" />
            </div>
            <span className="relative bg-white dark:bg-background px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              SDKs & Libraries
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {SDKS.map((sdk) => (
              <div 
                key={sdk.name}
                className="p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 hover:border-[#7A69BF]/40 dark:hover:border-[#7A69BF]/40 bg-white dark:bg-[#150a2e] shadow-sm hover:shadow-md transition-all duration-300 text-center flex flex-col items-center justify-center group flex-1 min-w-[140px] max-w-[200px] cursor-pointer"
              >
                {/* SDK Round Logo */}
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-slate-50 dark:bg-[#201343] rounded-2xl shrink-0 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white monochrome-icon transition-all duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8" viewBox={`0 0 ${sdk.width} ${sdk.height}`} dangerouslySetInnerHTML={{ __html: sdk.body }} />
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                  {sdk.name}
                </h4>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">
                  {sdk.version}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Endpoints Table Section */}
      <section className="py-12 bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="relative mb-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200 dark:border-white/5" />
            </div>
            <span className="relative bg-white dark:bg-background px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Popular Endpoints
            </span>
          </div>

          {/* Table Container */}
          <div className="rounded-3xl border border-slate-200/50 dark:border-white/10 overflow-hidden bg-white dark:bg-[#150a2e] shadow-sm select-all">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="py-4.5 px-6">Method</th>
                    <th className="py-4.5 px-6">Endpoint</th>
                    <th className="py-4.5 px-6">Description</th>
                    <th className="py-4.5 px-6 text-right">Auth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {ENDPOINTS.map((endpoint, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-6 font-mono text-[10px]">
                        <span className={cn(
                          "px-2 py-0.5 rounded font-black text-[9px] border",
                          endpoint.method === "GET" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-950",
                          endpoint.method === "POST" && "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-950",
                          endpoint.method === "PUT" && "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-950",
                          endpoint.method === "DEL" && "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-100 dark:border-rose-950"
                        )}>
                          {endpoint.method}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-900 dark:text-white">
                        {endpoint.path}
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                        {endpoint.desc}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-[9px]">
                        <span className="px-2 py-0.5 rounded-md border border-purple-200/40 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                          {endpoint.auth}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-12 bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="relative mb-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200 dark:border-white/5" />
            </div>
            <span className="relative bg-white dark:bg-background px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Quick Start
            </span>
          </div>

          {/* Terminal/Code Card */}
          <div className="rounded-2xl border border-slate-900 dark:border-white/10 overflow-hidden bg-slate-950 shadow-2xl relative">
            
            {/* Header bar */}
            <div className="px-4 py-3 bg-slate-900 border-b border-white/5 flex items-center justify-between select-none">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">quickstart.js</span>
              <button 
                onClick={handleCopy}
                className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-6 overflow-x-auto text-left font-mono text-xs leading-relaxed text-slate-300">
              <pre className="inline-block min-w-full">
                {QUICKSTART_CODE}
              </pre>
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
              placeholder="Search API reference & docs..."
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
