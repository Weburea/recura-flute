"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Search, ChevronDown, Menu, X, 
  BarChart3, RefreshCcw, Users, 
  Briefcase, Palette, Receipt, UserPlus, Bell,
  HelpCircle, Shield, FileText, LayoutDashboard,
  Settings, ChevronRight, Wallet
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

const mainFeatures = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, desc: 'Central overview', color: 'bg-indigo-50 text-indigo-600' },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: RefreshCcw, desc: 'Manage plans', color: 'bg-purple-50 text-purple-600' },
  { name: 'Customers', href: '/dashboard/customers', icon: Users, desc: 'Client database', color: 'bg-emerald-50 text-emerald-600' },
  { name: 'Billing & Invoices', href: '/dashboard/billing', icon: Receipt, desc: 'Invoices & history', color: 'bg-orange-50 text-orange-600' },
  { name: 'Payments', href: '/dashboard/payments', icon: Wallet, desc: 'Process transactions', color: 'bg-pink-50 text-pink-600' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, desc: 'Insights & metrics', color: 'bg-blue-50 text-blue-600' },
];

const settingsLinks = [
  { name: 'Workspace', href: '/dashboard/settings', icon: Briefcase, desc: 'General settings' },
  { name: 'Branding', href: '/dashboard/settings/branding', icon: Palette, desc: 'Custom portal' },
  { name: 'Payment Settings', href: '/dashboard/settings/payments', icon: Receipt, desc: 'Gateways & more' },
  { name: 'Team Members', href: '/dashboard/settings/team', icon: UserPlus, desc: 'Manage access' },
  { name: 'Notifications', href: '/dashboard/settings/notifications', icon: Bell, desc: 'Alert preferences' },
];

