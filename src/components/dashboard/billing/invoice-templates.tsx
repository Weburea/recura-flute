"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Box } from "lucide-react"
import type { Invoice } from "./mock-data"

export interface DetailedInvoice extends Invoice {
  invoiceNumber?: string
  subtotal?: string | number
  tax?: string | number
  discount?: string | number
  customerLogo?: string | null
  customerAddress?: string | null
  customerPhone?: string | null
  currencySymbol?: string
  currency?: string
  senderLogo?: string | null
  senderName?: string
  senderEmail?: string
  senderAddress?: string | null
  senderPhone?: string | null
  terms?: string | null
  items?: Array<{
    id?: string | number
    description?: string
    qty?: number
    quantity?: number
    price?: string | number
    total?: string | number
  }>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeInvoiceForTemplate(invoice: any, workspaceContext?: any, userContext?: any): DetailedInvoice {
  if (!invoice) return {} as DetailedInvoice

  // Extract from raw database properties or direct props
  const rawInvoice = invoice.raw || invoice
  const metadata = rawInvoice.metadata || {}

  const customerName = metadata.customerName || (typeof rawInvoice.customer === 'object' ? rawInvoice.customer?.name : rawInvoice.customer) || "N/A"
  const customerEmail = metadata.customerEmail || (typeof rawInvoice.customer === 'object' ? rawInvoice.customer?.email : rawInvoice.email) || "N/A"
  const customerLogo = metadata.customerLogo || (typeof rawInvoice.customer === 'object' ? rawInvoice.customer?.avatarUrl : rawInvoice.avatar) || null
  const customerAddress = metadata.customerAddress || null
  const customerPhone = metadata.customerPhone || null

  // Currency resolution
  const currency = metadata.currency || rawInvoice.currency || "USD"
  const currencySymbol = metadata.currencySymbol || rawInvoice.currencySymbol || "$"

  // Dynamic Sender details white-labeled from workspace
  const senderName = metadata.senderName || workspaceContext?.name || "BRIX Agency"
  const senderEmail = metadata.senderEmail || workspaceContext?.metadata?.billingEmail || userContext?.email || "billing@brixagency.com"
  const senderAddress = metadata.senderAddress || workspaceContext?.settings?.address || workspaceContext?.metadata?.address || null
  const senderPhone = metadata.senderPhone || workspaceContext?.settings?.phone || workspaceContext?.metadata?.phone || null
  const senderLogo = metadata.senderLogo || workspaceContext?.metadata?.logo_url || workspaceContext?.metadata?.logoUrl || null

  const terms = metadata.terms || null

  let amountStr = ""
  if (typeof rawInvoice.amount === 'number') {
    amountStr = `${currencySymbol}${(rawInvoice.amount / 100).toFixed(2)}`
  } else if (typeof rawInvoice.amount === 'string') {
    const cleaned = rawInvoice.amount.replace(/[^0-9.]/g, '')
    if (!isNaN(parseFloat(cleaned))) {
      amountStr = `${currencySymbol}${parseFloat(cleaned).toFixed(2)}`
    } else {
      amountStr = rawInvoice.amount.startsWith(currencySymbol) ? rawInvoice.amount : `${currencySymbol}${rawInvoice.amount}`
    }
  } else {
    amountStr = `${currencySymbol}0.00`
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDateString = (d: any) => {
    if (!d) return ""
    const dateObj = new Date(d)
    if (isNaN(dateObj.getTime())) return String(d)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const issuedDate = metadata.issuedDate || formatDateString(rawInvoice.createdAt || rawInvoice.date)
  const dueDate = formatDateString(rawInvoice.dueDate)

  let items = metadata.items || []
  if (!items || items.length === 0) {
    if (rawInvoice.items && Array.isArray(rawInvoice.items)) {
      items = rawInvoice.items
    }
  }

  return {
    ...rawInvoice,
    invoiceNumber: metadata.invoiceNumber || rawInvoice.id,
    customer: customerName,
    email: customerEmail,
    amount: amountStr,
    date: issuedDate,
    dueDate: dueDate,
    plan: metadata.plan || rawInvoice.plan || "Service Plan",
    customerLogo,
    customerAddress,
    customerPhone,
    currency,
    currencySymbol,
    senderName,
    senderEmail,
    senderAddress,
    senderPhone,
    senderLogo,
    terms,
    items,
    subtotal: metadata.subtotal,
    tax: metadata.tax,
    discount: metadata.discount
  }
}

export interface NormalizedItem {
  id: string | number
  description: string
  qty: number
  price: string
  total: string
}

interface TemplateProps {
  invoice: DetailedInvoice
  logoUrl?: string | null
  primaryColor: string
  isDarkMode?: boolean
}

// Normalize Invoice Items safely
function useNormalizedItems(invoice: DetailedInvoice): NormalizedItem[] {
  return React.useMemo(() => {
    const symbol = invoice.currencySymbol || "$"
    if (invoice.items && Array.isArray(invoice.items) && invoice.items.length > 0) {
      return invoice.items.map((item, idx) => {
        const qty = item.qty ?? item.quantity ?? 1
        const priceVal = item.price
        
        let priceStr = String(priceVal)
        if (typeof priceVal === 'number') {
          priceStr = `${symbol}${priceVal.toFixed(2)}`
        } else if (typeof priceVal === 'string' && !priceVal.startsWith('$') && !priceVal.startsWith('₦') && !priceVal.startsWith('€') && !priceVal.startsWith('£')) {
          const num = parseFloat(priceVal.replace(/[^0-9.]/g, ''))
          priceStr = isNaN(num) ? priceVal : `${symbol}${num.toFixed(2)}`
        }
        
        const totalVal = item.total ?? (typeof priceVal === 'number' ? priceVal * qty : null)
        let totalStr = String(totalVal)
        if (typeof totalVal === 'number') {
          totalStr = `${symbol}${totalVal.toFixed(2)}`
        } else if (typeof totalVal === 'string' && !totalVal.startsWith('$') && !totalVal.startsWith('₦') && !totalVal.startsWith('€') && !totalVal.startsWith('£')) {
          const num = parseFloat(totalVal.replace(/[^0-9.]/g, ''))
          totalStr = isNaN(num) ? totalVal : `${symbol}${num.toFixed(2)}`
        } else if (totalVal === null) {
          totalStr = priceStr
        }
        
        return {
          id: item.id || idx,
          description: item.description || "Service Item",
          qty,
          price: priceStr,
          total: totalStr
        }
      })
    }
    return [
      { id: 1, description: `Product Subscription - ${invoice.plan || "Base Plan"}`, qty: 1, price: invoice.amount, total: invoice.amount },
      { id: 2, description: "Platform Fee", qty: 1, price: `${symbol}0.00`, total: `${symbol}0.00` },
      { id: 3, description: "Additional Support", qty: 1, price: `${symbol}0.00`, total: `${symbol}0.00` }
    ]
  }, [invoice])
}

// Helper to resolve accent colors cleanly
function getAccentStyles(primaryColor: string) {
  return {
    "--primary-accent": primaryColor,
    "--primary-accent-10": `${primaryColor}1a`,
    "--primary-accent-20": `${primaryColor}33`,
    "--primary-accent-50": `${primaryColor}80`
  } as React.CSSProperties
}

// Premium Siri-like dots vector decoration
function DotsPattern() {
  return (
    <div className="flex gap-1 items-center opacity-30 shrink-0">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      ))}
    </div>
  )
}

