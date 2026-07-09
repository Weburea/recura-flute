"use client"

import * as React from "react"
import Image from "next/image"
import { 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  FileSpreadsheet, 
  ListFilter,
  Search,
  Receipt,
  Mail,
  Trash2,
  CreditCard,
  Building2,
  Smartphone
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ReceiptModal, Transaction } from "@/components/dashboard/shared/modals/receipt-modal"

const mockTransactions: Transaction[] = [
  { id: "A1X9-B223", customer: "Sarah Johnson", email: "sarahj@email.com", plan: "Premium", amount: "$149.00", method: { type: "Credit Card", details: "•••• 4242", icon: CreditCard }, date: "Mar 15, 2026, 2:30 PM", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png" },
  { id: "C4M7-K991", customer: "Mark Luck", email: "mark.luck@company.com", plan: "Enterprise", amount: "$899.00", method: { type: "Bank Transfer", details: "ACH •••• 9876", icon: Building2 }, date: "Mar 14, 2026, 10:15 AM", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png" },
  { id: "D8N2-P334", customer: "Lisa Goodwill", email: "lisa.g@startup.io", plan: "Basic", amount: "$49.00", method: { type: "Apple Pay", details: "Device •••• 1122", icon: Smartphone }, date: "Mar 14, 2026, 9:00 AM", status: "Failed", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571696/61%201.png" },
  { id: "X9Q1-L445", customer: "Carla Marlin", email: "carla.m@design.co", plan: "Premium", amount: "$149.00", method: { type: "Credit Card", details: "•••• 5544", icon: CreditCard }, date: "Mar 13, 2026, 4:45 PM", status: "Pending", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png" },
  { id: "B2W5-Z889", customer: "Tech Trump", email: "billing@techtrump.net", plan: "Enterprise", amount: "$899.00", method: { type: "Bank Transfer", details: "Wire Transfer", icon: Building2 }, date: "Mar 12, 2026, 11:20 AM", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571692/60%201.png" },
  { id: "M5V8-R112", customer: "Sarah Johnson", email: "sarahj@email.com", plan: "Premium", amount: "$149.00", method: { type: "Credit Card", details: "•••• 4242", icon: CreditCard }, date: "Feb 15, 2026, 2:30 PM", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png" },
  { id: "J7K4-T667", customer: "Luck Matt", email: "matthew.l@agency.co", plan: "Basic", amount: "$49.00", method: { type: "Credit Card", details: "•••• 8899", icon: CreditCard }, date: "Feb 14, 2026, 1:15 PM", status: "Failed", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/59%201.png" },
  { id: "P3H6-Y221", customer: "Carla Marlin", email: "carla.m@design.co", plan: "Premium", amount: "$149.00", method: { type: "Apple Pay", details: "Device •••• 4455", icon: Smartphone }, date: "Feb 13, 2026, 3:30 PM", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png" },
  { id: "F1G9-C553", customer: "Mark Luck", email: "mark.luck@company.com", plan: "Enterprise", amount: "$899.00", method: { type: "Bank Transfer", details: "ACH •••• 9876", icon: Building2 }, date: "Feb 12, 2026, 10:00 AM", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png" },
  { id: "E8D2-S778", customer: "Lisa Goodwill", email: "lisa.g@startup.io", plan: "Basic", amount: "$49.00", method: { type: "Credit Card", details: "•••• 3322", icon: CreditCard }, date: "Feb 11, 2026, 9:20 AM", status: "Pending", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571696/61%201.png" },
]

const statusStyles: Record<string, string> = {
  Approved: "status-badge-active",
  Pending: "status-badge-trial",
  Failed: "status-badge-canceled",
}

export function PaymentTable() {
  const [activeTab, setActiveTab ] = React.useState("All")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [showActions, setShowActions] = React.useState(false)
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null)
  
  // Modal State
  const [isReceiptModalOpen, setIsReceiptModalOpen] = React.useState(false)
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null)

  const menuRef = React.useRef<HTMLDivElement>(null)
  const itemsPerPage = 6

  // Handle click outside for dropdown
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
  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesTab = activeTab === "All" || txn.status === activeTab
    const matchesSearch = 
      txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

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
    All: mockTransactions.length,
    Approved: mockTransactions.filter(t => t.status === "Approved").length,
    Failed: mockTransactions.filter(t => t.status === "Failed").length,
    Pending: mockTransactions.filter(t => t.status === "Pending").length,
  }

  const handlePrint = () => {
    const tableHeader = ["Transaction ID", "Customer", "Plan", "Amount", "Method", "Date", "Status"];
    const rows = filteredTransactions.map(t => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">#${t.id}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div><strong>${t.customer}</strong></div>
          <div style="font-size: 11px; color: #666;">${t.email}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${t.plan}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">${t.amount}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${t.method.type}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${t.date}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${t.status}</td>
      </tr>
    `).join("");

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payments & Transactions - Print</title>
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
            <h1>Payments & Transactions - ${activeTab}</h1>
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
    const headers = ["Transaction ID", "Customer", "Email", "Plan", "Amount", "Method", "Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map(t => [
        `"${t.id}"`,
        `"${t.customer}"`,
        `"${t.email}"`,
        `"${t.plan}"`,
        `"${t.amount}"`,
        `"${t.method.type} - ${t.method.details}"`,
        `"${t.date}"`,
        t.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `recura_payments_${activeTab.toLowerCase()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsReceiptModalOpen(true)
    setActiveMenuId(null)
  }

  return (
    <>
    <div className="dashboard-card bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-[24px] p-0 overflow-hidden shadow-sm">
      {/* Header Container */}
      <div className="p-8 pb-4">
        {/* Search and Actions Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="dashboard-search-container">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, email, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dashboard-search-input"
            />
          </div>
          
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
          {["All", "Approved", "Pending", "Failed"].map((label) => {
            const isActive = activeTab === label
            const count = counts[label as keyof typeof counts]
            return (
              <button
                key={label}
                onClick={() => handleTabChange(label)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  isActive 
                    ? "bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 shadow-sm shadow-purple-100 dark:shadow-none" 
                    : "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {label} ({count})
              </button>
            )
          })}
        </div>
      </div>

        <div className="table-container border-t border-slate-50 dark:border-white/5">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header-cell">
                  <input 
                    type="checkbox" 
                    className="checkbox-custom"
                    checked={paginatedTransactions.length > 0 && paginatedTransactions.every(t => selectedIds.includes(t.id))}
                    onChange={(e) => {
                      const pageIds = paginatedTransactions.map(t => t.id)
                      if (e.target.checked) {
                        setSelectedIds(prev => [...new Set([...prev, ...pageIds])])
                      } else {
                        setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)))
                      }
                    }}
                  />
                </th>
                <th className="table-header-cell min-w-[120px]">Transaction ID</th>
                <th className="table-header-cell min-w-[200px]">Customer</th>
                <th className="table-header-cell">Plan</th>
                <th className="table-header-cell">Amount</th>
                <th className="table-header-cell min-w-[160px]">Method</th>
                <th className="table-header-cell min-w-[160px]">Date</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell w-16 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={cn(
              "divide-y divide-slate-50 dark:divide-white/5 transition-opacity duration-200",
              isTransitioning ? "opacity-0" : "opacity-100"
            )}>
              {paginatedTransactions.map((transaction) => {
                const isSelected = selectedIds.includes(transaction.id)
                return (
                  <tr key={transaction.id} className={cn(
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
                              ? prev.filter(id => id !== transaction.id)
                              : [...prev, transaction.id]
                          )
                        }}
                      />
                    </td>
                    <td className="table-data-cell">
                      <span className="font-bold text-slate-600 dark:text-slate-300 text-xs tracking-wider">#{transaction.id}</span>
                    </td>
                    <td className="table-data-cell">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10">
                          <Image 
                            src={transaction.avatar} 
                            alt={transaction.customer} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{transaction.customer}</p>
                          <p className="font-bold text-slate-400 dark:text-slate-500 text-[11px] lowercase">{transaction.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-data-cell font-bold text-slate-600 dark:text-slate-300">{transaction.plan}</td>
                    <td className="table-data-cell font-extrabold text-slate-900 dark:text-white">{transaction.amount}</td>
                    <td className="table-data-cell">
                      <div className="flex items-center gap-2">
                        {transaction.method.icon && (
                          <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center shrink-0">
                            <transaction.method.icon className="w-4 h-4 text-slate-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{transaction.method.type}</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{transaction.method.details}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-data-cell">
                      <span className="font-bold text-slate-500 dark:text-slate-400 text-xs">{transaction.date}</span>
                    </td>
                    <td className="table-data-cell">
                      <span className={cn(
                        "status-badge",
                        statusStyles[transaction.status]
                      )}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="table-data-cell relative text-right">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === transaction.id ? null : transaction.id)}
                        className={cn(
                          "p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 cursor-pointer ml-auto block",
                          activeMenuId === transaction.id && "bg-slate-100 text-slate-900"
                        )}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {/* Action Dropdown Menu */}
                      {activeMenuId === transaction.id && (
                        <div 
                          ref={menuRef}
                          className="absolute top-[70%] right-6 w-48 bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl shadow-purple-500/10 dark:shadow-purple-900/40 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left"
                        >
                          <button 
                            onClick={() => openReceipt(transaction)}
                            className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                          >
                            <Receipt className="w-4 h-4 text-slate-400" />
                            View Receipt
                          </button>
                          <button className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer">
                            <Mail className="w-4 h-4 text-slate-400" />
                            Resend Email
                          </button>
                          <div className="h-[1px] bg-slate-50 dark:bg-white/5 my-1 mx-2" />
                          <button className="w-full px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-3 transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4 text-rose-500" />
                            Delete Record
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
          {!isTransitioning && paginatedTransactions.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-400 dark:text-slate-500 font-bold">No transactions found match your criteria.</p>
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

      {/* Render Receipt Modal */}
      <ReceiptModal 
        isOpen={isReceiptModalOpen} 
        onClose={() => setIsReceiptModalOpen(false)} 
        transaction={selectedTransaction} 
      />
    </>
  )
}
