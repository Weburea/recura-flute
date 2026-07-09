import React from 'react';
import Image from 'next/image';

const integrations = [
  { name: 'Stripe', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571946/Stripe.svg' },
  { name: 'Zapier', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571966/Zapier.svg' },
  { name: 'QuickBooks', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571793/QuickBooks.svg' },
  { name: 'Slack', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571937/Slack.svg' },
  { name: 'HubSpot', src: '/images/landing/integration/Group 1000001643.png' },
  { name: 'Salesforce', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571922/Salesforce.svg' },
  { name: 'Xero', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571959/Xero.svg' },
  { name: 'Intercom', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571782/Intercom.svg' },
  { name: 'PayPal', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571788/PayPal.svg' },
  { name: 'Analytics', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571765/Analytics.svg' },
  { name: 'Mailchimp', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571783/Mailchimp.svg' },
  { name: 'Webhooks', src: 'https://res.cloudinary.com/weburea/image/upload/v1783571956/Webhooks.svg' },
];

export function Integration() {
  return (
    <section className="py-20 bg-white dark:bg-transparent overflow-hidden relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-200/30 dark:bg-purple-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs tracking-wider uppercase mb-3 block">
            Integrations
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Connects to everything you already use.
          </h2>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {integrations.map((app, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-md dark:hover:bg-white/[0.04] transition-all duration-300 group cursor-default"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={app.src}
                  alt={`${app.name} logo`}
                  fill
                  className="object-contain"
                  sizes="56px"
                />
              </div>
              {/* Name */}
              <span className="text-slate-800 dark:text-slate-200 font-medium text-sm text-center">
                {app.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Integration;
