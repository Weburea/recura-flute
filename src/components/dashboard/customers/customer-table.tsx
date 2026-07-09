"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  FileSpreadsheet, 
  ListFilter,
  Search,
  FileEdit,
  Mail,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

const customers = [
  { id: 1, name: "Sarah johnson", email: "sharaJ2@gmail.com", status: "Active", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png" },
  { id: 2, name: "Mark Luck", email: "sharaJ2@gmail.com", status: "Trial", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png" },
  { id: 3, name: "Lisa Goodwill", email: "sharaJ2@gmail.com", status: "Inactive", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571696/61%201.png" },
  { id: 4, name: "Carla Marlin", email: "sharaJ2@gmail.com", status: "Trial", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png" },
  { id: 5, name: "Tech Trump", email: "sharaJ2@gmail.com", status: "Active", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571692/60%201.png" },
  { id: 6, name: "Sarah johnson", email: "sharaJ2@gmail.com", status: "Trial", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png" },
  { id: 7, name: "Luck Matt", email: "sharaJ2@gmail.com", status: "Active", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/59%201.png" },
  { id: 8, name: "Carla Marlin", email: "sharaJ2@gmail.com", status: "Trial", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png" },
  { id: 9, name: "Mark Luck", email: "sharaJ2@gmail.com", status: "Active", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png" },
  { id: 10, name: "Lisa Goodwill", email: "sharaJ2@gmail.com", status: "Active", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571696/61%201.png" },
  { id: 11, name: "Sarah johnson", email: "sharaJ2@gmail.com", status: "Inactive", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png" },
  { id: 12, name: "Luck Matt", email: "sharaJ2@gmail.com", status: "Active", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/59%201.png" },
  { id: 13, name: "Lisa Goodwill", email: "sharaJ2@gmail.com", status: "Trial", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571696/61%201.png" },
  { id: 14, name: "Carla Marlin", email: "sharaJ2@gmail.com", status: "Inactive", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png" },
  { id: 15, name: "Luck Matt", email: "sharaJ2@gmail.com", status: "Trial", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/59%201.png" },
  { id: 16, name: "Lisa Goodwill", email: "sharaJ2@gmail.com", status: "Active", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571696/61%201.png" },
  { id: 17, name: "Sarah johnson", email: "sharaJ2@gmail.com", status: "Inactive", plan: "Enterprise Corp", spent: "$299.00", lastActivity: "Jan 28, 2026", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png" },
]

const statusStyles: Record<string, string> = {
  Active: "status-badge-active",
  Trial: "status-badge-trial",
  Inactive: "status-badge-canceled",
}

export function CustomerTable() {
  const [activeTab, setActiveTab ] = React.useState("All")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<number[]>([])
  const [showActions, setShowActions] = React.useState(false)
  const [activeMenuId, setActiveMenuId] = React.useState<number | null>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const itemsPerPage = 8

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
  const filteredCustomers = customers.filter((customer) => {
    const matchesTab = activeTab === "All" || customer.status === activeTab
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Pagination Logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

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
    All: customers.length,
    Active: customers.filter(c => c.status === "Active").length,
    Inactive: customers.filter(c => c.status === "Inactive").length,
    Trial: customers.filter(c => c.status === "Trial").length,
  }

  const handlePrint = () => {
    const tableHeader = ["Customer Name", "Email", "Status", "Plan", "Spent", "Last Activity"];
    const rows = filteredCustomers.map(c => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${c.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${c.email}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${c.status}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${c.plan}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${c.spent}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${c.lastActivity}</td>
      </tr>
    `).join("");

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Customer List - Print</title>
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
            <h1>Customer List - ${activeTab}</h1>
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
    const headers = ["ID", "Name", "Email", "Status", "Plan", "Spent", "Last Activity"];
    const csvContent = [
      headers.join(","),
      ...filteredCustomers.map(c => [
        c.id,
        `"${c.name}"`,
        `"${c.email}"`,
        c.status,
        `"${c.plan}"`,
        `"${c.spent}"`,
        c.lastActivity
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `recura_customers_${activeTab.toLowerCase()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-card bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-3xl p-0 overflow-hidden shadow-sm">
      {/* Header with Search and Actions */}
      <div className="p-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           <div className="dashboard-search-container">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers, subscriptions, invoice..."
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
          {["All", "Active", "Inactive", "Trial"].map((label) => {
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
                {label === "All" ? "All Customers" : label} ({count})
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
                  checked={paginatedCustomers.length > 0 && paginatedCustomers.every(c => selectedIds.includes(c.id))}
                  onChange={(e) => {
                    const pageIds = paginatedCustomers.map(c => c.id)
                    if (e.target.checked) {
                      setSelectedIds(prev => [...new Set([...prev, ...pageIds])])
                    } else {
                      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)))
                    }
                  }}
                />
              </th>
              <th className="table-header-cell">Customer Name</th>
              <th className="table-header-cell">Email</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Subscription plan</th>
              <th className="table-header-cell">Total Spent</th>
              <th className="table-header-cell">Last Activity</th>
              <th className="table-header-cell"></th>
            </tr>
          </thead>
          <tbody className={cn(
            "divide-y divide-slate-50 dark:divide-white/5 transition-opacity duration-200",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}>
            {paginatedCustomers.map((customer) => {
              const isSelected = selectedIds.includes(customer.id)
              return (
                <tr key={customer.id} className={cn(
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
                            ? prev.filter(id => id !== customer.id)
                            : [...prev, customer.id]
                        )
                      }}
                    />
                  </td>
                  <td className="table-data-cell">
                    <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10">
                      <Image 
                        src={customer.avatar} 
                        alt={customer.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white capitalize">{customer.name}</span>
                  </div>
                </td>
                <td className="table-data-cell font-bold text-slate-500 dark:text-slate-400 lowercase">{customer.email}</td>
                <td className="table-data-cell">
                  <span className={cn(
                    "status-badge",
                    statusStyles[customer.status]
                  )}>
                    {customer.status}
                  </span>
                </td>
                <td className="table-data-cell font-bold text-slate-600 dark:text-slate-300">{customer.plan}</td>
                <td className="table-data-cell font-bold text-slate-900 dark:text-white">{customer.spent}</td>
                <td className="table-data-cell font-bold text-slate-500 dark:text-slate-400">{customer.lastActivity}</td>
                <td className="table-data-cell relative">
                  <div className="flex items-center gap-3">
                    <Link 
                      href="/dashboard/settings/profile"
                      className="px-5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                    >
                      View Profile
                    </Link>
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === customer.id ? null : customer.id)}
                      className={cn(
                        "p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 cursor-pointer",
                        activeMenuId === customer.id && "bg-slate-100 text-slate-900"
                      )}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Action Dropdown Menu */}
                  {activeMenuId === customer.id && (
                    <div 
                      ref={menuRef}
                      className="absolute top-[70%] right-10 w-52 bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl shadow-purple-500/10 dark:shadow-purple-900/40 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <button className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer">
                        <FileEdit className="w-4 h-4 text-slate-400" />
                        Edit Customer
                      </button>
                      <button className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer">
                        <Mail className="w-4 h-4 text-slate-400" />
                        Send Message
                      </button>
                      <div className="h-[1px] bg-slate-50 dark:bg-white/5 my-1 mx-2" />
                      <button className="w-full px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-3 transition-colors text-left cursor-pointer">
                        <Trash2 className="w-4 h-4 text-rose-500" />
                        Delete Customer
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
        {!isTransitioning && paginatedCustomers.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-slate-400 dark:text-slate-500 font-bold">No customers found.</p>
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