const supportLinks = [
  { name: 'Help Center', href: '/dashboard/help', icon: HelpCircle },
  { name: 'Privacy Policy', href: '/privacy-policy', icon: Shield },
  { name: 'Terms of Service', href: '/terms-of-service', icon: FileText },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(mainFeatures[0]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const featureColorClass = hoveredFeature.color.split(' ')[0]; // Gets the bg color

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-[#0D0518]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-white/10 transition-all">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">

        {/* 1. Logo Section */}
        <Link href="/" className="flex items-center gap-2">
           {/* Light Mode Logo */}
           <Image
             src="https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg"
             alt="Recura Logo"
             width={120}
             height={32}
             className="h-7 sm:h-8 w-auto object-contain dark:hidden"
           />
           {/* Dark Mode Logo */}
           <Image
             src="https://res.cloudinary.com/weburea/image/upload/v1783571835/logo.svg"
             alt="Recura Logo"
             width={120}
             height={32}
             className="h-7 sm:h-8 w-auto object-contain hidden dark:block"
           />
        </Link>

        {/* 2. Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          
          {/* Features Mega-Menu Trigger */}
          <div className="relative group">
            <button 
              className={cn(
                "nav-link flex items-center gap-1.5 focus:outline-none transition-colors py-8",
                isDashboardOpen ? "text-primary" : "hover:text-slate-900"
              )}
              onClick={() => setIsDashboardOpen(!isDashboardOpen)}
              onMouseEnter={() => setIsDashboardOpen(true)}
              onMouseLeave={() => setIsDashboardOpen(false)}
            >
              Features <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isDashboardOpen ? "rotate-180 text-primary" : "text-slate-400")} />
            </button>
            
            {/* Dashboard Mega-Menu Content */}
            <div 
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-purple-900/20 rounded-2xl overflow-hidden transform transition-all duration-300 origin-top",
                isDashboardOpen ? "opacity-100 scale-100 visible translate-y-0" : "opacity-0 scale-95 invisible -translate-y-2"
              )}
              onMouseEnter={() => setIsDashboardOpen(true)}
              onMouseLeave={() => setIsDashboardOpen(false)}
            >
              <div className="grid grid-cols-12 gap-0">
                {/* Left Col - Main Links & Legal */}
                <div className="col-span-8 p-6 grid grid-cols-2 gap-8 bg-white dark:bg-[#150a2e]">
                  {/* Core Features */}
                  <div className="space-y-4">
                    <h3 className="text-xs tracking-widest font-bold text-slate-400 uppercase flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Core Features
                    </h3>
                    <div className="space-y-1">
                      {mainFeatures.map((feature) => (
                        <Link 
                          key={feature.name} 
                          href={feature.href} 
                          className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors group/item"
                          onMouseEnter={() => setHoveredFeature(feature)}
                        >
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-slate-100/50 dark:border-white/10", feature.color)}>
                            <feature.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover/item:text-primary transition-colors">{feature.name}</h4>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{feature.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Settings & Config */}
                  <div className="space-y-4">
                     <h3 className="text-xs tracking-widest font-bold text-slate-400 uppercase flex items-center gap-2">
                      <Settings className="w-4 h-4" /> Configuration
                    </h3>
                    <div className="space-y-1">
                      {settingsLinks.map((link) => (
                        <Link 
                          key={link.name} 
                          href={link.href} 
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors group/item"
                        >
                          <div className="flex items-center gap-3">
                            <link.icon className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover/item:text-primary transition-colors" />
                            <div>
                               <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors">{link.name}</h4>
                            </div>
                         </div>
                         <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                    
                    <div className="pt-2 mt-2 border-t border-slate-100 dark:border-white/10">
                        {supportLinks.map((link) => (
                          <Link 
                            key={link.name} 
                            href={link.href} 
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors group/item"
                          >
                            <link.icon className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover/item:text-primary transition-colors" />
                            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors">{link.name}</h4>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Right Col - Dynamic Visual */}
                <div className="col-span-4 bg-slate-50 dark:bg-black/20 p-6 border-l border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20" />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-white/10 transition-all duration-500 transform scale-100", featureColorClass)}>
                        <hoveredFeature.icon className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{hoveredFeature.name}</h4>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">{hoveredFeature.desc}</p>
                      </div>
                      <Link href={hoveredFeature.href}>
                         <Button variant="outline" size="sm" className="mt-4 bg-white dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/20 dark:hover:text-white">Explore {hoveredFeature.name}</Button>
                      </Link>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <Link href="/pricing" className={cn("hover:text-primary dark:hover:text-primary transition-all duration-200 px-4 py-1.5 rounded-xl text-sm font-semibold", pathname === '/pricing' ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold shadow-sm" : "text-slate-600 dark:text-slate-300")}>Pricing</Link>
          <Link href="/customers" className={cn("hover:text-primary dark:hover:text-primary transition-all duration-200 px-4 py-1.5 rounded-xl text-sm font-semibold", pathname === '/customers' ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold shadow-sm" : "text-slate-600 dark:text-slate-300")}>Customers</Link>
          <Link href="/integrations" className={cn("hover:text-primary dark:hover:text-primary transition-all duration-200 px-4 py-1.5 rounded-xl text-sm font-semibold", pathname === '/integrations' ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold shadow-sm" : "text-slate-600 dark:text-slate-300")}>Integrations</Link>
          <Link href="#resources" className="hover:text-primary dark:hover:text-primary transition-all duration-200 px-4 py-1.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300">Resources</Link>
          <Link href="#blog" className="hover:text-primary dark:hover:text-primary transition-all duration-200 px-4 py-1.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300">Blog</Link>
        </div>

        {/* 3. Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-4">
          
          <ThemeToggle />

          {/* Search Popover */}
          <div className="relative">
             <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-slate-400 dark:text-slate-300 transition-colors cursor-pointer hover:text-slate-900 dark:hover:text-white hover:scale-105"
             >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            
            {/* Search Input Dropdown */}
            <div className={cn(
              "fixed left-4 right-4 top-[84px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-4 sm:w-[360px] bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-purple-900/20 p-4 transform transition-all duration-300 sm:origin-top-right origin-top rounded-2xl",
              isSearchOpen ? "opacity-100 scale-100 visible sm:translate-y-0" : "opacity-0 scale-95 invisible sm:-translate-y-2 -translate-y-4"
             )}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input 
                      ref={searchInputRef}
                      type="text" 
                      placeholder="Search docs, features, and more..." 
                      className="w-full pl-10 pr-14 py-3 text-sm border-2 border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 rounded-xl focus:outline-none focus:ring-0 focus:border-primary/50 dark:focus:border-primary/50 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-400 dark:text-slate-300 shadow-sm">
                    ⌘K
                  </div>
                </div>
                <div className="mt-4 border-t border-slate-100 dark:border-white/10 pt-3 flex flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase w-full mb-1">Quick Links</span>
                  {['Documentation', 'API Reference', 'Integrations'].map((link) => (
                    <button key={link} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-colors">
                      {link}
                    </button>
                  ))}
                </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 ml-2">
            <Link href="/sign-in">
                <Button variant="ghost" className="font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl">
                  Sign In
                </Button>
            </Link>
            <Link href="/sign-up">
                <Button variant="brand" className="rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                  Start free trial
                </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-slate-600 focus:outline-none ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div 
        className={cn(
          "lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-[#150a2e] border-t border-slate-100 dark:border-white/10 shadow-2xl p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 origin-top",
          isMobileMenuOpen ? "max-h-[80vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 overflow-hidden py-0 border-none"
        )}
      >
            <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                  className="flex items-center justify-between text-lg font-bold text-slate-900 dark:text-white py-3 border-b border-slate-100 dark:border-white/10"
                >
                    Features 
                    <ChevronDown className={cn("w-5 h-5 transition-transform text-slate-400", isDashboardOpen ? "rotate-180 text-primary" : "")} />
                </button>
                {isDashboardOpen && (
                    <div className="pl-4 flex flex-col gap-3 py-3 animate-in slide-in-from-top-2">
                        {mainFeatures.map(link => (
                           <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-semibold py-1">
                             <link.icon className="w-4 h-4 text-primary" /> {link.name}
                           </Link>
                        ))}
                        <div className="my-2 border-t border-slate-100 dark:border-white/10 w-full" />
                        {settingsLinks.map(link => (
                           <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-semibold py-1">
                             <link.icon className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {link.name}
                           </Link>
                        ))}
                        <div className="my-2 border-t border-slate-100 dark:border-white/10 w-full" />
                        {supportLinks.map(link => (
                           <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-semibold py-1">
                             <link.icon className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {link.name}
                           </Link>
                        ))}
                    </div>
                )}
            </div>
            
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className={cn("text-lg font-bold py-3 border-b border-slate-100 dark:border-white/10 transition-colors", pathname === '/pricing' ? "text-purple-600 dark:text-purple-400" : "text-slate-900 dark:text-white")}>Pricing</Link>
            <Link href="/customers" onClick={() => setIsMobileMenuOpen(false)} className={cn("text-lg font-bold py-3 border-b border-slate-100 dark:border-white/10 transition-colors", pathname === '/customers' ? "text-purple-600 dark:text-purple-400" : "text-slate-900 dark:text-white")}>Customers</Link>
            <Link href="#integrations" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-900 dark:text-white py-3 border-b border-slate-100 dark:border-white/10">Integrations</Link>
            <Link href="#resources" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-900 dark:text-white py-3 border-b border-slate-100 dark:border-white/10">Resources</Link>
            <Link href="#blog" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-900 dark:text-white py-3 border-b border-slate-100 dark:border-white/10">Blog</Link>
            
            <div className="flex flex-col gap-3 mt-6">
                 <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline-brand" className="w-full justify-center rounded-xl py-6 font-bold">Sign In</Button>
                 </Link>
                 <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="brand" className="w-full justify-center rounded-xl py-6 font-bold shadow-lg shadow-primary/20">Start free trial</Button>
                 </Link>
            </div>
        </div>
    </nav>
  );
}
