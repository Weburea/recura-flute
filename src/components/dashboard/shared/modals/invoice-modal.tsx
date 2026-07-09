"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { X, Printer, Download, Loader2 } from "lucide-react"
import { toPng } from "html-to-image"
import type { Invoice } from "@/components/dashboard/billing/mock-data"

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice
  onDownload?: () => void
  isDownloading?: boolean
}

export function InvoiceModal({ isOpen, onClose, invoice, onDownload, isDownloading }: InvoiceModalProps) {
  const [mounted, setMounted] = React.useState(false)
  const invoiceRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadInternal = async () => {
    if (invoiceRef.current === null || !invoice) return
    
    // If parent provided onDownload, use it, otherwise use internal logic
    if (onDownload) {
      onDownload();
      return;
    }

    try {
      const dataUrl = await toPng(invoiceRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })
      
      const link = document.createElement("a")
      link.download = `invoice-${invoice.id}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to download invoice:", err)
    }
  }

  if (!isOpen || !invoice || !mounted) return null

  const items = [
    { description: "Product Subscription - " + invoice.plan, qty: 1, price: invoice.amount, total: invoice.amount },
    { description: "Platform Fee", qty: 1, price: "$0.00", total: "$0.00" },
    { description: "Additional Support", qty: 1, price: "$0.00", total: "$0.00" },
  ]

  const modalContent = (
    <>
      <style>{`
        @media print {
          body {
             background: white !important;
             margin: 0 !important;
             padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            visibility: visible !important;
          }
          header, footer, nav, .dashboard-sidebar, .dashboard-header {
            display: none !important;
          }
          .print-modal-container {
            background: white !important;
            position: static !important;
            display: block !important;
            padding: 0 !important;
          }
        }
      `}</style>
      
      <div className="fixed inset-0 z-[1000] flex items-start sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm overflow-y-auto no-print print-modal-container px-0 sm:px-4 custom-scrollbar">
        {/* Overlay Close Trigger */}
        <div className="fixed inset-0 z-0 print:hidden no-print" onClick={onClose} />
        
        {/* Modal Content - Refined Visual Weight */}
        <div className="relative z-10 w-full max-w-5xl bg-white rounded-xl sm:rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom sm:zoom-in duration-300 print:shadow-none print:rounded-none flex flex-col h-auto max-h-[96vh] sm:max-h-[96vh] my-4 sm:my-0 print:my-0 print:w-full print:block print-area">
          
          {/* Controls */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-6 flex items-center gap-2 z-[1100] print:hidden no-print">
            <button 
              onClick={handleDownloadInternal}
              disabled={isDownloading}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-md hover:bg-white text-slate-900 transition-all border border-slate-200 shadow-sm cursor-pointer disabled:opacity-50"
              title="Save as Image"
            >
              {isDownloading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Download className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button 
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-md hover:bg-white text-slate-900 transition-all border border-slate-200 shadow-sm cursor-pointer"
              title="Print Invoice"
            >
              <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-md hover:bg-white text-slate-900 transition-all border border-slate-200 shadow-sm cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar rounded-xl sm:rounded-2xl print:overflow-visible print:block">
            {/* Invoice Body */}
            <div 
              ref={invoiceRef} 
              id="invoice-content"
              className="p-0 flex flex-col bg-white w-full mx-auto min-h-full print:block"
              style={{ color: "#1e293b" }} 
            >
              {/* Branded Header Section - Pronounced Height & Curved Bottom */}
              <div 
                className="relative p-6 sm:p-7 md:p-8 overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.5rem] print:rounded-none" 
                style={{ 
                  background: "linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)",
                }}
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                <div className="absolute bottom-[-50px] left-[-20px] w-80 h-80 bg-white/10 rounded-full blur-3xl print:hidden" />
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="relative w-36 h-9 sm:w-44 sm:h-11">
                      <Image 
                        src="https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg" 
                        alt="Recura" 
                        fill 
                        className="object-contain brightness-0 invert" 
                        priority
                      />
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm font-bold tracking-tight">
                      <p className="opacity-80">Recura Technologies Inc.</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-[2rem] p-4 sm:p-5 flex items-center gap-4 sm:gap-4 print:bg-transparent print:border-slate-100 shadow-2xl">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-xl print:shadow-none shrink-0">
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#7c3aed] to-[#c026d3] text-white font-black text-lg sm:text-lg rounded-full border-2 sm:border-3 border-white/30">
                        {invoice.customer.substring(0, 1)}
                      </div>
                    </div>
                    <div>
                      <p className="text-white uppercase text-[8px] sm:text-[9px] font-black tracking-[0.25em] opacity-80 mb-0.5 sm:mb-0.5">Total Amount:</p>
                      <div className="flex items-baseline gap-1.5 sm:gap-1.5">
                        <h2 className="text-white text-2xl sm:text-3xl font-black tracking-tighter">{invoice.amount.replace('$', '')}</h2>
                        <span className="text-white/70 font-bold text-xs sm:text-sm tracking-tight">$ USD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Bar - Floating over the curved header */}
              <div className="px-6 sm:px-12 py-2 flex flex-col sm:flex-row gap-3 -mt-10 relative z-10 print:mt-10 print:px-0">
                <div className="px-5 py-5 rounded-2xl bg-white border border-slate-100 shadow-2xl shadow-purple-900/10 flex-1 print:shadow-none">
                  <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest mb-0.5 opacity-80">Invoice Number:</p>
                  <p className="text-sm sm:text-base font-black text-slate-900 tracking-tight">Nº: {invoice.id.split('-')[1] || invoice.id}</p>
                </div>
                <div className="px-5 py-5 rounded-2xl bg-white border border-slate-100 shadow-2xl shadow-indigo-900/10 flex-1 print:shadow-none">
                  <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-0.5 opacity-80">Issued Date:</p>
                  <p className="text-sm sm:text-base font-black text-slate-900 tracking-tight">{invoice.date}</p>
                </div>
                <div className="px-5 py-5 rounded-2xl bg-white border border-slate-100 shadow-2xl shadow-blue-900/10 flex-1 print:shadow-none">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-0.5 opacity-80">Due Date:</p>
                  <p className="text-sm sm:text-base font-black text-slate-900 tracking-tight">{invoice.dueDate}</p>
                </div>
              </div>

              {/* Sender & Recipient Details - More Pronounced */}
              <div className="px-6 sm:px-12 py-6 grid grid-cols-1 md:grid-cols-2 gap-8 print:px-0">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 print:bg-transparent shadow-sm print:shadow-none">
                  <h4 className="text-[10px] font-black text-slate-900 flex items-center gap-3 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-purple-600 shadow-lg shadow-purple-500/40" />
                    Recipient
                  </h4>
                  <div className="space-y-1.5">
                    <p className="text-xl font-black text-slate-900 tracking-tight">{invoice.customer}</p>
                    <p className="text-xs font-bold text-slate-500">{invoice.email}</p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                    123 Business Street, San Francisco, CA 94107
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-100 space-y-4 print:bg-transparent shadow-sm print:shadow-none">
                  <h4 className="text-[10px] font-black text-slate-900 flex items-center gap-3 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-slate-200" />
                    Sender
                  </h4>
                  <div className="space-y-1.5">
                    <p className="text-xl font-black text-slate-900 tracking-tight">Recura Technologies</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">billing@recura.tech</p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                    456 Innovation Way, New York, NY 10001
                  </p>
                </div>
              </div>

              {/* Items Table - Restored Visual Weight */}
              <div className="px-6 sm:px-12 py-2 flex-1 print:px-0">
                <div className="rounded-xl border border-slate-100 overflow-x-auto no-scrollbar print:border-none print:overflow-visible">
                  <table className="w-full min-w-[500px] sm:min-w-0">
                    <thead className="bg-slate-50 border-b border-slate-100 print:bg-white print:border-b-2">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Description</th>
                        <th className="px-4 py-4 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Qty</th>
                        <th className="px-4 py-4 text-right text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Price</th>
                        <th className="px-6 py-4 text-right text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 print:divide-slate-200">
                      {items.map((item, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-slate-900">{item.description}</td>
                          <td className="px-4 py-4 text-center text-xs font-bold text-slate-400">{item.qty}</td>
                          <td className="px-4 py-4 text-right text-xs font-bold text-slate-400">{item.price}</td>
                          <td className="px-6 py-4 text-right text-xs font-extrabold text-purple-600">{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Section - Refined */}
              <div className="px-8 sm:px-12 py-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 print:px-0 print:border-t-2 print:mt-6">
                <div className="max-w-md space-y-1 text-center md:text-left print:text-left">
                  <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest opacity-80">Legal Notice:</h5>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wide">
                    This is a computer generated invoice. No signature is required.
                  </p>
                </div>
                
                <div className="px-6 py-4 rounded-2xl bg-purple-50/50 border-2 border-purple-100 flex items-center gap-6 print:bg-transparent print:border-slate-100 print:py-2 print:px-0">
                  <span className="text-purple-600/60 font-black text-[10px] uppercase tracking-[0.3em]">Total Due:</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#7c3aed] tracking-tighter">{invoice.amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}
