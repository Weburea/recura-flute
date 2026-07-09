import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-white dark:bg-transparent pt-32 pb-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[550px] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.06),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_65%)]" />
        <Image
          src="/images/landing/Grid_hero_lines.svg"
          alt="Background Pattern"
          fill
          className="object-contain opacity-75 dark:opacity-50 pointer-events-none"
          priority
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-6 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/50 dark:bg-white/5 dark:border-white/10 text-xs font-bold mb-8">
          <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-extrabold uppercase tracking-wide">
            New
          </span>
          <span className="text-slate-600 dark:text-slate-300 pr-1">
            Revenue Analytics 1.0
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
          Billing that <span className="text-gradient-bold">scales</span> <br />
          with your ambition.
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          One platform to manage subscriptions, automate billing, reduce churn, and grow recurring revenue.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 px-4">
          <div className="w-full sm:w-auto">
            <Button variant="primary" className="w-full px-8 py-6 text-lg rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:-translate-y-0.5">
              Start for free
            </Button>
          </div>
          <div className="w-full sm:w-auto">
            <Button variant="outline-brand" className="group w-full px-8 py-6 text-lg rounded-xl font-bold transition-all hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Book a demo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Checkmarks */}
        <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 mb-16 text-sm font-semibold">
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-white">
            <span className="text-emerald-500 font-bold">✓</span> 14-day free trial
          </span>
          <span className="text-slate-300 dark:text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-white">
            <span className="text-emerald-500 font-bold">✓</span> SOC 2 certified
          </span>
          <span className="text-slate-300 dark:text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-white">
            <span className="text-emerald-500 font-bold">✓</span> Cancel any time
          </span>
        </div>

        {/* Dashboard Device Mockup (Hidden on mobile) */}
        <div className="hidden md:block relative mx-auto mt-16 w-full max-w-[1200px] px-0">
          <style>{`
            @keyframes rotate-gradient {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .mockup-glow-light {
              background: conic-gradient(from 0deg, transparent 46%, #A28CFF 48%, #ffffff 50%, #A28CFF 52%, transparent 54%);
            }
            .mockup-glow-dark {
              background: conic-gradient(from 0deg, transparent 47%, #ffffff 49%, #ffffff 50%, #ffffff 51%, transparent 53%);
            }
          `}</style>
          <div className="relative overflow-hidden p-[5.5px] border-[2.5px] border-slate-900 dark:border-primary bg-slate-900 dark:bg-primary rounded-2xl shadow-2xl">
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
            <div className="absolute inset-[2px] bg-slate-900 dark:bg-primary rounded-[12px] z-10 pointer-events-none" />

            {/* Screen Content Wrapper */}
            <div className="relative z-20 rounded-xl overflow-hidden bg-slate-950">
              <Image 
                src="/images/landing/light_mode.png" 
                alt="Recura Dashboard Light Mode"
                width={1248}
                height={851}
                className="w-full h-auto block dark:hidden"
                priority 
              />
              <Image 
                src="/images/landing/dark_mode.png" 
                alt="Recura Dashboard Dark Mode"
                width={1248}
                height={851}
                className="w-full h-auto hidden dark:block"
                priority 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}