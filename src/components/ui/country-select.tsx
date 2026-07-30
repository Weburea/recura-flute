'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCountries, CountryItem } from '@/lib/services/countries';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CountrySelect({ value, onChange, placeholder = 'Search or select country...' }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getCountries().then(data => {
      if (isMounted) setCountries(data);
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = countries.find(
    c => c.name.toLowerCase() === value?.toLowerCase() || c.code.toLowerCase() === value?.toLowerCase()
  );

  const filtered = countries.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Combobox Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3.5 rounded-xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-gray-900 dark:text-white flex items-center justify-between gap-3 hover:border-purple-300 dark:hover:border-purple-800 transition-all cursor-pointer shadow-xs text-left"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {selected ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selected.flagUrl} 
                alt={selected.name} 
                className="w-5 h-3.5 object-cover rounded-2xs border border-gray-200/80 dark:border-white/20 shrink-0" 
              />
              <span className="font-extrabold text-xs text-purple-600 dark:text-purple-400 shrink-0">
                {selected.code}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white truncate">
                {selected.name}
              </span>
            </>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0", isOpen && "rotate-180")} />
      </button>

      {/* Searchable Combobox Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-[#150A2E] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-purple-950/20 overflow-hidden max-h-72 flex flex-col touch-pan-y">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 relative flex items-center shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-5" />
            <input
              type="text"
              placeholder="Search country name or code (e.g., Switzerland, CH)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-600"
              autoFocus
            />
          </div>

          {/* Country Options List */}
          <div className="overflow-y-auto max-h-48 sm:max-h-56 p-1.5 custom-scrollbar touch-pan-y overscroll-contain shrink-1">
            {filtered.length > 0 ? (
              filtered.map((c) => {
                const isSelected = selected?.code === c.code;
                return (
                  <button
                    key={`${c.code}-${c.name}`}
                    type="button"
                    onClick={() => {
                      onChange(c.name);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={cn(
                      "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer mb-0.5",
                      isSelected
                        ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold"
                        : "text-gray-700 dark:text-gray-200 hover:bg-purple-50/50 dark:hover:bg-white/5"
                    )}
                  >
                    <span className="flex items-center gap-3 truncate">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={c.flagUrl} 
                        alt={c.name} 
                        className="w-5 h-3.5 object-cover rounded-2xs border border-gray-200/80 dark:border-white/20 shrink-0" 
                      />
                      <span className="font-extrabold text-purple-600 dark:text-purple-400 w-6 shrink-0">{c.code}</span>
                      <span className="truncate">{c.name}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <p className="p-4 text-xs font-medium text-gray-400 text-center">No country found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
