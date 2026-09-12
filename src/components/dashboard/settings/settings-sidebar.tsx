"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  User,
  Building2, 
  Palette, 
  CreditCard, 
  Users, 
  Bell
} from "lucide-react"
import { cn } from "@/lib/utils"

const settingsNav = [
  { icon: User, label: "Profile", href: "/dashboard/settings/profile", matchExact: false },
  { icon: Building2, label: "Workspace", href: "/dashboard/settings/workspace", matchExact: true },
  { icon: Palette, label: "Branding", href: "/dashboard/settings/branding", matchExact: true },
  { icon: CreditCard, label: "Payment Settings", href: "/dashboard/settings/payments", matchExact: true },
  { icon: Users, label: "Team Members", href: "/dashboard/settings/team", matchExact: true },
  { icon: Bell, label: "Notifications", href: "/dashboard/settings/notifications", matchExact: true },
]

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 px-2 tracking-tight">Settings</h2>
      
      <nav className="space-y-1">
        {settingsNav.map((item) => {
          const isActive = item.href === "/dashboard/settings/profile"
            ? (pathname === "/dashboard/settings/profile" || pathname === "/dashboard/settings")
            : pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group font-bold text-[15px] tracking-tight",
                isActive 
                  ? "bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-[22px] h-[22px]",
              )} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
