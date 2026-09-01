"use client"

import * as React from "react"
import { X, AlertCircle, Upload, Loader2, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  businessType: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editData?: any
}

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "Pound Sterling" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
]

const plans = ["Basic Plan", "Premium Plan", "Enterprise Package"]

export function CreateSubscriptionModal({ isOpen, onClose, onSuccess, businessType, editData }: CreateSubscriptionModalProps) {
  const [formData, setFormData] = React.useState({
    customerName: "",
    email: "",
    plan: "Basic Plan",
    billingCycle: "Monthly",
    amount: "",
    avatarUrl: "",
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [selectedCurrency, setSelectedCurrency] = React.useState(CURRENCIES[0])
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const currencyDropdownRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Handle click outside to close dropdowns
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset form on open/close
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        customerName: editData?.customer?.name || editData?.name || "",
        email: editData?.customer?.email || "",
        plan: editData?.plan || "Basic Plan",
        billingCycle: editData?.interval === "year" ? "Yearly" : "Monthly",
        amount: editData?.price ? (editData.price / 100).toString() : "",
        avatarUrl: editData?.customer?.avatarUrl || "",
      })
      const symbol = editData?.customer?.currencySymbol || "$";
      const curr = CURRENCIES.find(c => c.symbol === symbol) || CURRENCIES[0];
      setSelectedCurrency(curr);
      setErrors({})
    }
  }, [isOpen, editData])

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.customerName) newErrors.customerName = "Customer name is required"
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (!formData.amount) newErrors.amount = "Amount is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const uploadData = new FormData()
      uploadData.append("file", file)
      uploadData.append("niche", businessType)

      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: uploadData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const result = await response.json()
      if (result.success && result.secure_url) {
        setFormData(prev => ({ ...prev, avatarUrl: result.secure_url }))
      } else {
        throw new Error(result.error || "Upload failed")
      }
    } catch (err) {
      console.error("[UPLOAD ERROR]", err)
      setErrors(prev => ({ ...prev, avatarUrl: "Failed to upload image. Please try again." }))
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const priceCents = Math.round(parseFloat(formData.amount) * 100)
      const interval = formData.billingCycle === "Monthly" ? "month" : "year"

      if (editData) {
        // 1. Patch customer details first
        if (editData.customerId) {
          const customerPayload = {
            name: formData.customerName,
            email: formData.email,
            avatarUrl: formData.avatarUrl || null,
            spent: priceCents,
            plan: formData.plan,
            currencySymbol: selectedCurrency.symbol,
          }

          const customerRes = await fetch(`/api/v1/customers/${editData.customerId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerPayload),
          })

          if (!customerRes.ok) {
            const errResult = await customerRes.json()
            throw new Error(errResult.error || "Failed to update customer details")
          }
        }

        // 2. Patch the contract attributes
        const payload = {
          plan: formData.plan,
          price: priceCents,
          interval,
        }

        const response = await fetch(`/api/v1/subscriptions/${editData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          const errResult = await response.json()
          throw new Error(errResult.error || "Failed to update subscription details")
        }
      } else {
        // 2. Create customer and contract sequentially
        let customerId = ""

        // Post to customer endpoint to create client profile
        const customerPayload = {
          name: formData.customerName,
          email: formData.email,
          avatarUrl: formData.avatarUrl || null,
          spent: priceCents,
          plan: formData.plan,
          currencySymbol: selectedCurrency.symbol,
        }

        const customerRes = await fetch("/api/v1/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerPayload),
        })

        if (!customerRes.ok) {
          const errResult = await customerRes.json()
          throw new Error(errResult.error || "Failed to create customer record")
        }

        const customerData = await customerRes.json()
        customerId = customerData.data.id

        // Post to subscription endpoint to create contract record
        const now = new Date()
        const nextBilling = new Date()
        nextBilling.setDate(now.getDate() + (formData.billingCycle === "Monthly" ? 30 : 365))

        const subscriptionPayload = {
          customerId,
          planId: formData.plan,
          status: "Active",
          price: priceCents,
          interval,
          lastPaymentAt: now.toISOString(),
          nextBillingAt: nextBilling.toISOString(),
        }

        const subResponse = await fetch("/api/v1/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscriptionPayload),
        })

        if (!subResponse.ok) {
          const errResult = await subResponse.json()
          throw new Error(errResult.error || "Failed to create subscription record")
        }
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error("[SUBMIT ERROR]", err)
      setErrors(prev => ({ ...prev, form: err instanceof Error ? err.message : "Failed to persist contract" }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#150a2e] rounded-3xl shadow-2xl overflow-hidden border border-slate-50 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#150a2e]/50">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {editData ? "Edit Plan & Contract" : "Create Plan & Contract"}
            </h3>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
              {editData ? "Update existing billing details and contract pricing" : "Add a new customer and activate their billing contract"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 max-h-[75vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
              {errors.form && (
                <div className="p-4 bg-rose-50/50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-600 dark:text-rose-400 text-xs font-bold leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errors.form}</span>
                </div>
              )}
              <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Customer / Client Name</label>
                      <input 
                        type="text" 
                        value={formData.customerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="e.g. John Doe"
                        className={cn("w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border rounded-2xl text-sm font-bold placeholder:text-slate-400 text-slate-900 dark:text-white focus:outline-none transition-all", errors.customerName ? "border-rose-500 focus:border-rose-500" : "border-slate-100 dark:border-white/5 focus:border-purple-500 focus:bg-white dark:focus:bg-transparent")}
                      />
                      {errors.customerName && <p className="text-xs text-rose-500 font-bold ml-1">{errors.customerName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g. john@company.com"
                        className={cn("w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border rounded-2xl text-sm font-bold placeholder:text-slate-400 text-slate-900 dark:text-white focus:outline-none transition-all", errors.email ? "border-rose-500 focus:border-rose-500" : "border-slate-100 dark:border-white/5 focus:border-purple-500 focus:bg-white dark:focus:bg-transparent")}
                      />
                      {errors.email && <p className="text-xs text-rose-500 font-bold ml-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Customer Logo / Avatar</label>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      
                      {formData.avatarUrl ? (
                        <div className="border border-purple-200 dark:border-purple-800/60 rounded-2xl p-4 bg-purple-50/40 dark:bg-purple-950/30 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-1 overflow-hidden shrink-0 flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={formData.avatarUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-purple-900 dark:text-purple-300">Image uploaded</p>
                              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Ready to link</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, avatarUrl: "" }))}
                            className="text-xs font-black text-rose-600 hover:text-rose-700"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="w-full py-5 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/30 dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 cursor-pointer"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                              <span className="text-xs font-bold text-purple-600">Uploading to Cloudinary...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-slate-400" />
                              <span className="text-xs font-bold">Click to upload brand logo</span>
                            </>
                          )}
                        </button>
                      )}
                      {errors.avatarUrl && <p className="text-xs text-rose-500 font-bold ml-1">{errors.avatarUrl}</p>}
                    </div>

                {/* Plan Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 relative" ref={dropdownRef}>
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Select Tier / Package</label>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={cn(
                        "w-full px-5 py-3.5 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-sm font-bold text-slate-900 dark:text-white text-left flex items-center justify-between transition-all hover:bg-slate-100/50 dark:hover:bg-white/10",
                        isDropdownOpen && "ring-2 ring-purple-500/20 border-purple-200 dark:border-purple-500/50"
                      )}
                    >
                      {formData.plan}
                      <ChevronDown className={cn("w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform", isDropdownOpen && "rotate-180")} />
                    </button>

                    {/* Custom Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-[150] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                        {plans.map((plan) => (
                          <button
                            key={plan}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, plan })
                              setIsDropdownOpen(false)
                            }}
                            className={cn(
                              "w-full px-5 py-3 text-sm font-bold text-left flex items-center justify-between transition-colors",
                              formData.plan === plan 
                                ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" 
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                            )}
                          >
                            {plan}
                            {formData.plan === plan && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Amount</label>
                    <div className={cn(
                      "flex w-full rounded-2xl border bg-slate-50/50 dark:bg-white/5 transition-all focus-within:ring-2 focus-within:ring-purple-500/20",
                      errors.amount 
                        ? "border-rose-200 dark:border-rose-500/30 bg-rose-50/30 dark:bg-rose-500/5" 
                        : "border-slate-100 dark:border-white/5"
                    )}>
                      {/* Currency Selector Dropdown */}
                      <div className="relative border-r border-slate-100 dark:border-white/5 shrink-0" ref={currencyDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                          className="h-full px-4 text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 transition-all hover:bg-slate-100/50 dark:hover:bg-white/10 cursor-pointer rounded-l-2xl"
                        >
                          <span className="text-lg">{selectedCurrency.symbol}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {isCurrencyDropdownOpen && (
                          <div className="absolute top-[calc(100%+8px)] left-0 w-[180px] bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-[150] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                            {CURRENCIES.map((curr) => (
                              <button
                                key={curr.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCurrency(curr)
                                  setIsCurrencyDropdownOpen(false)
                                }}
                                className={cn(
                                  "w-full px-5 py-2.5 text-xs font-bold text-left flex items-center justify-between transition-colors",
                                  selectedCurrency.code === curr.code
                                    ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                )}
                              >
                                <span>{curr.name} ({curr.symbol})</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Amount Input */}
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="0.00"
                        className={cn(
                          "flex-1 min-w-0 px-4 py-3.5 bg-transparent text-sm font-bold focus:outline-none dark:placeholder-slate-600",
                          errors.amount 
                            ? "text-rose-900 dark:text-rose-400" 
                            : "text-slate-900 dark:text-white"
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Cycle */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Billing Cycle / Payment Frequency</label>
                  <div className="flex gap-4">
                    {["Monthly", "Yearly"].map((cycle) => (
                      <button
                        key={cycle}
                        type="button"
                        onClick={() => setFormData({...formData, billingCycle: cycle})}
                        className={cn(
                          "flex-1 py-3.5 rounded-2xl text-sm font-bold border transition-all cursor-pointer",
                          formData.billingCycle === cycle 
                            ? "bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400" 
                            : "bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
                        )}
                      >
                        {cycle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="flex-[2] py-4 bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving...</span>
                    </>
                  ) : (editData ? "Save Changes" : "Create Plan & Contract")}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  )
}
