"use client"

import * as React from "react"
import { TrendingUp, Users, PlayCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
}

function MetricCard({ title, value, icon: Icon, iconColor, iconBg }: MetricCardProps) {
  return (
    <div className="dashboard-card bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-[24px] p-6 lg:p-8 flex items-start justify-between shadow-sm">
      <div className="space-y-3">
        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs tracking-widest uppercase">{title}</p>
        <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
      </div>
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-slate-50 dark:border-white/5", iconBg)}>
        <Icon className={cn("w-5 h-5", iconColor)} strokeWidth={2.5} />
      </div>
    </div>
  )
}

interface MetricsOverviewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptions?: any[]
  businessType?: string
}

export function MetricsOverview({ subscriptions = [], businessType = "other" }: MetricsOverviewProps) {
  const activeSubs = subscriptions.filter(s => s.status === 'Active')
  const canceledSubs = subscriptions.filter(s => s.status === 'Canceled')

  // Calculate MRR sum of ALL packages in list (active, paused, canceled)
  const totalValueCents = subscriptions.reduce((acc, s) => {
    const price = s.price || 0
    if (s.interval === 'year') {
      return acc + Math.round(price / 12)
    }
    return acc + price
  }, 0)

  const mrrValue = `$${(totalValueCents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`

  let mrrTitle = "Total Package Value"
  let totalTitle = "Total Packages"
  let activeTitle = "Active Packages"
  let canceledTitle = "Canceled Packages"

  if (businessType === "saas") {
    mrrTitle = "Total Subscription Value"
    totalTitle = "Total Subscribers"
    activeTitle = "Active Subscribers"
    canceledTitle = "Canceled Subscribers"
  } else if (businessType === "agencies") {
    mrrTitle = "Total Retainer Value"
    totalTitle = "Total Agreements"
    activeTitle = "Active Agreements"
    canceledTitle = "Canceled Agreements"
  } else if (businessType === "social_media") {
    mrrTitle = "Total Package Value"
    totalTitle = "Total Packages"
    activeTitle = "Active Packages"
    canceledTitle = "Canceled Packages"
  } else if (businessType === "marketplaces") {
    mrrTitle = "Total Catalog Value"
    totalTitle = "Total Products"
    activeTitle = "Active Products"
    canceledTitle = "Inactive Listings"
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title={mrrTitle}
        value={mrrValue}
        icon={TrendingUp}
        iconColor="text-emerald-500 dark:text-emerald-400"
        iconBg="bg-emerald-50 dark:bg-emerald-500/20"
      />
      <MetricCard
        title={totalTitle}
        value={subscriptions.length.toString()}
        icon={Users}
        iconColor="text-blue-500 dark:text-blue-400"
        iconBg="bg-blue-50 dark:bg-blue-500/20"
      />
      <MetricCard
        title={activeTitle}
        value={activeSubs.length.toString()}
        icon={PlayCircle}
        iconColor="text-purple-500 dark:text-purple-400"
        iconBg="bg-purple-50 dark:bg-purple-500/20"
      />
      <MetricCard
        title={canceledTitle}
        value={canceledSubs.length.toString()}
        icon={XCircle}
        iconColor="text-rose-500 dark:text-rose-400"
        iconBg="bg-rose-50 dark:bg-rose-500/20"
      />
    </div>
  )
}
