"use client"

import * as React from "react"
import {
  Building2,
  DollarSign,
  FolderOpen,
  Users,
  Rocket,
  CheckCircle2,
  LucideIcon
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActivityItem {
  icon: LucideIcon
  title: string
  description: string
  time: string
  iconColor: string
  iconBg: string
}

export interface RecentActivityProps {
  title?: string
  activities?: ActivityItem[]
  /** Pass workspace.metadata to generate onboarding milestones when activities is empty */
  metadata?: Record<string, unknown> | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeStr(meta: Record<string, unknown> | null | undefined, ...keys: string[]): string {
  if (!meta) return ""
  for (const k of keys) {
    const v = meta[k]
    if (v !== null && v !== undefined && String(v).trim() !== "") return String(v)
  }
  return ""
}

function safeNum(meta: Record<string, unknown> | null | undefined, ...keys: string[]): number {
  if (!meta) return 0
  for (const k of keys) {
    const v = meta[k]
    if (v !== null && v !== undefined) {
      const n = Number(v)
      if (!isNaN(n) && n > 0) return n
    }
  }
  return 0
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n.toLocaleString()}`
}

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.round(diffMs / 60_000)
  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin} minutes ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`
  const diffDay = Math.round(diffHr / 24)
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`
}

interface Milestone {
  icon: LucideIcon
  title: string
  description: string
  time: string
  iconColor: string
  iconBg: string
  badgeLabel: string
  badgeColor: string
}

function buildOnboardingMilestones(meta: Record<string, unknown> | null | undefined): Milestone[] {
  const milestones: Milestone[] = []

  // 1 — Workspace created
  const createdAt = safeStr(meta, "created_at", "createdAt")
  const workspaceName = safeStr(meta, "business_name", "businessName", "name")
  const createdDate = createdAt ? new Date(createdAt) : new Date()
  milestones.push({
    icon: Building2,
    title: "Workspace Created",
    description: workspaceName
      ? `"${workspaceName}" is ready to go`
      : "Your workspace has been set up and is ready to use",
    time: relativeTime(createdDate),
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-500/20",
    badgeLabel: "Setup",
    badgeColor: "bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400",
  })

  // 2 — Retainer / avg project value
  const retainer = safeNum(meta, "avg_project_value", "avgProjectValue", "monthly_revenue", "monthlyRevenue")
  if (retainer > 0) {
    milestones.push({
      icon: DollarSign,
      title: "Active Retainer Set",
      description: `Baseline value configured at ${formatCurrency(retainer)}/mo`,
      time: relativeTime(createdDate),
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/20",
      badgeLabel: "Billing",
      badgeColor: "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    })
  } else {
    milestones.push({
      icon: DollarSign,
      title: "Retainer Pending",
      description: "No retainer value configured yet — update in Settings",
      time: relativeTime(createdDate),
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-500/20",
      badgeLabel: "Pending",
      badgeColor: "bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400",
    })
  }

  // 3 — Projects / team size
  const teamSize = safeNum(meta, "team_size", "teamSize")
  const activeCount = safeNum(meta, "active_customers_count", "activeCustomersCount", "active_customers")
  const projectCount = activeCount > 0 ? activeCount : teamSize > 0 ? teamSize : 0

  if (projectCount > 0) {
    milestones.push({
      icon: FolderOpen,
      title: `${projectCount} Project${projectCount > 1 ? "s" : ""} Initialized`,
      description: `${projectCount} active ${activeCount > 0 ? "customer" : "team member"}${projectCount > 1 ? "s" : ""} registered in your workspace`,
      time: relativeTime(createdDate),
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-500/20",
      badgeLabel: "Active",
      badgeColor: "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400",
    })
  } else {
    milestones.push({
      icon: Users,
      title: "Team Not Configured",
      description: "Add your team members or import customer data to get started",
      time: relativeTime(createdDate),
      iconColor: "text-slate-400 dark:text-slate-500",
      iconBg: "bg-slate-50 dark:bg-white/5",
      badgeLabel: "Setup",
      badgeColor: "bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500",
    })
  }

  // 4 — Integrations
  const integrations = meta?.integrations
  const integrationCount = Array.isArray(integrations) ? integrations.length : 0
  if (integrationCount > 0) {
    milestones.push({
      icon: Rocket,
      title: `${integrationCount} Integration${integrationCount > 1 ? "s" : ""} Connected`,
      description: `${(integrations as string[]).join(", ")} linked to your workspace`,
      time: relativeTime(createdDate),
      iconColor: "text-cyan-600 dark:text-cyan-400",
      iconBg: "bg-cyan-50 dark:bg-cyan-500/20",
      badgeLabel: "Live",
      badgeColor: "bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
    })
  }

  // 5 — Always-present "Onboarding complete" capstone
  milestones.push({
    icon: CheckCircle2,
    title: "Onboarding Complete",
    description: "Your workspace is live. Start tracking revenue and activity.",
    time: relativeTime(createdDate),
    iconColor: "text-teal-600 dark:text-teal-400",
    iconBg: "bg-teal-50 dark:bg-teal-500/20",
    badgeLabel: "Done",
    badgeColor: "bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400",
  })

  return milestones
}

// ─── Milestone row ────────────────────────────────────────────────────────────

function MilestoneRow({ item, isLast }: { item: Milestone; isLast: boolean }) {
  const Icon = item.icon
  return (
    <div className="flex gap-4 group">
      {/* Left: icon + connector line */}
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${item.iconBg}`}>
          <Icon className={`w-4 h-4 ${item.iconColor}`} strokeWidth={2.5} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-slate-100 dark:bg-white/5 mt-2 mb-1 min-h-[20px]" />
        )}
      </div>

      {/* Right: content card */}
      <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-5"}`}>
        <div className="bg-slate-50/60 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 rounded-2xl p-4 transition-all group-hover:border-purple-100 dark:group-hover:border-purple-500/20 group-hover:shadow-sm group-hover:shadow-purple-500/5">
          <div className="flex items-start justify-between gap-3 mb-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {item.title}
            </p>
            <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-lg ${item.badgeColor}`}>
              {item.badgeLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
            {item.description}
          </p>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            {item.time}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Activity row (live data) ─────────────────────────────────────────────────

function ActivityRow({ activity, isLast }: { activity: ActivityItem; isLast: boolean }) {
  return (
    <div className={`flex items-start gap-4 group ${isLast ? "" : "pb-5"}`}>
      <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 flex-shrink-0 ${activity.iconBg}`}>
        <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none mb-1">
          {activity.title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-1">
          {activity.description}
        </p>
        <p className="text-[10px] text-slate-400 font-medium">
          {activity.time}
        </p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RecentActivity({
  title = "Recent Activity",
  activities = [],
  metadata,
}: RecentActivityProps) {
  const showMilestones = activities.length === 0
  const milestones = React.useMemo(
    () => buildOnboardingMilestones(metadata ?? null),
    [metadata]
  )

  return (
    <div className="dashboard-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="dashboard-title text-lg md:text-xl">
            {showMilestones ? "Getting Started" : title}
          </h3>
          {showMilestones && (
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
              Your workspace onboarding progress
            </p>
          )}
        </div>
        {!showMilestones && (
          <button className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline cursor-pointer">
            View All
          </button>
        )}
      </div>

      {/* Content */}
      {showMilestones ? (
        <div>
          {milestones.map((m, i) => (
            <MilestoneRow key={i} item={m} isLast={i === milestones.length - 1} />
          ))}
        </div>
      ) : (
        <div>
          {activities.map((activity, i) => (
            <ActivityRow
              key={i}
              activity={activity}
              isLast={i === activities.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
