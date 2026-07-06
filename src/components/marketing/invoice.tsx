import Image from 'next/image';
import { Check } from 'lucide-react';

const billingFeatures = [
  'Automatic invoice generation on every renewal',
  'Smart payment retry with configurable dunning',
  'Tax calculation across 135+ countries',
  'QuickBooks and Xero sync out of the box',
];

const intelligenceFeatures = [
  'Live MRR and ARR with movement breakdown',
  'AI-powered revenue forecasting',
  'Cohort analysis and churn prediction',
  'Export to CSV, PDF, or Google Sheets',
];

function DeviceMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative overflow-hidden p-[5.5px] border-[2.5px] border-slate-900 dark:border-purple-600 bg-slate-900 dark:bg-purple-600 rounded-3xl shadow-2xl w-full max-w-[440px] aspect-[1.3] mx-auto group">
      {/* Background rotating conic gradient (laser glow trace sandwiched in-between) */}
      <div 
        className="absolute inset-[-150%] pointer-events-none z-0 block dark:hidden mockup-glow-light"
        style={{
          animation: 'rotate-gradient 12s linear infinite',
        }}
      />
      <div 
        className="absolute inset-[-150%] pointer-events-none z-0 hidden dark:block mockup-glow-dark"
        style={{
          animation: 'rotate-gradient 12s linear infinite',
        }}
      />
      
      {/* Inner bezel mask overlay */}
      <div className="absolute inset-[2px] bg-slate-900 dark:bg-purple-600 rounded-[20px] z-10 pointer-events-none" />

      {/* Top Bezel Camera Notch */}
      <div className="absolute top-[2.5px] left-1/2 -translate-x-1/2 w-16 h-3.5 bg-slate-950 rounded-b-xl z-30 flex items-center justify-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-white/5" />
        <div className="w-1 h-1 rounded-full bg-slate-950" />
      </div>

      {/* Screen Content Wrapper */}
      <div className="relative z-20 rounded-[18px] overflow-hidden bg-slate-950 w-full h-full flex flex-col">
        {/* Browser Top-Bar / Window Controls */}
        <div className="h-7 bg-slate-900 dark:bg-purple-950/80 flex items-center px-4 gap-1.5 relative border-b border-slate-800 dark:border-purple-800/20 shrink-0">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 w-36 h-4.5 bg-slate-950/40 rounded-md flex items-center justify-center text-[9px] text-slate-500 font-mono tracking-wide">
            recura.tech
          </div>
        </div>

        {/* Screen Image Container */}
        <div className="relative w-full h-full overflow-hidden flex-1">
          <Image 
            src={src} 
            alt={alt}
            fill
            className="object-cover object-top scale-[1.03] -translate-y-[2px]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority 
          />
        </div>
      </div>
    </div>
  );
}

export function Invoice() {
  return (
    <section className="py-20 bg-white dark:bg-transparent overflow-hidden">
      {/* Dynamic Glow Styles */}
      <style>{`
        @keyframes rotate-gradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .mockup-glow-light {
          background: conic-gradient(from 0deg, transparent 46%, #a855f7 48%, #ffffff 50%, #a855f7 52%, transparent 54%);
        }
        .mockup-glow-dark {
          background: conic-gradient(from 0deg, transparent 47%, #ffffff 49%, #ffffff 50%, #ffffff 51%, transparent 53%);
        }
      `}</style>

      <div className="container mx-auto px-4 space-y-32">
        {/* Section 1: Automated Billing (Mockup Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Mockup */}
          <div className="order-last lg:order-first">
            <DeviceMockup 
              src="/images/landing/invoice-INV-1267.png" 
              alt="Invoices that send themselves mockup" 
            />
          </div>

          {/* Right Column: Text content */}
          <div className="flex flex-col justify-center">
            <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs tracking-wider uppercase mb-3 block">
              Automated Billing
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              Invoices that send themselves.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
              Generate, send, and reconcile invoices on auto-pilot. Tax calculation, payment matching, and accounting sync — all handled.
            </p>

            {/* Feature List */}
            <ul className="space-y-4">
              {billingFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3 flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 2: Revenue Intelligence (Text Left, Mockup Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Text content */}
          <div className="flex flex-col justify-center">
            <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs tracking-wider uppercase mb-3 block">
              Revenue Intelligence
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              See every dollar. Know every trend.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
              MRR waterfall, cohort retention, LTV curves, and AI-powered forecasting — giving your finance and growth teams data to act on.
            </p>

            {/* Feature List */}
            <ul className="space-y-4">
              {intelligenceFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3 flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Mockup */}
          <div>
            <DeviceMockup 
              src="/images/landing/Recura-Invoice.png" 
              alt="Revenue Intelligence analytics mockup" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
