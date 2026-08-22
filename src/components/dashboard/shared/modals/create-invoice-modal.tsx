"use client"

import * as React from "react"
import Image from "next/image"
import { X, Loader2, Calendar, Check, ChevronDown, Search, Plus, Trash2, Globe, Phone, MapPin, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/context/user-context"

interface CreateInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (newInvoice: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoiceToEdit?: any
}

interface ItemRow {
  description: string
  qty: number
  price: string
}

interface PhoneCountry {
  name: string
  code: string
  phonePrefix: string
  flag: string
  regex: RegExp
  format: string
  maxLength: number
}

const PHONE_COUNTRIES: PhoneCountry[] = [
  { name: "United States", code: "US", phonePrefix: "+1", flag: "🇺🇸", regex: /^\d{10}$/, format: "10 digits: 202 555 0199", maxLength: 10 },
  { name: "Nigeria", code: "NG", phonePrefix: "+234", flag: "🇳🇬", regex: /^\d{10,11}$/, format: "10 or 11 digits: 803 123 4567", maxLength: 11 },
  { name: "United Kingdom", code: "GB", phonePrefix: "+44", flag: "🇬🇧", regex: /^\d{10}$/, format: "10 digits: 7911 123456", maxLength: 10 },
  { name: "Germany", code: "DE", phonePrefix: "+49", flag: "🇩🇪", regex: /^\d{10,11}$/, format: "10 or 11 digits: 170 1234567", maxLength: 11 },
  { name: "Switzerland", code: "CH", phonePrefix: "+41", flag: "🇨🇭", regex: /^\d{9}$/, format: "9 digits: 79 123 45 67", maxLength: 9 },
  { name: "Canada", code: "CA", phonePrefix: "+1", flag: "🇨🇦", regex: /^\d{10}$/, format: "10 digits: 202 555 0199", maxLength: 10 },
  { name: "France", code: "FR", phonePrefix: "+33", flag: "🇫🇷", regex: /^\d{9}$/, format: "9 digits: 6 1234 5678", maxLength: 9 },
  { name: "Australia", code: "AU", phonePrefix: "+61", flag: "🇦🇺", regex: /^\d{9}$/, format: "9 digits: 412 345 678", maxLength: 9 },
  { name: "India", code: "IN", phonePrefix: "+91", flag: "🇮🇳", regex: /^\d{10}$/, format: "10 digits: 98765 43210", maxLength: 10 },
  { name: "South Africa", code: "ZA", phonePrefix: "+27", flag: "🇿🇦", regex: /^\d{9}$/, format: "9 digits: 82 123 4567", maxLength: 9 },
  { name: "Kenya", code: "KE", phonePrefix: "+254", flag: "🇰🇪", regex: /^\d{9,10}$/, format: "9 or 10 digits: 712 345 678", maxLength: 10 },
  { name: "Ghana", code: "GH", phonePrefix: "+233", flag: "🇬🇭", regex: /^\d{9}$/, format: "9 digits: 24 123 4567", maxLength: 9 },
  { name: "Brazil", code: "BR", phonePrefix: "+55", flag: "🇧🇷", regex: /^\d{11}$/, format: "11 digits: 11 91234 5678", maxLength: 11 },
  { name: "China", code: "CN", phonePrefix: "+86", flag: "🇨🇳", regex: /^\d{11}$/, format: "11 digits: 139 1234 5678", maxLength: 11 },
  { name: "Japan", code: "JP", phonePrefix: "+81", flag: "🇯🇵", regex: /^\d{10}$/, format: "10 digits: 90 1234 5678", maxLength: 10 },
  { name: "Mexico", code: "MX", phonePrefix: "+52", flag: "🇲🇽", regex: /^\d{10}$/, format: "10 digits: 55 1234 5678", maxLength: 10 },
  { name: "Spain", code: "ES", phonePrefix: "+34", flag: "🇪🇸", regex: /^\d{9}$/, format: "9 digits: 612 345 678", maxLength: 9 },
  { name: "Italy", code: "IT", phonePrefix: "+39", flag: "🇮🇹", regex: /^\d{10}$/, format: "10 digits: 312 345 6789", maxLength: 10 },
  { name: "Netherlands", code: "NL", phonePrefix: "+31", flag: "🇳🇱", regex: /^\d{9}$/, format: "9 digits: 6 1234 5678", maxLength: 9 },
  { name: "Singapore", code: "SG", phonePrefix: "+65", flag: "🇸🇬", regex: /^\d{8}$/, format: "8 digits: 8123 4567", maxLength: 8 },
  { name: "United Arab Emirates", code: "AE", phonePrefix: "+971", flag: "🇦🇪", regex: /^\d{9}$/, format: "9 digits: 50 123 4567", maxLength: 9 },
]

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "Pound Sterling" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
]

