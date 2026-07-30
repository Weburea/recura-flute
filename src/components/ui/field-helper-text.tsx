'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldHelperTextProps {
  text?: string;
  className?: string;
  variant?: 'info' | 'warning';
}

export function FieldHelperText({ text, className, variant = 'info' }: FieldHelperTextProps) {
  if (!text) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -4, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -4, height: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex items-start gap-1.5 mt-2 text-xs font-medium leading-relaxed transition-all",
          variant === 'info' && "text-gray-500 dark:text-gray-400",
          variant === 'warning' && "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50",
          className
        )}
      >
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
        <span>{text}</span>
      </motion.div>
    </AnimatePresence>
  );
}
