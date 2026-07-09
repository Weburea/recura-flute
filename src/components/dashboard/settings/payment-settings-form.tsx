"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  ChevronDown, 
  RotateCcw,
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Bell,
  CheckCircle2,
  Globe,
  Apple,
  Edit2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StatusModal, StatusType } from "@/components/dashboard/shared/modals/status-modal"
import { ReceiptModal, Transaction } from "@/components/dashboard/shared/modals/receipt-modal"
import { 
  CreditCard,
  Building2,
  Smartphone
} from "lucide-react"

type Tab = "gateway" | "customization" | "billing" | "transactions"

interface OverviewCardProps {
  type: string
  count: string
  gradient: string
  icon: string | React.ReactNode
  number: string
  holder: string
  expiry: string
  active: boolean
  isDark?: boolean
}

interface ToggleControlProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  active: boolean
  onToggle: () => void
}

const DesignPattern = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case "waves":
      return (
        <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" fillOpacity="0.15" />
          <path d="M0 80 C 30 20 60 40 100 80 Z" fill="currentColor" fillOpacity="0.08" />
        </svg>
      )
    case "mesh":
      return (
        <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="meshPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#meshPattern)" />
        </svg>
      )
    case "circles":
      return (
        <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="90" cy="10" r="30" fill="currentColor" fillOpacity="0.1" />
          <circle cx="10" cy="90" r="40" fill="currentColor" fillOpacity="0.05" />
          <circle cx="50" cy="50" r="20" fill="currentColor" fillOpacity="0.05" />
        </svg>
      )
    case "abstract":
      return (
        <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 0 Q 50 100 100 0 Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M0 100 Q 50 0 100 100 Z" fill="currentColor" fillOpacity="0.05" />
        </svg>
      )
    case "aurora":
      return (
        <div className={cn(className, "opacity-30 blur-3xl select-none relative h-full w-full overflow-hidden")}>
          <div className="absolute top-0 -left-1/4 w-full h-full bg-cyan-400/30 rounded-full" />
          <div className="absolute bottom-0 -right-1/4 w-full h-full bg-purple-400/30 rounded-full" />
        </div>
      )
    case "multi-waves":
      return (
        <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" fillOpacity="0.2" />
          <path d="M0 80 C 30 20 60 40 100 80 Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M0 60 C 40 10 50 50 100 60 Z" fill="currentColor" fillOpacity="0.05" />
        </svg>
      )
    case "cross":
      return (
        <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 0 L 100 100 M 100 0 L 0 100" stroke="currentColor" strokeWidth="20" strokeOpacity="0.05" fill="none" />
          <path d="M -10 50 L 110 50" stroke="currentColor" strokeWidth="10" strokeOpacity="0.03" fill="none" />
        </svg>
      )
    default:
      return null
  }
}

