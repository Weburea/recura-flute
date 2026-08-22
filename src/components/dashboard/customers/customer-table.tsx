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
  FileEdit,
  Mail,
  Trash2,
  PlayCircle,
  PauseCircle,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"

const MOCK_CUSTOMERS = [
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
];

const DEFAULT_STATUS_STYLES: Record<string, string> = {
  Active: "status-badge-active",
  Trial: "status-badge-trial",
  Inactive: "status-badge-canceled",
  Paused: "status-badge-paused",
  Canceled: "status-badge-canceled",
};

export interface CustomerTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customers?: any[];
  entityLabel?: string;
  col3Header?: string;
  col4Header?: string;
  tabs?: string[];
  statusStyles?: Record<string, string>;
  isLoading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit?: (customer: any) => void;
  onDelete?: (id: string | number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewProfile?: (customer: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onStatusChange?: (customer: any, newStatus: string) => void;
  refreshData?: () => void;
}

export function CustomerTable({
  customers,
  entityLabel = "Customers",
  col3Header = "Subscription plan",
  col4Header = "Total Spent",
  tabs = ["All", "Active", "Inactive", "Trial"],
  statusStyles = DEFAULT_STATUS_STYLES,
  isLoading = false,
  onEdit,
  onDelete,
  onViewProfile,
  onStatusChange,
  refreshData,
}: CustomerTableProps) {
  const [activeTab, setActiveTab ] = React.useState("All")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeSort, setActiveSort] = React.useState<string>("date-desc")
  const [isSortOpen, setIsSortOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<(number | string)[]>([])
  const [showActions, setShowActions] = React.useState(false)
  const [activeMenuId, setActiveMenuId] = React.useState<number | string | null>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const sortRef = React.useRef<HTMLDivElement>(null)
  const itemsPerPage = 8

  const [isBulkLoading, setIsBulkLoading] = React.useState(false)

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return
    setIsBulkLoading(true)
    try {
      const res = await fetch('/api/v1/customers/bulk', {
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

  // Handle click outside for dropdowns
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null)
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Map incoming customer objects (API schema or mock schema) to common structure
  const items = React.useMemo(() => {
    const rawList = customers || MOCK_CUSTOMERS;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawList.map((c: any) => ({
      id: c.id,
      name: c.name || "N/A",
      email: c.email || "N/A",
      status: c.status || "Active",
      plan: c.plan || "N/A",
      spent: typeof c.spent === 'number' 
        ? `$${(c.spent / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        : (c.spent || "$0.00"),
      lastActivity: c.lastActivity || (c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'),
      avatar: c.avatar || c.avatarUrl || "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png",
      raw: c,
    }));
  }, [customers]);

  // Filtering & Sorting Logic
  const filteredCustomers = React.useMemo(() => {
    const list = items.filter((customer) => {
      const matchesTab = activeTab === "All" || customer.status === activeTab
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    });

    // Sorting Logic
    list.sort((a, b) => {
      if (activeSort === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (activeSort === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      if (activeSort === "date-desc" || activeSort === "date-asc") {
        const dateA = new Date(a.raw.createdAt || a.raw.updatedAt || 0).getTime();
        const dateB = new Date(b.raw.createdAt || b.raw.updatedAt || 0).getTime();
        return activeSort === "date-desc" ? dateB - dateA : dateA - dateB;
      }
      if (activeSort === "value-desc" || activeSort === "value-asc") {
        const valA = Number(a.raw.spent) || 0;
        const valB = Number(b.raw.spent) || 0;
        return activeSort === "value-desc" ? valB - valA : valA - valB;
      }
      return 0;
    });

    return list;
  }, [items, activeTab, searchQuery, activeSort]);

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


  const handlePrint = () => {
    const tableHeader = ["Customer Name", "Email", "Status", col3Header, col4Header, "Last Activity"];
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
    link.setAttribute("download", `recura_${entityLabel.toLowerCase().replace(/\s+/g, "_")}_${activeTab.toLowerCase()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      {/* Header with Search and Actions */}
      <div className="p-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
            <div className="dashboard-search-container w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${entityLabel.toLowerCase()}, subscriptions, invoice...`}
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
            const selectedCustomers = items.filter(c => selectedIds.includes(c.id));
            const hasActive = selectedCustomers.some(c => c.status === 'Active' || c.status === 'Trial');
            const hasInactive = selectedCustomers.some(c => c.status === 'Inactive');
            return (
              <div className="flex items-center gap-2 md:gap-3 flex-wrap animate-in fade-in slide-in-from-right-4 duration-200">
                <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-white/5">
                  {selectedIds.length} selected
                </span>
                {hasInactive && (
                  <button
                    disabled={isBulkLoading}
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    Activate Selected
                  </button>
                )}
                {hasActive && (
                  <button
                    disabled={isBulkLoading}
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <PauseCircle className="w-3.5 h-3.5" />
                    Deactivate Selected
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
          )}
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((label) => {
            const isActive = activeTab === label
            const count = label === "All"
              ? items.length
              : items.filter(c => c.status === label).length
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
                {label === "All" ? `All ${entityLabel}` : label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      <div className={cn(
        "table-container border-t border-slate-50 dark:border-white/5",
        activeMenuId !== null ? "!overflow-visible" : ""
      )}>
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
              <th className="table-header-cell">{col3Header}</th>
              <th className="table-header-cell">{col4Header}</th>
              <th className="table-header-cell">Last Activity</th>
              <th className="table-header-cell"></th>
            </tr>
          </thead>
          <tbody className={cn(
            "divide-y divide-slate-50 dark:divide-white/5 transition-opacity duration-200",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-20 text-center text-slate-400 font-bold">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
                    Loading customers...
                  </div>
                </td>
              </tr>
            ) : paginatedCustomers.map((customer) => {
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
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10 flex-shrink-0 flex items-center justify-center">
                      {customer.avatar && 
                       !customer.avatar.includes('24%201.png') && 
                       !customer.avatar.includes('11%201.png') && 
                       !customer.avatar.includes('61%201.png') && 
                       !customer.avatar.includes('9%201.png') && 
                       !customer.avatar.includes('60%201.png') && 
                       !customer.avatar.includes('59%201.png') ? (
                        <Image 
                          src={customer.avatar} 
                          alt={customer.name} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-xs font-extrabold uppercase">
                          {customer.name.charAt(0)}
                        </div>
                      )}
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
                <td className="table-data-cell font-bold text-slate-900 dark:text-white whitespace-nowrap">{customer.spent}</td>
                <td className="table-data-cell font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">{customer.lastActivity}</td>
                <td className="table-data-cell relative">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onViewProfile?.(customer.raw || customer)}
                      className="px-5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer whitespace-nowrap"
                    >
                      View Profile
                    </button>
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
                      className="absolute right-0 top-full mt-1 z-[100] w-52 bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl py-2 hidden md:block animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <button 
                        onClick={() => {
                          setActiveMenuId(null);
                          onEdit?.(customer.raw || customer);
                        }}
                        className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer"
                      >
                        <FileEdit className="w-4 h-4 text-slate-400" />
                        Edit Customer
                      </button>
                      <button 
                        onClick={() => {
                          setActiveMenuId(null);
                          onStatusChange?.(customer.raw || customer, customer.status === "Inactive" ? "Active" : "Inactive");
                        }}
                        className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer"
                      >
                        {customer.status === "Inactive" ? (
                          <>
                            <PlayCircle className="w-4 h-4 text-slate-400" />
                            Activate Customer
                          </>
                        ) : (
                          <>
                            <PauseCircle className="w-4 h-4 text-slate-400" />
                            Deactivate Customer
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => setActiveMenuId(null)}
                        className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer"
                      >
                        <Mail className="w-4 h-4 text-slate-400" />
                        Send Message
                      </button>
                      <div className="h-[1px] bg-slate-50 dark:bg-white/5 my-1 mx-2" />
                      <button 
                        onClick={() => {
                          setActiveMenuId(null);
                          onDelete?.(customer.id);
                        }}
                        className="w-full px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-3 transition-colors text-left cursor-pointer"
                      >
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
            <p className="text-slate-400 dark:text-slate-500 font-bold">No {entityLabel.toLowerCase()} found.</p>
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

      {/* Mobile Drawer (Bottom Sheet) */}
      {activeMenuId !== null && (() => {
        const activeCustomer = paginatedCustomers.find(c => c.id === activeMenuId);
        if (!activeCustomer) return null;
        return (
          <div className="md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[140] animate-in fade-in duration-200"
              onClick={() => setActiveMenuId(null)}
            />
            {/* Drawer */}
            <div className="fixed inset-x-0 bottom-0 bg-white dark:bg-[#150a2e] rounded-t-[32px] border-t border-slate-100 dark:border-white/10 p-6 pb-8 z-[150] animate-in slide-in-from-bottom duration-300 shadow-2xl">
              {/* Drawer handle */}
              <div className="w-12 h-1 bg-slate-200 dark:bg-white/20 rounded-full mx-auto mb-6" />
              
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10">
                  <Image 
                    src={activeCustomer.avatar} 
                    alt={activeCustomer.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white capitalize">{activeCustomer.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 lowercase">{activeCustomer.email}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-1">
                <button 
                  onClick={() => {
                    setActiveMenuId(null);
                    onEdit?.(activeCustomer.raw || activeCustomer);
                  }}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 flex items-center gap-3 transition-colors text-left"
                >
                  <FileEdit className="w-5 h-5 text-slate-400" />
                  Edit Customer Details
                </button>
                <button 
                  onClick={() => {
                    setActiveMenuId(null);
                    onStatusChange?.(activeCustomer.raw || activeCustomer, activeCustomer.status === "Inactive" ? "Active" : "Inactive");
                  }}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 flex items-center gap-3 transition-colors text-left"
                >
                  {activeCustomer.status === "Inactive" ? (
                    <>
                      <PlayCircle className="w-5 h-5 text-slate-400" />
                      Activate Account
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-5 h-5 text-slate-400" />
                      Deactivate Account
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setActiveMenuId(null)}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 flex items-center gap-3 transition-colors text-left"
                >
                  <Mail className="w-5 h-5 text-slate-400" />
                  Send Email Notification
                </button>
                <div className="h-[1px] bg-slate-100 dark:bg-white/5 my-2" />
                <button 
                  onClick={() => {
                    setActiveMenuId(null);
                    onDelete?.(activeCustomer.id);
                  }}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 active:bg-rose-100 dark:active:bg-rose-500/20 flex items-center gap-3 transition-colors text-left"
                >
                  <Trash2 className="w-5 h-5 text-rose-500" />
                  Delete Customer
                </button>
              </div>

              <button 
                onClick={() => setActiveMenuId(null)}
                className="w-full mt-4 py-3.5 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 active:bg-slate-200 dark:active:bg-white/15 transition-all text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  )
}
