import React from 'react';
import Image from 'next/image';

interface IntegrationItem {
  name: string;
  src: string;
  className?: string;
}

const integrations: IntegrationItem[] = [
  { name: 'WhatsApp', src: 'https://res.cloudinary.com/weburea/image/upload/v1788257091/whatsapp-svgrepo-com_jcfgnm.svg' },
  { name: 'Zapier', src: 'https://res.cloudinary.com/weburea/image/upload/v1788257095/zapier-svgrepo-com_rad8jo.svg' },
  { name: 'QuickBooks', src: 'https://res.cloudinary.com/weburea/image/upload/v1788257094/brand-quickbooks-svgrepo-com_l5gwnx.svg', className: 'dark:invert' },
  { name: 'Slack', src: 'https://res.cloudinary.com/weburea/image/upload/v1788257096/slack-svgrepo-com_cqbzpx.svg' },
  { name: 'Gmail', src: 'https://res.cloudinary.com/weburea/image/upload/v1788257086/gmail-svgrepo-com_fgzzci.svg' },
  { name: 'Instagram', src: 'https://res.cloudinary.com/weburea/image/upload/v1788257086/instagram-2-1-logo-svgrepo-com_cvstiw.svg' },
  { name: 'Trello', src: 'https://res.cloudinary.com/weburea/image/upload/v1788257086/trello-color-svgrepo-com_fmyeb8.svg' },
  { name: 'Shopify', src: 'https://res.cloudinary.com/weburea/image/upload/v1788257091/shopify-color-svgrepo-com_jjqkrn.svg' },
  { name: 'Meta', src: 'https://res.cloudinary.com/weburea/image/upload/v1788257093/meta-3_wgbzmj.svg' },
  { name: 'LinkedIn', src: 'https://res.cloudinary.com/weburea/image/upload/v1788257092/linkedin-svgrepo-com_hmvm7e.svg' },
  { name: 'Mailchimp', src: 'https://res.cloudinary.com/weburea/image/upload/v1788257089/mailchimp-svgrepo-com_kla57c.svg' },
  { name: 'Notion', src: 'https://res.cloudinary.com/weburea/image/upload/v1788257088/notion-svgrepo-com_jc7luj.svg', className: 'dark:invert' },
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
                  className={`object-contain ${app.className || ''}`}
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
