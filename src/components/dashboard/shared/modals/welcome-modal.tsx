'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Rocket, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/user-context';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const { user, workspace, refreshUser } = useUser();
  const [shouldRender, setShouldRender] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  if (!shouldRender || !user || !workspace) return null;

  const handleDismiss = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/workspaces/settings', {
        method: 'POST',
      });
      if (res.ok) {
        await refreshUser();
        onClose();
      }
    } catch (err) {
      console.error('Failed to dismiss welcome modal:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-500",
      isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    )}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-500" 
        onClick={handleDismiss}
      />

      {/* Modal Container */}
      <div className={cn(
        "relative w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 transform",
        isOpen ? "scale-100 translate-y-0" : "scale-90 translate-y-10"
      )}>
        {/* Dynamic Background Header */}
        <div className="h-56 flex items-center justify-center relative overflow-hidden bg-[#8400DB]">
          {/* Subtle noise/texture for premium feel */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          
          {/* Siri Orb Container (Centered in Header) */}
          <div className="relative z-20">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Siri Layers (Multi-colored) */}
              <div className="absolute inset-0 rounded-full mix-blend-screen blur-2xl opacity-60 animate-siri-layer-1 bg-cyan-400" />
              <div className="absolute inset-2 rounded-full mix-blend-screen blur-2xl opacity-60 animate-siri-layer-2 bg-fuchsia-500" />
              <div className="absolute inset-[10%] rounded-full mix-blend-screen blur-xl opacity-70 animate-siri-layer-3 bg-[#8400DB]" />
              <div className="absolute inset-[25%] rounded-full bg-white blur-lg opacity-80 animate-siri-core" />
              
              {/* Real-time organic light spheres */}
              <div className="absolute w-[80%] h-[80%] rounded-full blur-md opacity-40 animate-siri-morph-1 bg-gradient-to-tr from-cyan-300 via-fuchsia-400 to-white/80" />
              <div className="absolute w-[85%] h-[85%] rounded-full blur-lg opacity-30 animate-siri-morph-2 bg-gradient-to-bl from-purple-400 via-white to-cyan-200" />
              
              {/* The Central Icon Box (Floating) */}
              <div className="relative z-30 w-24 h-24 rounded-[2rem] backdrop-blur-3xl border border-white/40 flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-siri-float bg-white/10">
                <Rocket className="w-12 h-12 text-white stroke-[2px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area (White space) */}
        <div className="p-8 pt-8 flex flex-col items-center text-center bg-white relative">
          {/* Status Badge */}
          <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border bg-purple-50 text-[#8400DB] border-purple-100">
            Welcome to Recura
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Welcome to Recura!</h3>
          <p className="text-sm font-black text-purple-600 mb-3 uppercase tracking-wider">
            Hi, {user.fullName}
          </p>
          <p className="text-slate-500 font-bold leading-relaxed mb-6 text-sm">
            Your workspace <strong className="text-slate-900 font-extrabold">{workspace.name}</strong> has been successfully configured as a <strong className="text-slate-900 font-extrabold">{workspace.niche || 'business'}</strong> hub.
          </p>

          {/* Compact Checklist */}
          <div className="w-full bg-slate-50/50 p-5 rounded-[1.5rem] text-left border border-slate-100/50 mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
              </div>
              <p className="text-xs font-bold text-slate-400 line-through">
                Workspace Profile Configured
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-purple-400 flex items-center justify-center shrink-0">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                Explore subscription metrics and KPIs
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
              <p className="text-xs font-bold text-slate-500">
                Link payment gateways (e.g. Stripe)
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleDismiss}
            disabled={submitting}
            className="w-full py-4 rounded-[1.5rem] text-white font-black text-sm tracking-[0.2em] shadow-xl transition-all active:scale-[0.97] uppercase bg-gradient-to-r from-[#FAB2FF] to-[#8400DB] hover:shadow-purple-500/40 shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Go to my dashboard"
            )}
          </button>
        </div>

        {/* Branding Footer */}
        <div className="bg-slate-50/50 p-6 flex flex-col items-center gap-3 border-t border-slate-100">
           <div className="relative w-20 h-6 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
              <Image 
                src="https://res.cloudinary.com/weburea/image/upload/v1783571840/logo_plan.svg" 
                alt="Recura Logo" 
                fill
                className="object-contain invert dark:invert-0"
              />
           </div>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full shadow-sm">
             Verified Secure
           </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes siri-layer-1 {
          0%, 100% { transform: translate(0, 0) scale(1) skew(0) rotate(0); }
          50% { transform: translate(15px, -10px) scale(1.1) skew(5deg) rotate(15deg); }
        }
        @keyframes siri-layer-2 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0); }
          50% { transform: translate(-20px, 15px) scale(1.15) rotate(-20deg); }
        }
        @keyframes siri-layer-3 {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.2) translate(10px, 10px); }
        }
        @keyframes siri-core {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 0.4; }
        }
        @keyframes siri-morph-1 {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg) scale(1); }
          50% { border-radius: 30% 60% 70% 30% / 50% 60% 30% 60%; transform: rotate(180deg) scale(1.1); }
        }
        @keyframes siri-morph-2 {
          0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 70%; transform: rotate(0deg) scale(1.1); }
          50% { border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%; transform: rotate(-180deg) scale(0.9); }
        }
        @keyframes siri-float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        .animate-siri-layer-1 { animation: siri-layer-1 6s ease-in-out infinite; }
        .animate-siri-layer-2 { animation: siri-layer-2 8s ease-in-out infinite; }
        .animate-siri-layer-3 { animation: siri-layer-3 10s ease-in-out infinite; }
        .animate-siri-core { animation: siri-core 3s ease-in-out infinite; }
        .animate-siri-morph-1 { animation: siri-morph-1 7s linear infinite; }
        .animate-siri-morph-2 { animation: siri-morph-2 9s linear infinite; }
        .animate-siri-float { animation: siri-float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
