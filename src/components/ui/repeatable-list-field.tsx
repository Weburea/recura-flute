'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RepeatableListFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  itemLabel?: string; // e.g. "service" or "product type"
  items: string[];
  onChange: (items: string[]) => void;
  error?: string;
}

export function RepeatableListField({
  id,
  label,
  placeholder = 'e.g. Web Design',
  itemLabel = 'service',
  items = [''],
  onChange,
  error,
}: RepeatableListFieldProps) {

  const handleItemChange = (index: number, val: string) => {
    const copy = [...items];
    copy[index] = val;
    onChange(copy);
  };

  const handleAddItem = () => {
    onChange([...items, '']);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      onChange(['']);
    } else {
      const copy = items.filter((_, i) => i !== index);
      onChange(copy);
    }
  };

  const activeItems = items.length > 0 ? items : [''];

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
        {label}
      </label>

      <div className="space-y-2.5">
        {activeItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              id={`${id}-${index}`}
              placeholder={index === 0 ? placeholder : `${label} #${index + 1}`}
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className={cn(
                "w-full px-4 py-3 rounded-xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-600/10 transition-all",
                error && !item && "border-red-500"
              )}
            />

            {activeItems.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="p-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/50 bg-white dark:bg-white/5 transition-all cursor-pointer shrink-0"
                aria-label="Remove item"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

      <button
        type="button"
        onClick={handleAddItem}
        className="py-2.5 px-4 rounded-xl border border-dashed border-purple-300 dark:border-purple-800/60 bg-purple-50/40 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all inline-flex items-center gap-1.5 cursor-pointer mt-1"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add another {itemLabel}</span>
      </button>
    </div>
  );
}
