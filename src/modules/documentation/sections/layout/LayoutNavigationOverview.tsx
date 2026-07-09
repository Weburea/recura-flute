"use client"

import * as React from "react"
import { Layout, Sidebar as SidebarIcon, Monitor, ArrowRight, Code2, Info, Copy, Check, Layers, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Link from "next/link"
import Image from "next/image"

export function LayoutNavigationOverview() {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(`<DashboardShell>
  <Sidebar />
  <div className="flex-1">
    <TopBar />
    <main>{children}</main>
    <Footer />
  </div>
</DashboardShell>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dashboardImg = (theme === 'dark' || theme === 'system') 
    ? "https://res.cloudinary.com/weburea/image/upload/v1783571660/dashboard_dark.png" 
    : "https://res.cloudinary.com/weburea/image/upload/v1783571650/dashboard.png"

  if (!mounted) return null

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Header Section */}
      <div className="space-y-4">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Layout & navigation overview</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-3xl">
          Recura&apos;s interface is built on a modular shell system that balances high-density data management with intuitive global navigation across all device tiers.
        </p>
      </div>

      {/* 2. Visual Structure */}
      <div className="bg-slate-50 dark:bg-white/[0.02] rounded-[3rem] border border-slate-100 dark:border-white/5 p-10 sm:p-14 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/[0.03] blur-[120px] rounded-full -mr-32 -mt-32 group-hover:bg-purple-600/[0.06] transition-colors duration-1000" />
        
        <div className="relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
               <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">Master shell configuration</h4>
               <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Global orchestration hub</p>
            </div>
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 shadow-sm transition-all group/link"
            >
              Enter live dashboard <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <Link 
            href="/dashboard"
            className="block aspect-[16/9] w-full rounded-[2.5rem] bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden relative group/image cursor-pointer"
          >
            <Image 
              src={dashboardImg} 
              alt="Recura Dashboard Master Shell" 
              fill
              className="object-cover transition-transform duration-1000 group-hover/image:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-700">
              <div className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-bold text-sm shadow-2xl flex items-center gap-3">
                 <ExternalLink className="w-5 h-5" />
                 View live interface
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. Technical Specification Table */}
      <section className="space-y-8">
        <div className="bg-white dark:bg-[#150a2e] rounded-[3rem] border border-slate-100 dark:border-white/10 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <div className="px-6 py-8 md:px-10 md:py-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/[0.02]">
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Core layout metrics</h4>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">System-wide structural constants</p>
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 dark:bg-white/[0.01]">
                      <th className="px-6 py-5 md:px-10 md:py-6 text-xs font-semibold text-slate-500 border-b border-slate-100 dark:border-white/5 whitespace-nowrap">Component</th>
                      <th className="px-6 py-5 md:px-10 md:py-6 text-xs font-semibold text-slate-500 border-b border-slate-100 dark:border-white/5 whitespace-nowrap">Dimension</th>
                      <th className="px-6 py-5 md:px-10 md:py-6 text-xs font-semibold text-slate-500 border-b border-slate-100 dark:border-white/5 whitespace-nowrap">Z-Index</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                   {[
                      { component: "Sidebar (Docked)", dim: "250px Width", z: "50" },
                      { component: "Topbar (Sticky)", dim: "80px Height", z: "40" },
                      { component: "Mobile drawer", dim: "80vw Width", z: "100" },
                      { component: "Content padding", dim: "32px / 40px", z: "Auto" }
                   ].map((row, i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all duration-300">
                         <td className="px-6 py-5 md:px-10 md:py-6 text-sm font-medium text-slate-900 dark:text-white tracking-tight whitespace-nowrap">{row.component}</td>
                         <td className="px-6 py-5 md:px-10 md:py-6 whitespace-nowrap">
                            <code className="text-xs px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg font-bold shadow-sm">
                               {row.dim}
                            </code>
                         </td>
                         <td className="px-6 py-5 md:px-10 md:py-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {row.z}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </section>

      {/* 4. Behavior Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Sidebar navigation",
            desc: "Primary entry points for main dashboard modules. Stays fixed on desktop and collapses into a drawer on mobile.",
            icon: SidebarIcon,
            color: "purple"
          },
          {
            title: "Global topbar",
            desc: "Contains global search, notification engine, and user profile management. Always sticky at the top of the viewport.",
            icon: Monitor,
            color: "blue"
          },
          {
            title: "Flexible content",
            desc: "Dynamic rendering area that adapts its layout based on the current active module while maintaining shell persistence.",
            icon: Layout,
            color: "emerald"
          }
        ].map((item, i) => (
          <div key={i} className="p-10 rounded-[2.5rem] bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500">
            <div className={cn(
               "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-black/5",
               item.color === 'purple' && "bg-purple-50 text-purple-600 dark:bg-purple-500/10",
               item.color === 'blue' && "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
               item.color === 'emerald' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
            )}>
              <item.icon className="w-7 h-7 stroke-[2.5px]" />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-3 leading-none">{item.title}</h4>
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed tracking-tight">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* 5. Technical Reference */}
      <section className="space-y-12">
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-900/10">
                 <Code2 className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Technical reference</h4>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Master shell orchestration</p>
              </div>
           </div>
        </div>

        <div className="rounded-[3rem] bg-[#0A0D14] border border-white/5 shadow-2xl overflow-hidden relative group">
           <div className="px-4 py-3 md:px-8 md:py-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between gap-3 md:gap-4">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                 <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                 <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="text-[13px] font-medium text-slate-400 flex items-center gap-2 truncate flex-1 justify-center px-2">
                 <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                 <span>src/components/dashboard/dashboard-layout.tsx</span>
              </div>
              <button 
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
           </div>
           <div className="p-8 overflow-hidden">
              <pre className="text-[13px] font-medium text-slate-400 leading-relaxed custom-scrollbar max-h-[400px] overflow-y-auto pr-4">
{`<div className="flex min-h-screen bg-slate-50 dark:bg-[#0D0518]">
  {/* Sticky sidebar */}
  <Sidebar className="w-64 fixed h-full z-50" />

  <div className="flex-1 flex flex-col lg:pl-64">
    {/* Fixed header */}
    <TopBar className="sticky top-0 z-40" />

    {/* Scrollable content area */}
    <main className="flex-1 p-8 sm:p-12 transition-all">
       {children}
    </main>

    {/* Platform footer */}
    <Footer />
  </div>
</div>`}
              </pre>
           </div>
        </div>
      </section>

      {/* 6. Behavioral Rule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-12 rounded-[3rem] bg-indigo-50 dark:bg-white/[0.02] border border-indigo-100/50 dark:border-white/5 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg">
               <Layers className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Contextual orchestration</h4>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed tracking-tight">
               The layout system automatically detects the current route and adjusts the visibility of sub-navigation bars and contextual action buttons in the Topbar.
            </p>
         </div>
         <div className="p-12 rounded-[3rem] bg-slate-900 border border-white/5 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shadow-lg">
               <SidebarIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-xl font-black text-white tracking-tight leading-none">Layout persistence</h4>
            <p className="text-sm font-medium text-slate-400 leading-relaxed tracking-tight">
               React state within the sidebar remains mounted across page transitions within the dashboard segment, preventing annoying flash issues during navigation.
            </p>
         </div>
      </div>
    </div>
  )
}