export function CreateInvoiceModal({
  isOpen,
  onClose,
  onSuccess,
  invoiceToEdit,
}: CreateInvoiceModalProps) {
  const { workspace } = useUser()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customers, setCustomers] = React.useState<any[]>([])
  const [isLoadingCustomers, setIsLoadingCustomers] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)

  // Wizard tab: 'choose' | 'new'
  const [activeTab, setActiveTab] = React.useState<'choose' | 'new'>('choose')

  // Search & custom dropdown state for existing customer select
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [optionSearchQuery, setOptionSearchQuery] = React.useState("")
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Form States
  const [selectedCustomerId, setSelectedCustomerId] = React.useState("")
  
  // Custom details to enter/override
  const [customerDetails, setCustomerDetails] = React.useState({
    name: "",
    email: "",
    logoUrl: "",
    address: "",
    phone: "",
  })

  // Country combobox selection
  const [selectedCountry, setSelectedCountry] = React.useState(PHONE_COUNTRIES[0])
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = React.useState(false)
  const [countrySearchQuery, setCountrySearchQuery] = React.useState("")
  const countryDropdownRef = React.useRef<HTMLDivElement>(null)

  // Currency Selection
  const [selectedCurrency, setSelectedCurrency] = React.useState(CURRENCIES[0])
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = React.useState(false)
  const currencyDropdownRef = React.useRef<HTMLDivElement>(null)

  // Date picker range popover state
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false)
  const [rangeStart, setRangeStart] = React.useState<Date | null>(new Date())
  const [rangeEnd, setRangeEnd] = React.useState<Date | null>(() => {
    // Default to 7 days from now
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d
  })
  const [currentCalendarMonth, setCurrentCalendarMonth] = React.useState(new Date())
  const datePickerRef = React.useRef<HTMLDivElement>(null)

  // Terms and Conditions
  const [terms, setTerms] = React.useState("")

  const [items, setItems] = React.useState<ItemRow[]>([
    { description: "Product Subscription - Monthly Retainer", qty: 1, price: "" }
  ])

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Reset tab values to avoid avatar/logo state leakage
  React.useEffect(() => {
    if (invoiceToEdit) return
    setSelectedCustomerId("")
    setCustomerDetails({
      name: "",
      email: "",
      logoUrl: "",
      address: "",
      phone: "",
    })
    setErrors({})
  }, [activeTab, invoiceToEdit])

  // Pre-populate form values when editing an invoice
  React.useEffect(() => {
    if (isOpen && invoiceToEdit) {
      if (isLoadingCustomers) return
      
      const meta = invoiceToEdit.metadata || {}
      const hasCustomer = customers.some(c => c.id === invoiceToEdit.customerId)
      
      if (!hasCustomer) {
        setActiveTab("new")
        setCustomerDetails({
          name: meta.customerName || "",
          email: meta.customerEmail || "",
          logoUrl: meta.customerLogo || "",
          address: meta.customerAddress ? meta.customerAddress.split(`, ${selectedCountry.name}`)[0] : "",
          phone: meta.customerPhone ? meta.customerPhone.replace(selectedCountry.phonePrefix, "").trim() : "",
        })
      } else {
        setActiveTab("choose")
        setSelectedCustomerId(invoiceToEdit.customerId)
        setCustomerDetails({
          name: meta.customerName || "",
          email: meta.customerEmail || "",
          logoUrl: meta.customerLogo || "",
          address: meta.customerAddress || "",
          phone: meta.customerPhone || "",
        })
      }

      const curr = CURRENCIES.find(c => c.code === meta.currency) || CURRENCIES[0]
      setSelectedCurrency(curr)

      if (meta.customerPhone) {
        const countryMatch = PHONE_COUNTRIES.find(c => meta.customerPhone.startsWith(c.phonePrefix))
        if (countryMatch) {
          setSelectedCountry(countryMatch)
        }
      }

      if (meta.items && Array.isArray(meta.items)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setItems(meta.items.map((item: any) => ({
          description: item.description,
          qty: item.qty,
          price: item.price.toString()
        })))
      }

      if (meta.issuedDate) {
        setRangeStart(new Date(meta.issuedDate))
      }
      if (invoiceToEdit.dueDate) {
        setRangeEnd(new Date(invoiceToEdit.dueDate))
      }

      setTerms(meta.terms || "")
    } else if (isOpen) {
      setSelectedCustomerId("")
      setCustomerDetails({
        name: "",
        email: "",
        logoUrl: "",
        address: "",
        phone: "",
      })
      setSelectedCurrency(CURRENCIES[0])
      setItems([{ description: "Product Subscription - Monthly Retainer", qty: 1, price: "" }])
      setTerms("")
      setRangeStart(new Date())
      const d = new Date()
      d.setDate(d.getDate() + 7)
      setRangeEnd(d)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceToEdit, isOpen, customers, isLoadingCustomers])

  // Fetch customers for choose tab
  React.useEffect(() => {
    if (isOpen && activeTab === 'choose') {
      setIsLoadingCustomers(true)
      fetch("/api/v1/customers")
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setCustomers(json.data || [])
          }
        })
        .catch(err => console.error("Failed to load customers:", err))
        .finally(() => setIsLoadingCustomers(false))
    }
  }, [isOpen, activeTab])

  // Auto-fill customer details when existing customer is selected
  React.useEffect(() => {
    if (activeTab === 'choose' && selectedCustomerId) {
      const match = customers.find(c => c.id === selectedCustomerId)
      if (match) {
        setCustomerDetails({
          name: match.name,
          email: match.email,
          logoUrl: match.avatarUrl || "",
          address: "",
          phone: "",
        })
      }
    }
  }, [selectedCustomerId, customers, activeTab])

  // Handle click outside dropdowns
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false)
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(target)) {
        setIsCountryDropdownOpen(false)
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(target)) {
        setIsCurrencyDropdownOpen(false)
      }
      if (datePickerRef.current && !datePickerRef.current.contains(target)) {
        setIsDatePickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset search queries on close
  React.useEffect(() => {
    if (!isDropdownOpen) setOptionSearchQuery("")
    if (!isCountryDropdownOpen) setCountrySearchQuery("")
  }, [isDropdownOpen, isCountryDropdownOpen])

  const selectedCustomerRecord = React.useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId)
  }, [customers, selectedCustomerId])

  const filteredOptions = React.useMemo(() => {
    if (!optionSearchQuery.trim()) return customers
    const q = optionSearchQuery.toLowerCase()
    return customers.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.email.toLowerCase().includes(q)
    )
  }, [customers, optionSearchQuery])

  const filteredCountries = React.useMemo(() => {
    if (!countrySearchQuery.trim()) return PHONE_COUNTRIES
    const q = countrySearchQuery.toLowerCase()
    return PHONE_COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.code.toLowerCase().includes(q) ||
      c.phonePrefix.includes(q)
    )
  }, [countrySearchQuery])

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCustomerDetails(prev => ({ ...prev, logoUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Add Item Row
  const addItemRow = () => {
    setItems(prev => [...prev, { description: "", qty: 1, price: "" }])
  }

  // Remove Item Row
  const removeItemRow = (idx: number) => {
    if (items.length <= 1) return
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  // Update Item Row values
  const updateItemRow = (idx: number, field: keyof ItemRow, value: string | number) => {
    setItems(prev => prev.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: value }
      }
      return item
    }))
  }

  // Compute subtotal amount
  const subtotal = React.useMemo(() => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0
      return sum + (price * item.qty)
    }, 0)
  }, [items])

  // Calendar Range picker helpers
  const formatDateLabel = (d: Date | null) => {
    if (!d) return ""
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handlePrevMonth = () => {
    setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1))
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDayIndex = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    
    const days = []
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null)
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const handleDayClick = (day: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day)
      setRangeEnd(null)
    } else {
      if (day < rangeStart) {
        setRangeStart(day)
      } else {
        setRangeEnd(day)
        setIsDatePickerOpen(false)
      }
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (activeTab === 'choose' && !selectedCustomerId) {
      newErrors.customerId = "Please select an existing customer profile"
    }
    if (activeTab === 'new') {
      if (!customerDetails.name.trim()) newErrors.customerName = "Business name is required"
      if (!customerDetails.email.trim() || !customerDetails.email.includes("@")) {
        newErrors.customerEmail = "Please enter a valid billing email"
      }
      // Country-specific Phone Number Validation
      if (customerDetails.phone.trim()) {
        const numericPhone = customerDetails.phone.replace(/[^0-9]/g, "")
        if (!selectedCountry.regex.test(numericPhone)) {
          newErrors.phone = `Invalid format for ${selectedCountry.name}. E.g. ${selectedCountry.format}`
        }
      }
    }
    if (!rangeEnd) {
      newErrors.dueDate = "Due date selection is required"
    }
    if (items.some(item => !item.description.trim())) {
      newErrors.items = "Please provide descriptions for all invoice items"
    }
    if (items.some(item => !item.price || isNaN(parseFloat(item.price)) || parseFloat(item.price) <= 0)) {
      newErrors.itemsPrice = "All items must have a valid price greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCloseClean = () => {
    setIsGenerating(false)
    setIsSubmitting(false)
    setSelectedCustomerId("")
    setCustomerDetails({ name: "", email: "", logoUrl: "", address: "", phone: "" })
    setItems([{ description: "Product Subscription - Monthly Retainer", qty: 1, price: "" }])
    setTerms("")
    setRangeStart(new Date())
    const d = new Date()
    d.setDate(d.getDate() + 7)
    setRangeEnd(d)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setIsGenerating(true)

    try {
      const amountCents = Math.round(subtotal * 100)
      
      // Auto-generate invoice number using the rule: INV_[random4]_[DDMMYY]_[WSNamePrefix]
      const randomPart = Math.floor(1000 + Math.random() * 9000)
      const dateObj = rangeStart || new Date()
      const dd = String(dateObj.getDate()).padStart(2, '0')
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
      const yy = String(dateObj.getFullYear()).slice(-2)
      const wsPart = (workspace?.name || "REC").slice(0, 3).toUpperCase()
      const generatedInvoiceNumber = `INV_${randomPart}${dd}${mm}${yy}_${wsPart}`

      // Prefix phone number with dial prefix
      const finalPhone = activeTab === 'new' && customerDetails.phone
        ? `${selectedCountry.phonePrefix} ${customerDetails.phone.trim()}`
        : customerDetails.phone

      const metadataPayload = {
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerLogo: customerDetails.logoUrl || null,
        customerAddress: customerDetails.address
          ? `${customerDetails.address}, ${selectedCountry.name}`
          : null,
        customerPhone: finalPhone || null,
        invoiceNumber: generatedInvoiceNumber,
        issuedDate: rangeStart ? rangeStart.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        currency: selectedCurrency.code,
        currencySymbol: selectedCurrency.symbol,
        terms: terms.trim() || null,
        items: items.map((item, idx) => ({
          id: idx + 1,
          description: item.description,
          qty: item.qty,
          price: parseFloat(item.price),
          total: parseFloat(item.price) * item.qty
        })),
        subtotal: subtotal,
        tax: 0,
        discount: 0,
      }

      const payload = invoiceToEdit
        ? {
            id: invoiceToEdit.id,
            customerId: activeTab === 'choose' ? selectedCustomerId : 'new',
            newCustomer: activeTab === 'new' ? {
              name: customerDetails.name,
              email: customerDetails.email,
              avatarUrl: customerDetails.logoUrl || null,
              plan: items[0]?.description || 'Service Plan'
            } : null,
            amount: amountCents,
            dueDate: rangeEnd ? rangeEnd.toISOString() : null,
            metadata: {
              ...metadataPayload,
              invoiceNumber: invoiceToEdit.metadata?.invoiceNumber || metadataPayload.invoiceNumber
            }
          }
        : {
            customerId: activeTab === 'choose' ? selectedCustomerId : 'new',
            newCustomer: activeTab === 'new' ? {
              name: customerDetails.name,
              email: customerDetails.email,
              avatarUrl: customerDetails.logoUrl || null,
              plan: items[0]?.description || 'Service Plan'
            } : null,
            amount: amountCents,
            status: 'Unpaid',
            dueDate: rangeEnd ? rangeEnd.toISOString() : null,
            paidAt: null,
            metadata: metadataPayload,
          }

      const res = await fetch("/api/v1/billing", {
        method: invoiceToEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errResult = await res.json()
        throw new Error(errResult.error || "Failed to generate billing ledger record")
      }

      const json = await res.json()
      
      // Enforce the premium 1.5s organic morph loading before closure
      await new Promise(resolve => setTimeout(resolve, 1500))

      onSuccess(json.data)
      handleCloseClean()
    } catch (err) {
      console.error("[SUBMIT WIZARD ERROR]", err)
      setErrors(prev => ({ ...prev, form: err instanceof Error ? err.message : "Failed to generate invoice design." }))
      setIsGenerating(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const calendarDays = getDaysInMonth(currentCalendarMonth)
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity cursor-default"
        onClick={handleCloseClean}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[680px] bg-white dark:bg-[#0c051e] rounded-3xl shadow-2xl overflow-hidden border border-slate-50 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Animated Onboarding Siri Morph Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-[#0d051e]/90 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-200">
            {/* Siri Organic Light Morph Sphere */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full mix-blend-screen bg-cyan-400 blur-2xl opacity-60 animate-[siri-layer-1_6s_ease-in-out_infinite]" />
              <div className="absolute inset-2 rounded-full mix-blend-screen bg-fuchsia-500 blur-2xl opacity-60 animate-[siri-layer-2_8s_ease-in-out_infinite]" />
              <div className="absolute inset-[10%] rounded-full mix-blend-screen bg-[#8400DB] blur-xl opacity-70 animate-[siri-layer-3_10s_ease-in-out_infinite]" />
              <div className="absolute inset-[25%] rounded-full bg-white blur-lg opacity-80 animate-[siri-core_3s_ease-in-out_infinite]" />
              <div className="absolute w-[80%] h-[80%] rounded-full blur-md opacity-40 bg-gradient-to-tr from-cyan-300 via-fuchsia-400 to-white/80 animate-[siri-morph-1_7s_linear_infinite]" />
              <div className="absolute w-[85%] h-[85%] rounded-full blur-lg opacity-30 bg-gradient-to-bl from-purple-400 via-white to-cyan-200 animate-[siri-morph-2_9s_linear_infinite]" />
              
              {/* Central Floating core */}
              <div className="relative z-30 w-20 h-20 rounded-[1.75rem] backdrop-blur-3xl border border-white/40 flex items-center justify-center shadow-2xl bg-white/10 animate-[siri-float_3s_ease-in-out_infinite]">
                <Loader2 className="w-9 h-9 text-white animate-spin stroke-[4px] drop-shadow-md" />
              </div>
            </div>
            
            <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 border bg-purple-500/10 text-purple-300 border-purple-500/20">
              Processing Layout
            </span>
            <h3 className="text-xl font-black text-white tracking-tight mb-2">Generating Invoice</h3>
            <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-[280px] mb-8">
              Structuring customized branding template and compiling itemized transaction ledger...
            </p>

            {/* Recura Branding Indicator */}
            <div className="absolute bottom-8 flex items-center gap-1 opacity-60 z-20">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-450">Powered by</span>
              <div className="relative w-16 h-5">
                <Image 
                  src="https://res.cloudinary.com/weburea/image/upload/v1783571840/logo_plan.svg" 
                  alt="Recura Logo" 
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#0c051e]/50 shrink-0">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Invoice Generator</h3>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Design and issue custom branding invoice templates</p>
          </div>
          <button 
            onClick={handleCloseClean}
            className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-450 dark:text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold">
                {errors.form}
              </div>
            )}

            {/* Split onboarding tab toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => setActiveTab('choose')}
                className={cn(
                  "py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all",
                  activeTab === 'choose'
                    ? "bg-white dark:bg-[#1a1033] text-slate-950 dark:text-white shadow-sm border border-slate-200/40 dark:border-white/5"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                )}
              >
                Choose Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('new')}
                className={cn(
                  "py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all",
                  activeTab === 'new'
                    ? "bg-white dark:bg-[#1a1033] text-slate-950 dark:text-white shadow-sm border border-slate-200/40 dark:border-white/5"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                )}
              >
                Create New Customer
              </button>
            </div>

            {/* Tab content: Choose Existing Customer */}
            {activeTab === 'choose' && (
              <div className="space-y-4">
                {/* Searchable customer dropdown list */}
                <div className="space-y-2 relative" ref={dropdownRef}>
                  <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">Select Customer Profile</label>
                  <div className="relative">
                    {isLoadingCustomers ? (
                      <div className="w-full px-4 py-3 border border-slate-250/60 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-white/5 text-xs text-slate-400 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-650" />
                        Syncing customer base details...
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={cn(
                            "w-full px-4 py-3 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5 text-xs font-bold text-slate-900 dark:text-white text-left flex items-center justify-between transition-all hover:bg-slate-100 dark:hover:bg-white/10 h-12 cursor-pointer",
                            isDropdownOpen && "ring-2 ring-purple-600/20 border-purple-600 dark:border-purple-650"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {selectedCustomerRecord ? (
                              <>
                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10">
                                  {selectedCustomerRecord.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={selectedCustomerRecord.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-[9px] font-black text-slate-500">{selectedCustomerRecord.name.slice(0, 2).toUpperCase()}</span>
                                  )}
                                </div>
                                <span>{selectedCustomerRecord.name} ({selectedCustomerRecord.email})</span>
                              </>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500 font-medium">Select a customer profile...</span>
                            )}
                          </div>
                          <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white dark:bg-[#150a2e] border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-2xl z-[150] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="p-2 border-b border-slate-100 dark:border-white/5 relative">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                              <input
                                type="text"
                                placeholder="Search customer directory..."
                                value={optionSearchQuery}
                                onChange={(e) => setOptionSearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                              />
                            </div>

                            <div className="max-h-48 overflow-y-auto custom-scrollbar py-1">
                              {filteredOptions.length === 0 ? (
                                <div className="px-5 py-4 text-xs font-bold text-slate-400 text-center">No customer matches found</div>
                              ) : (
                                filteredOptions.map((c) => (
                                  <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCustomerId(c.id)
                                      setIsDropdownOpen(false)
                                    }}
                                    className={cn(
                                      "w-full px-4 py-2 text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer h-10",
                                      selectedCustomerId === c.id 
                                        ? "text-purple-600 bg-purple-50 dark:bg-purple-500/10" 
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-white/10 shrink-0">
                                        {c.avatarUrl ? (
                                          // eslint-disable-next-line @next/next/no-img-element
                                          <img src={c.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                          <span className="text-[9px] font-black text-slate-500">{c.name.slice(0, 2).toUpperCase()}</span>
                                        )}
                                      </div>
                                      <span>{c.name} ({c.email})</span>
                                    </div>
                                    {selectedCustomerId === c.id && <Check className="w-3.5 h-3.5 text-purple-650" />}
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {errors.customerId && <p className="text-[10px] text-rose-500 font-bold">{errors.customerId}</p>}
                </div>

                {/* Additional billing override fields for selected profile */}
                {selectedCustomerId && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Billing Address</label>
                      <input
                        type="text"
                        placeholder="Street, City, Zip override"
                        value={customerDetails.address}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-650 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</label>
                      <input
                        type="text"
                        placeholder="Billing phone override"
                        value={customerDetails.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9+ ]/g, "")
                          setCustomerDetails(prev => ({ ...prev, phone: val }))
                        }}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-650 text-xs font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab content: Create New Customer */}
            {activeTab === 'new' && (
              <div className="space-y-4 p-5 rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">Company / Customer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. BRIX Corporation"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-650 text-xs font-semibold"
                    />
                    {errors.customerName && <p className="text-[10px] text-rose-500 font-bold">{errors.customerName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">Billing Email</label>
                    <input
                      type="email"
                      placeholder="e.g. billing@brix.com"
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-650 text-xs font-semibold"
                    />
                    {errors.customerEmail && <p className="text-[10px] text-rose-500 font-bold">{errors.customerEmail}</p>}
                  </div>
                </div>

                {/* Logo Drag and drop Box */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Customer Logo Image</label>
                  <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-2xl border border-slate-250/50 dark:border-white/10 bg-slate-100 dark:bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                      {customerDetails.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={customerDetails.logoUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <label className="flex-1 border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-purple-650 hover:bg-slate-50 dark:hover:bg-white/5 transition-all p-5 rounded-2xl flex flex-col items-center justify-center cursor-pointer text-center group">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-350">Click or Drag & Drop customer logo</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">Supports SVG, PNG, JPG (max 2MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Country Combobox Selector with Search */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 relative" ref={countryDropdownRef}>
                    <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">Country</label>
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5 text-xs font-bold text-slate-900 dark:text-white text-left flex items-center justify-between transition-all hover:bg-slate-100 dark:hover:bg-white/10 h-10 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.name}</span>
                      </span>
                      <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", isCountryDropdownOpen && "rotate-180")} />
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-[#150a2e] border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-xl z-[160] flex flex-col overflow-hidden max-h-56">
                        <div className="p-2 border-b border-slate-100 dark:border-white/5 relative shrink-0">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search country name or code..."
                            value={countrySearchQuery}
                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                          />
                        </div>
                        <div className="overflow-y-auto custom-scrollbar py-1">
                          {filteredCountries.length === 0 ? (
                            <div className="px-5 py-4 text-xs font-bold text-slate-400 text-center">No countries found</div>
                          ) : (
                            filteredCountries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(c)
                                  setIsCountryDropdownOpen(false)
                                }}
                                className={cn(
                                  "w-full px-4 py-2 text-xs font-bold text-left flex items-center gap-2 transition-all cursor-pointer h-9",
                                  selectedCountry.code === c.code 
                                    ? "text-purple-650 bg-purple-50 dark:bg-purple-500/10" 
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                                )}
                              >
                                <span>{c.flag}</span>
                                <span>{c.name}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</label>
                    <div className="flex gap-2">
                      <div className="w-20 shrink-0 px-3 py-2.5 border border-slate-250 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white text-xs font-black flex items-center justify-center gap-1.5">
                        <span>{selectedCountry.flag}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{selectedCountry.phonePrefix}</span>
                      </div>
                      <input
                        type="text"
                        placeholder={selectedCountry.format}
                        value={customerDetails.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "")
                          if (val.length <= selectedCountry.maxLength) {
                            setCustomerDetails(prev => ({ ...prev, phone: val }))
                          }
                        }}
                        className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-650 text-xs font-semibold"
                      />
                    </div>
                    {errors.phone && <p className="text-[10px] text-rose-500 font-bold leading-none mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Billing Address</label>
                  <input
                    type="text"
                    placeholder={`e.g. Street Address, City, State, ZIP code, ${selectedCountry.name}`}
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-650 text-xs font-semibold"
                  />
                </div>
              </div>
            )}

            {/* Section: Metadata Settings (Date Range Picker) */}
            <div className="space-y-4 p-5 rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
              <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-450 dark:text-slate-400">Ledger Configuration</h4>
              
              <div className="space-y-2 relative" ref={datePickerRef}>
                <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-550 tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-650" /> Billing Period (Issued & Due Date)
                </label>
                
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-650 text-xs font-semibold flex items-center justify-between cursor-pointer h-12"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-650" />
                    {rangeStart && rangeEnd ? (
                      <span>{formatDateLabel(rangeStart)} ➔ {formatDateLabel(rangeEnd)}</span>
                    ) : rangeStart ? (
                      <span>{formatDateLabel(rangeStart)} ➔ Select due date...</span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 font-medium">Select billing cycle range...</span>
                    )}
                  </span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", isDatePickerOpen && "rotate-180")} />
                </button>
                {errors.dueDate && <p className="text-[10px] text-rose-500 font-bold">{errors.dueDate}</p>}

                {/* Custom Date Range Picker Dropdown */}
                {isDatePickerOpen && (
                  <div className="absolute top-[calc(100%+6px)] left-0 w-80 bg-white dark:bg-[#150a2e] border border-slate-200/50 dark:border-white/10 rounded-3xl shadow-2xl z-[170] p-5 flex flex-col gap-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <button 
                        type="button" 
                        onClick={handlePrevMonth}
                        className="p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-black text-slate-800 dark:text-white">
                        {currentCalendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </span>
                      <button 
                        type="button" 
                        onClick={handleNextMonth}
                        className="p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Weekdays header */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {weekdays.map((w, i) => (
                        <span key={i} className="text-[9px] font-black text-slate-400 tracking-wider">
                          {w}
                        </span>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, idx) => {
                        if (!day) return <div key={idx} />
                        
                        const isStart = rangeStart && day.toDateString() === rangeStart.toDateString()
                        const isEnd = rangeEnd && day.toDateString() === rangeEnd.toDateString()
                        const isInRange = rangeStart && rangeEnd && day > rangeStart && day < rangeEnd

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleDayClick(day)}
                            className={cn(
                              "w-8 h-8 text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer",
                              isStart && "bg-[#3B82F6] dark:bg-[#D97706] text-white rounded-full font-black shadow-md",
                              isEnd && "bg-[#3B82F6] dark:bg-[#D97706] text-white rounded-full font-black shadow-md",
                              isInRange && "bg-[#3B82F6]/10 dark:bg-[#D97706]/15 text-[#3B82F6] dark:text-[#D97706]",
                              !isStart && !isEnd && !isInRange && "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full"
                            )}
                          >
                            {day.getDate()}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Itemized Ledger Rows & Currency Selector */}
            <div className="space-y-4 p-5 rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-450 dark:text-slate-400">Line Items List</h4>
                
                {/* Currency Dropdown Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-550">Currency:</span>
                  <div className="relative" ref={currencyDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                      className="px-3 py-1.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-[10px] font-black text-slate-950 dark:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <span>{selectedCurrency.symbol} ({selectedCurrency.code})</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                    {isCurrencyDropdownOpen && (
                      <div className="absolute right-0 top-[calc(100%+4px)] w-36 bg-white dark:bg-[#150a2e] border border-slate-200/50 dark:border-white/10 rounded-xl shadow-xl z-[160] flex flex-col py-1">
                        {CURRENCIES.map((curr) => (
                          <button
                            key={curr.code}
                            type="button"
                            onClick={() => {
                              setSelectedCurrency(curr)
                              setIsCurrencyDropdownOpen(false)
                            }}
                            className={cn(
                              "w-full px-3 py-1.5 text-[10px] font-black text-left flex items-center justify-between transition-all cursor-pointer",
                              selectedCurrency.code === curr.code
                                ? "text-purple-650 bg-purple-50 dark:bg-purple-500/10"
                                : "text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-white/5"
                            )}
                          >
                            <span>{curr.name}</span>
                            <span>{curr.symbol}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={addItemRow}
                    className="ml-4 flex items-center gap-1 text-[10px] font-black uppercase text-purple-650 hover:text-purple-755 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>
              </div>

              <div className="space-y-3.5">
                {items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end animate-in fade-in duration-200">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-550 block sm:hidden">Description</label>
                      <input
                        type="text"
                        placeholder="Billing line item description"
                        value={item.description}
                        onChange={(e) => updateItemRow(idx, 'description', e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-650 text-xs font-semibold"
                      />
                    </div>
                    <div className="w-20 space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-550 block sm:hidden">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        placeholder="1"
                        value={item.qty}
                        onChange={(e) => updateItemRow(idx, 'qty', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-650 text-xs font-bold text-center"
                      />
                    </div>
                    <div className="w-32 space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-550 block sm:hidden">Price ({selectedCurrency.symbol})</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{selectedCurrency.symbol}</span>
                        <input
                          type="text"
                          placeholder="0.00"
                          value={item.price}
                          onChange={(e) => updateItemRow(idx, 'price', e.target.value)}
                          className="w-full pl-7 pr-3 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-650 text-xs font-bold text-right"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      disabled={items.length <= 1}
                      className="p-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.items && <p className="text-[10px] text-rose-500 font-bold">{errors.items}</p>}
              {errors.itemsPrice && <p className="text-[10px] text-rose-500 font-bold">{errors.itemsPrice}</p>}
            </div>

            {/* Terms and conditions block */}
            <div className="space-y-2 p-5 rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
              <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">Terms & Conditions (Optional)</label>
              <textarea
                placeholder="Specify payment notes, contract durations, bank transfer details... (max 150 words)"
                value={terms}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/)
                  if (words.length <= 150 || e.target.value.length < terms.length) {
                    setTerms(e.target.value)
                  }
                }}
                className="w-full h-20 px-4 py-3 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-650 text-xs font-semibold resize-none custom-scrollbar"
              />
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                <span>Terms render at the bottom of the white-labeled templates.</span>
                <span>{terms.trim() === "" ? 0 : terms.trim().split(/\s+/).length} / 150 words</span>
              </div>
            </div>

            {/* Total summary info */}
            <div className="p-5 rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] flex justify-between items-center">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Invoice Total</span>
              <div className="text-right">
                <span className="text-2xl font-black text-purple-650 dark:text-purple-400">
                  {selectedCurrency.symbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-1.5 uppercase">{selectedCurrency.code}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50 dark:border-white/5">
              <button
                type="button"
                onClick={handleCloseClean}
                className="px-6 py-3 rounded-xl border border-slate-250/60 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs tracking-wide transition-colors shadow-sm cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Processing Ledger...
                  </>
                ) : (
                  "Generate Invoice →"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
