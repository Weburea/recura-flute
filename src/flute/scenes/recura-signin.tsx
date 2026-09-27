"use client";

import React from "react";
import { Surface } from "@webprodigies/flute";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Eye,
  Check,
  Sparkles
} from "lucide-react";

export default function RecuraSignInScene() {
  const categories = ["SaaS", "Agencies", "Social Media", "Startups", "Marketplaces"];

  return (
    <>
      {/* ─── 1. Left Hero Branding & Animation Surface ────────────────────── */}
      <Surface
        id="signin-hero"
        style={{ width: 640, height: 820 }}
        className="bg-[#110724]/95 border border-purple-500/25 rounded-3xl p-8 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl relative overflow-hidden select-none"
      >
        {/* Ambient Glows */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-600/40">
            R
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">Recura</h2>
            <p className="text-[11px] text-purple-300 font-medium">Unified Recurring Revenue OS</p>
          </div>
        </div>

        {/* Glassmorphic Mockup Container */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative z-10 space-y-4 my-auto">
          {/* Top Window Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-3 py-0.5 rounded-full border border-white/5">
              app.recura.io/dashboard
            </span>
            <div className="w-4" />
          </div>

          {/* Central Orbiting Node Illustration */}
          <div className="relative h-44 flex items-center justify-center">
            {/* Orbiting rings */}
            <div className="absolute w-36 h-36 rounded-full border border-purple-500/30 animate-spin" style={{ animationDuration: "20s" }} />
            <div className="absolute w-24 h-24 rounded-full border border-indigo-500/20" />

            {/* Central Recura Hub */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-purple-500/50 z-10">
              R
            </div>

            {/* Satellite Avatar Nodes */}
            <div className="absolute top-2 left-16 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
              JD
            </div>
            <div className="absolute bottom-3 right-16 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
              SL
            </div>
            <div className="absolute top-6 right-20 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-[9px] font-bold text-white shadow-md">
              MK
            </div>
          </div>

          {/* Spotlight Transaction Cards */}
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-white">$18,420.00</p>
                <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Sub MRR via Stripe</p>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between opacity-80">
              <div>
                <p className="text-xs font-black text-white">+$149.00 USD</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">VIP Tier Subscription</p>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Tagline & Category Pills */}
        <div className="space-y-3 relative z-10 pt-2">
          <h3 className="text-2xl font-black text-white tracking-tight">
            One platform. <span className="text-purple-400">Five businesses.</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <span
                key={i}
                className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                  i === 0
                    ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30"
                    : "bg-white/5 text-slate-400 border-white/10"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </Surface>

      {/* ─── 2. Right Interactive Sign-In Form Surface ────────────────────── */}
      <Surface
        id="signin-form"
        style={{ width: 560, height: 820 }}
        className="bg-[#0B0415]/98 border border-white/10 rounded-3xl p-10 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-3xl relative select-none"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <span className="text-xs font-bold text-slate-400">Recura Authentication</span>
          <span className="text-xs font-bold text-purple-400 hover:underline cursor-pointer">Need help?</span>
        </div>

        {/* Form Body */}
        <div className="space-y-6 my-auto">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Hi, welcome back!</h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Sign in to manage your recurring billing, invoices, and subscribers
            </p>
          </div>

          {/* Social Sign-in Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all">
              <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[10px] text-black font-black">
                G
              </span>
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all">
              <span className="w-4 h-4 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center text-[10px] text-white font-black">
                🐙
              </span>
              <span>GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">or sign in with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="email"
                  readOnly
                  value="founder@acme-saas.io"
                  className="w-full bg-white/5 border border-purple-500/30 rounded-xl py-3 pl-10 pr-4 text-xs font-medium text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="password"
                  readOnly
                  value="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-xs font-medium text-white focus:outline-none tracking-widest"
                />
                <Eye className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-purple-600" />
                <span>Remember this device</span>
              </label>
              <span className="text-purple-400 font-bold hover:underline cursor-pointer">Forgot password?</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all">
            <span>Sign in to Recura</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Security Guarantee Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Protected with 256-bit bank-grade encryption</span>
        </div>
      </Surface>

      {/* ─── 3. Floating 2FA Verification Card Surface ────────────────────── */}
      <Surface
        id="signin-2fa-badge"
        style={{ width: 380, height: 300 }}
        className="bg-[#180B33]/98 border border-purple-400/50 rounded-3xl p-6 shadow-[0_30px_70px_rgba(0,0,0,0.95)] backdrop-blur-3xl flex flex-col justify-between select-none"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">Two-Factor Authentication</h4>
              <p className="text-[10px] text-purple-300 font-medium">Authenticator App Challenge</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-medium">
            Enter the 6-digit confirmation code from Google Authenticator or 1Password:
          </p>

          {/* 6 Digit Verification Code Boxes */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {["4", "8", "2", "9", "1", "0"].map((digit, i) => (
              <div
                key={i}
                className="w-11 h-12 rounded-xl bg-white/5 border border-purple-500/40 flex items-center justify-center font-mono text-lg font-black text-white shadow-inner"
              >
                {digit}
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30">
          <Check className="w-3.5 h-3.5" />
          <span>Verify & Complete Sign In</span>
        </button>
      </Surface>

      {/* ─── 4. Floating Success Status Banner Surface ────────────────────── */}
      <Surface
        id="signin-verified-pill"
        style={{ width: 380, height: 64 }}
        className="bg-emerald-950/95 border border-emerald-500/40 rounded-2xl px-5 flex items-center gap-3.5 shadow-xl shadow-black/80 backdrop-blur-2xl select-none"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold text-emerald-200">Account Setup Verified</p>
          <p className="text-[10px] text-emerald-400 font-medium truncate">Ready to sign in to your dashboard</p>
        </div>
      </Surface>
    </>
  );
}
