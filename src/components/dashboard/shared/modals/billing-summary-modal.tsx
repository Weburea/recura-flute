"use client"

import * as React from "react"
import NextImage from "next/image"
import { X, Download, Loader2, CheckCircle2 } from "lucide-react"

interface BillingSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceData: {
    id: string
    date: string
  }
  companyDetails: {
    name: string
    industry: string
    members: string
    phone: string
    website: string
    address: string
  }
  activeProvider: string
  isAutobillingEnabled: boolean
  prorationRange: number
  twoFactorEnabled: boolean
  activeSessionsCount: number
  onDownload?: () => void
  isDownloading?: boolean
  downloadProgress?: number
}

export function BillingSummaryModal({
  isOpen,
  onClose,
  invoiceData,
  companyDetails,
  activeProvider,
  isAutobillingEnabled,
  prorationRange,
  twoFactorEnabled,
  activeSessionsCount,
  onDownload,
  isDownloading,
  downloadProgress = 0
}: BillingSummaryModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-start sm:items-center justify-center p-4 sm:p-8 overflow-y-auto custom-scrollbar print:p-0 print:block bg-slate-900/60 backdrop-blur-md">
      <div 
        className="absolute inset-0 print:hidden" 
        onClick={onClose} 
      />
      
      <div id="invoice-content" className="relative w-full max-w-2xl bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:max-w-none print:w-full print:h-full flex flex-col animate-in zoom-in-95 duration-300 max-h-[92vh] sm:max-h-[85vh] my-auto">
        {/* Modal Header with Gradient */}
        <div className="p-5 sm:p-7 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4 sm:gap-4">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl sm:rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl shrink-0">
              <Download className="w-6 h-6 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">Billing Summary Preview</h3>
              <p className="text-[10px] sm:text-[12px] font-medium text-purple-100/80">Review your workspace financials</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 sm:p-2.5 hover:bg-white/10 rounded-xl sm:rounded-xl transition-colors group shrink-0"
          >
            <X className="w-5 h-5 sm:w-5 sm:h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Printable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto print:overflow-visible flex-1 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 sm:mb-8">
            <div>
              <div className="mb-4 sm:mb-4">
                <NextImage 
                  src="https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg" 
                  alt="Recura Logo" 
                  width={120} 
                  height={24} 
                  className="h-7 sm:h-7 w-auto object-contain"
                  priority
                />
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed">
                Workspace Billing Summary<br />
                Generated: {invoiceData.date}<br />
                ID: {invoiceData.id}
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs sm:text-xs font-bold text-slate-900 mb-0.5">Company Details</div>
              <div className="text-[10px] sm:text-[10px] font-medium text-slate-500 leading-relaxed whitespace-pre-line">
                {companyDetails.name}
                {" | "}{companyDetails.industry}
                <div className="mt-0 opacity-80">
                  {companyDetails.members} • {companyDetails.phone}
                </div>
                {companyDetails.website}
                <div className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">{companyDetails.address}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-8">
            <div className="p-5 sm:p-5 rounded-2xl sm:rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[9px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-1.5">Total Revenue</div>
              <div className="text-2xl sm:text-2xl font-black text-slate-900">$12,378.25</div>
            </div>
            <div className="p-5 sm:p-5 rounded-2xl sm:rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[9px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-1.5">Active Provider</div>
              <div className="text-lg sm:text-lg font-black text-slate-900 capitalize">{activeProvider}</div>
              <div className="text-[9px] sm:text-[9px] font-bold text-purple-600 mt-0.5 sm:mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5" /> Connected
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-4">
            <h4 className="text-[10px] sm:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-1.5">Active Controls</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 sm:gap-y-3">
              <div className="flex justify-between items-center py-1 sm:py-0">
                <span className="text-[11px] sm:text-xs font-medium text-slate-500">Autobilling</span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-900">{isAutobillingEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-0">
                <span className="text-[11px] sm:text-xs font-medium text-slate-500">Proration Logic</span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-900">{prorationRange}%</span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-0">
                <span className="text-[11px] sm:text-xs font-medium text-slate-500">2FA Security</span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-900">{twoFactorEnabled ? 'Secure' : 'Unprotected'}</span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-0">
                <span className="text-[11px] sm:text-xs font-medium text-slate-500">Active Sessions</span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-900">{activeSessionsCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-dashed border-slate-200 text-center">
            <p className="text-[10px] font-medium text-slate-400 tracking-tight">
              This summary is an automated report of your workspace configuration and current billing metrics.<br />
              © 2026 Recura Platforms Inc.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between print:hidden no-export">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-2xl text-slate-500 font-bold text-sm tracking-tight hover:bg-slate-100 transition-colors"
            >
              Close Preview
            </button>
            {downloadProgress > 0 && downloadProgress < 100 && (
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest animate-pulse">
                {downloadProgress}%
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onDownload}
              disabled={isDownloading}
              className="px-12 py-3 rounded-2xl bg-purple-600 text-white font-black text-sm tracking-tight hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Save as Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 40px;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
