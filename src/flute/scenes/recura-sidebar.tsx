"use client";

import React from "react";
import { Surface } from "@webprodigies/flute";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  Search,
  Bell,
  TrendingUp,
  DollarSign,
  Activity,
  Plus,
  ChevronDown,
  Sparkles
} from "lucide-react";

export default function RecuraSidebarScene() {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Users, label: "Subscribers", active: false },
    { icon: FileText, label: "Invoices", active: false },
    { icon: CreditCard, label: "Billing", active: false },
    { icon: Settings, label: "Settings", active: false }
  ];

  return (
    <>
      {/* ─── 1. Recura Sidebar Surface ─────────────────────────────────────── */}
      <Surface
        id="sidebar"
        style={{ width: 270, height: 820 }}
        className="bg-[#0D0518]/95 border border-purple-500/20 rounded-3xl p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden select-none"
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-purple-600/40">
              R
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Recura
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Pro
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">SaaS Analytics Suite</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-2">
            {navItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  item.active
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-900/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? "text-purple-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {item.active && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-purple-400 shadow-sm shadow-purple-400/80" />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom User Avatar State */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                AM
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0D0518]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Alex Mercer</p>
              <p className="text-[10px] text-purple-300 truncate font-medium">Founder & CEO</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </Surface>

      {/* ─── 2. Top Navbar Surface ─────────────────────────────────────────── */}
      <Surface
        id="topbar"
        style={{ width: 1060, height: 80 }}
        className="bg-[#0D0518]/95 border border-purple-500/20 rounded-2xl px-6 flex items-center justify-between shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl select-none"
      >
        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            readOnly
            value="Search customers, subscriptions, invoice..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-11 pr-4 text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Right Section: Actions, Notifications Bell, Avatar State */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-600/30">
            <Plus className="w-3.5 h-3.5" />
            <span>New Plan</span>
          </button>

          {/* Notifications Bell with Ping Badge */}
          <div className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-purple-400 shadow-sm">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0D0518]" />
          </div>

          {/* Topbar User Avatar State */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                AM
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0D0518]" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white">Alex Mercer</p>
              <p className="text-[9px] text-slate-400 font-semibold">Acme SaaS Inc.</p>
            </div>
          </div>
        </div>
      </Surface>

      {/* ─── 3. Main Dashboard Screen Surface ───────────────────────────────── */}
      <Surface
        id="dashboard-content"
        style={{ width: 1060, height: 710 }}
        className="relative bg-[#080210]/95 border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden select-none"
      >
        {/* Mockup Background Grid Lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(168, 85, 247, 0.15) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(168, 85, 247, 0.15) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }}
        />

        {/* Glowing Radial Backdrop Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-3 gap-5 relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">MRR</p>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white">$48,250.00</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs last month</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Subscribers</p>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white">2,840</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.6% vs last month</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Retention</p>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white">97.8%</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Industry benchmark top 5%</span>
            </div>
          </div>
        </div>

        {/* Live SVG Revenue Chart */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 mt-4 flex flex-col relative z-10">
          <RevenueChart
            title="Recurring Revenue Velocity"
            subtitle="Real-time timeline tracking MRR, new churn, and ARR expansion"
          />
        </div>
      </Surface>

      {/* ─── 4. Notifications Floating Popover Surface ────────────────────── */}
      <Surface
        id="notification-popover"
        style={{ width: 340, height: 280 }}
        className="bg-[#150a2e]/98 border border-purple-500/40 rounded-3xl p-5 shadow-[0_25px_50px_rgba(0,0,0,0.9)] backdrop-blur-3xl flex flex-col justify-between select-none"
      >
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-purple-400" />
              <span>Notifications</span>
            </h4>
            <span className="text-[10px] font-bold text-purple-400 hover:underline cursor-pointer">
              Mark all read
            </span>
          </div>

          <div className="space-y-3 mt-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  New Subscriber
                </span>
                <span className="text-[10px] text-slate-400">5m ago</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Sarah Johnson subscribed to <span className="text-purple-300 font-semibold">Premium Plan ($299/mo)</span>
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Payment Received
                </span>
                <span className="text-[10px] text-slate-400">23m ago</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Received <span className="text-emerald-300 font-semibold">$1,450.00</span> from Enterprise Corp
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 text-center">
          <button className="text-[11px] font-bold text-slate-400 hover:text-white uppercase tracking-wider">
            View full inbox →
          </button>
        </div>
      </Surface>
    </>
  );
}
