'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Check, 
  Loader2, 
  X,
  Info,
  ShoppingBag,
  Globe,
  Package,
  Store
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { OnboardingShell } from './onboarding-shell';
import { ONBOARDING_CONFIGS, PhaseConfig } from '@/config/onboarding-phases';
import { CountrySelect } from '@/components/ui/country-select';
import { FieldHelperText } from '@/components/ui/field-helper-text';
import { RepeatableListField } from '@/components/ui/repeatable-list-field';

/* Logo Upload Component supporting Click & Drag-and-Drop */
function LogoFileUpload({ 
  value, 
  onChange, 
  helperText 
}: { 
  value?: string; 
  onChange: (val: string) => void; 
  helperText?: string; 
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {value ? (
        <div className="border border-purple-200 dark:border-purple-800/60 rounded-2xl p-4 bg-purple-50/40 dark:bg-purple-950/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-1 overflow-hidden shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Logo preview" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">Logo uploaded successfully</p>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Ready for invoice templates</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group",
            isDragging
              ? "border-purple-600 bg-purple-50/80 dark:bg-purple-950/60"
              : "border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-white/10"
          )}
        >
          <Upload className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors mx-auto mb-2" />
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Click to select or drag logo file here
          </p>
          <p className="text-[11px] text-gray-400 mt-1 font-medium">
            {helperText || 'PNG, JPG, or SVG up to 2MB'}
          </p>
        </div>
      )}
    </div>
  );
}

function BusinessDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const nicheType = searchParams.get('type') || 'saas';
  const nicheConfig = ONBOARDING_CONFIGS[nicheType] || ONBOARDING_CONFIGS.saas;

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({ 
    country: 'United States',
    sellModel: 'own',
    platforms: ['shopify'],
    servicesList: [''],
    productTypes: [''],
    offeringsList: [''],
    isHiring: 'yes',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Compute active phases (with dynamic branching for E-Commerce if applicable)
  const activePhases: PhaseConfig[] = nicheConfig.getBranchPhases 
    ? nicheConfig.getBranchPhases(formData) 
    : nicheConfig.phases;

  const currentPhase: PhaseConfig = activePhases[currentPhaseIndex] || activePhases[0];
  const totalPhases = activePhases.length;
  const isFinalPhase = currentPhaseIndex === totalPhases - 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [fieldId]: value };
      
      currentPhase.fields.forEach(f => {
        if (f.autoEstimateFrom === fieldId && value !== '') {
          const monthly = parseFloat(value);
          if (!isNaN(monthly)) {
            updated[f.id] = (monthly * 12).toString();
          }
        }
      });
      
      return updated;
    });

    if (errors[fieldId]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  const validateCurrentPhase = () => {
    const newErrors: Record<string, string> = {};
    currentPhase.fields.forEach(field => {
      if (field.type === 'repeatable') {
        const listVal: string[] = formData[field.id] || [];
        const validItems = listVal.filter(item => item && item.trim() !== '');
        if (validItems.length === 0) {
          newErrors[field.id] = `Please add at least one ${field.itemLabel || 'item'} to continue`;
        }
      } else if (!field.optional) {
        const val = formData[field.id];
        if (val === undefined || val === null || String(val).trim() === '') {
          newErrors[field.id] = `${field.label} is required`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentPhase()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (isFinalPhase) {
        let isShopifySelected = false;
        if (formData['sales_channels'] && Array.isArray(formData['sales_channels'])) {
          isShopifySelected = formData['sales_channels'].includes('Shopify store');
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('recura_business_type', nicheType);
          sessionStorage.setItem('recura_business_type', nicheType);
          if (formData.businessName) {
            localStorage.setItem('recura_business_name', String(formData.businessName));
            sessionStorage.setItem('recura_business_name', String(formData.businessName));
          }
          localStorage.setItem('recura_step4_formdata', JSON.stringify(formData));
          sessionStorage.setItem('recura_step4_formdata', JSON.stringify(formData));
          if (isShopifySelected) {
            localStorage.setItem('recura_shopify_selected', 'true');
          }
        }
        const queryParams = new URLSearchParams({
          type: nicheType,
          ...(isShopifySelected ? { shopify: 'true' } : {}),
        }).toString();
        router.push(`/connect-payment?${queryParams}`);
      } else {
        setCurrentPhaseIndex(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 400);
  };

  const handleBack = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(prev => prev - 1);
    } else {
      router.push('/choose-business');
    }
  };

  return (
    <OnboardingShell step={4} maxWidth="2xl">
      <div className="w-full bg-white dark:bg-[#150A2E] rounded-[2.5rem] p-6 sm:p-12 shadow-2xl shadow-purple-900/10 border border-purple-100/50 dark:border-white/10 transition-all duration-300">
        
        {/* Phase Header Progress Indicator (Responsive Stack on Mobile, Single Line Badge) */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-gray-100 dark:border-white/5 pb-4 sm:pb-5">
          <div className="flex items-center gap-2 pl-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse shrink-0" />
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider truncate">
              {nicheConfig.title}
            </span>
          </div>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-3.5 py-1.5 rounded-full border border-gray-200/60 dark:border-white/10 w-fit shrink-0 whitespace-nowrap">
            {currentPhase.name} — {currentPhaseIndex + 1} of {totalPhases}
          </span>
        </div>

        {/* Dynamic Card Body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Phase Title & Subtitle */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {currentPhase.name}
              </h1>
              {currentPhase.description && (
                <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 font-medium">
                  {currentPhase.description}
                </p>
              )}
            </div>

            {/* Form Fields Renderer */}
            <form onSubmit={handleNext} className="space-y-6 pt-2">
              <div className="space-y-5">
                {currentPhase.fields.map((field) => {
                  const val = formData[field.id];

                  // Resolve helper text
                  let helperTextResolved: string | undefined = field.helperText;
                  if (field.helperTextMap && val) {
                    helperTextResolved = field.helperTextMap[val];
                  } else if (field.helperTextTemplate && val && String(val).trim() !== '') {
                    helperTextResolved = field.helperTextTemplate(String(val));
                  }

                  return (
                    <div key={field.id} className="space-y-1.5">
                      {field.type !== 'repeatable' && field.type !== 'radio_cards' && (
                        <div className="flex items-center justify-between">
                          <label htmlFor={field.id} className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                            {field.label}
                          </label>
                          {field.optional && (
                            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                              (optional)
                            </span>
                          )}
                        </div>
                      )}

                      {/* FIELD TYPE: REPEATABLE LIST */}
                      {field.type === 'repeatable' && (
                        <RepeatableListField
                          id={field.id}
                          label={field.label}
                          placeholder={field.placeholder}
                          itemLabel={field.itemLabel}
                          items={formData[field.id] || ['']}
                          onChange={(items) => handleInputChange(field.id, items)}
                          error={errors[field.id]}
                        />
                      )}

                      {/* FIELD TYPE: RADIO CARDS (How Do You Sell?) */}
                      {field.type === 'radio_cards' && field.options && (
                        <div className="space-y-3 pt-1">
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                            {field.label}
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {field.options.map((opt) => {
                              const isSelected = formData[field.id] === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => handleInputChange(field.id, opt.value)}
                                  className={cn(
                                    "p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden",
                                    isSelected
                                      ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/20 text-purple-950 dark:text-purple-100"
                                      : "bg-white dark:bg-white/5 border-gray-200/80 dark:border-white/10 text-gray-900 dark:text-white hover:border-purple-300"
                                  )}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-bold text-sm tracking-tight">{opt.label}</span>
                                    <div className={cn(
                                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                                      isSelected
                                        ? "border-purple-600 bg-purple-600 text-white"
                                        : "border-gray-300 dark:border-white/20"
                                    )}>
                                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>
                                  </div>
                                  {opt.helperText && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                      {opt.helperText}
                                    </p>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* FIELD TYPE: CHECKBOX GROUP (Platforms) */}
                      {field.type === 'checkbox_group' && field.options && (
                        <div className="space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {field.options.map((opt) => {
                              const selectedList: string[] = formData[field.id] || ['shopify'];
                              const isChecked = selectedList.includes(opt.value);

                              const toggleOption = () => {
                                if (opt.disabled) return;
                                if (isChecked) {
                                  handleInputChange(field.id, selectedList.filter(v => v !== opt.value));
                                } else {
                                  handleInputChange(field.id, [...selectedList, opt.value]);
                                }
                              };

                              const getOptionIcon = (iconKey?: string) => {
                                switch (iconKey) {
                                  case 'shopify': return <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
                                  case 'website': return <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />;
                                  case 'amazon': return <Package className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
                                  case 'walmart': return <Store className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />;
                                  default: return null;
                                }
                              };

                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  disabled={opt.disabled}
                                  onClick={toggleOption}
                                  className={cn(
                                    "p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer text-left",
                                    opt.disabled && "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-400",
                                    !opt.disabled && isChecked && "bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/20",
                                    !opt.disabled && !isChecked && "bg-white dark:bg-white/5 border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-purple-200"
                                  )}
                                >
                                  <span className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      disabled={opt.disabled}
                                      onChange={() => {}}
                                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    {getOptionIcon(opt.icon)}
                                    <span>{opt.label}</span>
                                  </span>
                                  {opt.badge && (
                                    <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-200/60 dark:bg-white/10 px-2 py-0.5 rounded-full">
                                      {opt.badge}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Inline Info Note for Shopify */}
                          {(formData[field.id] || ['shopify']).includes('shopify') && (
                            <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/50 text-xs text-purple-900 dark:text-purple-200 font-medium flex items-start gap-2.5 mt-2">
                              <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                              <span>
                                <strong>Shopify Integration Note:</strong> Requires a paid Shopify plan (Basic Shopify or higher) that includes API access — Shopify&apos;s free trial does not support this.
                              </span>
                            </div>
                          )}

                          {/* Dynamic Helper Text for "My own website" */}
                          {(formData[field.id] || []).includes('custom_site') && (
                            <FieldHelperText text="We'll connect this to your existing site via API." />
                          )}
                        </div>
                      )}

                      {/* FIELD TYPE: TOGGLE */}
                      {field.type === 'toggle' && field.options && (
                        <div className="flex items-center gap-2">
                          {field.options.map((opt) => {
                            const isSelected = formData[field.id] === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleInputChange(field.id, opt.value)}
                                className={cn(
                                  "py-3 px-5 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer flex-1 whitespace-nowrap",
                                  isSelected
                                    ? "bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20"
                                    : "bg-white dark:bg-white/5 border-gray-200/80 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-purple-200"
                                )}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* FIELD TYPE: SEARCHABLE COUNTRY COMBOBOX */}
                      {field.type === 'country_select' && (
                        <CountrySelect
                          value={formData[field.id] || 'United States'}
                          onChange={(val) => handleInputChange(field.id, val)}
                          placeholder={field.placeholder}
                        />
                      )}

                      {/* FIELD TYPE: SELECT PILLS (Single-Line Guarantee: whitespace-nowrap & responsive flex-wrap) */}
                      {field.type === 'select' && field.options && (
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-2.5 pt-0.5">
                            {field.options.map((opt) => {
                              const isSelected = formData[field.id] === opt.value || (!formData[field.id] && opt === field.options![0]);
                              if (!formData[field.id] && opt === field.options![0]) {
                                setTimeout(() => handleInputChange(field.id, opt.value), 0);
                              }
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => handleInputChange(field.id, opt.value)}
                                  className={cn(
                                    "py-3 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer flex items-center justify-center gap-1.5 flex-1 min-w-[calc(50%-6px)] sm:min-w-fit whitespace-nowrap",
                                    isSelected
                                      ? "bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-700 dark:text-purple-300 shadow-xs ring-2 ring-purple-500/20"
                                      : "bg-white dark:bg-white/5 border-gray-200/80 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-purple-200"
                                  )}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />}
                                  <span className="whitespace-nowrap">{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* FIELD TYPE: FILE UPLOAD */}
                      {field.type === 'file' && (
                        <LogoFileUpload
                          value={formData[field.id]}
                          onChange={(val) => handleInputChange(field.id, val)}
                          helperText={field.helperText}
                        />
                      )}

                      {/* FIELD TYPE: TEXTAREA */}
                      {field.type === 'textarea' && (
                        <textarea
                          id={field.id}
                          name={field.id}
                          rows={3}
                          placeholder={field.placeholder || ''}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className={cn(
                            "w-full px-4 py-3.5 rounded-xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-600/10 transition-all resize-none",
                            errors[field.id] && "border-red-500"
                          )}
                        />
                      )}

                      {/* FIELD TYPE: TEXT / EMAIL / NUMBER / URL INPUTS */}
                      {field.type !== 'select' && 
                       field.type !== 'country_select' && 
                       field.type !== 'file' && 
                       field.type !== 'repeatable' && 
                       field.type !== 'radio_cards' && 
                       field.type !== 'checkbox_group' && 
                       field.type !== 'toggle' && 
                       field.type !== 'textarea' && (
                        <div className="relative group">
                          <input
                            type={field.type}
                            id={field.id}
                            name={field.id}
                            placeholder={field.placeholder || ''}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className={cn(
                              "w-full px-4 py-3.5 rounded-xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-600/10 transition-all",
                              errors[field.id] && "border-red-500 focus:border-red-500"
                            )}
                          />
                        </div>
                      )}

                      {/* Config-driven Field Helper Text Renderer */}
                      <FieldHelperText text={helperTextResolved} variant={field.helperTextVariant} />

                      {errors[field.id] && field.type !== 'repeatable' && (
                        <p className="text-red-500 text-xs font-bold mt-1">{errors[field.id]}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Action Buttons (Stacked Full-Width on Mobile: Zero Text Wrapping!) */}
              <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-5 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:flex-1 bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold py-4 sm:py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-gray-900/10 dark:shadow-purple-950/50 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 text-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving phase...</span>
                    </>
                  ) : (
                    <>
                      <span className="whitespace-nowrap">{isFinalPhase ? 'Complete business setup' : 'Save & continue'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        </AnimatePresence>

      </div>
    </OnboardingShell>
  );
}

export function BusinessDetails() {
  return (
    <Suspense fallback={
      <OnboardingShell step={4} maxWidth="2xl">
        <div className="w-full bg-white dark:bg-[#150A2E] rounded-[2.5rem] p-12 text-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
          <p className="text-sm font-bold">Loading business phases...</p>
        </div>
      </OnboardingShell>
    }>
      <BusinessDetailsContent />
    </Suspense>
  );
}
