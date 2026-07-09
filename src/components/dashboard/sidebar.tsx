"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  FileText,
  Package,
  BookOpen,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Subscriptions", href: "/dashboard/subscriptions" },
  { icon: Users, label: "Customers", href: "/dashboard/customers" },
  { icon: CreditCard, label: "Billing & Invoice", href: "/dashboard/billing" },
  { icon: Package, label: "Payments", href: "/dashboard/payments" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: BookOpen, label: "Documentation", href: "/dashboard/documentation" },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <aside className={cn(
      "w-[250px] h-screen bg-white dark:bg-[#0D0518] border-r border-gray-100 dark:border-white/10 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 transition-colors",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center">
            {mounted ? (
              <Image 
                src={resolvedTheme === 'dark' ? "https://res.cloudinary.com/weburea/image/upload/v1783571835/logo.svg" : "https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg"} 
                alt="Recura Logo" 
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-24 h-6 bg-slate-100 dark:bg-white/10 rounded-lg animate-pulse" />
            )}
          </div>
        </Link>
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        {mounted ? (
          navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group",
                  isActive 
                    ? "bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 shadow-sm shadow-purple-100 dark:shadow-purple-900/20" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                )} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </Link>
            )
          })
        ) : (
          <div className="space-y-4 px-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-white/5" />
                <div className={cn(
                  "h-3 bg-slate-100 dark:bg-white/5 rounded-full",
                  i % 2 === 0 ? "w-24" : "w-32"
                )} />
              </div>
            ))}
          </div>
        )}
      </nav>

      <Link 
        href="/dashboard/settings/profile"
        onClick={() => setIsOpen(false)}
        className="block p-6 mt-auto border-t border-gray-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 hover:bg-purple-50/50 dark:hover:bg-purple-500/10 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-4 p-2 rounded-2xl group-hover:bg-white dark:group-hover:bg-white/5 transition-colors duration-300">
          {mounted ? (
            <>
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 overflow-hidden shrink-0 shadow-sm group-hover:shadow-md dark:group-hover:shadow-purple-900/20 transition-shadow duration-300">
                <div className="w-full h-full flex items-center justify-center bg-purple-600 dark:bg-purple-500/80 text-white font-bold text-sm">
                  AU
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">Admin User</p>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 truncate tracking-tight">admin@recura.com</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 w-full animate-pulse">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="w-20 h-2 bg-slate-100 dark:bg-white/5 rounded-full" />
                <div className="w-32 h-2 bg-slate-100 dark:bg-white/5 rounded-full opacity-50" />
              </div>
            </div>
          )}
        </div>
      </Link>
    </aside>
  )
}
