"use client"

import * as React from "react"
import Image from "next/image"
import { AlertTriangle, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger"
}: ConfirmationModalProps) {
  const [shouldRender, setShouldRender] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    }
  }, [isOpen])

  if (!shouldRender) return null

  return (
    <div className={cn(
      "fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-500",
      isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    )}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-500" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={cn(
        "relative w-full max-w-[400px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 transform",
        isOpen ? "scale-100 translate-y-0" : "scale-90 translate-y-10"
      )}>
        {/* Dynamic Header */}
        <div className={cn(
          "h-56 flex items-center justify-center relative overflow-hidden",
          type === "danger" && "bg-gradient-to-tr from-red-700 via-red-600 to-rose-500",
          type === "warning" && "bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-400",
          type === "info" && "bg-[#8400DB]"
        )}>
          {/* Subtle noise/texture for premium feel */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          
          {/* Siri Orb/Glow Container */}
          <div className="relative z-20">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Glowing Siri Layers */}
              <div className={cn(
                "absolute inset-0 rounded-full mix-blend-screen blur-2xl opacity-60 animate-siri-layer-1",
                type === "danger" ? "bg-rose-400" : "bg-amber-400"
              )} />
              <div className={cn(
                "absolute inset-2 rounded-full mix-blend-screen blur-2xl opacity-60 animate-siri-layer-2",
                type === "danger" ? "bg-red-500" : "bg-orange-500"
              )} />
              <div className="absolute inset-[25%] rounded-full bg-white blur-lg opacity-80 animate-siri-core" />
              
              {/* Floating central Icon Box */}
              <div className={cn(
                "relative z-35 w-24 h-24 rounded-[2rem] backdrop-blur-3xl border border-white/40 flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-siri-float",
                "bg-white/10"
              )}>
                {type === "danger" ? (
                  <Trash2 className="w-12 h-12 text-white stroke-[2.5px] drop-shadow-md" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-white stroke-[2.5px] drop-shadow-md" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-10 pt-10 flex flex-col items-center text-center bg-white relative">
          {/* Status Badge */}
          <div className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border",
            type === "danger" && "bg-rose-50 text-rose-600 border-rose-100",
            type === "warning" && "bg-amber-50 text-amber-700 border-amber-100",
            type === "info" && "bg-purple-50 text-purple-600 border-purple-100"
          )}>
            {type === "danger" ? "Confirm Deletion" : "Action Required"}
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{title}</h3>
          <p className="text-slate-500 font-bold leading-relaxed mb-8 max-w-[280px]">
            {message}
          </p>

          <div className="w-full flex flex-col gap-3">
            {/* Confirm Button */}
            <button 
              type="button"
              onClick={onConfirm}
              className={cn(
                "w-full py-4 rounded-[1.5rem] text-white font-black text-sm tracking-[0.2em] shadow-xl transition-all active:scale-[0.97] uppercase cursor-pointer",
                type === "danger" && "bg-gradient-to-r from-red-600 to-rose-700 hover:shadow-red-500/40 shadow-red-500/20",
                type === "warning" && "bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-amber-500/40 shadow-amber-500/20",
                type === "info" && "bg-gradient-to-r from-[#FAB2FF] to-[#8400DB] hover:shadow-purple-500/40 shadow-purple-500/20"
              )}
            >
              {confirmText}
            </button>

            {/* Cancel Button */}
            <button 
              type="button"
              onClick={onClose}
              className="w-full py-3.5 rounded-[1.5rem] bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs tracking-[0.2em] transition-all active:scale-[0.97] uppercase cursor-pointer"
            >
              {cancelText}
            </button>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="bg-slate-50/50 p-6 flex flex-col items-center gap-3 border-t border-slate-100">
           <div className="relative w-20 h-6 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
              <Image 
                src="https://res.cloudinary.com/weburea/image/upload/v1783571840/logo_plan.svg" 
                alt="Recura Logo" 
                fill
                className="object-contain invert dark:invert-0"
              />
           </div>
        </div>
      </div>
    </div>
  )
}
