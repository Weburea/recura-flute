"use client"

import * as React from "react"
import { X, Shield, CreditCard, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface ViewProfileModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customer: any
}

export function ViewProfileModal({ isOpen, onClose, customer }: ViewProfileModalProps) {
  if (!isOpen || !customer) return null

  // Format spent cents to dollar string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatSpent = (val: any) => {
    if (typeof val === 'number') {
      return `$${(val / 100).toFixed(2)}`
    }
    return val || "$0.00"
  }

  // Format activity date
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (val: any) => {
    if (!val) return "N/A"
    return new Date(val).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const avatarUrl = customer.avatar || customer.avatarUrl || "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#150a2e] rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-white/10 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#150a2e]/50">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Client Profile</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="p-6 flex flex-col items-center">
          {/* Avatar Area */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10 p-1 border-2 border-purple-500/20 mb-4 flex items-center justify-center">
            {avatarUrl && 
             !avatarUrl.includes('24%201.png') && 
             !avatarUrl.includes('11%201.png') && 
             !avatarUrl.includes('61%201.png') && 
             !avatarUrl.includes('9%201.png') && 
             !avatarUrl.includes('60%201.png') && 
             !avatarUrl.includes('59%201.png') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={avatarUrl} 
                alt={customer.name} 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-3xl font-extrabold uppercase rounded-full">
                {customer.name.charAt(0)}
              </div>
            )}
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white capitalize text-center mb-1">{customer.name}</h2>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-6">{customer.email}</p>

          {/* Details Grid */}
          <div className="w-full space-y-4 bg-slate-50/50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100/50 dark:border-white/5">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" /> Status
              </span>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                customer.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                customer.status === "Trial" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
                "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
              )}>
                {customer.status}
              </span>
            </div>

            {/* Plan / Campaign */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-500" /> Plan / Campaign
              </span>
              <span className="text-xs font-black text-slate-800 dark:text-white capitalize">
                {customer.plan || "N/A"}
              </span>
            </div>

            {/* Total Spent */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-500" /> Revenue / Spent
              </span>
              <span className="text-sm font-black text-[#8400DB] dark:text-purple-400">
                {formatSpent(customer.spent)}
              </span>
            </div>

            {/* Date Created */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" /> Client Since
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                {formatDate(customer.createdAt || customer.lastActivity)}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-3.5 bg-slate-900 hover:bg-black text-white font-extrabold text-sm rounded-xl transition-colors active:scale-[0.98] cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  )
}
