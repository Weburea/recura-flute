"use client"

import * as React from "react"
import Image from "next/image"
import { Check, Loader2, Info, X } from "lucide-react"
import { useUser } from "@/context/user-context"
import { cn } from "@/lib/utils"

interface TemplateConfig {
  id: string
  name: string
  tagline: string
  description: string
  colorClass: string
  accentColor: string
  designDetail: React.ReactNode
}

const TEMPLATES: TemplateConfig[] = [
  {
    id: "classic",
    name: "Classic Design",
    tagline: "Standard & Traditional",
    description: "Rounded dual-card header layout with split recipient/sender cards. Perfect for corporate and agency billing.",
    colorClass: "from-indigo-950 to-indigo-850 text-white",
    accentColor: "#7C3AED",
    designDetail: (
      <div className="space-y-2 opacity-50 w-full px-2">
        <div className="flex justify-between items-center"><div className="w-12 h-3.5 bg-white/20 rounded-md" /><div className="w-10 h-3.5 bg-white/20 rounded-md" /></div>
        <div className="w-full h-0.5 bg-white/10 rounded" />
        <div className="grid grid-cols-2 gap-2"><div className="h-5 bg-white/15 rounded-md" /><div className="h-5 bg-white/15 rounded-md" /></div>
        <div className="w-full h-8 bg-white/20 rounded-lg" />
      </div>
    )
  },
  {
    id: "minimalist",
    name: "Minimalist Clean",
    tagline: "Elegant & Modern",
    description: "Ultra-clean layout with logo badge overlapping a top gradient and inline totals. Great for designers and creators.",
    colorClass: "from-emerald-950 to-emerald-850 text-white",
    accentColor: "#10B981",
    designDetail: (
      <div className="space-y-2 opacity-50 w-full px-2">
        <div className="w-7 h-7 rounded-lg bg-white/25 border border-white/30 flex items-center justify-center font-black text-[10px]">B</div>
        <div className="w-2/3 h-2 bg-white/20 rounded" />
        <div className="w-1/2 h-1.5 bg-white/10 rounded" />
        <div className="w-full h-0.5 bg-white/10" />
        <div className="flex justify-between"><div className="w-14 h-2 bg-white/20 rounded" /><div className="w-8 h-2 bg-white/20 rounded" /></div>
      </div>
    )
  },
  {
    id: "detailed",
    name: "Detailed Split",
    tagline: "Information Rich",
    description: "Two-column bento-style template featuring metadata sidebar and visual item cards. Ideal for SaaS products.",
    colorClass: "from-cyan-950 to-cyan-850 text-white",
    accentColor: "#06B6D4",
    designDetail: (
      <div className="flex gap-2.5 h-full opacity-50 w-full px-2">
        <div className="w-1/3 h-14 bg-white/15 rounded-lg p-1 space-y-1 shrink-0">
          <div className="w-full h-1.5 bg-white/30 rounded" />
          <div className="w-3/4 h-1.5 bg-white/20 rounded" />
          <div className="w-full h-1.5 bg-white/15 rounded" />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="w-full h-4 bg-white/25 rounded-md" />
          <div className="w-full h-4 bg-white/25 rounded-md" />
          <div className="w-full h-4 bg-white/25 rounded-md" />
        </div>
      </div>
    )
  },
  {
    id: "modern",
    name: "Modern Rounded",
    tagline: "Chic & Friendly",
    description: "A card-structured layout with pill indicators and nested item borders. Fits high-growth startups.",
    colorClass: "from-orange-600 to-rose-600 text-white",
    accentColor: "#F97316",
    designDetail: (
      <div className="space-y-2 opacity-50 w-full px-2">
        <div className="w-full h-7 bg-white/15 rounded-xl p-1.5 flex justify-between items-center">
          <div className="w-14 h-2 bg-white/30 rounded-full" />
          <div className="w-6 h-3 bg-white/35 rounded-lg" />
        </div>
        <div className="w-full h-3.5 bg-white/20 rounded-lg" />
        <div className="w-full h-3.5 bg-white/20 rounded-lg" />
      </div>
    )
  },
  {
    id: "premium_dark",
    name: "Premium Dark",
    tagline: "Luxury Mode",
    description: "Dedicated dark-mode template with glowing purple gradients, custom borders, and golden accents.",
    colorClass: "from-slate-950 via-[#130725] to-slate-900 text-white border border-purple-500/10",
    accentColor: "#8B5CF6",
    designDetail: (
      <div className="space-y-1.5 opacity-65 relative w-full px-2">
        <div className="absolute right-2 top-0 w-8 h-8 rounded-full bg-purple-500/35 blur-md" />
        <div className="w-12 h-3 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-md" />
        <div className="w-full h-0.5 bg-white/10" />
        <div className="flex justify-between items-center"><div className="w-14 h-2 bg-white/25 rounded" /><div className="w-10 h-2 bg-amber-500/30 rounded" /></div>
        <div className="w-full h-6 bg-white/10 rounded-lg border border-white/15" />
      </div>
    )
  }
]

interface TemplateSelectorProps {
  onPreviewTemplate?: (templateId: string) => void
}

