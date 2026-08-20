"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X, Download, Loader2, Palette, Paintbrush, Check, Sun, Moon, Sparkles } from "lucide-react"
import { toPng } from "html-to-image"
import type { Invoice } from "@/components/dashboard/billing/mock-data"
import { InvoiceTemplateRenderer, normalizeInvoiceForTemplate } from "@/components/dashboard/billing/invoice-templates"
import { StatusModal } from "./status-modal"
import { useUser } from "@/context/user-context"
import { cn } from "@/lib/utils"

interface InvoiceWithMetadata extends Invoice {
  metadata?: {
    savedImageUrl?: string
    invoiceNumber?: string
    [key: string]: unknown
  }
}

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: InvoiceWithMetadata
  onDownload?: () => void
  readOnly?: boolean
}

const PRESET_COLORS = [
  { name: "Recura Purple", value: "#7C3AED" },
  { name: "Ocean Blue", value: "#3B82F6" },
  { name: "Emerald Green", value: "#10B981" },
  { name: "Sunset Orange", value: "#F97316" },
  { name: "Crimson Red", value: "#F43F5E" }
]

type TemplateType = 'classic' | 'minimalist' | 'detailed' | 'modern' | 'premium_dark'

export function InvoiceModal({ isOpen, onClose, invoice, onDownload, readOnly = false }: InvoiceModalProps) {
  const [mounted, setMounted] = React.useState(false)
  const invoiceRef = React.useRef<HTMLDivElement>(null)

  // Customizer States
  const [activeTemplate, setActiveTemplate] = React.useState<TemplateType>('classic')
  const [accentColor, setAccentColor] = React.useState<string>('#7C3AED')
  const [previewTheme, setPreviewTheme] = React.useState<'light' | 'dark'>('light')
  const [internalDownloading, setInternalDownloading] = React.useState(false)

  const { user, workspace, refreshUser } = useUser()

  // Status modal overlay state for saving/printing
  const [statusOverlay, setStatusOverlay] = React.useState<{
    isOpen: boolean
    type: "success" | "error" | "pending" | "info"
    title: string
    message: string
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: ""
  })

  // Normalize invoice for rendering
  const normalizedInvoice = React.useMemo(() => {
    return normalizeInvoiceForTemplate(invoice, workspace, user)
  }, [invoice, workspace, user])

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

  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metadata = (invoice as any)?.metadata || {}
      if (metadata.template) {
        setActiveTemplate(metadata.template as TemplateType)
      } else if (workspace?.settings?.invoiceTemplate) {
        setActiveTemplate(workspace.settings.invoiceTemplate as TemplateType)
      }

      if (metadata.accentColor) {
        setAccentColor(metadata.accentColor as string)
      } else if (workspace?.settings?.primaryColor) {
        setAccentColor(workspace.settings.primaryColor as string)
      }

      if (metadata.theme) {
        setPreviewTheme(metadata.theme as 'light' | 'dark')
      }
    }
  }, [isOpen, workspace, invoice])

  const saveActiveTemplateToSettings = async (templateId: string, color: string) => {
    try {
      const currentSettings = workspace?.settings || {}
      await fetch("/api/v1/workspaces/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            ...currentSettings,
            invoiceTemplate: templateId,
            primaryColor: color
          }
        })
      })
      refreshUser?.()
    } catch (err) {
      console.error("Failed to update active workspace settings:", err)
    }
  }

  const handleSaveHDImage = async () => {
    if (invoiceRef.current === null || !invoice) return

    setStatusOverlay({
      isOpen: true,
      type: "pending",
      title: "Saving HD Image...",
      message: "Rendering ultra-high-resolution 4x layout grids..."
    })

    await saveActiveTemplateToSettings(activeTemplate, accentColor)

    try {
      await fetch("/api/v1/billing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: invoice.id,
          metadata: {
            template: activeTemplate,
            accentColor: accentColor,
            theme: previewTheme
          }
        })
      })
    } catch (e) {
      console.error("Failed to save metadata to invoice:", e)
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const isDark = previewTheme === 'dark' || activeTemplate === 'premium_dark'
      const dataUrl = await toPng(invoiceRef.current, {
        quality: 1.0,
        pixelRatio: 4, // 4x for Ultra-HD resolution
        backgroundColor: isDark ? '#0b051a' : '#ffffff',
      })
      
      const link = document.createElement("a")
      link.download = `invoice-${invoice.id}-${activeTemplate}-hd.png`
      link.href = dataUrl
      link.click()

      // Upload generated PNG to Cloudinary in the background
      fetch("/api/v1/billing/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.id,
          base64Image: dataUrl
        })
      }).catch(uploadErr => {
        console.error("Failed to upload HD image to Cloudinary:", uploadErr)
      })

      setStatusOverlay({
        isOpen: true,
        type: "success",
        title: "HD Image Saved",
        message: "Ultra-high-definition invoice image has been generated and saved."
      })
    } catch (err) {
      console.error("Failed to download HD image:", err)
      setStatusOverlay({
        isOpen: true,
        type: "error",
        title: "Generation Failed",
        message: "Failed to render high-definition image grid."
      })
    }
  }

  const handleDownloadInternal = async () => {
    if (invoiceRef.current === null || !invoice) return
    
    if (onDownload) {
      onDownload()
      return
    }

    setInternalDownloading(true)
    setStatusOverlay({
      isOpen: true,
      type: "pending",
      title: "Saving PNG...",
      message: "Generating high-fidelity invoice image..."
    })

    await saveActiveTemplateToSettings(activeTemplate, accentColor)

    try {
      await fetch("/api/v1/billing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: invoice.id,
          metadata: {
            template: activeTemplate,
            accentColor: accentColor,
            theme: previewTheme
          }
        })
      })
    } catch (e) {
      console.error("Failed to save download metadata to invoice:", e)
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const isDark = previewTheme === 'dark' || activeTemplate === 'premium_dark'
      const dataUrl = await toPng(invoiceRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: isDark ? '#0b051a' : '#ffffff',
      })
      
      const link = document.createElement("a")
      link.download = `invoice-${invoice.id}-${activeTemplate}.png`
      link.href = dataUrl
      link.click()

      setStatusOverlay({
        isOpen: true,
        type: "success",
        title: "Download Successful",
        message: "Invoice PNG image has been saved to your device."
      })
      setTimeout(() => {
        setStatusOverlay(prev => ({ ...prev, isOpen: false }))
      }, 1500)
    } catch (err) {
      console.error("Failed to download invoice:", err)
      setStatusOverlay({
        isOpen: true,
        type: "error",
        title: "Download Failed",
        message: "Failed to generate image file for this invoice."
      })
    } finally {
      setInternalDownloading(false)
    }
  }

  if (!isOpen || !invoice || !mounted) return null

  const finalLogoUrl = (workspace?.metadata?.logo_url as string) || (workspace?.metadata?.logoUrl as string) || null

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
      
      <div className="fixed inset-0 z-[1000] flex items-stretch md:items-center justify-center bg-slate-900/60 backdrop-blur-sm overflow-y-auto no-print print-modal-container px-0 sm:px-4 custom-scrollbar">
        {/* Overlay Close Trigger */}
        <div className="fixed inset-0 z-0 print:hidden no-print" onClick={onClose} />
        
        {/* Modal Container: Flex layout to accommodate customizer sidebar */}
        <div className={cn(
          "relative z-10 w-full bg-white dark:bg-[#110825] rounded-none md:rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom md:zoom-in duration-300 print:shadow-none print:rounded-none flex flex-col md:flex-row h-auto md:h-[88vh] overflow-y-auto md:overflow-hidden my-0 md:my-4 print:my-0 print:w-full print:block print-area",
          readOnly ? "max-w-4xl" : "max-w-6xl"
        )}>
          
          {/* LEFT: Designer Customizer Toolbar */}
          {!readOnly && (
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-150 dark:border-white/10 p-6 flex flex-col gap-6 no-print bg-slate-50/50 dark:bg-[#150a2e]/40 overflow-y-auto shrink-0">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <Paintbrush className="w-5 h-5 text-purple-650 dark:text-purple-400" />
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Invoice Designer</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="md:hidden p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Template Selector Card List */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Template</span>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'classic', label: 'Classic Design' },
                    { id: 'minimalist', label: 'Minimalist Clean' },
                    { id: 'detailed', label: 'Detailed Split' },
                    { id: 'modern', label: 'Modern Rounded' },
                    { id: 'premium_dark', label: 'Premium Dark Mode', special: true }
                  ].map((item) => {
                    const isActive = activeTemplate === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTemplate(item.id as TemplateType)}
                        className={cn(
                          "w-full px-4 py-3 rounded-2xl border text-xs text-left font-bold transition-all relative flex items-center justify-between cursor-pointer",
                          isActive
                            ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/10"
                            : "border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-350 hover:bg-slate-100/50 dark:hover:bg-white/5",
                          item.special && !isActive && "border-amber-500/20 text-amber-500 hover:border-amber-500/40"
                        )}
                      >
                        <span>{item.label}</span>
                        {isActive && <Check className="w-4 h-4 text-white" />}
                        {item.special && !isActive && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-500 font-extrabold uppercase scale-90">
                            LUX
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Accent Color Customizer */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> Accent Color
                </span>
                
                {/* Preset circles */}
                <div className="flex flex-wrap gap-2.5 items-center">
                  {PRESET_COLORS.map((color) => {
                    const isColorActive = accentColor.toLowerCase() === color.value.toLowerCase()
                    return (
                      <button
                        key={color.value}
                        onClick={() => setAccentColor(color.value)}
                        style={{ backgroundColor: color.value }}
                        className="w-7 h-7 rounded-full border border-black/10 dark:border-white/20 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 shadow-sm relative shrink-0"
                        title={color.name}
                      >
                        {isColorActive && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                      </button>
                    )
                  })}

                  {/* Color Picker Box */}
                  <div className="relative w-7 h-7 rounded-full border border-slate-300 dark:border-white/20 overflow-hidden cursor-pointer shrink-0 transition-transform hover:scale-110 flex items-center justify-center bg-slate-100/50">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-none bg-transparent"
                      title="Choose Custom Color"
                    />
                    <Palette className="w-3.5 h-3.5 text-slate-500 pointer-events-none mix-blend-difference" />
                  </div>
                </div>
                
                {/* HEX Value display */}
                <input
                  type="text"
                  value={accentColor.toUpperCase()}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#7C3AED"
                  maxLength={7}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-650 text-xs font-mono font-bold"
                />
              </div>

              {/* Theme Toggle (not visible if premium_dark template selected) */}
              {activeTemplate !== 'premium_dark' && (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Theme Preview</span>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100/55 dark:bg-white/5 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPreviewTheme('light')}
                      className={cn(
                        "py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all",
                        previewTheme === 'light' 
                          ? "bg-white dark:bg-[#1a1033] text-slate-950 dark:text-white shadow-sm" 
                          : "text-slate-400 dark:text-slate-550 hover:text-slate-700"
                      )}
                    >
                      <Sun className="w-3.5 h-3.5" /> Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTheme('dark')}
                      className={cn(
                        "py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all",
                        previewTheme === 'dark' 
                          ? "bg-white dark:bg-[#1a1033] text-slate-950 dark:text-white shadow-sm" 
                          : "text-slate-400 dark:text-slate-550 hover:text-slate-700"
                      )}
                    >
                      <Moon className="w-3.5 h-3.5" /> Dark
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2.5 pt-6 border-t border-slate-100 dark:border-white/5">
                <button
                  onClick={handleSaveHDImage}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-250/60 dark:border-white/10 bg-slate-50/50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Save HD Image
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-355 font-bold text-xs cursor-pointer text-center"
                >
                  Close View
                </button>
              </div>
            </div>
          )}

          {/* Right Paper Area */}
          <div className="flex-1 flex flex-col min-w-0 print:block print:p-0 print:static print:h-auto">
            {/* Top Toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-[#110825]/50 flex items-center justify-between shrink-0 no-print">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {readOnly ? "Invoice Details View" : "Preview Area"}
                </span>
                <h4 className="text-xs font-black text-slate-900 dark:text-white leading-none mt-1">
                  {normalizedInvoice.customer} • {normalizedInvoice.invoiceNumber || normalizedInvoice.id}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={handleDownloadInternal}
                    disabled={internalDownloading}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs tracking-wide transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    {internalDownloading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    Save PNG
                  </button>
                )}
                {readOnly && invoice.metadata?.savedImageUrl && (
                  <a
                    href={invoice.metadata.savedImageUrl}
                    download={`invoice-${normalizedInvoice.invoiceNumber || invoice.id}.png`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs tracking-wide transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PNG
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-350 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Main Preview Screen */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-start justify-center print:p-0 print:overflow-visible print:block bg-slate-50/30 dark:bg-[#0c051e]/30">
              {readOnly && invoice.metadata?.savedImageUrl ? (
                <div className="w-full max-w-[800px] flex items-center justify-center bg-white dark:bg-[#110825] p-6 rounded-3xl border border-slate-150 dark:border-white/10 shadow-2xl relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={invoice.metadata.savedImageUrl} 
                    alt="Saved Invoice HD Image" 
                    className="w-full h-auto object-contain rounded-2xl shadow-md max-h-[70vh]"
                  />
                </div>
              ) : (
                /* Active Invoice Paper Container */
                <div 
                  ref={invoiceRef} 
                  id="invoice-content"
                  className="w-full max-w-[800px] shadow-2xl shadow-purple-950/5 dark:shadow-none print:shadow-none print:w-full rounded-2xl md:rounded-3xl overflow-hidden print:rounded-none"
                >
                  <InvoiceTemplateRenderer
                    template={activeTemplate}
                    invoice={normalizedInvoice}
                    logoUrl={finalLogoUrl}
                    primaryColor={accentColor}
                    theme={previewTheme}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <StatusModal
        isOpen={statusOverlay.isOpen}
        onClose={() => setStatusOverlay(prev => ({ ...prev, isOpen: false }))}
        type={statusOverlay.type}
        title={statusOverlay.title}
        message={statusOverlay.message}
      />
    </>
  )

  return createPortal(modalContent, document.body)
}
