import React from 'react';

const testimonials = [
  {
    quote: 'Recura replaced three billing tools we were stitching together. Setup took one afternoon. We recovered 11% of churned revenue in the first 30 days.',
    author: 'Sarah Kim',
    role: 'Head of Revenue, Retool',
    initials: 'SK',
    avatarBg: 'bg-purple-500 dark:bg-purple-600',
  },
  {
    quote: 'The MRR waterfall is the first thing I open every morning. Recura turned our revenue data from a monthly spreadsheet into a live dashboard that actually drives decisions.',
    author: 'Marcus Reid',
    role: 'CFO, Loom',
    initials: 'MR',
    avatarBg: 'bg-emerald-500 dark:bg-emerald-600',
  },
  {
    quote: "Our support team used to spend hours on subscription changes. With Recura's customer portal, 80% of those requests are now fully self-served.",
    author: 'Jamie Park',
    role: 'VP Operations, Pitch',
    initials: 'JP',
    avatarBg: 'bg-amber-500 dark:bg-amber-600',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-transparent overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs tracking-wider uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Loved by the teams building tomorrow.
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {testimonials.map((t, index) => (
            <div 
              key={index} 
              className="bg-slate-50/20 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-md transition-all duration-300 hover:bg-slate-50/40 dark:hover:bg-white/[0.04]"
            >
              {/* Top Section */}
              <div>
                {/* 5 Stars Rating */}
                <div className="text-purple-600 dark:text-purple-400 tracking-wider mb-6 text-sm">
                  ★★★★★
                </div>
                {/* Quote */}
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm md:text-base">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-200/40 dark:border-white/5">
                {/* Circular Avatar */}
                <div className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-sm shrink-0 ${t.avatarBg}`}>
                  {t.initials}
                </div>
                {/* Name & Role */}
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white font-bold text-sm md:text-base">
                    {t.author}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs md:text-sm font-medium">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