export function TemplateSelector({ onPreviewTemplate }: TemplateSelectorProps) {
  const { workspace, refreshUser } = useUser()
  const [flippedCardId, setFlippedCardId] = React.useState<string | null>(null)
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null)

  const activeTemplate = (workspace?.settings?.invoiceTemplate as string) || "classic"

  const handleSelectTemplate = async (templateId: string) => {
    if (activeTemplate === templateId) return
    setIsUpdating(templateId)
    try {
      const currentSettings = workspace?.settings || {}
      const res = await fetch("/api/v1/workspaces/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            ...currentSettings,
            invoiceTemplate: templateId
          }
        })
      })
      if (res.ok) {
        await refreshUser()
      }
    } catch (err) {
      console.error("Failed to update active invoice template:", err)
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Active Invoice Template
        </h2>
        <p className="text-xs font-bold text-slate-450 dark:text-slate-500 mt-1">
          {"Choose a 3D branding design card below to set your workspace's active invoice template. Click the flip icon for details."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {TEMPLATES.map((template) => {
          const isActive = activeTemplate === template.id
          const isFlipped = flippedCardId === template.id
          const isPending = isUpdating === template.id

          return (
            <div key={template.id} className="space-y-3">
              <div 
                className={cn(
                  "perspective-1000 w-full h-[135px] cursor-pointer group select-none",
                  isFlipped ? "flip-card-active" : ""
                )}
              >
                <div className="flip-card-inner">
                  {/* Front Side */}
                  <div 
                    onClick={() => {
                      if (onPreviewTemplate) {
                        onPreviewTemplate(template.id)
                      } else {
                        handleSelectTemplate(template.id)
                      }
                    }}
                    style={{
                      backgroundImage: "url('/images/dumb_images/invoices dumb/Background Gradient.svg')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    className={cn(
                      "flip-card-front p-4 flex flex-col justify-between overflow-hidden rounded-3xl relative transition-all duration-300 hover:scale-[1.02] border shadow-lg text-white",
                      isActive 
                        ? "ring-2 ring-white/80 border-white shadow-xl scale-[1.01]" 
                        : "border-white/10"
                    )}
                  >
                    {/* Premium gradient overlays blended with Background Gradient SVG */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-[0.88] dark:opacity-[0.92] -z-10",
                      template.id === 'classic' && "from-indigo-650 to-blue-700",
                      template.id === 'minimalist' && "from-emerald-500 to-teal-650",
                      template.id === 'detailed' && "from-cyan-500 to-blue-600",
                      template.id === 'modern' && "from-rose-500 to-orange-500",
                      template.id === 'premium_dark' && "from-[#2e1065] via-[#4c1d95] to-slate-950"
                    )} />

                    {/* Top Row: Badge & Flip Icon */}
                    <div className="flex justify-between items-start relative z-10 w-full">
                      {isActive ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 border border-white/25 backdrop-blur-md text-white font-black text-[9px] uppercase tracking-wider shadow-sm z-20">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                          <div className="relative w-5.5 h-5.5">
                            <Image 
                              src="/images/dumb_images/invoices%20dumb/Company%20Isotype.png" 
                              alt="Logo" 
                              fill 
                              className="object-contain brightness-0 invert" 
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Info Flip Trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setFlippedCardId(template.id)
                        }}
                        className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 cursor-pointer"
                        title="Template Description"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Row: Name */}
                    <div className="relative z-10">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-60 leading-none">{template.tagline}</p>
                      <h4 className="text-xs sm:text-sm font-black mt-1.5 leading-tight">{template.name}</h4>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div 
                    onClick={() => setFlippedCardId(null)}
                    style={{
                      backgroundImage: "url('/images/dumb_images/invoices dumb/Background Gradient.svg')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    className={cn(
                      "flip-card-back p-4 flex flex-col justify-between overflow-hidden rounded-3xl relative border text-white",
                      isActive ? "border-white/80" : "border-white/10"
                    )}
                  >
                    {/* Premium gradient overlays blended with Background Gradient SVG */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-[0.88] dark:opacity-[0.92] -z-10",
                      template.id === 'classic' && "from-indigo-650 to-blue-700",
                      template.id === 'minimalist' && "from-emerald-500 to-teal-650",
                      template.id === 'detailed' && "from-cyan-500 to-blue-600",
                      template.id === 'modern' && "from-rose-500 to-orange-500",
                      template.id === 'premium_dark' && "from-[#2e1065] via-[#4c1d95] to-slate-950"
                    )} />

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-black tracking-widest opacity-60">Profile</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setFlippedCardId(null)
                          }}
                          className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[9px] font-bold leading-normal opacity-90 text-left line-clamp-3">
                        {template.description}
                      </p>
                    </div>

                    {/* Activation action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectTemplate(template.id)
                        setFlippedCardId(null)
                      }}
                      disabled={isActive || isPending}
                      className={cn(
                        "w-full py-1.5 rounded-xl font-black text-[10px] transition-colors flex items-center justify-center gap-1 shadow-md",
                        isActive 
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 cursor-default" 
                          : "bg-white hover:bg-slate-100 text-slate-900 cursor-pointer"
                      )}
                    >
                      {isPending && <Loader2 className="w-2.5 h-2.5 animate-spin text-slate-800" />}
                      {isActive ? "Active" : (isPending ? "Activating..." : "Set Active")}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status footer label below card */}
              <div className="flex items-center justify-between px-1.5">
                <span className="font-extrabold text-[11px] text-slate-600 dark:text-slate-400 capitalize">
                  {template.id.replace('_', ' ')}
                </span>
                {isActive && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-550 dark:text-emerald-400 uppercase tracking-wider">
                    <Check className="w-3.5 h-3.5" /> Selected
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
