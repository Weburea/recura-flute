'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navigation = {
  product: [
    { name: 'Subscriptions', href: '/dashboard/subscriptions' },
    { name: 'Invoicing', href: '/dashboard/billing' },
    { name: 'Analytics', href: '/dashboard/analytics' },
    { name: 'Customer Portal', href: '#' },
    { name: 'Integrations', href: '#integrations' },
    { name: 'Changelog', href: '#' },
  ],
  solutions: [
    { name: 'SaaS', href: '#' },
    { name: 'Agencies', href: '#' },
    { name: 'Enterprises', href: '#' },
    { name: 'Startups', href: '#' },
    { name: 'Marketplaces', href: '#' },
  ],
  resources: [
    { name: 'Documentation', href: '/dashboard/documentation' },
    { name: 'API Reference', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Status Page', href: '#' },
    { name: 'Security', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Contact', href: '#faq' },
    { name: 'Privacy', href: '/privacy-policy' },
    { name: 'Terms', href: '/terms-of-service' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-50/50 dark:bg-transparent border-t border-slate-200/60 dark:border-white/10 py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
          {/* Logo & Description Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg"
                alt="Recura Logo"
                width={120}
                height={32}
                className="h-8 w-auto object-contain dark:hidden"
              />
              <Image
                src="https://res.cloudinary.com/weburea/image/upload/v1783571835/logo.svg"
                alt="Recura Logo"
                width={120}
                height={32}
                className="h-8 w-auto object-contain hidden dark:block"
              />
            </Link>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              The subscription management platform for modern businesses. Billing made effortless.
            </p>
            
            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/50 dark:bg-white/5 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 w-fit">
              <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse shrink-0" />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Product Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Product</h3>
            <ul className="flex flex-col gap-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm font-semibold transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Solutions</h3>
            <ul className="flex flex-col gap-3">
              {navigation.solutions.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm font-semibold transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Resources</h3>
            <ul className="flex flex-col gap-3">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm font-semibold transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Company</h3>
            <ul className="flex flex-col gap-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm font-semibold transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-slate-200/60 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
            © 2025 Recura, Inc. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-400 dark:text-slate-500 text-xs font-semibold">
            <span>SOC 2 Type II</span>
            <span>PCI DSS Level 1</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
