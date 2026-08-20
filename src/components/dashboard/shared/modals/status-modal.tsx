"use client"

import * as React from "react"
import Image from "next/image"
import { Check, X, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type StatusType = "success" | "error" | "pending" | "info"

interface StatusModalProps {
  isOpen: boolean
  onClose: () => void
  type: StatusType
  title: string
  message: string
}

export function StatusModal({ isOpen, onClose, type, title, message }: StatusModalProps) {
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
        {/* Dynamic Background Header */}
        <div className={cn(
          "h-56 flex items-center justify-center relative overflow-hidden",
          type === "success" && "bg-[#8400DB]",
          type === "error" && "bg-gradient-to-tr from-red-700 via-red-600 to-rose-500",
          type === "pending" && "bg-purple-600",
          type === "info" && "bg-blue-600"
        )}>
          {/* Subtle noise/texture for premium feel */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          
          {/* Siri Orb Container (Centered in Header) */}
          <div className="relative z-20">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Siri Layers (Multi-colored) */}
              {/* Cyan/Red Layer */}
              <div className={cn(
                "absolute inset-0 rounded-full mix-blend-screen blur-2xl opacity-60 animate-siri-layer-1",
                type === "error" ? "bg-rose-400" : "bg-cyan-400"
              )} />
              {/* Magenta/Rose Layer */}
              <div className={cn(
                "absolute inset-2 rounded-full mix-blend-screen blur-2xl opacity-60 animate-siri-layer-2",
                type === "error" ? "bg-red-500" : "bg-fuchsia-500"
              )} />
              {/* Purple/Dark Rose Layer */}
              <div className={cn(
                "absolute inset-[10%] rounded-full mix-blend-screen blur-xl opacity-70 animate-siri-layer-3",
                type === "error" ? "bg-rose-800" : "bg-[#8400DB]"
              )} />
              {/* White Core/Glow */}
              <div className="absolute inset-[25%] rounded-full bg-white blur-lg opacity-80 animate-siri-core" />
              
              {/* Real-time organic light spheres (Apple Siri Style) */}
              <div className={cn(
                "absolute w-[80%] h-[80%] rounded-full blur-md opacity-40 animate-siri-morph-1",
                type === "error" ? "bg-gradient-to-tr from-red-400 via-rose-500 to-white/80" : "bg-gradient-to-tr from-cyan-300 via-fuchsia-400 to-white/80"
              )} />
              <div className={cn(
                "absolute w-[85%] h-[85%] rounded-full blur-lg opacity-30 animate-siri-morph-2",
                type === "error" ? "bg-gradient-to-bl from-rose-400 via-white to-red-200" : "bg-gradient-to-bl from-purple-400 via-white to-cyan-200"
              )} />
              
              {/* The Central Icon Box (The "Floating" Box) */}
              <div className={cn(
                "relative z-30 w-24 h-24 rounded-[2rem] backdrop-blur-3xl border border-white/40 flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.2)]",
                "animate-siri-float",
                type === "error" ? "bg-red-500/20 shadow-red-900/40 border-red-400/50" : "bg-white/10"
              )}>
                  {type === "success" && <Check className="w-12 h-12 text-white stroke-[5px] drop-shadow-md" />}
                  {type === "error" && (
                    <X className="w-12 h-12 text-[#FF0000] stroke-[5px] drop-shadow-[0_0_15px_rgba(255,255,255,1)] animate-pop-in" />
                  )}
                  {type === "pending" && <Loader2 className="w-12 h-12 text-white animate-spin stroke-[5px] drop-shadow-md" />}
                  {type === "info" && <AlertCircle className="w-12 h-12 text-white stroke-[5px] drop-shadow-md" />}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area (White space) */}
        <div className="p-10 pt-10 flex flex-col items-center text-center bg-white relative">
          {/* Status Badge */}
          <div className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border",
            type === "success" && "bg-purple-50 text-[#8400DB] border-purple-100",
            type === "error" && "bg-rose-50 text-rose-600 border-rose-100",
            type === "pending" && "bg-purple-50 text-purple-600 border-purple-100",
            type === "info" && "bg-blue-50 text-blue-600 border-blue-100"
          )}>
            {type === "success" ? "Operation Successful" : type === "error" ? "Submission Failed" : type}
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{title}</h3>
          <p className="text-slate-500 font-bold leading-relaxed mb-8 max-w-[280px]">
            {message}
          </p>

          <button 
            type="button"
            onClick={onClose}
            className={cn(
              "w-full py-4 rounded-[1.5rem] text-white font-black text-sm tracking-[0.2em] shadow-xl transition-all active:scale-[0.97] uppercase",
              type === "success" && "bg-gradient-to-r from-[#FAB2FF] to-[#8400DB] hover:shadow-purple-500/40 shadow-purple-500/20",
              type === "error" && "bg-gradient-to-r from-red-600 to-rose-700 hover:shadow-red-500/40 shadow-red-500/20",
              type === "pending" && "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20",
              type === "info" && "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
            )}
          >
            Continue
          </button>
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
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full shadow-sm">
             Verified Secure
           </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes siri-layer-1 {
          0%, 100% { transform: translate(0, 0) scale(1) skew(0) rotate(0); }
          50% { transform: translate(15px, -10px) scale(1.1) skew(5deg) rotate(15deg); }
        }
        @keyframes siri-layer-2 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0); }
          50% { transform: translate(-20px, 15px) scale(1.15) rotate(-20deg); }
        }
        @keyframes siri-layer-3 {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.2) translate(10px, 10px); }
        }
        @keyframes siri-core {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 0.4; }
        }
        @keyframes siri-morph-1 {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg) scale(1); }
          50% { border-radius: 30% 60% 70% 30% / 50% 60% 30% 60%; transform: rotate(180deg) scale(1.1); }
        }
        @keyframes siri-morph-2 {
          0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 70%; transform: rotate(0deg) scale(1.1); }
          50% { border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%; transform: rotate(-180deg) scale(0.9); }
        }
        @keyframes siri-float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .animate-siri-layer-1 { animation: siri-layer-1 6s ease-in-out infinite; }
        .animate-siri-layer-2 { animation: siri-layer-2 8s ease-in-out infinite; }
        .animate-siri-layer-3 { animation: siri-layer-3 10s ease-in-out infinite; }
        .animate-siri-core { animation: siri-core 3s ease-in-out infinite; }
        .animate-siri-morph-1 { animation: siri-morph-1 7s linear infinite; }
        .animate-siri-morph-2 { animation: siri-morph-2 9s linear infinite; }
        .animate-siri-float { animation: siri-float 3s ease-in-out infinite; }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  )
}
