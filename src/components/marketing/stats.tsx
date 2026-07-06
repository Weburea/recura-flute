'use client';

import { useEffect, useState, useRef } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

function CountUp({ end, duration = 1500, decimals = 0, prefix = '', suffix = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number | null = null;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function: easeOutQuad
            const easedProgress = percentage * (2 - percentage);
            
            const currentCount = easedProgress * end;
            setCount(currentCount);

            if (progress < duration) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={elementRef}>
      {prefix}
      {count.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

const metrics = [
  {
    value: 2.4,
    decimals: 1,
    prefix: '$',
    suffix: 'B+',
    label: 'Processed in billing volume',
  },
  {
    value: 12000,
    decimals: 0,
    prefix: '',
    suffix: '+',
    label: 'Companies on Recura',
  },
  {
    value: 99.99,
    decimals: 2,
    prefix: '',
    suffix: '%',
    label: 'Platform uptime SLA',
  },
  {
    value: 41,
    decimals: 0,
    prefix: '',
    suffix: '%',
    label: 'Average churn reduction',
  },
];

export function Stats() {
  return (
    <section className="py-12 bg-white dark:bg-transparent">
      <div className="container mx-auto px-4">
        <div className="bg-slate-200/60 dark:bg-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-slate-200/60 dark:border-white/10 shadow-sm">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-background p-8 md:p-10 flex flex-col justify-center h-full group hover:bg-slate-50/40 dark:hover:bg-white/[0.01] transition-colors duration-300"
            >
              <span className="text-4xl md:text-5xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight mb-2 group-hover:scale-[1.02] transition-transform duration-300">
                <CountUp 
                  end={metric.value} 
                  decimals={metric.decimals} 
                  prefix={metric.prefix} 
                  suffix={metric.suffix} 
                />
              </span>
              <span className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
