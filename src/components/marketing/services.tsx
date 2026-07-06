import { Layers, Clock, TrendingUp, HelpCircle, User, Calendar } from 'lucide-react';

const services = [
  {
    title: 'Unified dashboard',
    description: 'Every subscription, invoice, and payment in one place. No tab-switching or spreadsheets.',
    icon: Layers,
  },
  {
    title: 'Automated billing',
    description: 'Set schedules once. Recura handles charges, retries, receipts, and dunning automatically.',
    icon: Clock,
  },
  {
    title: 'Revenue intelligence',
    description: 'Real-time MRR, ARR, churn, and LTV with AI forecasting so you always know what\'s next.',
    icon: TrendingUp,
  },
  {
    title: 'Smart dunning',
    description: 'Recover failed payments with intelligent retry logic and personalised email sequences.',
    icon: HelpCircle,
  },
  {
    title: 'Customer portal',
    description: 'Self-service subscription management reduces support tickets by 60%. White-labeled to your brand.',
    icon: User,
  },
  {
    title: 'Flexible pricing plans',
    description: 'Flat-rate, per-seat, usage-based, tiered, or hybrid — switch models without breaking subscriptions.',
    icon: Calendar,
  },
];

export function Services() {
  return (
    <section className="py-20 bg-white dark:bg-transparent">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-4xl mb-16">
          <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs tracking-wider uppercase mb-3 block">
            Why Recura
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
            Everything your billing stack should be.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed">
            Stop stitching tools together. Recura gives your team a single, coherent system — from first charge to revenue intelligence.
          </p>
        </div>

        {/* Feature Grid Container */}
        <div className="bg-slate-200/60 dark:bg-white/10 grid grid-cols-1 md:grid-cols-3 gap-px rounded-3xl overflow-hidden border border-slate-200/60 dark:border-white/10 shadow-sm">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index} 
                className="bg-white dark:bg-background p-8 md:p-12 flex flex-col h-full group hover:bg-slate-50/40 dark:hover:bg-white/[0.01] transition-colors duration-300"
              >
                {/* Icon Wrapper */}
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-105 transition-transform duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>
                
                {/* Content */}
                <h3 className="text-slate-900 dark:text-white font-semibold text-lg md:text-xl mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

