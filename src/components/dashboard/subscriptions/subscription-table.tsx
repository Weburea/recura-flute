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
  PlayCircle,
  Trash2,
  Printer,
  FileSpreadsheet,
  ListFilter,
  Search,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"

const MOCK_SUBSCRIPTIONS = [
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
];

const DEFAULT_STATUS_STYLES: Record<string, string> = {
  Active: "status-badge-active",
  Trial: "status-badge-trial",
  Paused: "status-badge-paused",
  Canceled: "status-badge-canceled",
};

export interface SubscriptionTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptions?: any[];
  tableTitle?: string;
  planColHeader?: string;
  billingColHeader?: string;
  tabs?: string[];
  entityLabel?: string;
  statusStyles?: Record<string, string>;
  isLoading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewDetails?: (sub: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit?: (sub: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPause?: (sub: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCancel?: (sub: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDelete?: (sub: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onActivate?: (sub: any) => void;
  refreshData?: () => void;
}

export function SubscriptionTable({
  subscriptions,
  tableTitle = "Subscription List",
  planColHeader = "Plan",
  billingColHeader = "Billing Cycle",
  tabs = ["All", "Active", "Paused", "Canceled"],
  entityLabel = "subscriptions",
  statusStyles = DEFAULT_STATUS_STYLES,
  isLoading = false,
  onViewDetails,
  onEdit,
  onPause,
  onCancel,
  onDelete,
  onActivate,
  refreshData,
}: SubscriptionTableProps) {
  const [activeTab, setActiveTab ] = React.useState("All")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeSort, setActiveSort] = React.useState<string>("date-desc")
  const [isSortOpen, setIsSortOpen] = React.useState(false)
  const [activeMenuId, setActiveMenuId] = React.useState<number | string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedIds, setSelectedIds] = React.useState<(number | string)[]>([])
  const [showActions, setShowActions] = React.useState(false)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const sortRef = React.useRef<HTMLDivElement>(null)
  const itemsPerPage = 8

  const [isBulkLoading, setIsBulkLoading] = React.useState(false)

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return
    setIsBulkLoading(true)
    try {
      const res = await fetch('/api/v1/subscriptions/bulk', {
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

  // Handle click outside to close dropdowns
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

  // Map incoming subscription objects (API schema or mock schema) to common structure
  const items = React.useMemo(() => {
    const rawList = subscriptions || MOCK_SUBSCRIPTIONS;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawList.map((s: any) => {
      const name = s.customer?.name || s.name || "N/A";
      const avatar = s.customer?.avatarUrl || s.avatar || "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png";
      const plan = s.plan || s.planId || "N/A";

      let billingCycle = s.billingCycle;
      if (typeof s.price === 'number') {
        const intervalText = s.interval === 'one-time' ? 'one-time' : `${s.interval || 'month'}`;
        billingCycle = `$${(s.price / 100).toFixed(2)}/ ${intervalText}`;
      } else {
        billingCycle = s.billingCycle || "$0.00";
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formatDate = (dateVal: any) => {
        if (!dateVal) return "N/A";
        return new Date(dateVal).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      };

      const lastPayment = s.lastPayment || formatDate(s.lastPaymentAt);
      const nextBillingDate = s.nextBillingDate || formatDate(s.nextBillingAt);

      return {
        id: s.id,
        name,
        avatar,
        plan,
        status: s.status || "Active",
        billingCycle,
        lastPayment,
        nextBillingDate,
        raw: s,
      };
    });
  }, [subscriptions]);

  // Filtering & Sorting Logic
  const filteredSubscriptions = React.useMemo(() => {
    let list = activeTab === "All" 
      ? items 
      : items.filter(sub => sub.status === activeTab);
      
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(sub => 
        sub.name.toLowerCase().includes(q) || 
        sub.plan.toLowerCase().includes(q) ||
        sub.id.toString().toLowerCase().includes(q)
      );
    }

    // Sorting Logic
    list.sort((a, b) => {
      if (activeSort === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (activeSort === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      if (activeSort === "date-desc" || activeSort === "date-asc") {
        const dateA = new Date(a.raw.createdAt || a.raw.lastPaymentAt || 0).getTime();
        const dateB = new Date(b.raw.createdAt || b.raw.lastPaymentAt || 0).getTime();
        return activeSort === "date-desc" ? dateB - dateA : dateA - dateB;
      }
      if (activeSort === "value-desc" || activeSort === "value-asc") {
        const valA = Number(a.raw.price) || 0;
        const valB = Number(b.raw.price) || 0;
        return activeSort === "value-desc" ? valB - valA : valA - valB;
      }
      return 0;
    });

    return list;
  }, [items, activeTab, searchQuery, activeSort]);

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

  const handlePrint = () => {
    const tableHeader = ["Customer", planColHeader, "Status", billingColHeader, "Last Payment", "Next Billing Date"];
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
    link.setAttribute("download", `recura_${entityLabel.replace(/\s+/g, "_")}_${activeTab.toLowerCase()}.csv`);
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
      "dashboard-card bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-[24px] p-0 shadow-sm mt-8",
      (activeMenuId !== null || isSortOpen) ? "!overflow-visible" : "overflow-hidden"
    )}>
      {/* Header Container */}
      <div className="p-8 pb-4">
        {/* Table Title and Actions row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
            <div className="dashboard-search-container w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${tableTitle.toLowerCase()}...`}
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
            const selectedSubs = items.filter(s => selectedIds.includes(s.id));
            const hasActive = selectedSubs.some(s => s.status === 'Active' || s.status === 'Trial');
            const hasInactive = selectedSubs.some(s => s.status === 'Paused' || s.status === 'Canceled');
            return (
              <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end animate-in fade-in slide-in-from-right-4 duration-200">
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
                  <>
                    <button
                      disabled={isBulkLoading}
                      onClick={() => handleBulkAction('pause')}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <PauseCircle className="w-3.5 h-3.5" />
                      Pause Selected
                    </button>
                    <button
                      disabled={isBulkLoading}
                      onClick={() => handleBulkAction('cancel')}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel Selected
                    </button>
                  </>
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
          )}
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((label) => {
            const isActive = activeTab === label
            const count = label === "All"
              ? items.length
              : items.filter(s => s.status === label).length
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
              <th className="table-header-cell">{planColHeader}</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">{billingColHeader}</th>
              <th className="table-header-cell">Last Payment</th>
              <th className="table-header-cell">Next Billing Date</th>
              <th className="table-header-cell"></th>
            </tr>
          </thead>
          <tbody className={cn("divide-y divide-slate-50 dark:divide-white/5 transition-opacity duration-200", isTransitioning ? "opacity-0" : "opacity-100")}>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-20 text-center text-slate-400 font-bold">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
                    Loading contracts...
                  </div>
                </td>
              </tr>
            ) : paginatedSubscriptions.map((sub) => {
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
                        className="absolute right-0 top-full mt-1 z-[100] w-52 bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl py-2 hidden md:block animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                        <button 
                          onClick={() => {
                            setActiveMenuId(null);
                            onViewDetails?.(sub.raw || sub);
                          }}
                          className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-slate-400" />
                          View Details
                        </button>
                        <button 
                          onClick={() => {
                            setActiveMenuId(null);
                            onEdit?.(sub.raw || sub);
                          }}
                          className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer"
                        >
                          <FileEdit className="w-4 h-4 text-slate-400" />
                          Edit Subscription
                        </button>
                        {sub.status === "Active" ? (
                          <button 
                            onClick={() => {
                              setActiveMenuId(null);
                              onPause?.(sub.raw || sub);
                            }}
                            className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer"
                          >
                            <PauseCircle className="w-4 h-4 text-slate-400" />
                            Pause Subscription
                          </button>
                        ) : (sub.status === "Paused" || sub.status === "Canceled") && (
                          <button 
                            onClick={() => {
                              setActiveMenuId(null);
                              onActivate?.(sub.raw || sub);
                            }}
                            className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer"
                          >
                            <PlayCircle className="w-4 h-4 text-slate-400" />
                            Activate Plan
                          </button>
                        )}
                        <div className="h-[1px] bg-slate-50 dark:bg-white/5 my-1 mx-2" />
                        {sub.status !== "Canceled" && (
                          <button 
                            onClick={() => {
                              setActiveMenuId(null);
                              onCancel?.(sub.raw || sub);
                            }}
                            className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors text-left cursor-pointer"
                          >
                            <XCircle className="w-4 h-4 text-slate-400" />
                            Cancel Plan
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setActiveMenuId(null);
                            onDelete?.(sub.raw || sub);
                          }}
                          className="w-full px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-3 transition-colors text-left cursor-pointer"
                        >
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
            <p className="text-slate-400 dark:text-slate-500 font-bold">No {entityLabel} found for this status.</p>
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
        const activeSub = paginatedSubscriptions.find(s => s.id === activeMenuId);
        if (!activeSub) return null;
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
                    src={activeSub.avatar} 
                    alt={activeSub.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white capitalize">{activeSub.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 lowercase">{activeSub.plan}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-1">
                <button 
                  onClick={() => {
                    setActiveMenuId(null);
                    onViewDetails?.(activeSub.raw || activeSub);
                  }}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 flex items-center gap-3 transition-colors text-left"
                >
                  <Eye className="w-5 h-5 text-slate-400" />
                  View Subscription Details
                </button>
                <button 
                  onClick={() => {
                    setActiveMenuId(null);
                    onEdit?.(activeSub.raw || activeSub);
                  }}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 flex items-center gap-3 transition-colors text-left"
                >
                  <FileEdit className="w-5 h-5 text-slate-400" />
                  Edit Subscription Plan
                </button>
                {activeSub.status === "Active" ? (
                  <button 
                    onClick={() => {
                      setActiveMenuId(null);
                      onPause?.(activeSub.raw || activeSub);
                    }}
                    className="w-full px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 flex items-center gap-3 transition-colors text-left"
                  >
                    <PauseCircle className="w-5 h-5 text-slate-400" />
                    Pause Subscription
                  </button>
                ) : (activeSub.status === "Paused" || activeSub.status === "Canceled") && (
                  <button 
                    onClick={() => {
                      setActiveMenuId(null);
                      onActivate?.(activeSub.raw || activeSub);
                    }}
                    className="w-full px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 flex items-center gap-3 transition-colors text-left"
                  >
                    <PlayCircle className="w-5 h-5 text-slate-400" />
                    Activate Plan
                  </button>
                )}
                <div className="h-[1px] bg-slate-100 dark:bg-white/5 my-2" />
                {activeSub.status !== "Canceled" && (
                  <button 
                    onClick={() => {
                      setActiveMenuId(null);
                      onCancel?.(activeSub.raw || activeSub);
                    }}
                    className="w-full px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 flex items-center gap-3 transition-colors text-left"
                  >
                    <XCircle className="w-5 h-5 text-slate-400" />
                    Cancel Plan
                  </button>
                )}
                <button 
                  onClick={() => {
                    setActiveMenuId(null);
                    onDelete?.(activeSub.raw || activeSub);
                  }}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 active:bg-rose-100 dark:active:bg-rose-500/20 flex items-center gap-3 transition-colors text-left"
                >
                  <Trash2 className="w-5 h-5 text-rose-500" />
                  Delete Subscription
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
