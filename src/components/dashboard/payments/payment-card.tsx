"use client"

import * as React from "react"
import Image from "next/image"
import { Apple } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentCardProps {
  type: "credit-card" | "bank-transfer" | "apple-pay"
  cardNumber: string
  cardHolder: string
  expiryDate: string
  activeCustomers?: number
}

export function PaymentCard({ 
  type, 
  cardNumber, 
  cardHolder, 
  expiryDate,
  activeCustomers 
}: PaymentCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false)

  const getCardStyles = () => {
    switch (type) {
      case "credit-card":
        return {
          background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)",
          textColor: "text-white",
          logo: "https://res.cloudinary.com/weburea/image/upload/v1783571834/visa.svg",
          chip: "https://res.cloudinary.com/weburea/image/upload/v1783571832/sim.svg",
          className: "bg-gradient-to-br from-indigo-950 to-indigo-700"
        }
      case "bank-transfer":
        return {
          background: "linear-gradient(135deg, #f97316 0%, #3b82f6 33%, #10b981 66%, #db2777 100%)",
          textColor: "text-white",
          logo: "https://res.cloudinary.com/weburea/image/upload/v1783571830/bank_logo.svg",
          chip: "https://res.cloudinary.com/weburea/image/upload/v1783571832/sim.svg",
          className: "bg-gradient-to-br from-orange-500 via-blue-500 to-pink-500"
        }
      case "apple-pay":
        return {
          background: "#ffffff",
          textColor: "text-slate-900 dark:text-white",
          logo: null,
          chip: "https://res.cloudinary.com/weburea/image/upload/v1783571832/sim.svg",
          className: "bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 shadow-sm"
        }
    }
  }

  const styles = getCardStyles()

  return (
    <div className="space-y-4">
      <div 
        className={cn(
          "perspective-1000 w-full h-[240px] cursor-pointer group",
          isFlipped ? "flip-card-active" : ""
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flip-card-inner">
          {/* Front Side */}
          <div className={cn(
            "flip-card-front p-6 flex flex-col justify-between overflow-hidden rounded-3xl",
            styles.className
          )}>
            {/* Background elements (waves/patterns if possible, otherwise simple) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" className="opacity-10" />
              </svg>
            </div>

            <div className="relative z-10 flex justify-between items-start">
              {type === "apple-pay" ? (
                <div className="w-10 h-10 flex items-center justify-center">
                  <Apple className="w-8 h-8 text-slate-900" />
                </div>
              ) : (
                styles.chip && (
                  <div className="w-10 h-8 relative">
                    <Image 
                      src={styles.chip} 
                      alt="Chip" 
                      fill 
                      className="object-contain"
                    />
                  </div>
                )
              )}
              
              {styles.logo && (
                <div className="w-14 h-8 relative">
                  <Image 
                    src={styles.logo} 
                    alt="Logo" 
                    fill 
                    className="object-contain brightness-0 invert"
                  />
                </div>
              )}
            </div>

            <div className="relative z-10">
              <p className={cn(
                "text-xl font-bold tracking-[0.2em] mb-4",
                styles.textColor
              )}>
                **** **** **** {cardNumber.slice(-4)}
              </p>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className={cn("text-[10px] uppercase opacity-60 mb-1", styles.textColor)}>Card Holder</p>
                  <p className={cn("text-sm font-bold", styles.textColor)}>{cardHolder}</p>
                </div>
                <div>
                  <p className={cn("text-[10px] uppercase opacity-60 mb-1", styles.textColor)}>Expiry Date</p>
                  <p className={cn("text-sm font-bold", styles.textColor)}>{expiryDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className={cn(
            "flip-card-back p-6 flex flex-col justify-between overflow-hidden rounded-3xl",
            styles.className
          )}>
            <div className="absolute top-8 left-0 w-full h-10 bg-slate-900 opacity-80" />
            
            <div className="mt-14 flex items-center gap-4">
              <div className="h-8 bg-slate-100/20 flex-1 px-4 flex items-center justify-end">
                <p className={cn("text-xs font-mono italic", styles.textColor)}>123</p>
              </div>
              <div className="text-[10px] uppercase opacity-60">CVV</div>
            </div>

            <p className={cn("text-[8px] leading-tight opacity-50", styles.textColor)}>
              This card is a property of Recura. Use is subject to terms and conditions. 
              Unauthorized use is strictly prohibited.
            </p>
          </div>
        </div>
      </div>
      
      {/* Label/Status below card */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="font-black text-slate-900 dark:text-white text-sm">
            {type === "credit-card" ? "Credit Card" : 
             type === "bank-transfer" ? "Bank Transfer" : "Apple Pay"}
          </p>
          {activeCustomers && (
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500">{activeCustomers} Active Customers</p>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/10 border border-slate-100 dark:border-white/20 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
