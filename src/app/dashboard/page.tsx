"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useUser } from "@/context/user-context"
import { WelcomeModal } from "@/components/dashboard/shared/modals/welcome-modal"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { ViewProfileModal } from "@/components/dashboard/shared/modals/view-profile-modal"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { 
  Users, 
  RefreshCcw, 
  AlertTriangle,
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
  ShoppingBag,
  Flame,
  LucideIcon,
  InboxIcon,
  MoreHorizontal,
  Eye
} from "lucide-react"

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Safely read a number from workspace.metadata, checking multiple key variants (camelCase + snake_case). */
function metaNum(meta: Record<string, unknown> | null | undefined, ...keys: string[]): number {
  if (!meta) return 0;
  for (const k of keys) {
    const v = meta[k];
    if (v !== null && v !== undefined) {
      const n = Number(v);
      if (!isNaN(n) && n > 0) return n;
    }
  }
  return 0;
}

/** Format a dollar amount from cents or raw value */
function formatCurrency(n: number): string {
  if (n === 0) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toLocaleString()}`;
}

/** Build a minimal 12-month relative chart from a single representative value (normalised 0-100) */
function buildChartFromValue(baseline: number): Record<string, number[]> {
  const clamp = (v: number) => Math.max(5, Math.min(100, Math.round(v)));
  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed
  const scale = baseline > 0 ? baseline / 100 : 0.1;

  // Slight ramp: show gradual growth up to the current month, flat after
  const data = Array.from({ length: 12 }, (_, i) => {
    if (i > currentMonth) return clamp(scale * 40); // future months = modest projection
    const fraction = currentMonth > 0 ? i / currentMonth : 1;
    return clamp(scale * (40 + 60 * fraction));
  });

  return { [`${year}`]: data };
}

// ─── Niche Template Labels ───────────────────────────────────────────────────

interface NicheTemplate {
  welcomeMessage: string;
  stat1Title: string;
  stat1Icon: LucideIcon;
  stat1Color: string;
  stat1Bg: string;
  stat2Title: string;
  stat2Icon: LucideIcon;
  stat2Color: string;
  stat2Bg: string;
  stat3Title: string;
  stat3Icon: LucideIcon;
  stat3Color: string;
  stat3Bg: string;
  stat4Title: string;
  stat4Icon: LucideIcon;
  stat4Color: string;
  stat4Bg: string;
  chartTitle: string;
  chartSubtitle: string;
  alertsTitle: string;
}

const NICHE_TEMPLATES: Record<string, NicheTemplate> = {
  saas: {
    welcomeMessage: "Here's what's happening with your subscription engine today.",
    stat1Title: "Total Revenue", stat1Icon: DollarSign, stat1Color: "text-emerald-600 dark:text-emerald-400", stat1Bg: "bg-emerald-50 dark:bg-emerald-500/20",
    stat2Title: "Active Subscriptions", stat2Icon: Users, stat2Color: "text-blue-600 dark:text-blue-400", stat2Bg: "bg-blue-50 dark:bg-blue-500/20",
    stat3Title: "Monthly Recurring Revenue", stat3Icon: RefreshCcw, stat3Color: "text-cyan-600 dark:text-cyan-400", stat3Bg: "bg-cyan-50 dark:bg-cyan-500/20",
    stat4Title: "Low Inventory Alerts", stat4Icon: AlertTriangle, stat4Color: "text-rose-600 dark:text-rose-400", stat4Bg: "bg-rose-50 dark:bg-rose-500/20",
    chartTitle: "Revenue Overview", chartSubtitle: "Monthly recurring revenue trend",
    alertsTitle: "Low Inventory Alerts",
  },
  agencies: {
    welcomeMessage: "Here's the health of your client retainers today.",
    stat1Title: "Retainer Revenue", stat1Icon: DollarSign, stat1Color: "text-emerald-600 dark:text-emerald-400", stat1Bg: "bg-emerald-50 dark:bg-emerald-500/20",
    stat2Title: "Active Projects", stat2Icon: FileText, stat2Color: "text-blue-600 dark:text-blue-400", stat2Bg: "bg-blue-50 dark:bg-blue-500/20",
    stat3Title: "Average Client LTV", stat3Icon: TrendingUp, stat3Color: "text-cyan-600 dark:text-cyan-400", stat3Bg: "bg-cyan-50 dark:bg-cyan-500/20",
    stat4Title: "Pending Proposals", stat4Icon: Clock, stat4Color: "text-amber-600 dark:text-amber-400", stat4Bg: "bg-amber-50 dark:bg-amber-500/20",
    chartTitle: "Retainer Value Overview", chartSubtitle: "Monthly client retainer contract volume",
    alertsTitle: "Pending Proposals",
  },
  social_media: {
    welcomeMessage: "Here's the performance of your social accounts today.",
    stat1Title: "Campaign Revenue", stat1Icon: DollarSign, stat1Color: "text-emerald-600 dark:text-emerald-400", stat1Bg: "bg-emerald-50 dark:bg-emerald-500/20",
    stat2Title: "Active Accounts", stat2Icon: Users, stat2Color: "text-blue-600 dark:text-blue-400", stat2Bg: "bg-blue-50 dark:bg-blue-500/20",
    stat3Title: "Avg. Engagement Rate", stat3Icon: TrendingUp, stat3Color: "text-cyan-600 dark:text-cyan-400", stat3Bg: "bg-cyan-50 dark:bg-cyan-500/20",
    stat4Title: "Pending Deliverables", stat4Icon: Clock, stat4Color: "text-amber-600 dark:text-amber-400", stat4Bg: "bg-amber-50 dark:bg-amber-500/20",
    chartTitle: "Campaign Revenue Overview", chartSubtitle: "Monthly campaign billing trend",
    alertsTitle: "Pending Deliverables",
  },
  startups: {
    welcomeMessage: "Here's your funding runway overview today.",
    stat1Title: "Total Funding Secured", stat1Icon: DollarSign, stat1Color: "text-emerald-600 dark:text-emerald-400", stat1Bg: "bg-emerald-50 dark:bg-emerald-500/20",
    stat2Title: "Active Pilot Customers", stat2Icon: Users, stat2Color: "text-blue-600 dark:text-blue-400", stat2Bg: "bg-blue-50 dark:bg-blue-500/20",
    stat3Title: "Monthly Burn Rate", stat3Icon: Flame, stat3Color: "text-cyan-600 dark:text-cyan-400", stat3Bg: "bg-cyan-50 dark:bg-cyan-500/20",
    stat4Title: "Runway Warning Days", stat4Icon: AlertTriangle, stat4Color: "text-rose-600 dark:text-rose-400", stat4Bg: "bg-rose-50 dark:bg-rose-500/20",
    chartTitle: "Funding & Cash Run", chartSubtitle: "Secured cash index",
    alertsTitle: "Runway Warning Items",
  },
  marketplaces: {
    welcomeMessage: "Here's your shop transaction log today.",
    stat1Title: "Gross Merchandise Value", stat1Icon: DollarSign, stat1Color: "text-emerald-600 dark:text-emerald-400", stat1Bg: "bg-emerald-50 dark:bg-emerald-500/20",
    stat2Title: "Completed Orders", stat2Icon: ShoppingBag, stat2Color: "text-blue-600 dark:text-blue-400", stat2Bg: "bg-blue-50 dark:bg-blue-500/20",
    stat3Title: "Average Order Value", stat3Icon: TrendingUp, stat3Color: "text-cyan-600 dark:text-cyan-400", stat3Bg: "bg-cyan-50 dark:bg-cyan-500/20",
    stat4Title: "Out-of-Stock SKUs", stat4Icon: AlertTriangle, stat4Color: "text-rose-600 dark:text-rose-400", stat4Bg: "bg-rose-50 dark:bg-rose-500/20",
    chartTitle: "GMV Performance", chartSubtitle: "Gross transaction volume logs",
    alertsTitle: "Out-of-Stock SKUs",
  },
  other: {
    welcomeMessage: "Here's a snapshot of your business activity today.",
    stat1Title: "Total Revenue", stat1Icon: DollarSign, stat1Color: "text-emerald-600 dark:text-emerald-400", stat1Bg: "bg-emerald-50 dark:bg-emerald-500/20",
    stat2Title: "Active Customers", stat2Icon: Users, stat2Color: "text-blue-600 dark:text-blue-400", stat2Bg: "bg-blue-50 dark:bg-blue-500/20",
    stat3Title: "Average Project Value", stat3Icon: TrendingUp, stat3Color: "text-cyan-600 dark:text-cyan-400", stat3Bg: "bg-cyan-50 dark:bg-cyan-500/20",
    stat4Title: "Team Size", stat4Icon: Users, stat4Color: "text-amber-600 dark:text-amber-400", stat4Bg: "bg-amber-50 dark:bg-amber-500/20",
    chartTitle: "Revenue Overview", chartSubtitle: "Monthly revenue trend",
    alertsTitle: "Action Items",
  },
};

// ─── Niche Resolver ──────────────────────────────────────────────────────────

function resolveNiche(businessType: string | null, niche: string | null): keyof typeof NICHE_TEMPLATES {
  const bt = businessType ? businessType.toLowerCase().trim() : "";
  const n = niche ? niche.toLowerCase().trim() : "";

  if (bt === "saas") return "saas";
  if (bt === "agencies" || bt === "agency") return "agencies";
  if (bt === "social_media") return "social_media";
  if (bt === "startups" || bt === "startup") return "startups";
  if (bt === "marketplaces" || bt === "marketplace" || bt === "ecommerce" || bt === "e-commerce") return "marketplaces";

  // Fallback to niche string matching
  if (n.includes("agency") || n.includes("agencies") || n.includes("consulting")) return "agencies";
  if (n.includes("social_media") || n.includes("social media")) return "social_media";
  if (n.includes("ecommerce") || n.includes("shop") || n.includes("marketplace") || n.includes("store")) return "marketplaces";
  if (n.includes("startup") || n.includes("funding") || n.includes("runway")) return "startups";
  if (n.includes("saas") || n.includes("subscription")) return "saas";

  return "other";
}

// ─── Empty State Component ───────────────────────────────────────────────────

function EmptyActivityState() {
  return (
    <Card className="flex flex-col items-center justify-center py-16 px-8 text-center border-dashed">
      <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center mb-5">
        <InboxIcon className="w-7 h-7 text-purple-500 dark:text-purple-400" />
      </div>
      <p className="text-base font-bold text-slate-900 dark:text-white mb-1">No recent activity logged yet</p>
      <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
        Activity from customers, payments, and events will appear here once your workspace starts receiving data.
      </p>
    </Card>
  );
}

// ─── Dashboard Page ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, workspace, loading } = useUser()
  const [modalOpen, setModalOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  // Live database states
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customers, setCustomers] = React.useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscriptions, setSubscriptions] = React.useState<any[]>([])

  // Search and Pagination states
  const [custSearch, setCustSearch] = React.useState("")
  const [subSearch, setSubSearch] = React.useState("")
  const [custPage, setCustPage] = React.useState(1)
  const [subPage, setSubPage] = React.useState(1)



  // Action dropdown states
  const [activeCustMenuId, setActiveCustMenuId] = React.useState<string | number | null>(null)
  const [activeSubMenuId, setActiveSubMenuId] = React.useState<string | number | null>(null)

  // Preview Modal state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProfile, setSelectedProfile] = React.useState<any | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (workspace && workspace.settings && workspace.settings.welcome_seen !== true) {
      setModalOpen(true)
    } else {
      setModalOpen(false)
    }
  }, [workspace])

  // Fetch live workspace details
  React.useEffect(() => {
    if (workspace) {
      Promise.all([
        fetch('/api/v1/customers').then(res => res.json()),
        fetch('/api/v1/subscriptions').then(res => res.json())
      ]).then(([custJson, subJson]) => {
        if (custJson.success) setCustomers(custJson.data || [])
        if (subJson.success) setSubscriptions(subJson.data || [])
      }).catch(err => {
        console.error('[DASHBOARD FETCH ERROR]', err)
      })
    }
  }, [workspace])

  // Click outside to close menus — uses data-attributes instead of refs
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('[data-menu-cust]')) {
        setActiveCustMenuId(null)
      }
      if (!target.closest('[data-menu-sub]')) {
        setActiveSubMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Client-side filtering
  const filteredCustomers = React.useMemo(() => {
    return customers.filter(c => 
      c.name?.toLowerCase().includes(custSearch.toLowerCase()) || 
      c.email?.toLowerCase().includes(custSearch.toLowerCase()) || 
      c.plan?.toLowerCase().includes(custSearch.toLowerCase()) ||
      c.status?.toLowerCase().includes(custSearch.toLowerCase())
    )
  }, [customers, custSearch])

  const filteredSubscriptions = React.useMemo(() => {
    return subscriptions.filter(s => {
      const name = s.customer?.name || s.name || ""
      const email = s.customer?.email || ""
      const plan = s.plan || ""
      const status = s.status || ""
      return (
        name.toLowerCase().includes(subSearch.toLowerCase()) ||
        email.toLowerCase().includes(subSearch.toLowerCase()) ||
        plan.toLowerCase().includes(subSearch.toLowerCase()) ||
        status.toLowerCase().includes(subSearch.toLowerCase())
      )
    })
  }, [subscriptions, subSearch])

  // Pagination bounds
  const totalCustPages = Math.ceil(filteredCustomers.length / 10) || 1
  const totalSubPages = Math.ceil(filteredSubscriptions.length / 10) || 1

  const displayCustomers = React.useMemo(() => {
    const start = (custPage - 1) * 10
    return filteredCustomers.slice(start, start + 10)
  }, [filteredCustomers, custPage])

  const displaySubscriptions = React.useMemo(() => {
    const start = (subPage - 1) * 10
    return filteredSubscriptions.slice(start, start + 10)
  }, [filteredSubscriptions, subPage])



  // Helper: format spent cents to standard revenue display
  const formatSpent = (cents: number | string) => {
    const val = Number(cents)
    if (isNaN(val)) return "$0.00"
    return `$${(val / 100).toFixed(2)}`
  }

  // Helper: formatDate helper
  const formatDate = (dateVal: string | null) => {
    if (!dateVal) return "N/A"
    return new Date(dateVal).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewDetails = (sub: any) => {
    setSelectedProfile({
      id: sub.id,
      name: sub.customer?.name || sub.name || "N/A",
      email: sub.customer?.email || "N/A",
      status: sub.status || "Active",
      plan: sub.plan || "N/A",
      spent: sub.price, 
      createdAt: sub.createdAt || sub.lastPaymentAt,
      avatarUrl: sub.customer?.avatarUrl || sub.avatar || ""
    })
  }

  // ── Loading / skeleton ──
  if (loading || !mounted) {
    return (
      <DashboardLayout>
        <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-200 dark:bg-white/5 rounded-lg" />
            <div className="h-4 w-96 bg-slate-100 dark:bg-white/5 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="dashboard-card h-32 bg-white dark:bg-[#0D0518]/25 border border-slate-100 dark:border-white/5 rounded-2xl flex flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-slate-200 dark:bg-white/5 rounded-full" />
                    <div className="h-6 w-16 bg-slate-100 dark:bg-white/5 rounded-full" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/5" />
                </div>
                <div className="h-3 w-32 bg-slate-100 dark:bg-white/5 rounded-full" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="dashboard-card lg:col-span-2 h-[480px] bg-white dark:bg-[#0D0518]/25 border border-slate-100 dark:border-white/5 rounded-2xl p-6" />
            <div className="dashboard-card h-[480px] bg-white dark:bg-[#0D0518]/25 border border-slate-100 dark:border-white/5 rounded-2xl p-6" />
          </div>

          <div className="dashboard-card h-64 bg-white dark:bg-[#0D0518]/25 border border-slate-100 dark:border-white/5 rounded-2xl p-6" />
        </div>
      </DashboardLayout>
    )
  }

  // ── Resolve niche and template ──
  const nicheKey = resolveNiche(workspace?.businessType ?? null, workspace?.niche ?? null);
  const tmpl = NICHE_TEMPLATES[nicheKey] ?? NICHE_TEMPLATES.other;
  const meta = workspace?.metadata ?? {};

  // ── Derive metric values from metadata (supporting all niches) ──
  const monthlyRevenue   = metaNum(meta, "monthlyRevenue", "monthly_revenue");
  const activeCustomers  = metaNum(meta, "activeClients", "activeCustomers", "catalogSize", "payingCustomers", "monthlyOrders", "active_customers_count", "active_customers");
  const avgProjectValue  = metaNum(meta, "avgRetainerValue", "avgPricePerCustomer", "avgFeePerClient", "avgProjectValue", "avg_project_value", "amountRaised");
  const teamSize         = metaNum(meta, "teamSize", "team_size", "newClientInquiries", "monthlyInquiries", "monthlySignups", "investorCount");

  // Niche-specific metric derivations
  const stat1Value = monthlyRevenue > 0 ? formatCurrency(monthlyRevenue) : "$0";
  const stat2Value = activeCustomers > 0 ? activeCustomers.toLocaleString() : "0";
  const stat3Value = avgProjectValue > 0 ? formatCurrency(avgProjectValue) : "$0";
  const stat4Value = teamSize > 0 ? teamSize.toLocaleString() : "0";

  const isNewAccount = monthlyRevenue === 0 && activeCustomers === 0 && avgProjectValue === 0;

  // ── Chart data ──
  const revenueScale = monthlyRevenue > 0
    ? Math.min(100, Math.round((monthlyRevenue / 50_000) * 100))
    : 0;
  const chartYearData = isNewAccount
    ? { [`${new Date().getFullYear()}`]: Array(12).fill(0) }
    : buildChartFromValue(revenueScale);

  // ── Stats cards ──
  const stats = [
    {
      title: tmpl.stat1Title,
      value: stat1Value,
      trend: isNewAccount ? "No data yet" : "+0.0%",
      trendType: "up" as const,
      icon: tmpl.stat1Icon,
      iconColor: tmpl.stat1Color,
      iconBg: tmpl.stat1Bg,
    },
    {
      title: tmpl.stat2Title,
      value: stat2Value,
      trend: isNewAccount ? "No data yet" : "0 this month",
      trendType: "up" as const,
      icon: tmpl.stat2Icon,
      iconColor: tmpl.stat2Color,
      iconBg: tmpl.stat2Bg,
    },
    {
      title: tmpl.stat3Title,
      value: stat3Value,
      trend: isNewAccount ? "No data yet" : "+0.0%",
      trendType: "up" as const,
      icon: tmpl.stat3Icon,
      iconColor: tmpl.stat3Color,
      iconBg: tmpl.stat3Bg,
    },
    {
      title: tmpl.stat4Title,
      value: stat4Value,
      trend: isNewAccount ? "No data yet" : "0 change",
      trendType: "up" as const,
      icon: tmpl.stat4Icon,
      iconColor: tmpl.stat4Color,
      iconBg: tmpl.stat4Bg,
    },
  ];

  // Dynamic titles and labels for the summary tables
  let leftTableTitle = "Customer Profiles"
  let leftCol4Header = "Total Spent"

  let rightTableTitle = "Active Contracts"
  const rightCol4Header = "Retainer Rate"

  const totalSpentVal = formatSpent(customers.reduce((acc, c) => acc + (Number(c.spent) || 0), 0))
  const totalRetainerVal = formatSpent(subscriptions.reduce((acc, s) => acc + (Number(s.price) || 0), 0))

  let leftTableDesc = `Summary of active client CRM profiles • Total Revenue: ${totalSpentVal} across ${customers.length} records`
  let rightTableDesc = `Summary of active retainer agreements • Total Retainer: ${totalRetainerVal} across ${subscriptions.length} contracts`

  if (nicheKey === "saas") {
    leftTableTitle = "Subscriber Profiles"
    leftCol4Header = "MRR Contribution"
    leftTableDesc = `Active platform subscribers • Total MRR: ${totalSpentVal} across ${customers.length} subscribers`

    rightTableTitle = "Subscription Tiers"
    rightTableDesc = `Core subscription billing structures • Total Value: ${totalRetainerVal} across ${subscriptions.length} tiers`
  } else if (nicheKey === "agencies") {
    leftTableTitle = "CRM & Brand Accounts"
    leftCol4Header = "Total Revenue"
    leftTableDesc = `Quick overview of client accounts • Total Revenue: ${totalSpentVal} across ${customers.length} accounts`

    rightTableTitle = "Retainer Agreements"
    rightTableDesc = `Agency deliverables contracts log • Total Retainers: ${totalRetainerVal} across ${subscriptions.length} contracts`
  } else if (nicheKey === "social_media") {
    leftTableTitle = "CRM & Brand Accounts"
    leftCol4Header = "Campaign Revenue"
    leftTableDesc = `Summary of campaigns CRM records • Total Campaign Revenue: ${totalSpentVal} across ${customers.length} campaigns`

    rightTableTitle = "Campaign Packages"
    rightTableDesc = `Social media deliverables retainers • Total Retainers: ${totalRetainerVal} across ${subscriptions.length} packages`
  } else if (nicheKey === "marketplaces") {
    leftTableTitle = "Store Customers"
    leftCol4Header = "Total Value"
    leftTableDesc = `Buyers and store customers profiles • Total Value: ${totalSpentVal} across ${customers.length} customers`

    rightTableTitle = "Product Listings"
    rightTableDesc = `Store listings catalog summaries • Total Catalog Value: ${totalRetainerVal} across ${subscriptions.length} listings`
  }

  return (
    <DashboardLayout>
      <WelcomeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="max-w-[1400px] mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            Welcome back, {user ? user.fullName : "Business Owner"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">
            {tmpl.welcomeMessage}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatsCard
              key={i}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              trendType={stat.trendType}
              icon={stat.icon}
              iconColor={stat.iconColor}
              iconBg={stat.iconBg}
            />
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RevenueChart
            title={tmpl.chartTitle}
            subtitle={tmpl.chartSubtitle}
            yearData={chartYearData}
          />
          {isNewAccount ? (
            <div className="dashboard-card flex flex-col justify-center">
              <EmptyActivityState />
            </div>
          ) : (
            <RecentActivity
              title="Recent Activity"
              activities={[]}
            />
          )}
        </div>

        {/* Bottom Section — Split Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* LEFT TABLE: CRM & Brand Accounts */}
          <Card className="dashboard-card overflow-hidden !p-0">
            <CardHeader className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex flex-row items-center justify-between gap-4">
              <div className="space-y-0.5">
                <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">{leftTableTitle}</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">{leftTableDesc}</CardDescription>
              </div>
              <div className="relative w-44 flex-shrink-0">
                <input 
                  type="text"
                  placeholder="Search CRM..."
                  value={custSearch}
                  onChange={(e) => {
                    setCustSearch(e.target.value)
                    setCustPage(1)
                  }}
                  className="w-full px-2.5 py-1 text-xs border border-slate-200 dark:border-white/10 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="text-[11px]">
                <TableHeader>
                  <TableRow className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                    <TableHead className="w-8 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-2 py-2">#</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-3 py-2">Customer</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-3 py-2 hidden sm:table-cell">Email</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-3 py-2">Status</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-3 py-2 text-left">{leftCol4Header}</TableHead>
                    <TableHead className="w-10 px-2 py-2"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-slate-400 font-bold text-[11px]">No CRM profiles found.</TableCell>
                    </TableRow>
                  ) : displayCustomers.map((c, idx) => (
                    <TableRow key={c.id} className={cn(
                      "transition-colors hover:bg-slate-50/30 dark:hover:bg-white/[0.01]",
                      idx % 2 === 1 ? "bg-slate-50/50 dark:bg-white/[0.02]" : "bg-white dark:bg-[#150a2e]/30"
                    )}>
                      <TableCell className="w-8 font-semibold text-slate-400 dark:text-slate-500 px-2 py-2">{(custPage - 1) * 10 + idx + 1}</TableCell>
                      <TableCell className="font-semibold text-slate-900 dark:text-white px-3 py-2">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-100 dark:bg-white/5 flex-shrink-0">
                            <Image 
                              src={c.avatarUrl || c.avatar || "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png"} 
                              alt={c.name} 
                              fill 
                              className="object-cover"
                            />
                          </div>
                          <span className="whitespace-normal break-words leading-tight">{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400 px-3 py-2 hidden sm:table-cell whitespace-nowrap">{c.email}</TableCell>
                      <TableCell className="px-3 py-2">
                        <span className={cn(
                          "status-badge text-[9px] py-0.5 px-1.5",
                          c.status === "Active" ? "status-badge-active" : "status-badge-canceled"
                        )}>
                          {c.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-950 dark:text-white font-bold px-3 py-2 text-left">{formatSpent(c.spent)}</TableCell>
                      <TableCell className="relative w-10 px-2 py-2" data-menu-cust>
                        <button 
                          onClick={() => setActiveCustMenuId(activeCustMenuId === c.id ? null : c.id)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-md text-slate-400 cursor-pointer transition-colors"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                        {activeCustMenuId === c.id && (
                          <div data-menu-cust className="absolute right-2 top-8 w-28 bg-white dark:bg-[#1e103c] border border-slate-100 dark:border-white/10 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                            <button 
                              onClick={() => {
                                setActiveCustMenuId(null);
                                setSelectedProfile({
                                  id: c.id,
                                  name: c.name,
                                  email: c.email,
                                  status: c.status,
                                  plan: c.plan,
                                  spent: c.spent,
                                  createdAt: c.createdAt || c.lastActivity,
                                  avatarUrl: c.avatarUrl || c.avatar
                                });
                              }}
                              className="w-full px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white flex items-center gap-1.5 text-left cursor-pointer"
                            >
                              <Eye className="w-3 h-3 text-slate-400" />
                              View Profile
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Pagination Footer */}
              <div className="border-t border-slate-100 dark:border-white/5 px-4 py-3 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01]">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  Showing {filteredCustomers.length > 0 ? (custPage - 1) * 10 + 1 : 0} to {Math.min(custPage * 10, filteredCustomers.length)} of {filteredCustomers.length} records
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCustPage(p => Math.max(1, p - 1))}
                    disabled={custPage === 1}
                    className="px-2 py-1 border border-slate-200 dark:border-white/10 rounded-md bg-white dark:bg-slate-900 text-[10px] font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCustPage(p => Math.min(totalCustPages, p + 1))}
                    disabled={custPage === totalCustPages}
                    className="px-2 py-1 border border-slate-200 dark:border-white/10 rounded-md bg-white dark:bg-slate-900 text-[10px] font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RIGHT TABLE: Active Contracts */}
          <Card className="dashboard-card overflow-hidden !p-0">
            <CardHeader className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex flex-row items-center justify-between gap-4">
              <div className="space-y-0.5">
                <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">{rightTableTitle}</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">{rightTableDesc}</CardDescription>
              </div>
              <div className="relative w-44 flex-shrink-0">
                <input 
                  type="text"
                  placeholder="Search Packages..."
                  value={subSearch}
                  onChange={(e) => {
                    setSubSearch(e.target.value)
                    setSubPage(1)
                  }}
                  className="w-full px-2.5 py-1 text-xs border border-slate-200 dark:border-white/10 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="text-[11px]">
                <TableHeader>
                  <TableRow className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                    <TableHead className="w-8 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-2 py-2">#</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-3 py-2">Customer</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-3 py-2 hidden sm:table-cell">Package Type</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-3 py-2">Status</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-3 py-2 text-left">{rightCol4Header}</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-3 py-2 hidden md:table-cell">Billing</TableHead>
                    <TableHead className="w-10 px-2 py-2"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displaySubscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-slate-400 font-bold text-[11px]">No active packages found.</TableCell>
                    </TableRow>
                  ) : displaySubscriptions.map((s, idx) => (
                    <TableRow key={s.id} className={cn(
                      "transition-colors hover:bg-slate-50/30 dark:hover:bg-white/[0.01]",
                      idx % 2 === 1 ? "bg-slate-50/50 dark:bg-white/[0.02]" : "bg-white dark:bg-[#150a2e]/30"
                    )}>
                      <TableCell className="w-8 font-semibold text-slate-400 dark:text-slate-500 px-2 py-2">{(subPage - 1) * 10 + idx + 1}</TableCell>
                      <TableCell className="font-semibold text-slate-900 dark:text-white px-3 py-2">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-100 dark:bg-white/5 flex-shrink-0">
                            <Image 
                              src={s.customer?.avatarUrl || s.avatar || "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png"} 
                              alt={s.customer?.name || s.name} 
                              fill 
                              className="object-cover"
                            />
                          </div>
                          <span className="whitespace-normal break-words leading-tight">{s.customer?.name || s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400 px-3 py-2 hidden sm:table-cell">
                        <span className="whitespace-normal break-words leading-tight">{s.plan || "N/A"}</span>
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <span className={cn(
                          "status-badge text-[9px] py-0.5 px-1.5",
                          s.status === "Active" ? "status-badge-active" : s.status === "Paused" ? "status-badge-paused" : "status-badge-canceled"
                        )}>
                          {s.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-950 dark:text-white font-bold px-3 py-2 text-left">{formatSpent(s.price)}</TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400 whitespace-nowrap px-3 py-2 hidden md:table-cell">{formatDate(s.nextBillingAt)}</TableCell>
                      <TableCell className="relative w-10 px-2 py-2" data-menu-sub>
                        <button 
                          onClick={() => setActiveSubMenuId(activeSubMenuId === s.id ? null : s.id)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-md text-slate-400 cursor-pointer transition-colors"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                        {activeSubMenuId === s.id && (
                          <div data-menu-sub className="absolute right-2 top-8 w-28 bg-white dark:bg-[#1e103c] border border-slate-100 dark:border-white/10 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                            <button 
                              onClick={() => {
                                setActiveSubMenuId(null);
                                handleViewDetails(s);
                              }}
                              className="w-full px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white flex items-center gap-1.5 text-left cursor-pointer"
                            >
                              <Eye className="w-3 h-3 text-slate-400" />
                              View Details
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Pagination Footer */}
              <div className="border-t border-slate-100 dark:border-white/5 px-4 py-3 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01]">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  Showing {filteredSubscriptions.length > 0 ? (subPage - 1) * 10 + 1 : 0} to {Math.min(subPage * 10, filteredSubscriptions.length)} of {filteredSubscriptions.length} records
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSubPage(p => Math.max(1, p - 1))}
                    disabled={subPage === 1}
                    className="px-2 py-1 border border-slate-200 dark:border-white/10 rounded-md bg-white dark:bg-slate-900 text-[10px] font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setSubPage(p => Math.min(totalSubPages, p + 1))}
                    disabled={subPage === totalSubPages}
                    className="px-2 py-1 border border-slate-200 dark:border-white/10 rounded-md bg-white dark:bg-slate-900 text-[10px] font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <ViewProfileModal
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        customer={selectedProfile}
      />
    </DashboardLayout>
  )
}
