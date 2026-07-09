"use client"

import * as React from "react"
import Image from "next/image"
import { 
  LayoutDashboard, 
  Settings, 
  FileText,
  CheckCircle2,
  Code2,
  Layers,
  Info,
  Users,
  CreditCard,
  Package,
  BarChart3,
  BookOpen,
  Copy,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ComparisonSlider } from "../../components/ComparisonSlider"

const NavMockItem = ({ icon: Icon, label, active, theme }: { icon: React.ElementType, label: string, active?: boolean, theme: 'light' | 'dark' }) => (
  <div className={cn(
    "flex items-center gap-4 px-5 py-3 rounded-2xl transition-all font-bold text-[11px] tracking-tight w-full",
    active 
      ? (theme === 'light' ? "bg-purple-50 text-purple-600 shadow-sm" : "bg-purple-500/20 text-purple-400") 
      : (theme === 'light' ? "text-slate-400" : "text-slate-500")
  )}>
    <Icon className="w-4 h-4" />
    {label}
  </div>
)

export function SidebarNavigationDoc() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Subscriptions", href: "/dashboard/subscriptions" },
  { icon: Users, label: "Customers", href: "/dashboard/customers" },
  { icon: CreditCard, label: "Billing & Invoice", href: "/dashboard/billing" },
  { icon: Package, label: "Payments", href: "/dashboard/payments" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: BookOpen, label: "Documentation", href: "/dashboard/documentation" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" }
];`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false },
    { icon: FileText, label: "Subscriptions", active: false },
    { icon: Users, label: "Customers", active: false },
    { icon: CreditCard, label: "Billing & Invoice", active: false },
    { icon: Package, label: "Payments", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: BookOpen, label: "Documentation", active: true },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Technical Specification Table */}
      <section className="space-y-8">
        <div className="bg-white dark:bg-[#150a2e] rounded-[3rem] border border-slate-100 dark:border-white/10 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <div className="px-6 py-8 md:px-10 md:py-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/[0.02]">
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Interface parameters</h4>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">Core configuration constants</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-purple-600 text-[10px] font-bold text-white shadow-lg shadow-purple-600/20">
               Latest v2.0
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 dark:bg-white/[0.01]">
                      <th className="px-6 py-5 md:px-10 md:py-6 text-xs font-semibold text-slate-500 border-b border-slate-100 dark:border-white/5 whitespace-nowrap">Property</th>
                      <th className="px-6 py-5 md:px-10 md:py-6 text-xs font-semibold text-slate-500 border-b border-slate-100 dark:border-white/5 whitespace-nowrap">Definition</th>
                      <th className="px-6 py-5 md:px-10 md:py-6 text-xs font-semibold text-slate-500 border-b border-slate-100 dark:border-white/5 whitespace-nowrap">Direct implementation</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                   {[
                      { prop: "Fixed width", val: "250px", impl: ["w-[250px]", "fixed left-0"] },
                      { prop: "Z-Index", val: "50", impl: ["z-50", "layout-high"] },
                      { prop: "Theme logic", val: "SSR-Safe", impl: ["mounted-hook", "resolvedTheme"] },
                      { prop: "Active pattern", val: "Inclusive", impl: ["pathname === href", "startsWith"] },
                      { prop: "Mobile switch", val: "Drawer", impl: ["isOpen-state", "lg:translate-x-0"] }
                   ].map((row, i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all duration-300">
                         <td className="px-6 py-5 md:px-10 md:py-6 text-sm font-medium text-slate-900 dark:text-white tracking-tight whitespace-nowrap">{row.prop}</td>
                         <td className="px-6 py-5 md:px-10 md:py-6 whitespace-nowrap">
                            <code className="text-xs px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg font-bold shadow-sm">
                               {row.val}
                            </code>
                         </td>
                         <td className="px-6 py-5 md:px-10 md:py-6 text-[10px] font-medium flex gap-3 flex-wrap">
                          {row.impl.map((tag, j) => (
                            <span key={j} className="text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full transition-colors group-hover:border-purple-600/30 group-hover:text-purple-600">
                               {tag}
                            </span>
                          ))}
                       </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        </div>
      </section>

      {/* 2. Dual Comparison Sliders */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-16">
        <ComparisonSlider 
          title="High-fidelity interface"
          description="The sidebar maintains peak legibility across both themes using an adaptive color system."
          height="650px"
          action={{
            label: "View Live Dashboard",
            href: "/dashboard"
          }}
          lightLayer={
            <div className="w-64 h-full bg-white border-r border-slate-100 flex flex-col p-6 gap-2">
               <div className="p-8 pb-4">
                  <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg" alt="Logo" width={100} height={32} className="object-contain" />
               </div>
               <div className="flex-1 px-4 space-y-1 mt-4">
                  {navItems.map((item, i) => (
                    <NavMockItem key={i} {...item} theme="light" />
                  ))}
               </div>
            </div>
          }
          darkLayer={
            <div className="w-64 h-full bg-[#0D0518] border-r border-white/10 flex flex-col p-6 gap-2">
               <div className="p-8 pb-4">
                  <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571835/logo.svg" alt="Logo" width={100} height={32} className="object-contain" />
               </div>
               <div className="flex-1 px-4 space-y-1 mt-4">
                  {navItems.map((item, i) => (
                    <NavMockItem key={i} {...item} theme="dark" />
                  ))}
               </div>
            </div>
          }
        />

        <ComparisonSlider 
          title="Skeleton integration"
          description="Swipe to compare light vs dark loading patterns used for content placeholders."
          height="650px"
          lightLayer={
            <div className="w-64 h-full bg-white border-r border-slate-100 flex flex-col p-6 overflow-hidden animate-pulse">
               <div className="p-8 pb-4 opacity-40">
                  <div className="w-24 h-8 bg-slate-100 rounded-lg" />
               </div>
               <div className="flex-1 px-6 space-y-6 mt-8 opacity-40">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                       <div className="w-5 h-5 rounded-lg bg-slate-200" />
                       <div className={cn("h-3 rounded-full bg-slate-100", i % 2 === 0 ? "w-24" : "w-32")} />
                    </div>
                  ))}
               </div>
            </div>
          }
          darkLayer={
            <div className="w-64 h-full bg-[#0D0518] border-r border-white/10 flex flex-col p-6 overflow-hidden animate-pulse">
               <div className="p-8 pb-4 opacity-40">
                  <div className="w-24 h-8 bg-white/10 rounded-lg" />
               </div>
               <div className="flex-1 px-6 space-y-6 mt-8 opacity-40">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                       <div className="w-5 h-5 rounded-lg bg-white/10" />
                       <div className={cn("h-3 rounded-full bg-white/5", i % 2 === 0 ? "w-24" : "w-32")} />
                    </div>
                  ))}
               </div>
            </div>
          }
        />
      </section>

      {/* 3. Real Implementation Code Workspace */}
      <section className="space-y-12">
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-900/10">
                 <Code2 className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Technical reference</h4>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Production ready sidebar configuration</p>
              </div>
           </div>
        </div>

        <div className="rounded-[3rem] bg-[#0A0D14] border border-white/5 shadow-2xl overflow-hidden relative group">
           <div className="px-4 py-3 md:px-8 md:py-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between gap-3 md:gap-4">
              <div className="flex gap-2 md:gap-3 shrink-0">
                 <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56]" />
                 <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FFBD2E]" />
                 <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27C93F]" />
              </div>
              <div className="text-[10px] md:text-[13px] font-medium text-slate-400 flex items-center gap-2 truncate flex-1 justify-center px-2">
                 <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400 shrink-0 hidden sm:block" />
                 <span className="truncate text-center">src/components/dashboard/sidebar.tsx</span>
              </div>
              <button 
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-[10px] md:text-xs font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
           </div>
           <div className="p-8 overflow-hidden">
              <pre className="text-[13px] font-medium text-slate-400 leading-relaxed custom-scrollbar max-h-[400px] overflow-y-auto pr-4">
{`const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Subscriptions", href: "/dashboard/subscriptions" },
  { icon: Users, label: "Customers", href: "/dashboard/customers" },
  { icon: CreditCard, label: "Billing & Invoice", href: "/dashboard/billing" },
  { icon: Package, label: "Payments", href: "/dashboard/payments" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: BookOpen, label: "Documentation", href: "/dashboard/documentation" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" }
];

// Dynamic active route logic
const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));`}
              </pre>
           </div>
        </div>
      </section>

      {/* 4. Behavior Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-10 rounded-[2.5rem] bg-indigo-50 dark:bg-white/[0.02] border border-indigo-100/50 dark:border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg">
               <Layers className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Active state hub</h4>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed tracking-tight">
               Active items are highlighted using an inclusive matching strategy. If a sub-route is active, the parent item remains highlighted for visual context.
            </p>
         </div>
         <div className="p-10 rounded-[2.5rem] bg-slate-900 border border-white/5 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shadow-lg">
               <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-xl font-black text-white tracking-tight leading-none">Responsive logic</h4>
            <p className="text-sm font-medium text-slate-400 leading-relaxed tracking-tight">
               The sidebar collapses into a hidden drawer on devices smaller than 992px, triggered by the global hamburger menu.
            </p>
         </div>
      </div>
    </div>
  )
}
