"use client";

import React from "react";
import { Surface } from "@webprodigies/flute";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { DollarSign, Users, CreditCard, Activity, ArrowUpRight } from "lucide-react";

export default function RecuraHero() {
  return (
    <Surface
      id="dashboard-surface"
      style={{ width: 1280, height: 820 }}
      className="p-8 bg-slate-900/95 text-slate-100 rounded-3xl border border-slate-700/60 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden"
    >
      {/* Top Header Mockup */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-500/25">
            R
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Recura Analytics
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-medium border border-purple-500/20">
                Live Overview
              </span>
            </h2>
            <p className="text-xs text-slate-400">Recurring revenue performance & real-time metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-600/20">
            <span>Generate Report</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="grid grid-cols-4 gap-5 my-2">
        <StatsCard
          title="Monthly Recurring Revenue"
          value="$48,250.00"
          trend="+18.4%"
          trendType="up"
          icon={DollarSign}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10 border border-purple-500/20"
          trendContext="vs last month"
        />
        <StatsCard
          title="Active Subscriptions"
          value="2,840"
          trend="+12.6%"
          trendType="up"
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border border-blue-500/20"
          trendContext="vs last month"
        />
        <StatsCard
          title="Avg. Revenue Per User"
          value="$64.80"
          trend="+4.2%"
          trendType="up"
          icon={CreditCard}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border border-emerald-500/20"
          trendContext="vs last month"
        />
        <StatsCard
          title="Retention Rate"
          value="97.8%"
          trend="+0.6%"
          trendType="up"
          icon={Activity}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border border-amber-500/20"
          trendContext="vs last month"
        />
      </div>

      {/* Main Revenue Chart Area */}
      <div className="flex-1 bg-slate-950/60 rounded-2xl border border-slate-800/80 p-5 mt-2 flex flex-col">
        <RevenueChart
          title="Revenue & Subscription Growth"
          subtitle="Real-time recurring revenue timeline across the past 12 months"
        />
      </div>
    </Surface>
  );
}
