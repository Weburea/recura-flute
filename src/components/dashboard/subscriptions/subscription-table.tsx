"use client"

import * as React from "react"
import Image from "next/image"
import { 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  FileEdit,
  PauseCircle,
  XCircle,
  Trash2,
  Printer,
  FileSpreadsheet,
  ListFilter
} from "lucide-react"
import { cn } from "@/lib/utils"

const subscriptions = [
  { id: 1, name: "Mark Luck", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png", plan: "Enterprise Corp", status: "Active", billingCycle: "$299.00/ month", lastPayment: "Jan 17, 2023", nextBillingDate: "Jan 28, 2023" },
  { id: 2, name: "Sarah Johnson", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png", plan: "Trial", status: "Trial", billingCycle: "$299.00/ month", lastPayment: "Jan 17, 2023", nextBillingDate: "Jan 28, 2023" },
  { id: 3, name: "Michael Brown", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/59%201.png", plan: "Enterprise Corp", status: "Paused", billingCycle: "$299.00/ month", lastPayment: "Jan 17, 2023", nextBillingDate: "Jan 28, 2023" },
  { id: 4, name: "Tech Trump", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571692/60%201.png", plan: "Enterprise Pla", status: "Canceled", billingCycle: "$299.00/ month", lastPayment: "Jan 17, 2023", nextBillingDate: "Jan 28, 2023" },
  { id: 5, name: "Lisa Goodwill", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571696/61%201.png", plan: "MTN Plan", status: "Canceled", billingCycle: "$299.00/ month", lastPayment: "Jan 17, 2023", nextBillingDate: "Jan 28, 2023" },
  { id: 6, name: "Carla Marlin", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png", plan: "USSD Bundle", status: "Paused", billingCycle: "$299.00/ month", lastPayment: "Jan 17, 2023", nextBillingDate: "Jan 28, 2023" },
  { id: 7, name: "David Wilson", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png", plan: "Basic Plan", status: "Active", billingCycle: "$99.00/ month", lastPayment: "Feb 10, 2023", nextBillingDate: "Mar 10, 2023" },
  { id: 8, name: "Emma Davis", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png", plan: "Premium Plan", status: "Active", billingCycle: "$199.00/ month", lastPayment: "Feb 12, 2023", nextBillingDate: "Mar 12, 2023" },
  { id: 9, name: "James Smith", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/59%201.png", plan: "Basic Plan", status: "Paused", billingCycle: "$99.00/ month", lastPayment: "Jan 05, 2023", nextBillingDate: "Feb 05, 2023" },
  { id: 10, name: "Olivia Taylor", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571692/60%201.png", plan: "Trial", status: "Trial", billingCycle: "$0.00/ month", lastPayment: "Feb 20, 2023", nextBillingDate: "Mar 06, 2023" },
  { id: 11, name: "Robert Jones", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571696/61%201.png", plan: "Premium Plan", status: "Active", billingCycle: "$199.00/ month", lastPayment: "Feb 15, 2023", nextBillingDate: "Mar 15, 2023" },
  { id: 12, name: "Sophia White", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png", plan: "Basic Plan", status: "Canceled", billingCycle: "$99.00/ month", lastPayment: "Jan 20, 2023", nextBillingDate: "N/A" },
  { id: 13, name: "William Clark", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png", plan: "Enterprise Plan", status: "Active", billingCycle: "$499.00/ month", lastPayment: "Feb 18, 2023", nextBillingDate: "Mar 18, 2023" },
  { id: 14, name: "Isabella Lewis", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png", plan: "Trial", status: "Trial", billingCycle: "$0.00/ month", lastPayment: "Feb 22, 2023", nextBillingDate: "Mar 08, 2023" },
  { id: 15, name: "Joseph Allen", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/59%201.png", plan: "Basic Plan", status: "Paused", billingCycle: "$99.00/ month", lastPayment: "Jan 10, 2023", nextBillingDate: "Feb 10, 2023" },
]

const statusStyles: Record<string, string> = {
  Active: "status-badge-active",
  Trial: "status-badge-trial",
  Paused: "status-badge-paused",
  Canceled: "status-badge-canceled",
}

export function SubscriptionTable() {
  const [activeTab, setActiveTab ] = React.useState("All")
  const [activeMenuId, setActiveMenuId] = React.useState<number | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<number[]>([])
  const [showActions, setShowActions] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const itemsPerPage = 6

  // Handle click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filtering Logic
  const filteredSubscriptions = activeTab === "All" 
    ? subscriptions 
    : subscriptions.filter(sub => sub.status === activeTab)

  // Pagination Logic
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, startIndex + itemsPerPage)

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

  const counts = {
    All: subscriptions.length,
    Active: subscriptions.filter(s => s.status === "Active").length,
    Paused: subscriptions.filter(s => s.status === "Paused").length,
    Canceled: subscriptions.filter(s => s.status === "Canceled").length,
  }

  const handlePrint = () => {
    const tableHeader = ["Customer", "Plan", "Status", "Billing Cycle", "Last Payment", "Next Billing Date"];
    const rows = filteredSubscriptions.map(sub => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${sub.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${sub.plan}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${sub.status}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${sub.billingCycle}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${sub.lastPayment}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${sub.nextBillingDate}</td>
      </tr>
    `).join("");

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Subscription List - Print</title>
            <style>
              body { font-family: sans-serif; padding: 20px; color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { text-align: left; background: #f8fafc; padding: 12px; border-bottom: 2px solid #eee; font-size: 14px; }
              h1 { color: #1e293b; font-size: 24px; }
              .logo { font-weight: bold; color: #7c3aed; font-size: 20px; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="logo">Recura</div>
            <h1>Subscription List - ${activeTab}</h1>
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
    const headers = ["ID", "Customer", "Plan", "Status", "Billing Cycle", "Last Payment", "Next Billing Date"];
    const csvContent = [
      headers.join(","),
      ...filteredSubscriptions.map(s => [
        s.id,
        `"${s.name}"`,
        `"${s.plan}"`,
        s.status,
        `"${s.billingCycle}"`,
        s.lastPayment,
        s.nextBillingDate
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `recura_subscriptions_${activeTab.toLowerCase()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-card bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-[24px] p-0 overflow-hidden shadow-sm mt-8">
      {/* Header Container */}
      <div className="p-8 pb-4">
        {/* Table Title and Actions row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Subscription List</h3>
          
          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
            <button 
              onClick={() => setShowActions(!showActions)}
              className={cn(
                "w-11 h-11 rounded-2xl border flex items-center justify-center transition-all cursor-pointer shadow-sm",
                showActions 
                ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/10 dark:shadow-purple-900/30" 
                  : "bg-white dark:bg-[#150a2e] border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
              )}
            >
              <ListFilter className="w-5 h-5 pointer-events-none" />
            </button>
            
            <div className={cn(
              "flex items-center gap-2 md:gap-3 transition-all duration-300 origin-right flex-wrap",
              showActions ? "opacity-100 translate-x-0 w-auto" : "opacity-0 translate-x-4 w-0 overflow-hidden"
            )}>
              <button 
                onClick={handlePrint}
                className="dashboard-action-btn dashboard-action-btn-secondary"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button 
                onClick={handleExport}
                className="dashboard-action-btn dashboard-action-btn-primary"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Convert to Sheets
              </button>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["All", "Active", "Paused", "Canceled"].map((label) => {
            const isActive = activeTab === label
            const count = counts[label as keyof typeof counts]
            return (
              <button
                key={label}
                onClick={() => handleTabChange(label)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  isActive 
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/10 dark:shadow-purple-900/40" 
                    : "bg-transparent text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-white"
                )}
              >
                {label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header-cell">
                <input 
                  type="checkbox" 
                  className="checkbox-custom"
                  checked={paginatedSubscriptions.length > 0 && paginatedSubscriptions.every(s => selectedIds.includes(s.id))}
                  onChange={(e) => {
                    const pageIds = paginatedSubscriptions.map(s => s.id)
                    if (e.target.checked) {
                      setSelectedIds(prev => [...new Set([...prev, ...pageIds])])
                    } else {
                      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)))
                    }
                  }}
                />
              </th>
              <th className="table-header-cell">Customer</th>
              <th className="table-header-cell">Plan</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Billing Cycle</th>
              <th className="table-header-cell">Last Payment</th>
              <th className="table-header-cell">Next Billing Date</th>
              <th className="table-header-cell"></th>
            </tr>
          </thead>
          <tbody className={cn("divide-y divide-slate-50 dark:divide-white/5 transition-opacity duration-200", isTransitioning ? "opacity-0" : "opacity-100")}>
            {paginatedSubscriptions.map((sub) => {
              const isSelected = selectedIds.includes(sub.id)
              return (
                <tr key={sub.id} className={cn(
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
                            ? prev.filter(id => id !== sub.id)
                            : [...prev, sub.id]
                        )
                      }}
                    />
                  </td>
                  <td className="table-data-cell">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10">
                        <Image 
                          src={sub.avatar} 
                          alt={sub.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{sub.name}</span>
                    </div>
                  </td>
                  <td className="table-data-cell font-bold text-slate-600 dark:text-slate-300">{sub.plan}</td>
                  <td className="table-data-cell">
                    <span className={cn(
                      "status-badge",
                      statusStyles[sub.status]
                    )}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="table-data-cell font-bold text-slate-900 dark:text-white">{sub.billingCycle}</td>
                  <td className="table-data-cell font-bold text-slate-600 dark:text-slate-300">{sub.lastPayment}</td>
                  <td className="table-data-cell font-bold text-slate-600 dark:text-slate-300">{sub.nextBillingDate}</td>
                  <td className="table-data-cell relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === sub.id ? null : sub.id)}
                      className={cn(
                        "p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 cursor-pointer",
                        activeMenuId === sub.id && "bg-slate-100 text-slate-900"
                      )}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {/* Action Dropdown Menu */}
                    {activeMenuId === sub.id && (
                      <div 
                        ref={menuRef}
                        className="absolute top-[70%] right-10 w-52 bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl shadow-purple-500/10 dark:shadow-purple-900/40 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                        <button className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer">
                          <Eye className="w-4 h-4 text-slate-400" />
                          View Details
                        </button>
                        <button className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer">
                          <FileEdit className="w-4 h-4 text-slate-400" />
                          Edit Subscription
                        </button>
                        <button className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer">
                          <PauseCircle className="w-4 h-4 text-slate-400" />
                          Pause Subscription
                        </button>
                        <div className="h-[1px] bg-slate-50 dark:bg-white/5 my-1 mx-2" />
                        <button className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer">
                          <XCircle className="w-4 h-4 text-slate-400" />
                          Cancel Plan
                        </button>
                        <button className="w-full px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-3 transition-colors text-left cursor-pointer">
                          <Trash2 className="w-4 h-4 text-rose-500" />
                          Delete Subscription
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {!isTransitioning && paginatedSubscriptions.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-slate-400 dark:text-slate-500 font-bold">No subscriptions found for this status.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="p-8 border-t border-slate-50 dark:border-white/5 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isTransitioning}
            className="pagination-btn"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
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
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