export function PaymentSettingsForm() {
  const [activeTab, setActiveTab] = useState<Tab>("customization")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<StatusType>("success")
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")
  const [isPreviewFlipped, setIsPreviewFlipped] = useState(false)

  // Transaction States
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Card Customization State
  const [cardDesign, setCardDesign] = useState({
    background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)",
    pattern: "waves",
    color: "#6366f1",
    simIcon: "sim.svg",
    roundedCorners: 16,
    style: "Purple Gradient"
  })

  // Card Details State
  const [cardDetails, setCardDetails] = useState({
    holder: "Noman Manzoor",
    number: "**** **** **** 2345",
    expiry: "02/30",
    brand: "Visa"
  })

  const [gatewayControls, setGatewayControls] = useState({
    autobilling: true,
    notifications: true,
    autoCollect: true,
    instantInvoicing: false,
    retryDelay: 3,
    currency: "USD",
    taxRate: "15",
    isEditingCurrencyTax: false,
    showCurrencyDropdown: false,
    showTaxDropdown: false
  })

  // Billing Rules state
  const [billingRules, setBillingRules] = useState({
    taxCalculation: "automatic",
    invoicePrefix: "REC-",
    nextInvoiceNumber: "1024",
    billingCycle: "monthly"
  })

  const handleApplyRules = () => {
    setModalType("success")
    setModalTitle("Rules Applied")
    setModalMessage("Your billing logic and rules have been updated successfully.")
    setShowModal(true)
  }

  // Dropdown states
  const [showBrandDropdown, setShowBrandDropdown] = useState(false)
  const [showStyleDropdown, setShowStyleDropdown] = useState(false)

  // Real-time Card Preview Styles
  const getCardBackground = () => {
    return cardDesign.background || cardDesign.color
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setModalType("success")
    setModalTitle("Design Saved")
    setModalMessage("Your card customization and payment settings have been successfully updated.")
    setShowModal(true)
  }

  const handleReset = () => {
    setCardDesign({
      background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)",
      pattern: "waves",
      color: "#6366f1",
      simIcon: "sim.svg",
      roundedCorners: 16,
      style: "Purple Gradient"
    })
  }

  const mockTransactions: Transaction[] = [
    { id: "A1X9-B223", customer: "Alex Johnson", email: "alex.j@email.com", plan: "Premium", amount: "$124.00", method: { type: "Credit Card", details: "•••• 4242", icon: CreditCard }, date: "Mar 02, 2024", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png" },
    { id: "C4M7-K991", customer: "Sarah Miller", email: "sarah.m@company.com", plan: "Basic", amount: "$50.00", method: { type: "Apple Pay", details: "Device •••• 1122", icon: Smartphone }, date: "Mar 01, 2024", status: "Failed", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571696/61%201.png" },
    { id: "D8N2-P334", customer: "Mike Ross", email: "mike.ross@legal.co", plan: "Enterprise", amount: "$89.99", method: { type: "Bank Transfer", details: "ACH •••• 9876", icon: Building2 }, date: "Feb 28, 2024", status: "Pending", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png" },
    { id: "X9Q1-L445", customer: "John Doe", email: "john.doe@gmail.com", plan: "Premium", amount: "$210.00", method: { type: "Credit Card", details: "•••• 5544", icon: CreditCard }, date: "Feb 27, 2024", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png" },
    { id: "B2W5-Z889", customer: "Emma Wilson", email: "emma.w@design.io", plan: "Basic", amount: "$49.00", method: { type: "Apple Pay", details: "Device •••• 3322", icon: Smartphone }, date: "Feb 26, 2024", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571692/60%201.png" },
    { id: "M5V8-R112", customer: "James Bond", email: "007@mi6.gov.uk", plan: "Enterprise", amount: "$999.00", method: { type: "Bank Transfer", details: "Wire Transfer", icon: Building2 }, date: "Feb 25, 2024", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/59%201.png" },
    { id: "J7K4-T667", customer: "Olivia Brown", email: "olivia.b@web.com", plan: "Premium", amount: "$150.00", method: { type: "Credit Card", details: "•••• 1234", icon: CreditCard }, date: "Feb 24, 2024", status: "Failed", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png" },
    { id: "P3H6-Y221", customer: "William Smith", email: "will.s@actor.me", plan: "Basic", amount: "$25.00", method: { type: "Apple Pay", details: "Device •••• 9988", icon: Smartphone }, date: "Feb 23, 2024", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571696/61%201.png" },
    { id: "Z9Q1-L445", customer: "Thomas Shelby", email: "thomas@shelby.co", plan: "Enterprise", amount: "$1500.00", method: { type: "Bank Transfer", details: "ACH •••• 1122", icon: Building2 }, date: "Feb 22, 2024", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png" },
    { id: "X8M2-P334", customer: "Arthur Shelby", email: "arthur@shelby.co", plan: "Premium", amount: "$250.00", method: { type: "Credit Card", details: "•••• 9988", icon: CreditCard }, date: "Feb 21, 2024", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png" },
    { id: "Y7N5-K445", customer: "Polly Gray", email: "polly@shelby.co", plan: "Basic", amount: "$100.00", method: { type: "Apple Pay", details: "Device •••• 4455", icon: Smartphone }, date: "Feb 20, 2024", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571692/60%201.png" },
    { id: "W6P3-M112", customer: "John Shelby", email: "johns@shelby.co", plan: "Enterprise", amount: "$500.00", method: { type: "Bank Transfer", details: "ACH •••• 6677", icon: Building2 }, date: "Feb 19, 2024", status: "Pending", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/59%201.png" },
    { id: "V5Q2-L112", customer: "Michael Gray", email: "michael@shelby.co", plan: "Premium", amount: "$175.00", method: { type: "Credit Card", details: "•••• 3344", icon: CreditCard }, date: "Feb 18, 2024", status: "Approved", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png" },
    { id: "U4R1-K112", customer: "Ada Thorne", email: "ada@shelby.co", plan: "Basic", amount: "$75.00", method: { type: "Apple Pay", details: "Device •••• 2211", icon: Smartphone }, date: "Feb 17, 2024", status: "Failed", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571696/61%201.png" },
  ]

  const handleExportCSV = () => {
    const headers = ["Transaction ID", "Customer", "Email", "Plan", "Amount", "Method", "Date", "Status"]
    const csvContent = [
      headers.join(","),
      ...mockTransactions.map(t => [
        `"${t.id}"`,
        `"${t.customer}"`,
        `"${t.email}"`,
        `"${t.plan}"`,
        `"${t.amount}"`,
        `"${t.method.type}"`,
        `"${t.date}"`,
        `"${t.status}"`
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "recura_recent_transactions.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsReceiptModalOpen(true)
  }

  const totalPages = Math.ceil(mockTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = mockTransactions.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-8">

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard 
          type="Credit Card"
          count="4 Active Customers"
          gradient="linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)"
          icon="https://res.cloudinary.com/weburea/image/upload/v1783571834/visa.svg"
          number="**** **** **** 2345"
          holder="Noman Manzoor"
          expiry="02/30"
          active={true}
        />
        <OverviewCard 
          type="Apple Pay"
          count="2 Active Customers"
          gradient="#ffffff"
          icon={<Apple className="w-6 h-6 text-slate-900" />}
          number="**** **** **** 8899"
          holder="Marisa Robertson"
          expiry="09/25"
          active={true}
          isDark={true}
        />
        <OverviewCard 
          type="Bank Transfer"
          count="2 Active Customers"
          gradient="linear-gradient(135deg, #f97316 0%, #3b82f6 33%, #10b981 66%, #db2777 100%)"
          icon="https://res.cloudinary.com/weburea/image/upload/v1783571830/bank_logo.svg"
          number="**** **** **** 5544"
          holder="Recura Business"
          expiry="--/--"
          active={true}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-white/5 overflow-x-auto">
        <div className="flex items-center gap-8 px-2">
          {[
            { id: "gateway", label: "Gateway Settings" },
            { id: "customization", label: "Card Customization" },
            { id: "billing", label: "Billing Rules" },
            { id: "transactions", label: "Transactions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "py-4 text-[13px] font-bold tracking-tight transition-all relative whitespace-nowrap",
                activeTab === tab.id 
                  ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600" 
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === "customization" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Design Options - 4 cols */}
            <div className="lg:col-span-4 dashboard-card p-8 h-full">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Customize Payment Cards</h3>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Design how your customers see your payment cards</p>
              </div>

              <div className="space-y-8">
                {/* Visual Options */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Design Options</h4>
                   </div>
                   
                   <div className="space-y-6">
                     {/* Gradient Styles */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
                          {[
                            { id: "purple-gradient", name: "Purple Gradient", class: "bg-indigo-700", pattern: "waves", bg: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)" },
                            { id: "ocean-gradient", name: "Ocean Blue", class: "bg-blue-500", pattern: "mesh", bg: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)" },
                            { id: "sunset-gradient", name: "Sunset Orange", class: "bg-orange-500", pattern: "waves", bg: "linear-gradient(135deg, #f97316 0%, #db2777 100%)" },
                            { id: "multi-wave", name: "Multi Wave", class: "bg-slate-900", pattern: "multi-waves", bg: "linear-gradient(135deg, #f97316 0%, #3b82f6 33%, #10b981 66%, #db2777 100%)" },
                            { id: "finaci-green", name: "Finaci Green", class: "bg-emerald-900", pattern: "cross", bg: "linear-gradient(135deg, #064e3b 0%, #059669 100%)" },
                            { id: "midnight-aurora", name: "Midnight Aurora", class: "bg-slate-900", pattern: "aurora", bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e293b 100%)" },
                            { id: "minimal-glass", name: "Minimalist Glass", class: "bg-slate-200", pattern: "none", bg: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)" }
                          ].map((g) => (
                            <button 
                              key={g.id}
                              onClick={() => {
                                setCardDesign({
                                  ...cardDesign, 
                                  background: g.bg,
                                  pattern: g.pattern,
                                  style: g.name
                                });
                              }}
                               className={cn(
                                "h-8 w-8 shrink-0 rounded-lg transition-all ring-offset-2 dark:ring-offset-slate-900 relative overflow-hidden border border-gray-100 dark:border-white/10",
                                cardDesign.style === g.name ? "ring-2 ring-purple-600 scale-[1.02]" : "hover:scale-[1.02]"
                              )}
                              style={{ background: g.bg }}
                            >
                              <div className="absolute inset-0 text-white/20">
                                <DesignPattern type={g.pattern} className="w-full h-full" />
                              </div>
                            </button>
                          ))}
                        </div>

                     {/* Card Color */}
                     <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Card Color</span>
                        <div className="flex items-center gap-2 mt-1 sm:mt-0">
                          {["#6366f1", "#8b5cf6", "#f97316", "#ef4444", "#3b82f6", "#cbd5e1"].map((c) => (
                            <button 
                              key={c}
                              onClick={() => setCardDesign({...cardDesign, color: c, background: c})}
                              style={{ backgroundColor: c }}
                              className={cn(
                                "w-6 h-6 rounded-full transition-all ring-offset-2 dark:ring-offset-slate-900",
                                cardDesign.color === c ? "ring-2 ring-purple-600 scale-110" : "hover:scale-105"
                              )}
                            />
                          ))}
                        </div>
                     </div>


                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SIM Style Selection</span>
                          <span className="text-[10px] font-black text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full uppercase tracking-tighter sm:tracking-normal">Premium</span>
                        </div>
                         <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
                           {["sim.svg",  "sim 2.svg", "sim 3.svg", "sim 4.svg", "sim 5.svg", "sim 6.svg", "sim 7.svg"].map((s) => (
                             <button 
                               key={s}
                               type="button"
                               onClick={() => setCardDesign({...cardDesign, simIcon: s})}
                               className={cn(
                                "h-10 min-w-[40px] rounded-lg border-2 transition-all flex items-center justify-center overflow-hidden bg-slate-50/30 dark:bg-white/5",
                                cardDesign.simIcon === s ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-600/10" : "border-gray-100 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                              )}
                            >
                              <div className="w-8 h-6 relative opacity-80 group-hover:opacity-100 transition-opacity">
                                <Image src={`/images/payment/${s}`} alt="Sim" fill className="object-contain" />
                              </div>
                            </button>
                          ))}
                        </div>
                     </div>

                     {/* Rounded Corners */}
                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Rounded Corners</span>
                          <span className="text-xs font-black text-slate-900 dark:text-white">{cardDesign.roundedCorners}px</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            min="0" 
                            max="30" 
                            value={cardDesign.roundedCorners}
                            onChange={(e) => setCardDesign({...cardDesign, roundedCorners: parseInt(e.target.value)})}
                            className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                          />
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Main Preview - 4 cols */}
             <div className="lg:col-span-4 space-y-8 flex flex-col items-center">
               <div 
                className={cn("w-full max-w-[340px] h-[210px] perspective-1000 cursor-pointer", isPreviewFlipped ? "flip-card-active" : "")}
                onClick={() => setIsPreviewFlipped(!isPreviewFlipped)}
               >
                  <div className="flip-card-inner">
                    {/* Front Side */}
                    <div 
                      style={{ 
                        background: getCardBackground(),
                        borderRadius: `${cardDesign.roundedCorners}px`
                      }}
                       className={cn(
                        "flip-card-front p-8 flex flex-col justify-between overflow-hidden shadow-2xl shadow-indigo-900/40 transition-colors duration-500",
                        cardDesign.style === "Minimalist Glass" ? "text-slate-900" : "text-white"
                      )}
                    >
                      {/* Background Pattern Layer */}
                      <div className="absolute inset-0 pointer-events-none">
                        <DesignPattern type={cardDesign.pattern} className="w-full h-full" />
                      </div>

                       <div className="flex justify-between items-start relative z-10 w-full">
                        <div className="w-8 h-6 relative">
                           <Image src={`/images/payment/${cardDesign.simIcon}`} alt="Chip" fill className="object-contain" />
                        </div>
                         <div className="w-24 h-10 relative -mt-1 flex justify-end items-center">
                           {cardDetails.brand === "Visa" ? (
                             <div className="w-24 h-10 relative">
                               <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571834/visa.svg" alt="Visa" fill className={cn("object-contain", cardDesign.style === "Minimalist Glass" ? "brightness-0" : "brightness-0 invert")} />
                             </div>
                           ) : cardDetails.brand === "Mastercard" ? (
                             <span className="text-lg font-black italic tracking-tight drop-shadow-md uppercase">Mastercard</span>
                           ) : (
                             <span className="text-[12px] font-black italic tracking-tighter drop-shadow-md uppercase text-right whitespace-nowrap">American Express</span>
                           )}
                        </div>
                      </div>

                      <div className="space-y-6 relative z-10 -mt-8">
                        <p className="text-xl font-black tracking-[0.2em]">{cardDetails.number}</p>
                        
                        <div className="flex justify-between items-end pb-2">
                          <div className="space-y-0">
                            <p className={cn("text-[8px] uppercase font-bold tracking-widest", cardDesign.style === "Minimalist Glass" ? "text-slate-900/40" : "text-white/50")}>Card Holder</p>
                            <p className="text-xs font-black">{cardDetails.holder}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                             <p className={cn("text-[8px] uppercase font-bold tracking-widest", cardDesign.style === "Minimalist Glass" ? "text-slate-900/40" : "text-white/50")}>Expiry</p>
                             <p className="text-xs font-black">{cardDetails.expiry}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back Side */}
                    <div 
                      style={{ 
                        background: getCardBackground(),
                        borderRadius: `${cardDesign.roundedCorners}px`
                      }}
                       className={cn(
                        "flip-card-back p-8 flex flex-col justify-between overflow-hidden shadow-2xl shadow-indigo-900/40 transition-colors duration-500",
                        cardDesign.style === "Minimalist Glass" ? "text-slate-900" : "text-white"
                      )}
                    >
                      <div className="absolute inset-0 pointer-events-none">
                        <DesignPattern type={cardDesign.pattern} className="w-full h-full" />
                      </div>
                      
                      <div className="absolute top-8 left-0 w-full h-10 bg-slate-900 opacity-80" />
                      
                      <div className="mt-14 flex items-center gap-4 relative z-10 px-2">
                        <div className="h-10 bg-white/10 flex-1 px-4 flex items-center justify-end rounded border border-white/10">
                          <p className="text-sm font-black mono tracking-widest italic">123</p>
                        </div>
                        <div className="text-[10px] uppercase font-bold opacity-60">CVV</div>
                      </div>

                      <p className="text-[8px] leading-tight opacity-50 relative z-10 text-center px-4">
                        This card is a property of Recura. Use is subject to terms and conditions. 
                        Unauthorized use is strictly prohibited.
                      </p>
                    </div>
                  </div>

                    {/* Flip Indicator */}
                    <div className="flex justify-center gap-2 mt-6">
                      <div className={cn("w-4 h-1.5 rounded-full transition-all duration-300", !isPreviewFlipped ? "bg-purple-600 w-6" : "bg-slate-200 dark:bg-slate-800")} />
                      <div className={cn("w-4 h-1.5 rounded-full transition-all duration-300", isPreviewFlipped ? "bg-purple-600 w-6" : "bg-slate-200 dark:bg-slate-800")} />
                    </div>
               </div>

               {/* Section Title */}
               <div className="w-full text-left">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Card Details</h4>
               </div>

               {/* Design Options - bottom (Customer View) */}
               <div className="w-full bg-slate-50/50 rounded-2xl border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Customer View</h4>
                      <p className="text-[10px] font-medium text-slate-400">Previewing with current design</p>
                    </div>
                  </div>
                   <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-purple transition-all">
                     {[
                      { id: "purple-gradient", name: "Purple Gradient", bg: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)", pattern: "waves" },
                      { id: "ocean-gradient", name: "Ocean Blue", bg: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)", pattern: "mesh" },
                      { id: "sunset-gradient", name: "Sunset Orange", bg: "linear-gradient(135deg, #f97316 0%, #db2777 100%)", pattern: "waves" },
                      { id: "multi-wave", name: "Multi Wave", bg: "linear-gradient(135deg, #f97316 0%, #3b82f6 33%, #10b981 66%, #db2777 100%)", pattern: "multi-waves" },
                      { id: "finaci-green", name: "Finaci Green", bg: "linear-gradient(135deg, #064e3b 0%, #059669 100%)", pattern: "cross" },
                      { id: "minimal-glass", name: "Minimalist Glass", bg: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)", pattern: "none" },
                    ].map((card, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCardDesign({...cardDesign, background: card.bg, pattern: card.pattern, style: card.name})}
                        className={cn(
                          "min-w-[140px] h-24 rounded-2xl p-4 flex flex-col justify-between shadow-sm transition-all hover:scale-105 hover:ring-2 ring-purple-600/20 active:scale-95 relative overflow-hidden",
                          cardDesign.style === card.name ? "ring-2 ring-purple-600" : ""
                        )} 
                        style={{ background: card.bg }}
                      >
                        <div className="absolute inset-0 pointer-events-none opacity-40">
                          <DesignPattern type={card.pattern} className="w-full h-full" />
                        </div>
                        <div className="w-6 h-5 bg-white/20 rounded-md relative z-10" />
                        <div className="space-y-1 relative z-10">
                          <div className="w-full h-1 bg-white/20 rounded-full" />
                          <div className="w-2/3 h-1 bg-white/10 rounded-full" />
                        </div>
                      </button>
                    ))}
                   </div>
               </div>
            </div>

            {/* Card Form - 4 cols */}
            <form onSubmit={handleSubmit} className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="dashboard-label">Card Holder</label>
                  <input
                    type="text"
                    value={cardDetails.holder}
                    onChange={(e) => setCardDetails({...cardDetails, holder: e.target.value})}
                    className="dashboard-form-input"
                    placeholder="Holder Name"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="dashboard-label">Card Number</label>
                  </div>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    className="dashboard-form-input"
                    placeholder="**** **** **** ****"
                  />
                </div>

                <div className="space-y-2">
                  <label className="dashboard-label">Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="dashboard-form-input"
                    placeholder="MM/YY"
                  />
                </div>

                <div className="space-y-2 relative">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Brand</label>
                  <button 
                    type="button" 
                    onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between text-slate-900 dark:text-white font-bold text-sm h-[48px] hover:border-purple-200 dark:hover:border-purple-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                       {cardDetails.brand === "Visa" ? (
                         <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571834/visa.svg" alt="Visa" width={32} height={12} className="object-contain dark:brightness-0 dark:invert" />
                       ) : (
                         <div className="w-8 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                       )}
                       <span>{cardDetails.brand}</span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showBrandDropdown ? "rotate-180" : "")} />
                  </button>
                  {showBrandDropdown && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-white/10 shadow-xl z-20 overflow-hidden py-1">
                      {["Visa", "Mastercard", "American Express"].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => {
                            setCardDetails({...cardDetails, brand: b})
                            setShowBrandDropdown(false)
                          }}
                          className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full transition-all",
                              cardDetails.brand === b ? "bg-purple-600 scale-125" : "bg-slate-200 group-hover:bg-slate-300"
                            )} />
                            <span className={cn(b === "Mastercard" ? "font-black" : "")}>{b}</span>
                          </div>
                          {b === "Visa" && <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571834/visa.svg" alt="" width={24} height={8} className="opacity-40 dark:brightness-0 dark:invert" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Card Style</label>
                  <button 
                    type="button" 
                    onClick={() => setShowStyleDropdown(!showStyleDropdown)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between text-slate-900 dark:text-white font-bold text-sm h-[48px] hover:border-purple-200 dark:hover:border-purple-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded shadow-sm overflow-hidden relative" style={{ background: getCardBackground() }}>
                          <DesignPattern type={cardDesign.pattern} className="w-full h-full text-white/20" />
                        </div>
                       <span>{cardDesign.style}</span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showStyleDropdown ? "rotate-180" : "")} />
                  </button>
                  {showStyleDropdown && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-white/10 shadow-xl z-20 overflow-hidden py-1">
                      {[
                        { name: "Purple Gradient", id: "purple-gradient", bg: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)", pattern: "waves" },
                        { name: "Ocean Blue", id: "ocean-gradient", bg: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)", pattern: "mesh" },
                        { name: "Sunset Orange", id: "sunset-gradient", bg: "linear-gradient(135deg, #f97316 0%, #db2777 100%)", pattern: "waves" },
                        { name: "Minimalist Glass", id: "glass-gradient", bg: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)", pattern: "none" }
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setCardDesign({
                              ...cardDesign, 
                              style: s.name, 
                              background: s.bg,
                              pattern: s.pattern
                            })
                            setShowStyleDropdown(false)
                          }}
                          className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-3"
                        >
                          <div className="w-4 h-4 rounded shadow-sm border border-gray-100 dark:border-white/10 relative overflow-hidden" style={{ background: s.bg }}>
                            <DesignPattern type={s.pattern} className="w-full h-full text-white/10" />
                          </div>
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6">
                 <button 
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-purple-600 text-white font-black text-sm tracking-tight hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
                 >
                   Save Design
                 </button>
                 <button 
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 text-slate-600 dark:text-slate-400 font-black text-sm tracking-tight hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                 >
                   Reset
                 </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "gateway" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Gateway Configuration */}
            <div className="lg:col-span-8 dashboard-card p-8 space-y-8">
               <div className="space-y-1">
                 <h3 className="text-base font-black text-slate-900 dark:text-white">Payment Gateway</h3>
                 <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Select & Configure Gateways</p>
               </div>

               <div className="space-y-4">
                 {[
                   { id: "stripe", name: "Stripe", connected: true, logo: "S" },
                   { id: "paystack", name: "Paystack", connected: true, logo: "P" },
                   { id: "paypal", name: "PayPal", connected: true, logo: "P" },
                   { id: "flutterwave", name: "Flutterwave", connected: false, logo: "F" },
                 ].map((gw) => (
                   <div key={gw.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-purple-200 dark:hover:border-purple-600 transition-all group">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center font-black text-slate-600 dark:text-slate-400">
                          {gw.logo}
                       </div>
                       <div>
                         <h4 className="text-sm font-black text-slate-900 dark:text-white">{gw.name}</h4>
                         {gw.connected && (
                           <div className="flex items-center gap-1.5 mt-0.5">
                             <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                             <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Connected</span>
                           </div>
                         )}
                       </div>
                     </div>
                     <button className="px-6 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-bold text-xs tracking-tight hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                       Configure
                     </button>
                   </div>
                 ))}
               </div>
            </div>

            {/* Gateway Controls */}
            <div className="lg:col-span-4 dashboard-card p-8 space-y-8">
               <div className="space-y-1">
                 <h3 className="text-base font-black text-slate-900 dark:text-white">Gateway Controls</h3>
               </div>

               <div className="space-y-6">
                 <ToggleControl 
                  icon={<RotateCcw className="w-4 h-4" />}
                  title="Autobilling Retries"
                  subtitle="Retry failed payments (3 attempts)"
                  active={gatewayControls.autobilling}
                  onToggle={() => setGatewayControls({...gatewayControls, autobilling: !gatewayControls.autobilling})}
                 />
                 <ToggleControl 
                  icon={<Bell className="w-4 h-4" />}
                  title="Payment Notifications"
                  subtitle="Email customers on success/failure"
                  active={gatewayControls.notifications}
                  onToggle={() => setGatewayControls({...gatewayControls, notifications: !gatewayControls.notifications})}
                 />
                  <div className="flex flex-col pt-4 border-t border-gray-50 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Currency & Tax</h4>
                          {!gatewayControls.isEditingCurrencyTax && (
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                              {gatewayControls.currency} • {gatewayControls.taxRate}% TAX
                            </p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => setGatewayControls({...gatewayControls, isEditingCurrencyTax: !gatewayControls.isEditingCurrencyTax})}
                        className={cn(
                          "p-2.5 rounded-xl border border-gray-100 transition-all",
                          gatewayControls.isEditingCurrencyTax ? "bg-purple-600 text-white border-purple-600" : "bg-white text-slate-400 hover:text-purple-600 dark:bg-slate-900 dark:border-white/10 dark:text-slate-500 dark:hover:text-purple-400"
                        )}
                      >
                         <Edit2 className="w-4 h-4" />
                      </button>
                    </div>

                    {gatewayControls.isEditingCurrencyTax && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5 relative">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Currency</label>
                            <button 
                              type="button"
                              onClick={() => setGatewayControls({...gatewayControls, showCurrencyDropdown: !gatewayControls.showCurrencyDropdown})}
                              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-sm transition-all"
                            >
                              <span>{gatewayControls.currency} ($)</span>
                              <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-300", gatewayControls.showCurrencyDropdown && "rotate-180")} />
                            </button>
                            
                            {gatewayControls.showCurrencyDropdown && (
                              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {["USD", "EUR", "GBP", "NGN"].map((cur) => (
                                  <button
                                    key={cur}
                                    type="button"
                                    onClick={() => setGatewayControls({...gatewayControls, currency: cur, showCurrencyDropdown: false})}
                                    className="w-full px-5 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-white/5 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center justify-between"
                                  >
                                    {cur}
                                    {gatewayControls.currency === cur && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tax Rate (%)</label>
                            <div className="relative">
                              <input 
                                type="number"
                                value={gatewayControls.taxRate}
                                onChange={(e) => setGatewayControls({...gatewayControls, taxRate: e.target.value})}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-purple-600 dark:focus:border-purple-400 pr-8"
                                placeholder="15"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 dark:text-slate-600">%</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setGatewayControls({...gatewayControls, isEditingCurrencyTax: false})}
                          className="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-200 transition-all"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 dashboard-card p-8 space-y-8">
               <div className="space-y-1">
                 <h3 className="text-base font-black text-slate-900 dark:text-white">Billing Logic & Rules</h3>
                 <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Configure how you collect payments and generate invoices</p>
               </div>

               <div className="flex flex-col gap-6">
                 <div className="space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">Auto-Collection</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">Enable automatic charging of customers&apos; saved payment methods on their billing date.</p>
                    <ToggleControl 
                      icon={<Zap className="w-4 h-4" />}
                      title="Instant Capture"
                      subtitle="Capture funds immediately upon checkout"
                      active={gatewayControls.autoCollect}
                      onToggle={() => setGatewayControls({...gatewayControls, autoCollect: !gatewayControls.autoCollect})}
                    />
                 </div>
                 <div className="space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">Tax Management</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Choose how taxes are calculated for your products.</p>
                      </div>
                      <div className="relative">
                        <button 
                          type="button"
                          onClick={() => setGatewayControls({...gatewayControls, showTaxDropdown: !gatewayControls.showTaxDropdown})}
                          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-3 hover:border-purple-200 dark:hover:border-purple-600 transition-all shadow-sm"
                        >
                          <span>{billingRules.taxCalculation === "automatic" ? "Automatic (Recura Tax)" : billingRules.taxCalculation === "manual" ? "Manual Entry" : "No Tax"}</span>
                          <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform", gatewayControls.showTaxDropdown && "rotate-180")} />
                        </button>

                        {gatewayControls.showTaxDropdown && (
                          <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {[
                              { label: "Automatic (Recura Tax)", value: "automatic" },
                              { label: "Manual Entry", value: "manual" },
                              { label: "No Tax", value: "none" }
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setBillingRules({...billingRules, taxCalculation: opt.value});
                                  setGatewayControls({...gatewayControls, showTaxDropdown: false});
                                }}
                                className="w-full px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-white/5 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center justify-between border-b border-gray-50 dark:border-white/5 last:border-none"
                              >
                                {opt.label}
                                {billingRules.taxCalculation === opt.value && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                 </div>
               </div>

               <div className="space-y-4 pt-4">
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">Invoicing Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Prefix</label>
                       <input 
                        type="text" 
                        value={billingRules.invoicePrefix}
                        onChange={(e) => setBillingRules({...billingRules, invoicePrefix: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-sm font-bold text-slate-900 dark:text-white"
                       />
                    </div>
                    <div className="space-y-2 text-center flex flex-col items-center justify-center">
                       <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Retry Pattern</label>
                       <div className="flex items-center gap-3">
                         <button onClick={() => setGatewayControls({...gatewayControls, retryDelay: Math.max(1, gatewayControls.retryDelay - 1)})} className="w-8 h-8 rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400">-</button>
                         <span className="text-sm font-black text-slate-900 dark:text-white">{gatewayControls.retryDelay} Days</span>
                         <button onClick={() => setGatewayControls({...gatewayControls, retryDelay: gatewayControls.retryDelay + 1})} className="w-8 h-8 rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400">+</button>
                       </div>
                    </div>
                     <div className="flex items-end">
                        <button 
                          onClick={handleApplyRules}
                          className="w-full py-3.5 rounded-xl bg-purple-600 text-white font-black text-xs tracking-tight hover:bg-purple-700 hover:shadow-[0_8px_30px_rgba(147,51,234,0.3)] transition-all shadow-lg shadow-purple-600/20 uppercase active:scale-95"
                        >
                          Apply Rules
                        </button>
                     </div>
                  </div>
               </div>
            </div>

             <div className="lg:col-span-4 bg-purple-600 rounded-2xl p-10 text-white relative overflow-hidden flex flex-col justify-between border border-white/20 shadow-[0_20px_50px_rgba(139,92,246,0.3)] group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-32 -mt-32 blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full -ml-32 -mb-32 blur-[80px] opacity-40" />
                
                {/* Subtle Refined Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                <div className="space-y-8 relative z-10">
                  <div className="w-16 h-16 rounded-[24px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]">
                    <Zap className="w-8 h-8 text-white fill-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <h4 className="text-2xl font-black italic tracking-tighter text-white">Pro Billing Tip</h4>
                       <span className="px-2.5 py-1 rounded-full bg-white text-purple-600 text-[10px] font-black uppercase tracking-tighter shadow-sm">Pro</span>
                    </div>
                    <p className="text-[11px] text-purple-100/70 font-black uppercase tracking-[0.3em]">Strategy Guide</p>
                  </div>
                  <p className="text-base text-white leading-relaxed font-bold tracking-tight">Use &quot;Instant Capture&quot; for digital goods but manual capture for physical products to ensure stock availability before charging.</p>
                </div>

                <div className="mt-10">
                  <Link 
                    href="/dashboard/docs"
                    className="relative z-10 w-full py-5 rounded-2xl bg-white text-purple-600 font-bold text-xs uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center justify-center"
                  >
                    Read Documentation
                  </Link>
                </div>
             </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="dashboard-card overflow-hidden !p-0">
            <div className="px-8 py-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Recent Transactions</h3>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Track and manage your customer payments</p>
               </div>
               <div className="flex items-center gap-2">
                 <button 
                  onClick={handleExportCSV}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-slate-900/10 dark:shadow-white/5 cursor-pointer flex items-center gap-2"
                 >
                    <FileSpreadsheet className="w-4 h-4" />
                    Export CSV
                 </button>
               </div>
            </div>
            <div className="overflow-x-auto min-h-[400px]">
               <table className="w-full">
                  <thead className="bg-slate-50/50 dark:bg-white/5">
                    <tr>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                   <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {paginatedTransactions.map((tx, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 dark:hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-400">
                                {tx.customer ? tx.customer[0] : ""}
                             </div>
                             <span className="text-sm font-bold text-slate-900 dark:text-white">{tx.customer}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-slate-900 dark:text-white">{tx.amount}</td>
                        <td className="px-8 py-6">
                           <span className={cn(
                             "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                             tx.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                             tx.status === "Failed" ? "bg-rose-50 text-rose-600" : "bg-orange-50 text-orange-600"
                           )}>
                              {tx.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-400 dark:text-slate-500">{tx.date}</td>
                        <td className="px-8 py-6 text-right">
                           <button 
                            onClick={() => openReceipt(tx)}
                            className="text-purple-600 dark:text-purple-400 text-xs font-black hover:underline uppercase tracking-widest cursor-pointer"
                           >
                            View
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>

            {/* Pagination UI */}
            <div className="px-8 py-5 bg-slate-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 text-center sm:text-left">
                Showing <span className="text-slate-900 dark:text-white">{startIndex + 1}</span> to <span className="text-slate-900 dark:text-white">{Math.min(startIndex + itemsPerPage, mockTransactions.length)}</span> of <span className="text-slate-900 dark:text-white">{mockTransactions.length}</span> results
              </p>
              <div className="flex items-center justify-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-100 dark:hover:border-purple-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer",
                        currentPage === page 
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30" 
                          : "bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 text-slate-400 dark:text-slate-500 hover:border-purple-100 dark:hover:border-purple-900 hover:text-purple-600 dark:hover:text-purple-400"
                      )}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-gray-100 bg-white text-slate-400 hover:text-purple-600 hover:border-purple-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <StatusModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
      />

      <ReceiptModal 
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  )
}

function OverviewCard({ 
  type, 
  count, 
  gradient, 
  icon, 
  number, 
  holder, 
  expiry, 
  active,
  isDark = false 
}: OverviewCardProps) {
  return (
    <div className="space-y-4">
      <div 
        style={{ background: gradient }}
        className={cn(
          "w-full h-[200px] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-lg",
          isDark ? "border border-gray-100" : "text-white shadow-indigo-950/20"
        )}
      >
        <div className="flex justify-between items-start relative z-10">
          <div className="w-10 h-8 relative">
            <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571832/sim.svg" alt="Chip" fill className="object-contain" />
          </div>
          {typeof icon === "string" ? (
             <div className="w-14 h-8 relative">
                <Image src={icon} alt="Logo" fill className="object-contain brightness-0 invert" />
             </div>
          ) : icon}
        </div>
        
        <div className="relative z-10 space-y-4">
          <p className={cn("text-lg font-black tracking-[0.2em]", isDark ? "text-slate-900" : "text-white")}>
            {number}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className={cn("text-[9px] uppercase font-bold opacity-60", isDark ? "text-slate-500" : "text-white/60")}>Card Holder</p>
              <p className={cn("text-xs font-black", isDark ? "text-slate-700" : "text-white")}>{holder}</p>
            </div>
            <div className="text-right">
              <p className={cn("text-[9px] uppercase font-bold opacity-60", isDark ? "text-slate-500" : "text-white/60")}>Expiry Date</p>
              <p className={cn("text-xs font-black", isDark ? "text-slate-700" : "text-white")}>{expiry}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-1">
        <div>
          <h4 className="text-[15px] font-black text-slate-900 dark:text-white tracking-tight">{type}</h4>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500">{count}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center">
          <div className={cn("w-2 h-2 rounded-full", active ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700")} />
        </div>
      </div>
    </div>
  )
}

function ToggleControl({ icon, title, subtitle, active, onToggle }: ToggleControlProps) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 shrink-0">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h4>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{subtitle}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={cn(
          "w-10 h-5 rounded-full transition-all relative flex items-center px-1 shrink-0",
          active ? "bg-purple-600 shadow-md shadow-purple-600/15 dark:shadow-purple-900/40" : "bg-slate-200 dark:bg-slate-800"
        )}
      >
        <div className={cn(
          "w-3 h-3 bg-white rounded-full transition-transform duration-200 shadow-sm",
          active ? "translate-x-5" : "translate-x-0"
        )} />
      </button>
    </div>
  )
}
