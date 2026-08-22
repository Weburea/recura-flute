"use client"

import * as React from "react"
import Image from "next/image"
import { 
  Search, 
  ListFilter, 
  FileSpreadsheet, 
  ChevronLeft,
  ChevronRight,
  Printer,
  Check,
  AlertTriangle,
  Trash2,
  ChevronDown,
  MoreHorizontal,
  FileEdit,
  PlayCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { billingInvoices, type Invoice } from "./mock-data"

import { InvoiceModal } from "@/components/dashboard/shared/modals/invoice-modal"

const statusStyles = {
  Paid: "status-badge-active",
  Unpaid: "status-badge-canceled",
  Refund: "bg-indigo-50 text-indigo-600",
  Overdue: "bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
}

export interface BillingTableConfig {
  planColHeader?: string  // "Plan" | "Retainer" | "Product"
  entityLabel?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoices?: any[]
  isLoading?: boolean
  refreshData?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewInvoice?: (invoice: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditInvoice?: (invoice: any) => void
}

export function BillingTable({
  planColHeader = "Plan",
  entityLabel = "invoices",
  invoices,
  isLoading = false,
  refreshData,
  onViewInvoice,
  onEditInvoice,
}: BillingTableConfig) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [activeTab, setActiveTab] = React.useState("All")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeSort, setActiveSort] = React.useState<string>("date-desc")
  const [isSortOpen, setIsSortOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [showActions, setShowActions] = React.useState(false)
  const sortRef = React.useRef<HTMLDivElement>(null)
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const [isBulkLoading, setIsBulkLoading] = React.useState(false)

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return
    setIsBulkLoading(true)
    try {
      const res = await fetch('/api/v1/billing/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedIds,
          action,
        }),
      })
      if (res.ok) {
        setSelectedIds([])
        refreshData?.()
      }
    } catch (err) {
      console.error('[BULK ACTION ERROR]', err)
    } finally {
      setIsBulkLoading(false)
    }
  }
  
  // Handle click outside to close sorting dropdown and actions menu
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (sortRef.current && !sortRef.current.contains(target)) {
        setIsSortOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Invoice Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedInvoice, setSelectedInvoice] = React.useState<any | null>(null)

  const itemsPerPage = 6

  // helper to format amount in cents
  const formatSpent = (cents: number | string, symbol = "$") => {
    const val = Number(cents)
    if (isNaN(val)) return `${symbol}0.00`
    return `${symbol}${(val / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // helper to format date strings
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A"
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Map database/mock structure to a unified format
  const items = React.useMemo(() => {
    if (invoices) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return invoices.map((i: any) => {
        const symbol = i.metadata?.currencySymbol || "$"
        return {
          id: i.id,
          invoiceNumber: i.metadata?.invoiceNumber || i.id,
          customer: i.metadata?.customerName || i.customer?.name || "N/A",
          email: i.metadata?.customerEmail || i.customer?.email || "N/A",
          plan: i.metadata?.items?.[0]?.description || i.customer?.plan || "N/A",
          amount: formatSpent(i.amount, symbol),
          date: formatDate(i.createdAt || i.paidAt),
          dueDate: formatDate(i.dueDate),
          status: i.status || "Unpaid",
          avatar: i.metadata?.customerLogo || i.customer?.avatarUrl || null,
          raw: i,
        }
      })
    }

    return billingInvoices.map((i) => ({
      id: i.id,
      invoiceNumber: i.id,
      customer: i.customer,
      email: i.email,
      plan: i.plan,
      amount: i.amount,
      date: i.date,
      dueDate: i.dueDate,
      status: i.status,
      avatar: i.avatar || null,
      raw: i,
    }))
  }, [invoices])

  const counts = {
    All: items.length,
    Paid: items.filter(i => i.status === "Paid").length,
    Unpaid: items.filter(i => i.status === "Unpaid" || i.status === "Canceled").length,
    Refund: items.filter(i => i.status === "Refund").length,
    Overdue: items.filter(i => i.status === "Overdue").length,
  }

  // Filtering & Sorting Logic
  const filteredInvoices = React.useMemo(() => {
    const list = items.filter((item) => {
      const matchesTab = activeTab === "All" || 
        (activeTab === "Refund" ? item.status === "Refund" : 
        (activeTab === "Unpaid" ? (item.status === "Unpaid" || item.status === "Canceled") : 
        item.status === activeTab))
      const matchesSearch = 
        item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    });

    // Sorting Logic
    list.sort((a, b) => {
      if (activeSort === "name-asc") {
        return a.customer.localeCompare(b.customer);
      }
      if (activeSort === "name-desc") {
        return b.customer.localeCompare(a.customer);
      }
      if (activeSort === "date-desc" || activeSort === "date-asc") {
        const dateA = new Date(a.raw.dueDate || a.raw.createdAt || 0).getTime();
        const dateB = new Date(b.raw.dueDate || b.raw.createdAt || 0).getTime();
        return activeSort === "date-desc" ? dateB - dateA : dateA - dateB;
      }
      if (activeSort === "value-desc" || activeSort === "value-asc") {
        const valA = Number(a.raw.amount) || 0;
        const valB = Number(b.raw.amount) || 0;
        return activeSort === "value-desc" ? valB - valA : valA - valB;
      }
      return 0;
    });

    return list;
  }, [items, activeTab, searchQuery, activeSort]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage)

  const handleTabChange = (label: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveTab(label)
      setCurrentPage(1)
      setIsTransitioning(false)
    }, 200)
  }

  const handlePageChange = (page: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentPage(page)
      setIsTransitioning(false)
    }, 200)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewInvoice = (invoice: any) => {
    if (onViewInvoice) {
      onViewInvoice(invoice.raw || invoice)
    } else {
      setSelectedInvoice(invoice)
      setIsModalOpen(true)
    }
  }

  const handlePrint = () => {
    const tableHeader = ["Invoice", "Customer", planColHeader, "Amount", "Due Date", "Status"];
    const rows = filteredInvoices.map(i => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">${i.invoiceNumber}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: bold;">${i.customer}</span>
            <span style="font-size: 11px; color: #64748b;">${i.email}</span>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${i.plan}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">${i.amount}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${i.dueDate}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${i.status}</td>
      </tr>
    `).join("");

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice List - Print</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #1e293b; }
              table { width: 100%; border-collapse: collapse; margin-top: 30px; }
              th { text-align: left; background: #f8fafc; padding: 14px; border-bottom: 2px solid #e2e8f0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; }
              td { font-size: 13px; }
              h1 { font-size: 28px; margin-bottom: 5px; color: #0f172a; }
              .logo { font-weight: 800; color: #7c3aed; font-size: 24px; margin-bottom: 20px; letter-spacing: -0.02em; }
              .meta { font-size: 12px; color: #94a3b8; margin-bottom: 30px; }
            </style>
          </head>
          <body>
            <div class="logo">Recura</div>
            <h1>Invoice List</h1>
            <div class="meta">Status: ${activeTab} • Generated on ${new Date().toLocaleDateString()}</div>
            <table>
              <thead>
                <tr>${tableHeader.map(h => `<th>${h}</th>`).join("")}</tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleExport = () => {
    const headers = ["Invoice", "Customer", "Email", "Plan", "Amount", "Due Date", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredInvoices.map(i => [
        i.invoiceNumber,
        `"${i.customer}"`,
        `"${i.email}"`,
        `"${i.plan}"`,
        `"${i.amount}"`,
        i.dueDate,
        i.status
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `recura_${entityLabel.replace(/\s+/g, "_")}_${activeTab.toLowerCase()}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/v1/billing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: newStatus
        })
      })
      if (res.ok) {
        refreshData?.()
      }
    } catch (err) {
      console.error("[STATUS UPDATE ERROR]", err)
    }
  }

  const sortLabels = {
    "name-asc": "Name (A-Z)",
    "name-desc": "Name (Z-A)",
    "date-desc": "Date (Newest)",
    "date-asc": "Date (Oldest)",
    "value-desc": "Revenue/Amount (High to Low)",
    "value-asc": "Revenue/Amount (Low to High)",
  }

  return (
    <div className={cn(
      "dashboard-card bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-3xl p-0 shadow-sm",
      (activeMenuId !== null || isSortOpen) ? "!overflow-visible" : "overflow-hidden"
    )}>
      {/* Header */}
      <div className="p-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
            <div className="dashboard-search-container w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers, subscriptions, invoice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dashboard-search-input"
              />
            </div>
            
            <div className="relative shrink-0" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-between gap-3 min-w-[180px] h-12 transition-all cursor-pointer"
              >
                <span>{sortLabels[activeSort as keyof typeof sortLabels] || "Sort by"}</span>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isSortOpen && "rotate-180")} />
              </button>

              {isSortOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 shadow-2xl p-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-150">
                  {Object.entries(sortLabels).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setActiveSort(value);
                        setIsSortOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer",
                        activeSort === value
                          ? "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <span>{label}</span>
                      {activeSort === value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {selectedIds.length > 0 ? (() => {
            const selectedInvoices = items.filter(i => selectedIds.includes(i.id));
            const hasNotPaid = selectedInvoices.some(i => i.status !== 'Paid');
            const hasNotOverdue = selectedInvoices.some(i => i.status !== 'Overdue');
            return (
              <div className="flex items-center gap-2 md:gap-3 flex-wrap animate-in fade-in slide-in-from-right-4 duration-200">
                <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-white/5">
                  {selectedIds.length} selected
                </span>
                {hasNotPaid && (
                  <button
                    disabled={isBulkLoading}
                    onClick={() => handleBulkAction('mark_paid')}
                    className="px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark Paid
                  </button>
                )}
                {hasNotOverdue && (
                  <button
                    disabled={isBulkLoading}
                    onClick={() => handleBulkAction('mark_overdue')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Mark Overdue
                  </button>
                )}
                <button
                  disabled={isBulkLoading}
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1.5 rounded-xl border border-rose-100 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Selected
                </button>
              </div>
            );
          })() : (
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <button 
                onClick={() => setShowActions(!showActions)}
                className={cn(
                  "dashboard-action-toggle",
                  showActions 
                    ? "dashboard-action-toggle-active" 
                    : "dashboard-action-toggle-inactive"
                )}
              >
                <ListFilter className="w-5 h-5" />
              </button>
              <div className={cn(
                "flex items-center gap-2 md:gap-3 transition-all duration-300 origin-right flex-wrap",
                showActions ? "opacity-100 translate-x-0 w-auto" : "opacity-0 translate-x-4 w-0 overflow-hidden"
              )}>
                <button onClick={handlePrint} className="dashboard-action-btn dashboard-action-btn-secondary">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button onClick={handleExport} className="dashboard-action-btn dashboard-action-btn-primary">
                  <FileSpreadsheet className="w-4 h-4" /> Convert to Sheets
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {["All", "Paid", "Unpaid", "Refund", "Overdue"].map((label) => (
            <button
              key={label}
              onClick={() => handleTabChange(label)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                activeTab === label 
                  ? "bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 shadow-sm shadow-purple-100 dark:shadow-none" 
                  : "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {label} ({counts[label as keyof typeof counts]})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-container border-t border-slate-50 dark:border-white/5">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header-cell">
                <input 
                  type="checkbox" 
                  className="checkbox-custom"
                  checked={paginatedInvoices.length > 0 && paginatedInvoices.every(i => selectedIds.includes(i.id))}
                  onChange={(e) => {
                    const pageIds = paginatedInvoices.map(i => i.id)
                    if (e.target.checked) {
                      setSelectedIds(prev => [...new Set([...prev, ...pageIds])])
                    } else {
                      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)))
                    }
                  }}
                />
              </th>
              <th className="table-header-cell">Invoice</th>
              <th className="table-header-cell">Customer</th>
              <th className="table-header-cell hidden lg:table-cell">{planColHeader}</th>
              <th className="table-header-cell">Amount</th>
              <th className="table-header-cell hidden md:table-cell">Due Date</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className={cn(
            "divide-y divide-slate-50 dark:divide-white/5 transition-opacity duration-200",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-20 text-center text-slate-400 font-bold">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
                    Loading invoices...
                  </div>
                </td>
              </tr>
            ) : paginatedInvoices.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-20 text-center text-slate-400 font-bold">
                  No {entityLabel} found.
                </td>
              </tr>
            ) : paginatedInvoices.map((invoice) => {
              const isSelected = selectedIds.includes(invoice.id)
              return (
                <tr key={invoice.id} className={cn(
                  "table-row-hover",
                  isSelected && "table-row-selected"
                )}>
                  <td className="table-data-cell">
                    <input 
                      type="checkbox" 
                      className="checkbox-custom"
                      checked={isSelected}
                      onChange={() => {
                        setSelectedIds(prev => 
                          isSelected 
                            ? prev.filter(id => id !== invoice.id)
                            : [...prev, invoice.id]
                        )
                      }}
                    />
                  </td>
                  <td className="table-data-cell font-bold text-slate-900 dark:text-white">{invoice.invoiceNumber}</td>
                  <td className="table-data-cell">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10 flex-shrink-0">
                        {invoice.avatar ? (
                          <Image 
                            src={invoice.avatar} 
                            alt={invoice.customer} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-[10px] font-bold">
                            {invoice.customer.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white truncate">{invoice.customer}</span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 lowercase truncate">{invoice.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="table-data-cell font-bold text-slate-600 dark:text-slate-300 hidden lg:table-cell max-w-[240px]">
                    <div className="truncate font-bold" title={invoice.plan}>
                      {invoice.plan}
                    </div>
                  </td>
                  <td className="table-data-cell font-bold text-slate-900 dark:text-white">{invoice.amount}</td>
                  <td className="table-data-cell font-bold text-slate-500 dark:text-slate-400 hidden md:table-cell">{invoice.dueDate}</td>
                  <td className="table-data-cell">
                    <span className={cn("status-badge", statusStyles[invoice.status as keyof typeof statusStyles])}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="table-data-cell relative px-2 sm:px-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleViewInvoice(invoice)}
                        className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer whitespace-nowrap"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === invoice.id ? null : invoice.id)}
                        className={cn(
                          "p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-slate-400 cursor-pointer",
                          activeMenuId === invoice.id && "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
                        )}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Action Dropdown Menu */}
                    {activeMenuId === invoice.id && (
                      <div 
                        ref={menuRef}
                        className="absolute right-0 top-full mt-1 z-[150] w-52 bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                        <button 
                          onClick={() => {
                            setActiveMenuId(null);
                            onEditInvoice?.(invoice.raw || invoice);
                          }}
                          className="w-full px-4 py-2.5 text-xs font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer animate-none"
                        >
                          <FileEdit className="w-4 h-4 text-slate-450" />
                          Edit Invoice
                        </button>
                        
                        {invoice.status !== "Paid" && (
                          <button 
                            onClick={() => {
                              setActiveMenuId(null);
                              handleStatusUpdate(invoice.id, "Paid");
                            }}
                            className="w-full px-4 py-2.5 text-xs font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer animate-none"
                          >
                            <Check className="w-4 h-4 text-emerald-500" />
                            Mark as Paid
                          </button>
                        )}
                        
                        {invoice.status !== "Unpaid" && (
                          <button 
                            onClick={() => {
                              setActiveMenuId(null);
                              handleStatusUpdate(invoice.id, "Unpaid");
                            }}
                            className="w-full px-4 py-2.5 text-xs font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer animate-none"
                          >
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                            Mark as Unpaid
                          </button>
                        )}

                        {invoice.status !== "Refund" && (
                          <button 
                            onClick={() => {
                              setActiveMenuId(null);
                              handleStatusUpdate(invoice.id, "Refund");
                            }}
                            className="w-full px-4 py-2.5 text-xs font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer animate-none"
                          >
                            <PlayCircle className="w-4 h-4 text-indigo-500" />
                            Mark as Refunded
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-8 border-t border-slate-50 dark:border-white/5 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isTransitioning}
            className="pagination-btn"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={isTransitioning}
              className={cn(
                "pagination-page-btn",
                page === currentPage && "pagination-page-btn-active"
              )}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isTransitioning}
            className="pagination-btn"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <InvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
        }} 
        invoice={selectedInvoice as Invoice} 
      />
    </div>
  )
}