// Premium white-label footer badge component
function RecuraBadge({ isDarkMode }: { isDarkMode?: boolean }) {
  const logoSrc = isDarkMode 
    ? "https://res.cloudinary.com/weburea/image/upload/v1783571835/logo.svg" 
    : "https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg";

  return (
    <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end no-print">
      <div className="flex items-center gap-1.5 opacity-40 hover:opacity-85 transition-opacity duration-300">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Powered by</span>
        <div className="relative w-16 h-4 select-none">
          <Image 
            src={logoSrc} 
            alt="Recura" 
            fill 
            className="object-contain" 
          />
        </div>
      </div>
    </div>
  )
}

// ─── Template 1: Classic ──────────────────────────────────────────────────────

function ClassicTemplate({ invoice, logoUrl, primaryColor, isDarkMode }: TemplateProps) {
  const accentStyles = getAccentStyles(primaryColor)
  const items = useNormalizedItems(invoice)

  const symbol = invoice.currencySymbol || "$"

  const formattedSubtotal = invoice.subtotal !== undefined
    ? (typeof invoice.subtotal === 'number' ? `${symbol}${invoice.subtotal.toFixed(2)}` : String(invoice.subtotal))
    : invoice.amount

  return (
    <div 
      style={accentStyles}
      className={cn(
        "p-6 sm:p-10 w-full mx-auto font-sans transition-colors duration-300 relative",
        isDarkMode ? "bg-[#0b051a] text-white" : "bg-white text-slate-800"
      )}
    >
      {/* Top Header Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6">
        {/* Left Brand Card */}
        <div 
          style={{ 
            backgroundImage: "url('/images/dumb_images/invoices dumb/Background Gradient.svg')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
          className={cn(
            "md:col-span-7 rounded-3xl p-6 relative overflow-hidden border min-h-[140px] flex flex-col justify-start gap-4",
            isDarkMode ? "border-white/10" : "border-slate-100"
          )}
        >
          {/* Accent decoration overlay */}
          <div className="absolute inset-0 bg-white/40 dark:bg-black/60 -z-10" />
          
          <div className="flex items-center gap-3.5 relative z-10">
            {invoice.senderLogo || logoUrl ? (
              <div className="relative w-16 h-16 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 overflow-hidden flex items-center justify-center p-2 shrink-0">
                <Image 
                  src={invoice.senderLogo || logoUrl || ""} 
                  alt="Logo" 
                  fill 
                  className="object-contain p-2" 
                  priority
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary-accent-10)] border border-[var(--primary-accent-20)] flex items-center justify-center font-black text-xl text-[var(--primary-accent)] uppercase shrink-0">
                {(invoice.senderName || "B").slice(0, 2)}
              </div>
            )}
            
            <div className="space-y-0.5 min-w-0">
              <h4 className={cn("text-xs sm:text-sm font-black uppercase tracking-tight font-sans truncate", isDarkMode ? "text-white/90" : "text-slate-800")}>
                {invoice.senderName}
              </h4>
              <p className={cn("text-[10px] font-bold leading-none truncate", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                {invoice.senderEmail}
              </p>
            </div>
          </div>

          <div className="space-y-0.5 relative z-10">
            <p className={cn("text-xs font-bold leading-none", isDarkMode ? "text-slate-400" : "text-slate-500")}>
              {invoice.senderEmail}
            </p>
            {invoice.senderPhone && (
              <p className={cn("text-[10px] font-bold leading-none mt-1", isDarkMode ? "text-slate-550" : "text-slate-400")}>
                {invoice.senderPhone}
              </p>
            )}
            {invoice.senderAddress && (
              <p className={cn("text-[10px] font-bold leading-relaxed mt-1", isDarkMode ? "text-slate-550" : "text-slate-400")}>
                {invoice.senderAddress}
              </p>
            )}
          </div>
        </div>

        {/* Right Client / Total Card */}
        <div className={cn(
          "md:col-span-5 rounded-3xl p-6 border flex flex-col justify-between",
          isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
        )}>
          <div className="flex items-center gap-3">
            {invoice.customerLogo ? (
              <div className="relative w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                <Image 
                  src={invoice.customerLogo} 
                  alt="Customer Logo" 
                  fill 
                  className="object-contain p-1.5" 
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-accent-10)] border border-[var(--primary-accent-20)] flex items-center justify-center font-black text-base text-[var(--primary-accent)] uppercase shrink-0">
                {invoice.customer.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-xs font-bold tracking-tight leading-none">{invoice.customer}</p>
              <p className={cn("text-[10px] font-bold", isDarkMode ? "text-slate-550" : "text-slate-450")}>{invoice.email}</p>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <p className={cn("text-[9px] uppercase font-black tracking-widest", isDarkMode ? "text-slate-550" : "text-slate-400")}>Total Amount:</p>
            <div className="flex items-baseline gap-1">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-[var(--primary-accent)]">{invoice.amount.replace(symbol, '')}</h2>
              <span className={cn("text-xs font-bold", isDarkMode ? "text-slate-450" : "text-slate-500")}>{invoice.currency || "USD"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metadata Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className={cn("px-5 py-3 rounded-2xl border text-center sm:text-left", isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-100 shadow-sm")}>
          <span className={cn("text-[9px] uppercase font-black tracking-wider block mb-0.5", isDarkMode ? "text-slate-550" : "text-slate-400")}>Invoice Number</span>
          <span className="text-xs font-black whitespace-nowrap">Nº: {invoice.invoiceNumber || invoice.id}</span>
        </div>
        <div className={cn("px-5 py-3 rounded-2xl border text-center sm:text-left", isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-100 shadow-sm")}>
          <span className={cn("text-[9px] uppercase font-black tracking-wider block mb-0.5", isDarkMode ? "text-slate-555" : "text-slate-400")}>Issued Date</span>
          <span className="text-xs font-black">{invoice.date}</span>
        </div>
        <div className={cn("px-5 py-3 rounded-2xl border text-center sm:text-left", isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-100 shadow-sm")}>
          <span className={cn("text-[9px] uppercase font-black tracking-wider block mb-0.5", isDarkMode ? "text-slate-555" : "text-slate-400")}>Due Date</span>
          <span className="text-xs font-black">{invoice.dueDate}</span>
        </div>
      </div>

      {/* Recipient & Sender Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={cn("p-6 rounded-3xl border space-y-3", isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-50/50 border-slate-100")}>
          <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent)]" />
            Recipient
          </h4>
          <div>
            <p className="text-base font-black">{invoice.customer}</p>
            <p className={cn("text-xs font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{invoice.email}</p>
          </div>
          <p className={cn("text-[10px] font-bold leading-relaxed", isDarkMode ? "text-slate-555" : "text-slate-400")}>
            {invoice.customerAddress || "123 Business Street, San Francisco, CA 94107"}
            {invoice.customerPhone && <span className="block mt-1 font-semibold">{invoice.customerPhone}</span>}
          </p>
        </div>

        <div className={cn("p-6 rounded-3xl border space-y-3", isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-50/50 border-slate-100")}>
          <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-350 dark:bg-slate-650" />
            Sender
          </h4>
          <div>
            <p className="text-base font-black">{invoice.senderName}</p>
            <p className={cn("text-xs font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{invoice.senderEmail}</p>
          </div>
          <p className={cn("text-[10px] font-bold leading-relaxed", isDarkMode ? "text-slate-555" : "text-slate-400")}>
            {invoice.senderAddress || "456 Innovation Way, New York, NY 10001"}
          </p>
        </div>
      </div>

      {/* Items Table Card */}
      <div className={cn("rounded-3xl border overflow-hidden mb-6", isDarkMode ? "border-white/10" : "border-slate-100")}>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[500px] sm:min-w-0">
            <thead className={isDarkMode ? "bg-white/5" : "bg-slate-50"}>
              <tr className={cn("border-b", isDarkMode ? "border-white/10" : "border-slate-100")}>
                <th className={cn("px-6 py-4 text-left text-[9px] font-extrabold uppercase tracking-widest", isDarkMode ? "text-slate-400" : "text-slate-500")}>Description</th>
                <th className={cn("px-4 py-4 text-center text-[9px] font-extrabold uppercase tracking-widest", isDarkMode ? "text-slate-400" : "text-slate-500")}>Qty</th>
                <th className={cn("px-4 py-4 text-right text-[9px] font-extrabold uppercase tracking-widest", isDarkMode ? "text-slate-400" : "text-slate-500")}>Price</th>
                <th className={cn("px-6 py-4 text-right text-[9px] font-extrabold uppercase tracking-widest", isDarkMode ? "text-slate-400" : "text-slate-500")}>Total</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDarkMode ? "divide-white/5" : "divide-slate-50")}>
              {items.map((item: NormalizedItem) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/10 dark:hover:bg-white/[0.01]">
                  <td className="px-6 py-4 text-xs font-bold">{item.description}</td>
                  <td className={cn("px-4 py-4 text-center text-xs font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{item.qty}</td>
                  <td className={cn("px-4 py-4 text-right text-xs font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{item.price}</td>
                  <td className="px-6 py-4 text-right text-xs font-black text-[var(--primary-accent)]">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Grid */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
        <div className="text-center sm:text-left">
          <p className={cn("text-[9px] font-black uppercase tracking-wider mb-0.5", isDarkMode ? "text-slate-555" : "text-slate-400")}>Terms & Conditions</p>
          <p className={cn("text-[8px] font-bold max-w-md uppercase tracking-wide", isDarkMode ? "text-slate-555" : "text-slate-400")}>
            {invoice.terms || "Fees and payment terms will be established in the agreement. An initial deposit may be required."}
          </p>
        </div>

        <div className="px-6 py-3.5 rounded-2xl bg-[var(--primary-accent-10)] border border-[var(--primary-accent-20)] flex items-center gap-6 shrink-0">
          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--primary-accent)]">Total Amount</span>
          <span className="text-xl font-black text-[var(--primary-accent)]">{formattedSubtotal}</span>
        </div>
      </div>

      <RecuraBadge isDarkMode={isDarkMode} />
    </div>
  )
}

// ─── Template 2: Minimalist ───────────────────────────────────────────────────

function MinimalistTemplate({ invoice, logoUrl, primaryColor, isDarkMode }: TemplateProps) {
  const accentStyles = getAccentStyles(primaryColor)
  const items = useNormalizedItems(invoice)

  const symbol = invoice.currencySymbol || "$"

  const subtotalStr = invoice.subtotal !== undefined
    ? (typeof invoice.subtotal === 'number' ? `${symbol}${invoice.subtotal.toFixed(2)}` : String(invoice.subtotal))
    : invoice.amount

  const taxStr = invoice.tax !== undefined
    ? (typeof invoice.tax === 'number' ? `${symbol}${invoice.tax.toFixed(2)}` : String(invoice.tax))
    : `${symbol}0.00`

  const discountStr = invoice.discount !== undefined
    ? (typeof invoice.discount === 'number' ? `${symbol}${invoice.discount.toFixed(2)}` : String(invoice.discount))
    : `${symbol}0.00`

  return (
    <div 
      style={accentStyles}
      className={cn(
        "p-6 sm:p-10 w-full mx-auto font-sans transition-colors duration-300 relative",
        isDarkMode ? "bg-[#0b051a] text-white" : "bg-white text-slate-800"
      )}
    >
      {/* Top Banner Accent */}
      <div 
        style={{ 
          backgroundImage: "url('/images/dumb_images/invoices dumb/Background Gradient.svg')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
        className="h-24 sm:h-32 rounded-3xl relative overflow-hidden mb-10 border border-white/5"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-accent)]/20 to-[var(--primary-accent-50)]/20 mix-blend-overlay" />
      </div>

      {/* Floating Header Card */}
      <div className={cn(
        "rounded-3xl p-6 border shadow-xl relative z-10 -mt-20 sm:-mt-24 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6",
        isDarkMode ? "bg-slate-900/90 border-white/10" : "bg-white border-slate-100"
      )}>
        <div className="flex items-center gap-4">
          {invoice.senderLogo || logoUrl ? (
            <div className="relative w-16 h-16 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 overflow-hidden flex items-center justify-center p-2">
              <Image 
                src={invoice.senderLogo || logoUrl || ""} 
                alt="Logo" 
                fill 
                className="object-contain p-2" 
                priority
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary-accent-10)] border border-[var(--primary-accent-20)] flex items-center justify-center font-black text-xl text-[var(--primary-accent)] uppercase">
              {(invoice.senderName || "B").slice(0, 2)}
            </div>
          )}
          <div>
            <h3 className="text-base font-black leading-none">{invoice.senderName}</h3>
            <p className={cn("text-xs font-bold mt-1", isDarkMode ? "text-slate-400" : "text-slate-500")}>
              {invoice.senderEmail}
            </p>
            {invoice.senderAddress && (
              <p className={cn("text-[10px] font-bold leading-normal mt-1", isDarkMode ? "text-slate-500" : "text-slate-400")}>
                {invoice.senderAddress}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 sm:self-center">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            {invoice.status}
          </span>
          <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border", isDarkMode ? "bg-white/5 border-white/10 text-slate-350" : "bg-slate-100 border-slate-200 text-slate-700")}>
            Invoice
          </span>
        </div>
      </div>

      {/* 3 Column Details Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 mb-8">
        <div className="space-y-3">
          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-[var(--primary-accent-10)] text-[var(--primary-accent)] inline-block">
            Invoice to:
          </span>
          <div className="space-y-1">
            <p className="text-base font-black leading-snug">{invoice.customer}</p>
            <p className={cn("text-xs font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{invoice.email}</p>
            <p className={cn("text-[10px] font-bold leading-normal", isDarkMode ? "text-slate-500" : "text-slate-400")}>
              {invoice.customerAddress || "123 Business Street, San Francisco, CA 94102"}
              {invoice.customerPhone && <span className="block mt-0.5 font-semibold">{invoice.customerPhone}</span>}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-[var(--primary-accent-10)] text-[var(--primary-accent)] inline-block">
            Date:
          </span>
          <div className="space-y-1">
            <p className="text-base font-black leading-snug">{invoice.date}</p>
            <p className={cn("text-xs font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{invoice.senderName}</p>
          </div>
        </div>

        <div className="space-y-3">
          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-[var(--primary-accent-10)] text-[var(--primary-accent)] inline-block">
            Invoice Number:
          </span>
          <div className="space-y-1">
            <p className="text-base font-black leading-snug whitespace-nowrap">Nº: {invoice.invoiceNumber || invoice.id}</p>
            <p className={cn("text-xs font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>Due: {invoice.dueDate}</p>
          </div>
        </div>
      </div>

      {/* Clean Minimal Table */}
      <div className="overflow-x-auto no-scrollbar mb-8">
        <table className="w-full min-w-[500px] sm:min-w-0">
          <thead>
            <tr className={cn("border-b text-[9px] font-extrabold uppercase tracking-widest", isDarkMode ? "border-white/10 text-slate-500" : "border-slate-100 text-slate-400")}>
              <th className="py-3 text-left">Description</th>
              <th className="py-3 text-center w-16">Qty</th>
              <th className="py-3 text-right w-24">Price</th>
              <th className="py-3 text-right w-28">Total</th>
            </tr>
          </thead>
          <tbody className={cn("divide-y", isDarkMode ? "divide-white/5" : "divide-slate-50")}>
            {items.map((item: NormalizedItem) => (
              <tr key={item.id} className="text-xs">
                <td className="py-4 font-bold">{item.description}</td>
                <td className={cn("py-4 text-center font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{item.qty}</td>
                <td className={cn("py-4 text-right font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{item.price}</td>
                <td className="py-4 text-right font-black">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Terms & Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-slate-100 dark:border-white/10 items-start">
        <div className="md:col-span-7">
          <p className={cn("text-[9px] font-black uppercase tracking-wider mb-1", isDarkMode ? "text-slate-500" : "text-slate-400")}>Terms & Conditions:</p>
          <p className={cn("text-[9px] font-bold leading-relaxed max-w-sm", isDarkMode ? "text-slate-500" : "text-slate-400")}>
            {invoice.terms || "Fees and payment terms will be established in the contract or agreement prior to the commencement of the project. We reserve the right to suspend work in the event of non-payment."}
          </p>
        </div>

        <div className="md:col-span-5 space-y-2.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Subtotal</span>
            <span>{subtotalStr}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold">
            <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Discount</span>
            <span className="text-emerald-500">-{discountStr}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold">
            <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Tax (VAT)</span>
            <span>{taxStr}</span>
          </div>
          <div className={cn("flex justify-between items-center pt-3 border-t text-sm font-black text-[var(--primary-accent)]", isDarkMode ? "border-white/10" : "border-slate-100")}>
            <span>Invoice Total</span>
            <span className="text-lg">{subtotalStr}</span>
          </div>
        </div>
      </div>

      <RecuraBadge isDarkMode={isDarkMode} />
    </div>
  )
}

// ─── Template 3: Detailed ─────────────────────────────────────────────────────

function DetailedTemplate({ invoice, logoUrl, primaryColor, isDarkMode }: TemplateProps) {
  const accentStyles = getAccentStyles(primaryColor)
  const items = useNormalizedItems(invoice)

  const symbol = invoice.currencySymbol || "$"

  const subtotalStr = invoice.subtotal !== undefined
    ? (typeof invoice.subtotal === 'number' ? `${symbol}${invoice.subtotal.toFixed(2)}` : String(invoice.subtotal))
    : invoice.amount

  return (
    <div 
      style={accentStyles}
      className={cn(
        "p-0 w-full mx-auto font-sans transition-colors duration-300 grid grid-cols-1 md:grid-cols-12 overflow-hidden border border-transparent rounded-[2.5rem]",
        isDarkMode ? "bg-[#0b051a] text-white" : "bg-white text-slate-800"
      )}
    >
      {/* Left Sidebar Details (Col 4) */}
      <div className={cn(
        "md:col-span-4 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r space-y-6 relative overflow-hidden",
        isDarkMode ? "bg-white/[0.02] border-white/10" : "bg-slate-50/50 border-slate-150"
      )}>
        <div className="space-y-6">
          {/* Invoice Number Pill */}
          <span className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-[var(--primary-accent-20)] text-[var(--primary-accent)] bg-[var(--primary-accent-10)] inline-block whitespace-nowrap">
            Nº: {invoice.invoiceNumber || invoice.id}
          </span>

          <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Invoice</h2>

          {/* Bill From details */}
          <div className="space-y-1">
            <span className={cn("text-[9px] uppercase font-black tracking-wider block", isDarkMode ? "text-slate-500" : "text-slate-400")}>Bill from:</span>
            <p className="text-sm font-black">{invoice.senderName}</p>
            <p className={cn("text-[10px] font-bold leading-normal", isDarkMode ? "text-slate-400" : "text-slate-500")}>
              {invoice.senderEmail}
              {invoice.senderPhone && <><br />{invoice.senderPhone}</>}
              {invoice.senderAddress && <><br />{invoice.senderAddress}</>}
            </p>
          </div>

          {/* Bill To details */}
          <div className="space-y-1">
            <span className={cn("text-[9px] uppercase font-black tracking-wider block", isDarkMode ? "text-slate-500" : "text-slate-405")}>Bill to:</span>
            <p className="text-sm font-black">{invoice.customer}</p>
            <p className={cn("text-[10px] font-bold leading-normal", isDarkMode ? "text-slate-400" : "text-slate-500")}>
              {invoice.email}<br />
              {invoice.customerAddress || "Pablo Alto, San Francisco, CA 92102"}<br />
              {invoice.customerPhone && <span className="font-semibold">{invoice.customerPhone}<br /></span>}
              United States of America
            </p>
          </div>

          {/* Meta dates */}
          <div className={cn("space-y-2 pt-4 border-t", isDarkMode ? "border-white/5" : "border-slate-150")}>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className={isDarkMode ? "text-slate-500" : "text-slate-400"}>Issued Date:</span>
              <span className="font-extrabold">{invoice.date}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className={isDarkMode ? "text-slate-500" : "text-slate-400"}>Due Date:</span>
              <span className="font-extrabold">{invoice.dueDate}</span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-1">
            <span className={cn("text-[9px] uppercase font-black tracking-wider block", isDarkMode ? "text-slate-500" : "text-slate-400")}>Terms & Conditions:</span>
            <p className={cn("text-[8px] font-bold leading-relaxed uppercase tracking-wide", isDarkMode ? "text-slate-500" : "text-slate-400")}>
              {invoice.terms || "Fees and payment terms will be established in the agreement. We reserve the right to suspend work in the event of non-payment."}
            </p>
          </div>
        </div>

        {/* Bottom Logo / Mark */}
        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-150 dark:border-white/5 w-full">
          {invoice.senderLogo || logoUrl ? (
            <div className="relative w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
              <Image 
                src={invoice.senderLogo || logoUrl || ""} 
                alt="Logo" 
                fill 
                className="object-contain p-1.5" 
                priority
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-accent-10)] border border-[var(--primary-accent-20)] flex items-center justify-center font-black text-base text-[var(--primary-accent)] uppercase shrink-0">
              {(invoice.senderName || "B").slice(0, 2)}
            </div>
          )}
          
          <div className="space-y-0.5 min-w-0">
            <h4 className="text-[10px] font-black uppercase tracking-tight text-slate-800 dark:text-white truncate">
              {invoice.senderName}
            </h4>
            {invoice.senderEmail && (
              <p className="text-[9px] font-bold text-slate-550 dark:text-slate-400 normal-case truncate">
                {invoice.senderEmail}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column Items Table (Col 8) */}
      <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className={cn("border-b text-[8px] font-extrabold uppercase tracking-widest", isDarkMode ? "border-white/10 text-slate-500" : "border-slate-155 text-slate-400")}>
                <th className="py-2.5 text-left">Description</th>
                <th className="py-2.5 text-center w-12">Qty</th>
                <th className="py-2.5 text-right w-20">Price</th>
                <th className="py-2.5 text-right w-24">Total</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDarkMode ? "divide-white/5" : "divide-slate-50")}>
              {items.map((item: NormalizedItem) => (
                <tr key={item.id} className="text-xs">
                  <td className="py-3.5 font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/10 dark:shadow-none shrink-0">
                      <Box className="w-5 h-5 drop-shadow-sm" />
                    </div>
                    <span>{item.description}</span>
                  </td>
                  <td className={cn("py-3.5 text-center font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{item.qty}</td>
                  <td className={cn("py-3.5 text-right font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{item.price}</td>
                  <td className="py-3.5 text-right font-black text-[var(--primary-accent)]">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dynamic total card summary block */}
        <div className={cn(
          "rounded-3xl p-6 border flex justify-between items-center mt-6",
          isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
        )}>
          <div>
            <span className={cn("text-[9px] uppercase font-black tracking-widest block", isDarkMode ? "text-slate-500" : "text-slate-400")}>Invoice Total</span>
            <span className={cn("text-[10px] font-bold uppercase", isDarkMode ? "text-slate-450" : "text-slate-500")}>{invoice.currency || "USD"}</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[var(--primary-accent)]">{subtotalStr}</span>
          </div>
        </div>

        <RecuraBadge isDarkMode={isDarkMode} />
      </div>
    </div>
  )
}

// ─── Template 4: Modern ───────────────────────────────────────────────────────

function ModernTemplate({ invoice, logoUrl, primaryColor, isDarkMode }: TemplateProps) {
  const accentStyles = getAccentStyles(primaryColor)
  const items = useNormalizedItems(invoice)

  const symbol = invoice.currencySymbol || "$"

  const subtotalStr = invoice.subtotal !== undefined
    ? (typeof invoice.subtotal === 'number' ? `${symbol}${invoice.subtotal.toFixed(2)}` : String(invoice.subtotal))
    : invoice.amount

  return (
    <div 
      style={accentStyles}
      className={cn(
        "p-6 sm:p-10 w-full mx-auto font-sans transition-colors duration-300 relative",
        isDarkMode ? "bg-[#0b051a] text-white" : "bg-white text-slate-800"
      )}
    >
      {/* Top row with Logo and Badge */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 w-full">
        <div className="flex items-center gap-3.5">
          {invoice.senderLogo || logoUrl ? (
            <div className="relative w-16 h-16 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 overflow-hidden flex items-center justify-center p-2 shrink-0">
              <Image 
                src={invoice.senderLogo || logoUrl || ""} 
                alt="Logo" 
                fill 
                className="object-contain p-2" 
                priority
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary-accent-10)] border border-[var(--primary-accent-20)] flex items-center justify-center font-black text-xl text-[var(--primary-accent)] uppercase shrink-0">
              {(invoice.senderName || "B").slice(0, 2)}
            </div>
          )}
          
          <div className="space-y-0.5">
            <h4 className={cn("text-xs sm:text-sm font-black uppercase tracking-tight font-sans whitespace-nowrap", isDarkMode ? "text-white" : "text-slate-800")}>
              {invoice.senderName}
            </h4>
            <p className={cn("text-[10px] font-bold leading-none", isDarkMode ? "text-slate-450" : "text-slate-500")}>
              {invoice.senderEmail}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[var(--primary-accent-10)] text-[var(--primary-accent)] border border-[var(--primary-accent-20)]">
            Invoice Number: {invoice.invoiceNumber || invoice.id}
          </span>
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            {invoice.status}
          </span>
        </div>
      </div>

      {/* Banner / Details Wrapper Card */}
      <div className={cn(
        "rounded-3xl p-6 border mb-8",
        isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200/60"
      )}>
        {/* 3 columns inside Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className={cn("text-[9px] uppercase font-black tracking-widest mb-1.5", isDarkMode ? "text-slate-400" : "text-slate-500")}>Invoice Details:</h4>
            <div className="space-y-0.5 text-xs font-bold">
              <p className="whitespace-nowrap">Nº: <span className="font-black">{invoice.invoiceNumber || invoice.id}</span></p>
              <p>Issued: <span className="font-black">{invoice.date}</span></p>
              <p>Due: <span className="font-black">{invoice.dueDate}</span></p>
            </div>
          </div>

          <div>
            <h4 className={cn("text-[9px] uppercase font-black tracking-widest mb-1.5", isDarkMode ? "text-slate-400" : "text-slate-500")}>{invoice.senderName}:</h4>
            <div className="space-y-0.5 text-xs font-bold">
              <p className="font-black">{invoice.senderName}</p>
              <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>{invoice.senderEmail}</p>
              {invoice.senderPhone && <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>{invoice.senderPhone}</p>}
              {invoice.senderAddress && <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>{invoice.senderAddress}</p>}
            </div>
          </div>

          {/* Client box */}
          <div className={cn(
            "p-3.5 rounded-2xl border flex items-center gap-3",
            isDarkMode ? "bg-[#150a2e] border-white/10" : "bg-white border-slate-200/50 shadow-sm shadow-slate-100"
          )}>
            {invoice.customerLogo ? (
              <div className="relative w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                <Image 
                  src={invoice.customerLogo} 
                  alt="Customer Logo" 
                  fill 
                  className="object-contain p-1.5" 
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-accent-10)] border border-[var(--primary-accent-20)] flex items-center justify-center font-black text-base text-[var(--primary-accent)] uppercase shrink-0">
                {invoice.customer.charAt(0)}
              </div>
            )}
            <div>
              <span className={cn("text-[8px] uppercase font-black tracking-wider block", isDarkMode ? "text-slate-500" : "text-slate-400")}>Invoice To:</span>
              <p className="text-xs font-black leading-tight">{invoice.customer}</p>
              <p className={cn("text-[9px] font-bold leading-none mt-0.5", isDarkMode ? "text-slate-400" : "text-slate-500")}>{invoice.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Styled Modern Rows list (instead of heavy grid lines) */}
      <div className="space-y-2.5 mb-8">
        <div className="grid grid-cols-12 gap-4 px-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
          <p className="col-span-6">Description</p>
          <p className="col-span-2 text-center">Qty</p>
          <p className="col-span-2 text-right">Price</p>
          <p className="col-span-2 text-right">Total</p>
        </div>

        {items.map((item: NormalizedItem) => (
          <div 
            key={item.id} 
            className={cn(
              "grid grid-cols-12 gap-4 p-4 px-6 rounded-2xl border transition-all items-center",
              isDarkMode ? "bg-white/[0.01] border-white/5 hover:bg-white/[0.03]" : "bg-white border-slate-100 hover:shadow-sm"
            )}
          >
            <p className={cn("col-span-6 text-xs font-bold leading-tight", isDarkMode ? "text-white" : "text-slate-900")}>{item.description}</p>
            <p className={cn("col-span-2 text-center text-xs font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{item.qty}</p>
            <p className={cn("col-span-2 text-right text-xs font-bold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{item.price}</p>
            <p className="col-span-2 text-right text-xs font-black text-[var(--primary-accent)]">{item.total}</p>
          </div>
        ))}
      </div>

      {/* Footer & Total */}
      <div className="flex justify-end gap-8 pt-6 border-t border-slate-100 dark:border-white/10">
        <div className="flex items-baseline gap-2 text-right">
          <span className={cn("text-[10px] font-black uppercase tracking-widest", isDarkMode ? "text-slate-500" : "text-slate-405")}>Total due:</span>
          <h2 className="text-3xl font-black text-[var(--primary-accent)] tracking-tighter">
            {subtotalStr}
          </h2>
          <span className={cn("text-[10px] font-bold uppercase", isDarkMode ? "text-slate-450" : "text-slate-500")}>{invoice.currency || "USD"}</span>
        </div>
      </div>

      {/* Wave Footer Vector */}
      <div className="flex flex-col sm:flex-row items-start justify-between mt-10 pt-6 border-t border-slate-100 dark:border-white/5 gap-6">
        <div className="text-left max-w-sm sm:max-w-md">
          <p className={cn("text-[9px] font-black uppercase tracking-wider mb-0.5", isDarkMode ? "text-slate-500" : "text-slate-405")}>Terms & Conditions:</p>
          <p className={cn("text-[9px] font-bold leading-relaxed", isDarkMode ? "text-slate-500" : "text-slate-400")}>
            {invoice.terms || "This is a computer generated invoice. Payment terms are net 30. Please contact support for any issues."}
          </p>
        </div>
        <DotsPattern />
      </div>

      <RecuraBadge isDarkMode={isDarkMode} />
    </div>
  )
}

// ─── Template 5: Premium Dark ──────────────────────────────────────────────────

function PremiumDarkTemplate({ invoice, logoUrl, primaryColor }: Omit<TemplateProps, 'isDarkMode'>) {
  const accentStyles = getAccentStyles(primaryColor)
  const items = useNormalizedItems(invoice)

  const symbol = invoice.currencySymbol || "$"

  const subtotalStr = invoice.subtotal !== undefined
    ? (typeof invoice.subtotal === 'number' ? `${symbol}${invoice.subtotal.toFixed(2)}` : String(invoice.subtotal))
    : invoice.amount

  return (
    <div 
      style={accentStyles}
      className="p-6 sm:p-10 w-full mx-auto font-sans transition-colors duration-300 relative bg-[#0b061c] text-white overflow-hidden"
    >
      {/* Decorative backdrop glows */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full blur-3xl opacity-10 bg-[var(--primary-accent)]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 rounded-full blur-3xl opacity-10 bg-indigo-600" />
      
      {/* Top Header Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 relative z-10">
        {/* Left Brand Card - Colored Gradient Banner */}
        <div 
          style={{ 
            backgroundImage: "url('/images/dumb_images/invoices dumb/Background Gradient.svg')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
          className="md:col-span-7 rounded-3xl p-6 relative overflow-hidden min-h-[140px] flex flex-col justify-start gap-4 border border-white/10"
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-accent)]/15 to-transparent mix-blend-color-dodge" />
          
          <div className="flex items-center gap-3.5 relative z-10">
            {invoice.senderLogo || logoUrl ? (
              <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center p-2 shrink-0">
                <Image 
                  src={invoice.senderLogo || logoUrl || ""} 
                  alt="Logo" 
                  fill 
                  className="object-contain p-2" 
                  priority
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl text-white uppercase shrink-0">
                {(invoice.senderName || "B").slice(0, 2)}
              </div>
            )}
            
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight text-white whitespace-nowrap">
                {invoice.senderName}
              </h4>
              <p className="text-[10px] font-bold text-white/75 leading-none">
                {invoice.senderEmail}
              </p>
            </div>
          </div>

          <p className="text-[10px] font-bold text-white/80 leading-relaxed relative z-10">
            {invoice.senderEmail}
            {invoice.senderPhone && <>&nbsp;&bull;&nbsp;{invoice.senderPhone}</>}
            {invoice.senderAddress && <><br />{invoice.senderAddress}</>}
          </p>
        </div>

        {/* Right Client Info Card */}
        <div className="md:col-span-5 rounded-3xl p-6 border border-white/10 bg-white/[0.03] flex flex-col justify-between">
          <div className="flex items-center gap-3">
            {invoice.customerLogo ? (
              <div className="relative w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                <Image 
                  src={invoice.customerLogo} 
                  alt="Customer Logo" 
                  fill 
                  className="object-contain p-1.5" 
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-accent)] to-slate-800 text-white flex items-center justify-center font-black text-base text-slate-400 uppercase shrink-0">
                {invoice.customer.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-xs font-bold tracking-tight leading-none text-white">{invoice.customer}</p>
              <p className="text-[10px] font-bold text-slate-500">{invoice.email}</p>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <p className="text-[9px] uppercase font-black tracking-widest text-slate-500">Total Amount:</p>
            <div className="flex items-baseline gap-1">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-[var(--primary-accent)]">{invoice.amount.replace(symbol, '')}</h2>
              <span className="text-xs font-bold text-slate-500">{invoice.currency || "USD"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metadata Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 relative z-10">
        <div className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center sm:text-left">
          <span className="text-[9px] uppercase font-black tracking-wider block mb-0.5 text-slate-500">Invoice Number</span>
          <span className="text-xs font-black text-white whitespace-nowrap">Nº: {invoice.invoiceNumber || invoice.id}</span>
        </div>
        <div className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center sm:text-left">
          <span className="text-[9px] uppercase font-black tracking-wider block mb-0.5 text-slate-500">Issued Date</span>
          <span className="text-xs font-black text-white">{invoice.date}</span>
        </div>
        <div className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center sm:text-left">
          <span className="text-[9px] uppercase font-black tracking-wider block mb-0.5 text-slate-500">Due Date</span>
          <span className="text-xs font-black text-white">{invoice.dueDate}</span>
        </div>
      </div>

      {/* Recipient & Sender Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
        <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-355">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent)]" />
            Recipient
          </h4>
          <div>
            <p className="text-base font-black text-white">{invoice.customer}</p>
            <p className="text-xs font-bold text-slate-400">{invoice.email}</p>
          </div>
          <p className="text-[10px] font-bold leading-relaxed text-slate-555 uppercase tracking-wide">
            {invoice.customerAddress || "123 Business Street, San Francisco, CA 94107"}
            {invoice.customerPhone && <span className="block mt-1 font-semibold">{invoice.customerPhone}</span>}
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-355">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Sender
          </h4>
          <div>
            <p className="text-base font-black text-white">{invoice.senderName}</p>
            <p className="text-xs font-bold text-slate-400">{invoice.email}</p>
          </div>
          <p className="text-[10px] font-bold leading-relaxed text-slate-555 uppercase tracking-wide">
            {invoice.senderAddress || "456 Innovation Way, New York, NY 10001"}
          </p>
        </div>
      </div>

      {/* Items Table Card */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden mb-8 relative z-10">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[500px] sm:min-w-0">
            <thead className="bg-white/5">
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-[9px] font-extrabold uppercase tracking-widest text-slate-455">Description</th>
                <th className="px-4 py-4 text-center text-[9px] font-extrabold uppercase tracking-widest text-slate-455">Qty</th>
                <th className="px-4 py-4 text-right text-[9px] font-extrabold uppercase tracking-widest text-slate-455">Price</th>
                <th className="px-6 py-4 text-right text-[9px] font-extrabold uppercase tracking-widest text-slate-455">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item: NormalizedItem) => (
                <tr key={item.id} className="transition-colors hover:bg-white/[0.01]">
                  <td className="px-6 py-4 text-xs font-bold text-white">{item.description}</td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-400">{item.qty}</td>
                  <td className="px-4 py-4 text-right text-xs font-bold text-slate-400">{item.price}</td>
                  <td className="px-6 py-4 text-right text-xs font-black text-[var(--primary-accent)]">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Grid */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 relative z-10">
        <div className="text-center sm:text-left">
          <p className="text-[9px] font-black uppercase tracking-wider mb-0.5 text-slate-500">Terms & Conditions</p>
          <p className="text-[8px] font-bold max-w-md uppercase tracking-wide text-slate-500 leading-relaxed">
            {invoice.terms || "This is a computer generated invoice. No signature is required. Fees and payment terms are net 30."}
          </p>
        </div>

        <div className="px-6 py-3.5 rounded-2xl bg-[var(--primary-accent-10)] border border-[var(--primary-accent-20)] flex items-center gap-6 shrink-0 shadow-inner">
          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--primary-accent)]">Total Amount</span>
          <span className="text-xl font-black text-[var(--primary-accent)]">{subtotalStr}</span>
        </div>
      </div>

      <RecuraBadge isDarkMode={true} />
    </div>
  )
}

// ─── Main Template Selector Renderer ──────────────────────────────────────────

interface InvoiceTemplateRendererProps {
  template: 'classic' | 'minimalist' | 'detailed' | 'modern' | 'premium_dark'
  invoice: DetailedInvoice
  logoUrl?: string | null
  primaryColor?: string
  theme?: 'light' | 'dark'
}

export function InvoiceTemplateRenderer({
  template,
  invoice,
  logoUrl,
  primaryColor = "#7C3AED",
  theme = "light"
}: InvoiceTemplateRendererProps) {
  const isDarkMode = theme === 'dark' || template === 'premium_dark'

  const props: TemplateProps = {
    invoice,
    logoUrl,
    primaryColor,
    isDarkMode
  }

  switch (template) {
    case 'classic':
      return <ClassicTemplate {...props} />
    case 'minimalist':
      return <MinimalistTemplate {...props} />
    case 'detailed':
      return <DetailedTemplate {...props} />
    case 'modern':
      return <ModernTemplate {...props} />
    case 'premium_dark':
      return <PremiumDarkTemplate {...props} />
    default:
      return <ClassicTemplate {...props} />
  }
}
