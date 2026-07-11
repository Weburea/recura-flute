'use client';

import React from 'react';
import Link from 'next/link';

interface HeroButtonsProps {
  primaryText: string;
  primaryOnClick?: () => void;
  primaryHref?: string;
  secondaryText: string;
  secondaryOnClick?: () => void;
  secondaryHref?: string;
}

export function HeroButtons({
  primaryText,
  primaryOnClick,
  primaryHref,
  secondaryText,
  secondaryOnClick,
  secondaryHref,
}: HeroButtonsProps) {
  const primaryClass = "w-full sm:w-auto px-8 py-[18px] rounded-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 transition-all duration-300 text-center inline-flex items-center justify-center cursor-pointer text-base shadow-sm";
  const secondaryClass = "w-full sm:w-auto px-8 py-[18px] rounded-[10px] font-bold border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 transition-all duration-300 text-center inline-flex items-center justify-center gap-1.5 cursor-pointer text-base shadow-sm";

  const renderPrimary = () => {
    if (primaryHref) {
      return (
        <Link href={primaryHref} className={primaryClass}>
          {primaryText}
        </Link>
      );
    }
    return (
      <button onClick={primaryOnClick} className={primaryClass}>
        {primaryText}
      </button>
    );
  };

  const renderSecondary = () => {
    if (secondaryHref) {
      return (
        <Link href={secondaryHref} className={secondaryClass}>
          <span>{secondaryText}</span>
          <span className="text-sm">→</span>
        </Link>
      );
    }
    return (
      <button onClick={secondaryOnClick} className={secondaryClass}>
        <span>{secondaryText}</span>
        <span className="text-sm">→</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
      {renderPrimary()}
      {renderSecondary()}
    </div>
  );
}
