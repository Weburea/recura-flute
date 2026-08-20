"use client"

import * as React from "react"
import { X, AlertCircle, Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { NicheConfig } from "@/config/niche-registry"

interface AddCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  businessType: string
  nicheConfig: NicheConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editData?: any
}

export function AddCustomerModal({
  isOpen,
  onClose,
  onSuccess,
  businessType,
  nicheConfig,
  editData,
}: AddCustomerModalProps) {
  const [formData, setFormData] = React.useState<Record<string, string>>({
    name: "",
    email: "",
    plan: "",
    spent: "",
    avatarUrl: "",
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: editData?.name || "",
        email: editData?.email || "",
        plan: editData?.plan || "",
        spent: editData?.spent ? (editData.spent / 100).toString() : "",
        avatarUrl: editData?.avatarUrl || editData?.avatar || "",
      })
      setErrors({})
    }
  }, [isOpen, editData])

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = `${nicheConfig.entityLabel} name is required`
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    
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
      const spentCents = formData.spent ? Math.round(parseFloat(formData.spent) * 100) : 0
      
      const payload = {
        name: formData.name,
        email: formData.email,
        status: editData?.status || "Active",
        plan: formData.plan || null,
        spent: spentCents,
        avatarUrl: formData.avatarUrl || null,
      }

      const url = editData ? `/api/v1/customers/${editData.id}` : "/api/v1/customers"
      const method = editData ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errResult = await response.json()
        throw new Error(errResult.error || `Failed to ${editData ? 'update' : 'create'} customer`)
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error("[SUBMIT ERROR]", err)
      setErrors(prev => ({ ...prev, form: err instanceof Error ? err.message : "Failed to save record" }))
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
      
      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#150a2e] rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-white/10 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#150a2e]/50">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {editData ? `Edit ${nicheConfig.entityLabel}` : nicheConfig.ctaLabel}
            </h3>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
              {editData ? "Update client details and campaign mapping" : `Create new profile for ${nicheConfig.entityLabel.toLowerCase()}`}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
              {errors.form && (
                <div className="p-4 bg-rose-50/50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-600 dark:text-rose-400 text-xs font-bold leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errors.form}</span>
                </div>
              )}

              {nicheConfig.formFields.map(field => {
                const hasError = !!errors[field.id]
                
                if (field.type === "file") {
                  return (
                    <div key={field.id} className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{field.label}</label>
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
                              <p className="text-xs font-bold text-gray-900 dark:text-white">Image uploaded</p>
                              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Ready to save</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, avatarUrl: "" }))}
                            className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className={cn(
                            "border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group flex flex-col items-center justify-center",
                            isUploading 
                              ? "border-purple-400 bg-purple-50/20 dark:bg-purple-950/20"
                              : "border-slate-200 dark:border-white/10 bg-slate-50/20 dark:bg-white/5 hover:border-purple-400 hover:bg-purple-50/10"
                          )}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-6 h-6 animate-spin text-purple-600 mb-2" />
                              <p className="text-xs font-bold text-slate-500">Uploading to Cloudinary...</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors mb-2" />
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload logo / photo</p>
                              <p className="text-[10px] text-slate-400 mt-1 font-semibold">JPG, PNG, or SVG</p>
                            </>
                          )}
                        </div>
                      )}
                      
                      {errors.avatarUrl && (
                        <p className="text-xs font-bold text-rose-500 flex items-center gap-1 ml-1">
                          <AlertCircle className="w-3 h-3" /> {errors.avatarUrl}
                        </p>
                      )}
                    </div>
                  )
                }

                return (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id] || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder || ""}
                      className={cn(
                        "w-full px-5 py-3.5 rounded-2xl border bg-slate-50/50 dark:bg-white/5 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:placeholder-slate-600",
                        hasError 
                          ? "border-rose-200 dark:border-rose-500/30 bg-rose-50/30 dark:bg-rose-500/5 text-rose-900 dark:text-rose-400" 
                          : "border-slate-100 dark:border-white/5 text-slate-900 dark:text-white"
                      )}
                    />
                    {hasError && (
                      <p className="text-xs font-bold text-rose-500 flex items-center gap-1 ml-1">
                        <AlertCircle className="w-3 h-3" /> {errors[field.id]}
                      </p>
                    )}
                  </div>
                )
              })}

              <div className="pt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting || isUploading}
                  className="flex-1 py-4 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="flex-[2] py-4 bg-[#1A1829] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving...</span>
                    </>
                  ) : nicheConfig.ctaLabel}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  )
}
