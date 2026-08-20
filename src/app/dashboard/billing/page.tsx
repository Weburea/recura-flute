"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { BillingTable } from "@/components/dashboard/billing/billing-table"
import { TemplateSelector } from "@/components/dashboard/billing/template-selector"
import { CreateInvoiceModal } from "@/components/dashboard/shared/modals/create-invoice-modal"
import { StatusModal } from "@/components/dashboard/shared/modals/status-modal"
import { InvoiceModal } from "@/components/dashboard/shared/modals/invoice-modal"
import { useUser } from "@/context/user-context"
import {
  DollarSign,
  Users,
  RefreshCcw,
  TrendingUp,
  ShoppingBag,
  FileText,
  Plus
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// ─── Niche Configuration ──────────────────────────────────────────────────────

interface BillingPageConfig {
  pageTitle: string
  pageSubtitle: string
  stat1Title: string
  stat1Icon: LucideIcon
  stat2Title: string
  stat2Icon: LucideIcon
  stat3Title: string
  stat3Icon: LucideIcon
  planColHeader: string
  entityLabel: string
  ctaLabel: string
}

const NICHE_CONFIG: Record<string, BillingPageConfig> = {
  saas: {
    pageTitle: "Subscription Payments",
    pageSubtitle: "Manage invoices and track subscription payments",
    stat1Title: "Total Revenue",
    stat1Icon: DollarSign,
    stat2Title: "Pending Payments",
    stat2Icon: Users,
    stat3Title: "Total Invoices",
    stat3Icon: RefreshCcw,
    planColHeader: "Plan",
    entityLabel: "invoices",
    ctaLabel: "Create Invoice",
  },
  agencies: {
    pageTitle: "Client Invoices",
    pageSubtitle: "Track retainer invoices and client payment history",
    stat1Title: "Total Billed",
    stat1Icon: DollarSign,
    stat2Title: "Outstanding",
    stat2Icon: FileText,
    stat3Title: "Invoices Issued",
    stat3Icon: TrendingUp,
    planColHeader: "Retainer",
    entityLabel: "invoices",
    ctaLabel: "Create Invoice",
  },
  social_media: {
    pageTitle: "Campaign & Ad Billing",
    pageSubtitle: "Track ad spend, campaign invoices, and client billing",
    stat1Title: "Total Ad Spend",
    stat1Icon: DollarSign,
    stat2Title: "Outstanding",
    stat2Icon: FileText,
    stat3Title: "Invoices Issued",
    stat3Icon: TrendingUp,
    planColHeader: "Campaign",
    entityLabel: "invoices",
    ctaLabel: "Create Invoice",
  },
  startups: {
    pageTitle: "Billing & Invoices",
    pageSubtitle: "Monitor cash flow and pilot billing records",
    stat1Title: "Total Billed",
    stat1Icon: DollarSign,
    stat2Title: "Pending",
    stat2Icon: Users,
    stat3Title: "Invoices Issued",
    stat3Icon: RefreshCcw,
    planColHeader: "Tier",
    entityLabel: "invoices",
    ctaLabel: "Create Invoice",
  },
  marketplaces: {
    pageTitle: "Store Orders & Payouts",
    pageSubtitle: "Manage marketplace orders, transactions, and settlement invoices",
    stat1Title: "Gross Revenue",
    stat1Icon: DollarSign,
    stat2Title: "Pending Orders",
    stat2Icon: ShoppingBag,
    stat3Title: "Orders Processed",
    stat3Icon: TrendingUp,
    planColHeader: "Product",
    entityLabel: "orders",
    ctaLabel: "Process Order",
  },
  other: {
    pageTitle: "Billing & Invoices",
    pageSubtitle: "Manage invoices and track payments",
    stat1Title: "Total Revenue",
    stat1Icon: DollarSign,
    stat2Title: "Pending Payments",
    stat2Icon: Users,
    stat3Title: "Total Invoices",
    stat3Icon: RefreshCcw,
    planColHeader: "Plan",
    entityLabel: "invoices",
    ctaLabel: "Create Invoice",
  },
}

function resolveNiche(businessType: string | null): keyof typeof NICHE_CONFIG {
  const bt = businessType ? businessType.toLowerCase().trim() : ""
  if (bt === "saas") return "saas"
  if (bt === "agencies" || bt === "agency") return "agencies"
  if (bt === "social_media") return "social_media"
  if (bt === "startups" || bt === "startup") return "startups"
  if (bt === "marketplaces" || bt === "marketplace" || bt === "ecommerce" || bt === "e-commerce") return "marketplaces"
  return "other"
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const { workspace, loading } = useUser()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [invoices, setInvoices] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedInvoice, setSelectedInvoice] = React.useState<any>(null)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingInvoice, setEditingInvoice] = React.useState<any | null>(null)
  const [viewModeReadOnly, setViewModeReadOnly] = React.useState(false)

  const [statusModal, setStatusModal] = React.useState<{
    isOpen: boolean
    type: "success" | "error"
    title: string
    message: string
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: ""
  })

  const fetchInvoices = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/v1/billing")
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          setInvoices(json.data)
        }
      }
    } catch (err) {
      console.error("[FETCH INVOICES ERROR]", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (!loading && workspace) {
      fetchInvoices()
    }
  }, [loading, workspace, fetchInvoices])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-[1400px] mx-auto space-y-8 pb-10 animate-pulse">
          <div className="space-y-2">
            <div className="h-10 w-72 bg-slate-200 dark:bg-white/5 rounded-lg" />
            <div className="h-5 w-80 bg-slate-100 dark:bg-white/5 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white dark:bg-[#0D0518]/25 border border-slate-100 dark:border-white/5 rounded-2xl" />
            ))}
          </div>
          <div className="h-[500px] bg-white dark:bg-[#0D0518]/25 border border-slate-100 dark:border-white/5 rounded-3xl" />
        </div>
      </DashboardLayout>
    )
  }

  const nicheKey = resolveNiche(workspace?.businessType ?? null)
  const config = NICHE_CONFIG[nicheKey] ?? NICHE_CONFIG.other

  // calculate dynamic stats values
  const totalBilled = invoices.reduce((acc, i) => acc + (Number(i.amount) || 0), 0)
  const totalBilledStr = `$${(totalBilled / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const outstanding = invoices
    .filter(i => i.status === "Unpaid" || i.status === "Canceled")
    .reduce((acc, i) => acc + (Number(i.amount) || 0), 0)
  const outstandingStr = `$${(outstanding / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const invoicesCount = invoices.length.toString()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateSuccess = (newInvoice: any) => {
    setStatusModal({
      isOpen: true,
      type: "success",
      title: editingInvoice ? "Invoice Updated" : "Invoice Created",
      message: editingInvoice 
        ? "The billing invoice transaction record was updated successfully." 
        : "The billing invoice transaction record was created successfully."
    })
    fetchInvoices()
    setEditingInvoice(null)
 
    setTimeout(() => {
      setStatusModal(prev => ({ ...prev, isOpen: false }))
      setSelectedInvoice(newInvoice)
      setViewModeReadOnly(false)
      setIsInvoiceModalOpen(true)
    }, 1500)
  }

  const handlePreviewTemplate = (templateId: string) => {
    const starterInvoice = {
      id: "INV-PREVIEW",
      customer: "BRIX Agency Client",
      email: "client@brixagency.com",
      amount: 35000,
      dueDate: new Date(Date.now() + 14*24*60*60*1000).toISOString(),
      createdAt: new Date().toISOString(),
      status: "Unpaid",
      metadata: {
        customerName: "BRIX Agency Client",
        customerEmail: "client@brixagency.com",
        customerAddress: "123 Business Street, San Francisco, CA 94107",
        invoiceNumber: "INV-GEN-9901",
        items: [
          { id: 1, description: "Product Subscription - Ad Management", qty: 1, price: 350, total: 350 }
        ]
      }
    }
    
    const baseInvoice = invoices[0] || starterInvoice
    const previewInv = {
      ...baseInvoice,
      metadata: {
        ...(baseInvoice.metadata || {}),
        template: templateId
      }
    }
    setSelectedInvoice(previewInv)
    setViewModeReadOnly(false)
    setIsInvoiceModalOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              {config.pageTitle}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight text-lg">
              {config.pageSubtitle}
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm tracking-wide transition-colors shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            {config.ctaLabel}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title={config.stat1Title}
            value={totalBilledStr}
            trend="+12.5%"
            trendType="up"
            icon={config.stat1Icon}
            iconColor="text-emerald-600 dark:text-emerald-400"
            iconBg="bg-emerald-50 dark:bg-emerald-500/20"
          />
          <StatsCard
            title={config.stat2Title}
            value={outstandingStr}
            trend="+8.5%"
            trendType="up"
            icon={config.stat2Icon}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBg="bg-blue-50 dark:bg-blue-500/20"
          />
          <StatsCard
            title={config.stat3Title}
            value={invoicesCount}
            trend="+2 this week"
            trendType="up"
            icon={config.stat3Icon}
            iconColor="text-cyan-600 dark:text-cyan-400"
            iconBg="bg-cyan-50 dark:bg-cyan-500/20"
          />
        </div>

        {/* Template Selector */}
        <TemplateSelector onPreviewTemplate={handlePreviewTemplate} />

        {/* Billing Table */}
        <BillingTable
          planColHeader={config.planColHeader}
          entityLabel={config.entityLabel}
          invoices={invoices}
          isLoading={isLoading}
          refreshData={fetchInvoices}
          onViewInvoice={(invoice) => {
            setSelectedInvoice(invoice)
            setViewModeReadOnly(true)
            setIsInvoiceModalOpen(true)
          }}
          onEditInvoice={(invoice) => {
            setEditingInvoice(invoice)
            setIsCreateModalOpen(true)
          }}
        />
      </div>

      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingInvoice(null)
        }}
        onSuccess={handleCreateSuccess}
        invoiceToEdit={editingInvoice}
      />
 
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoice={selectedInvoice}
        readOnly={viewModeReadOnly}
      />
 
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </DashboardLayout>
  )
}
