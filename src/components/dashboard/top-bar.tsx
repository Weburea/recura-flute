"use client"

import * as React from "react"
import { Search, Bell, Settings, Menu, User, Shield, HelpCircle, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  isRead: boolean
}

const notifications: Notification[] = [
  { id: "1", title: "New Subscriber", message: "Sarah Johnson subscribed to Premium Plan", time: "5 min ago", isRead: false },
  { id: "2", title: "Payment Received", message: "Received $299.00 from Enterprise Corp", time: "23 min ago", isRead: false },
  { id: "3", title: "System Update", message: "Recura v2.4.0 is now live!", time: "1 hour ago", isRead: true }
]

const settingsItems = [
  { icon: User, label: "Profile Settings", href: "/dashboard/settings/profile", text: "Manage your account" },
  { icon: Shield, label: "Security", href: "/dashboard/settings", text: "Password and 2FA" },
  { icon: HelpCircle, label: "Help Center", href: "/dashboard/help", text: "Tutorials and support" },
  { icon: LogOut, label: "Sign Out", href: "/sign-in", text: "Exit dashboard", color: "text-rose-500" }
]

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const [isNotifOpen, setIsNotifOpen] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)

  const notifRef = React.useRef<HTMLDivElement>(null)
  const settingsRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false)
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="h-20 bg-white dark:bg-[#0D0518] border-b border-gray-100 dark:border-white/10 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 gap-4 transition-colors">
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400" />
          <input
            type="text"
            placeholder="Search customers, subscriptions, invoice..."
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:focus:border-purple-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setIsNotifOpen(!isNotifOpen)
              setIsSettingsOpen(false)
            }}
            className={cn(
              "relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer",
              isNotifOpen && "bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 ring-2 ring-purple-100 dark:ring-purple-500/30"
            )}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0D0518]"></span>
          </button>

          {isNotifOpen && (
            <div className="absolute -right-14 sm:right-0 mt-3 w-[calc(100vw-32px)] sm:w-80 bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-3xl shadow-2xl dark:shadow-purple-900/20 z-50 py-4 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 sm:px-6 pb-3 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
                <h4 className="dashboard-title text-base dark:text-white">Notifications</h4>
                <button className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">Mark all as read</button>
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.map((notif) => (
                  <button 
                    key={notif.id}
                    className="w-full px-5 sm:px-6 py-4 flex flex-col gap-1 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{notif.title}</span>
                        {!notif.isRead && <span className="w-2 h-2 bg-purple-600 dark:bg-purple-500 rounded-full shrink-0"></span>}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0 ml-2">{notif.time}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2">{notif.message}</p>
                  </button>
                ))}
              </div>
              <div className="px-5 sm:px-6 pt-3 mt-2 border-t border-slate-50 dark:border-white/5">
                <button className="w-full py-2 bg-slate-50 dark:bg-white/5 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors uppercase tracking-wider cursor-pointer">
                  View full inbox
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings Dropdown */}
        <div className="relative" ref={settingsRef}>
          <button 
            onClick={() => {
              setIsSettingsOpen(!isSettingsOpen)
              setIsNotifOpen(false)
            }}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer",
              isSettingsOpen && "bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 ring-2 ring-purple-100 dark:ring-purple-500/30"
            )}
          >
            <Settings className="w-5 h-5" />
          </button>

          {isSettingsOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-3xl shadow-2xl dark:shadow-purple-900/20 z-50 py-3 overflow-hidden animate-in 
            fade-in slide-in-from-top-2 duration-200 cursor-pointer">
              <div className="flex flex-col gap-1 px-3">
                {settingsItems.map((item, i) => (
                  <Link 
                    key={i}
                    href={item.href}
                    onClick={() => setIsSettingsOpen(false)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group text-left cursor-pointer"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center transition-colors group-hover:bg-white dark:group-hover:bg-white/10 border border-transparent group-hover:border-slate-100 dark:group-hover:border-white/10 shadow-sm",
                      item.color && "bg-rose-50 dark:bg-rose-500/10 group-hover:bg-rose-100/50 dark:group-hover:bg-rose-500/20 cursor-pointer"
                    )}>
                      <item.icon className={cn("w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors", item.color)} />
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("text-sm font-extrabold text-slate-900 dark:text-white", item.color)}>{item.label}</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{item.text}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
