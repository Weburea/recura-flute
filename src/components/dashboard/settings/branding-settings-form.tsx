"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Upload, ChevronDown, Check, Save, Monitor, Bell, Search, Building2, CreditCard, LayoutDashboard } from "lucide-react"
import { StatusModal, StatusType } from "@/components/dashboard/shared/modals/status-modal"

interface BrandingFormData {
  companyName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  fontFamily: string
  headingWeight: string
  buttonStyle: string
  themeMode: string
  emailBranding: boolean
  invoiceBranding: boolean
  customLoginScreen: boolean
  whiteLabelMode: boolean
  vanityUrl: string
}

const Switch = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => (
  <button 
    type="button"
    onClick={() => onChange(!checked)}
    className={cn(
      "w-11 h-6 rounded-full transition-colors relative flex items-center shadow-inner",
      checked ? "bg-purple-600" : "bg-slate-200 dark:bg-white/10"
    )}
  >
    <span className={cn(
      "w-5 h-5 bg-white rounded-full shadow-md transition-transform transform absolute left-0.5",
      checked ? "translate-x-5" : "translate-x-0"
    )} />
  </button>
)

const FileUploadButton = ({ label, className, onUpload }: { label: string, className?: string, onUpload: (label: string, e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <label className={cn("cursor-pointer flex items-center gap-1 transition-colors text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400", className)}>
    <Upload className="w-3 h-3" />
    Upload
    <input 
      type="file" 
      className="hidden" 
      accept="image/*"
      onChange={(e) => onUpload(label, e)}
    />
  </label>
)

export function BrandingSettingsForm() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<BrandingFormData>({
    companyName: "Recura",
    primaryColor: "#7c3aed",
    secondaryColor: "#c026d3",
    accentColor: "#a855f7",
    textColor: "#0f0720",
    fontFamily: "Inter",
    headingWeight: "Bold",
    buttonStyle: "Rounded",
    themeMode: "Light",
    emailBranding: true,
    invoiceBranding: true,
    customLoginScreen: true,
    whiteLabelMode: false,
    vanityUrl: "app.company.com"
  })

  const [isFontOpen, setIsFontOpen] = useState(false)
  const fontRef = useRef<HTMLDivElement>(null)
  const fontOptions = ["Inter", "Roboto", "Outfit", "Plus Jakarta Sans"]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fontRef.current && !fontRef.current.contains(event.target as Node)) {
        setIsFontOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<StatusType>("success")
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFontChange = (value: string) => {
    setFormData(prev => ({ ...prev, fontFamily: value }))
    setIsFontOpen(false)
  }

  const setSetting = (key: keyof BrandingFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would be an API call
    console.log("Branding Settings Saved:", formData)
    
    setModalType("success")
    setModalTitle("Settings Saved")
    setModalMessage("Your branding preferences have been updated and are now live across your dashboard.")
    setShowModal(true)
  }

  const handleFileUpload = (label: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      
      if (
        label === "Main Brand Logo" || 
        label === "Upload Main Logo" || 
        label === "Upload Square Logo"
      ) {
        setLogoUrl(url)
      }
      
      setModalType("success")
      setModalTitle("File Uploaded")
      setModalMessage(`${label} successfully selected: ${file.name}`)
      setShowModal(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      
      {/* LEFT: Branding Settings Column */}
      <div className="xl:col-span-8 space-y-8">
        
        {/* Section 1: Brand Identity & Colors (Top Horizontal Row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand Identity Card */}
          <div className="bg-white dark:bg-[#150a2e] rounded-3xl border border-slate-100 dark:border-white/10 p-8 shadow-sm space-y-6 flex flex-col h-full">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Building2 className="w-5 h-5" />
              </div>
              Brand Identity
            </h2>
            
            <div className="flex items-center justify-between p-5 border border-slate-100 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-sm overflow-hidden"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    formData.companyName.charAt(0)
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{formData.companyName}</span>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Primary Branding</span>
                </div>
              </div>
              <FileUploadButton 
                label="Main Brand Logo" 
                onUpload={handleFileUpload} 
                className="text-xs px-4 py-2 border border-slate-200 dark:border-white/10 rounded-xl font-bold bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/20 shadow-sm" 
              />
            </div>

            <div className="space-y-4 flex-1">
              {[
                { label: "Upload Main Logo" },
                { label: "Upload Dark Mode Logo", icon: <Monitor className="w-4 h-4 text-slate-400" /> },
                { label: "Upload Square Logo" },
                { label: "Upload Favicon" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-white/5 last:border-0 hover:bg-slate-50/30 dark:hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors">
                  <div className="flex items-center gap-3">
                    {item.icon || <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />}
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{item.label}</span>
                  </div>
                  <FileUploadButton label={item.label} onUpload={handleFileUpload} className="text-xs font-bold" />
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-50 dark:border-white/10">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                Company Display Name
              </label>
              <input 
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:border-purple-600 dark:focus:border-purple-500 text-slate-900 dark:text-white font-bold transition-all"
                placeholder="Enter company name"
              />
            </div>
          </div>

          {/* Brand Colors Card */}
          <div className="bg-white dark:bg-[#150a2e] rounded-3xl border border-slate-100 dark:border-white/10 p-8 shadow-sm space-y-6 flex flex-col h-full">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              Brand Colors
            </h2>
            
            <div className="grid grid-cols-1 gap-5 flex-1">
              {[
                { name: "primaryColor", label: "Primary Color" },
                { name: "secondaryColor", label: "Secondary Color" },
                { name: "accentColor", label: "Accent Color" },
              ].map((color) => (
                <div key={color.name} className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{color.label}</label>
                    <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded border border-slate-100 dark:border-white/10 uppercase">
                      {formData[color.name as keyof BrandingFormData]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 shadow-sm cursor-pointer group">
                      <input 
                        type="color" 
                        name={color.name}
                        value={formData[color.name as keyof BrandingFormData] as string}
                        onChange={handleChange}
                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-none bg-transparent"
                      />
                    </div>
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        name={color.name}
                        value={formData[color.name as keyof BrandingFormData] as string}
                        onChange={handleChange}
                        className="w-full uppercase px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-600/10 focus:bg-white dark:focus:bg-white/10 text-slate-700 dark:text-slate-200 font-mono text-sm font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-2 pt-4 border-t border-slate-50 dark:border-white/10 mt-auto">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Text Color</label>
                  <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-black border border-emerald-100 dark:border-emerald-500/20">
                    <Check className="w-3 h-3" /> WCAG PASS
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 shadow-sm cursor-pointer">
                    <input 
                      type="color" 
                      name="textColor"
                      value={formData.textColor}
                      onChange={handleChange}
                      className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-none bg-transparent"
                    />
                  </div>
                  <input 
                    type="text" 
                    name="textColor"
                    value={formData.textColor}
                    onChange={handleChange}
                    className="flex-1 uppercase px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-600/10 focus:bg-white dark:focus:bg-white/10 text-slate-700 dark:text-slate-200 font-mono text-sm font-bold transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Typography & Experience (Middle Horizontal Row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Typography & UI Style Card */}
          <div className="bg-white dark:bg-[#150a2e] rounded-3xl border border-slate-100 dark:border-white/10 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              Typography & UI Style
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2" ref={fontRef}>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Font Family</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsFontOpen(!isFontOpen)}
                    className={cn(
                      "w-full px-5 py-3.5 rounded-2xl border bg-white dark:bg-white/5 focus:outline-none transition-all text-slate-900 dark:text-white flex items-center justify-between group h-[52px]",
                      isFontOpen ? "border-purple-600 dark:border-purple-500 ring-4 ring-purple-600/5 shadow-sm" : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                    )}
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200">{formData.fontFamily}</span>
                    <ChevronDown className={cn("w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform duration-200", isFontOpen ? "rotate-180" : "group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                  </button>
                  
                  <div className={cn(
                    "absolute z-20 w-full mt-2 bg-white dark:bg-[#1e143d] border border-slate-100 dark:border-white/10 rounded-3xl shadow-2xl shadow-slate-200/60 dark:shadow-none py-3 transition-all duration-200 transform origin-top left-0 overflow-hidden",
                    isFontOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  )}>
                    {fontOptions.map((font) => (
                      <button
                        key={font}
                        type="button"
                        onClick={() => handleFontChange(font)}
                        className={cn(
                          "w-full text-left px-6 py-3.5 text-sm transition-colors flex items-center justify-between",
                          formData.fontFamily === font ? "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 font-black" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 font-bold"
                        )}
                      >
                        {font}
                        {formData.fontFamily === font && <Check className="w-4 h-4 text-purple-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Heading Weight</label>
                  <div className="flex bg-slate-100/80 dark:bg-white/5 rounded-2xl p-1.5">
                    {["Medium", "Bold"].map(weight => (
                      <button
                        key={weight}
                        type="button"
                        onClick={() => setSetting("headingWeight", weight)}
                        className={cn(
                          "flex-1 px-4 py-3 rounded-xl text-sm transition-all focus:outline-none",
                          formData.headingWeight === weight 
                            ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white font-black shadow-sm" 
                            : "text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200"
                        )}
                      >
                        {weight}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Theme Mode</label>
                  <div className="flex bg-slate-100/80 dark:bg-white/5 rounded-2xl p-1.5 w-full">
                    {["Light", "Dark", "Auto"].map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setSetting("themeMode", mode)}
                        className={cn(
                          "flex-1 px-4 py-3 rounded-xl text-sm transition-all focus:outline-none whitespace-nowrap",
                          formData.themeMode === mode 
                            ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white font-black shadow-sm" 
                            : "text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200"
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Button Style</label>
                <div className="flex items-center gap-3">
                  {[
                    { name: "Rounded", class: "rounded-full" },
                    { name: "Soft", class: "rounded-2xl" },
                    { name: "Sharp", class: "rounded-md" }
                  ].map(style => (
                    <button
                      key={style.name}
                      type="button"
                      onClick={() => setSetting("buttonStyle", style.name)}
                      className={cn(
                        "flex-1 py-3 px-4 border transition-all text-xs font-black text-center shadow-sm",
                        style.class,
                        formData.buttonStyle === style.name 
                          ? "bg-gradient-to-r from-primary to-secondary border-transparent text-white shadow-xl shadow-purple-600/20" 
                          : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10"
                      )}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Experience Card */}
          <div className="dashboard-card space-y-6 flex flex-col h-full">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400">
                <Bell className="w-5 h-5" />
              </div>
              Experience Settings
            </h2>

            <div className="space-y-2 flex-1">
              {[
                { id: "emailBranding", label: "Email Branding", desc: "Add logo and colors to customer emails" },
                { id: "invoiceBranding", label: "Invoice Branding", desc: "Customize invoices with your brand Identity" },
                { id: "customLoginScreen", label: "Custom Login", desc: "branded portal login for your users" }
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/10 group">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-800 dark:text-slate-200 text-sm tracking-tight">{item.label}</span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors uppercase tracking-wider">{item.desc}</span>
                  </div>
                  <Switch 
                    checked={formData[item.id as keyof BrandingFormData] as boolean} 
                    onChange={(val) => setSetting(item.id as keyof BrandingFormData, val)}
                  />
                </div>
              ))}
            </div>
            
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl shadow-slate-200 dark:shadow-none relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-purple-600/30 transition-all duration-500" />
               <div className="flex items-center justify-between mb-3 relative z-10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <span className="font-black text-base text-white">White Label Mode</span>
                 </div>
                 <Switch 
                  checked={formData.whiteLabelMode} 
                  onChange={(val) => setSetting("whiteLabelMode", val)}
                />
               </div>
               <p className="text-xs text-slate-400 font-bold leading-relaxed relative z-10">
                 Remove Recura indicators for a pure brand experience. <span className="text-purple-400">Requires Pro Plan</span>
               </p>
            </div>
          </div>
        </div>

        {/* Section 3: Advanced Settings (Bottom Sticky-ish Save Bar) */}
        <div className="bg-white dark:bg-[#150a2e] rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-100 dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-6 p-6">
           <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-3">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Vanity URL</label>
                <div className="h-4 w-px bg-slate-100 dark:bg-white/10" />
                <button type="button" className="text-xs font-black text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                  DNS SETUP GUIDE
                </button>
              </div>
              <div className="flex gap-3 w-full max-w-md mt-1">
                <input 
                  type="text" 
                  name="vanityUrl"
                  value={formData.vanityUrl}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-600/10 focus:bg-white dark:focus:bg-white/10 text-slate-900 dark:text-white font-bold text-sm transition-all h-[40px] sm:h-[44px]"
                />
              </div>
           </div>

           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="hidden sm:flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2.5 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider">Synced</span>
              </div>
              <button 
                type="submit"
                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-purple-600 text-white font-black text-sm tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20 active:scale-95 uppercase"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
           </div>
        </div>
      </div>

      {/* RIGHT: Live Preview Column (Sticky) */}
      <div className="xl:col-span-4 h-full">
        <div className="sticky top-28 space-y-6">
          <div className="bg-white dark:bg-[#150a2e] rounded-3xl border border-slate-100 dark:border-white/10 space-y-4 bg-slate-100/50 dark:bg-white/5 border-slate-200/60 p-6 md:p-8 flex flex-col shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Real-time Preview</h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase">Live</span>
              </div>
            </div>
            
            {/* The Mini Dashboard Preview */}
            <div 
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-200/80 dark:border-white/10 mx-auto w-full max-w-[340px] min-h-[550px] flex flex-col transition-all duration-500 relative flex-1 group/preview hover:scale-[1.02]"
              style={{ fontFamily: formData.fontFamily === 'Inter' ? undefined : formData.fontFamily }}
            >
               {/* Browser mock header */}
               <div className="bg-slate-50 dark:bg-slate-800 h-10 flex items-center px-4 gap-2 border-b border-slate-200/50 dark:border-white/5 shrink-0">
                 <div className="w-2.5 h-2.5 rounded-full bg-rose-400/50" />
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/50" />
                 <div className="mx-auto w-24 h-2 bg-slate-200/70 dark:bg-slate-700 rounded-full" />
               </div>

               {/* Mini App Body */}
               <div className="flex flex-1 overflow-hidden" style={{ background: formData.themeMode === 'Dark' ? '#0F172A' : '#F8FAFC' }}>
                  
                  {/* Sidebar Mini */}
                  <div className={cn(
                    "w-16 shrink-0 border-r flex flex-col py-6 px-2 items-center gap-6 transition-colors duration-500",
                    formData.themeMode === 'Dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200/60 bg-white'
                  )}>
                    <div 
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transform transition-transform group-hover/preview:scale-110 text-2xl overflow-hidden"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        formData.companyName.charAt(0)
                      )}
                    </div>
                    
                    <div className="w-full flex-1 space-y-4 mt-2">
                       {/* Mock items */}
                       <div className="w-10 h-10 rounded-2xl mx-auto flex items-center justify-center bg-purple-50 text-purple-600 shadow-sm border border-purple-100" style={{ backgroundColor: `${formData.primaryColor}10`, color: formData.primaryColor, borderColor: `${formData.primaryColor}20` }}>
                         <LayoutDashboard className="w-5 h-5" />
                       </div>
                       {[Building2, CreditCard, Bell].map((Icon, i) => (
                        <div key={i} className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center transition-all mx-auto",
                          formData.themeMode === 'Dark' ? 'text-slate-600 hover:text-slate-400 hover:bg-slate-800' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main Content Mini */}
                  <div className="flex-1 p-6 flex flex-col gap-6 relative overflow-hidden">
                    {/* Header Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full -mr-16 -mt-16 transition-colors duration-1000" style={{ backgroundColor: formData.secondaryColor }} />

                    {/* Header line */}
                    <div className="flex justify-between items-center relative z-10">
                      <div 
                        className="text-2xl tracking-tight transition-all duration-500"
                        style={{ 
                          fontWeight: formData.headingWeight === 'Bold' ? 900 : 500,
                          color: formData.themeMode === 'Dark' ? '#F1F5F9' : formData.textColor
                        }}
                      >
                        {formData.companyName}
                      </div>
                      <div className="flex gap-2">
                        <div className={cn("w-8 h-8 rounded-2xl flex items-center justify-center border transition-colors duration-500", formData.themeMode === 'Dark' ? 'bg-slate-800 bg-slate-800 border-slate-700' : 'bg-white shadow-sm border-slate-100')}>
                          <Bell className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    {/* Stats mini */}
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                       <div className={cn("h-24 rounded-3xl border p-4 flex flex-col justify-end gap-1 shadow-sm transition-all duration-500", formData.themeMode === 'Dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-100')}>
                         <div className="w-10 h-1.5 rounded-full bg-slate-200/50 mb-auto" />
                         <div className="w-16 h-4 rounded-full" style={{ backgroundColor: formData.textColor, opacity: 0.8 }} />
                         <div className="w-8 h-1.5 rounded-full bg-emerald-500/20" />
                       </div>
                       <div className={cn("h-24 rounded-3xl border p-4 flex flex-col justify-end gap-1 shadow-sm transition-all duration-500", formData.themeMode === 'Dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-100')}>
                          <div className="w-10 h-1.5 rounded-full bg-slate-200/50 mb-auto" />
                          <div className="w-14 h-4 rounded-full" style={{ backgroundColor: formData.primaryColor, opacity: 0.8 }} />
                          <div className="w-6 h-1.5 rounded-full bg-purple-500/20" />
                       </div>
                    </div>

                    {/* Action element mini */}
                    <div className={cn("mt-auto p-5 rounded-[2rem] border flex flex-col items-center gap-4 text-center shadow-lg transition-all duration-500 relative z-10", formData.themeMode === 'Dark' ? 'bg-slate-800 border-slate-700 shadow-none' : 'bg-white border-slate-100')}>
                       <div className="w-full h-11 rounded-2xl bg-slate-50 flex items-center px-4 transition-colors duration-500" style={{ background: formData.themeMode === 'Dark' ? '#1E293B' : '#F1F5F9' }}>
                         <Search className="w-4 h-4 text-slate-400" />
                         <div className="ml-3 w-20 h-2 bg-slate-200/50 rounded-full" />
                       </div>
                       <button 
                         type="button"
                         className={cn(
                           "w-full py-3.5 text-xs font-black text-white transition-all shadow-xl active:scale-95 uppercase tracking-[0.1em]",
                           formData.buttonStyle === 'Rounded' ? 'rounded-full' : formData.buttonStyle === 'Soft' ? 'rounded-[1.25rem]' : 'rounded-md'
                         )}
                         style={{ 
                            backgroundColor: formData.accentColor,
                            boxShadow: `0 10px 15px -3px ${formData.accentColor}40`
                         }}
                       >
                         Create Invoice
                       </button>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-[#150a2e] rounded-2xl p-4 border border-slate-200/80 dark:border-white/10 shadow-sm mt-2">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                 <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
                   Preview represents a <span className="text-slate-800 dark:text-slate-200">standard dashboard</span> with your current brand configuration.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <StatusModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
      />
    </form>
  )
}
