"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Layers, Monitor, Shield, BookOpen, Settings, Info, Code2, Copy, Check, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { ComparisonSlider } from "../../components/ComparisonSlider"

export function PageLayoutSystem() {
  const [mounted, setMounted] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(`// Master dashboard layout shell
export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64 fixed h-full" />
      <main className="flex-1 ml-64 bg-slate-50 dark:bg-[#0D0518]">
        <TopBar />
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!mounted) return null

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Header Section */}
      <div className="space-y-4">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Page layout system</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-3xl">
          Recura utilizes a hierarchical layout system based on Next.js App Router conventions to ensure consistent shell persistence and optimized rendering.
        </p>
      </div>

      {/* 2. Technical Specification Table */}
      <section className="space-y-8">
        <div className="bg-white dark:bg-[#150a2e] rounded-[3rem] border border-slate-100 dark:border-white/10 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <div className="px-6 py-8 md:px-10 md:py-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/[0.02]">
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Layout architecture</h4>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">Shell definitions and inheritance</p>
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 dark:bg-white/[0.01]">
                      <th className="px-6 py-5 md:px-10 md:py-6 text-xs font-semibold text-slate-500 border-b border-slate-100 dark:border-white/5 whitespace-nowrap">Shell Type</th>
                      <th className="px-6 py-5 md:px-10 md:py-6 text-xs font-semibold text-slate-500 border-b border-slate-100 dark:border-white/5 whitespace-nowrap">File Path</th>
                      <th className="px-6 py-5 md:px-10 md:py-6 text-xs font-semibold text-slate-500 border-b border-slate-100 dark:border-white/5 whitespace-nowrap">Inheritance</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                   {[
                      { type: "Root layout", path: "app/layout.tsx", inheritance: "Global (Providers, HTML/Body)" },
                      { type: "Dashboard shell", path: "app/dashboard/layout.tsx", inheritance: "Sub-root (Sidebar, Topbar)" },
                      { type: "Settings module", path: "app/dashboard/settings/layout.tsx", inheritance: "Nested (Sub-navigation)" },
                      { type: "Marketing site", path: "app/(marketing)/layout.tsx", inheritance: "Isolated (Navbar, Footer)" }
                   ].map((row, i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all duration-300">
                         <td className="px-6 py-5 md:px-10 md:py-6 text-sm font-medium text-slate-900 dark:text-white tracking-tight whitespace-nowrap">{row.type}</td>
                         <td className="px-6 py-5 md:px-10 md:py-6 whitespace-nowrap">
                            <code className="text-xs px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg font-bold shadow-sm">
                               {row.path}
                            </code>
                         </td>
                         <td className="px-6 py-5 md:px-10 md:py-6 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {row.inheritance}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </section>

      {/* 3. Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[
          {
            title: "Dashboard layout",
            type: "Master shell",
            desc: "The primary 2-column layout (Sidebar + Content) used for core platform functionality. Optimized for data density.",
            icon: Monitor,
            color: "purple",
            href: "/dashboard",
            images: { light: "https://res.cloudinary.com/weburea/image/upload/v1783571650/dashboard.png", dark: "https://res.cloudinary.com/weburea/image/upload/v1783571660/dashboard_dark.png" }
          },
          {
            title: "Settings layout",
            type: "Split header",
            desc: "Extended dashboard shell that introduces a secondary sub-navigation sidebar for complex configuration modules.",
            icon: Settings,
            color: "blue",
            href: "/dashboard/settings",
            images: { light: "https://res.cloudinary.com/weburea/image/upload/v1783571738/settings.png", dark: "https://res.cloudinary.com/weburea/image/upload/v1783571743/settings_dark.png" }
          },
          {
            title: "Auth layout",
            type: "Minimalist shell",
            desc: "Clean, distraction-free environment for security-critical flows like login and account recovery.",
            icon: Shield,
            color: "rose",
            href: "/sign-in",
            images: { light: "https://res.cloudinary.com/weburea/image/upload/v1783571702/Auth.png", dark: "https://res.cloudinary.com/weburea/image/upload/v1783571706/Auth_dark.png" }
          },
          {
            title: "Guide layout",
            type: "Readability shell",
            desc: "Specialized for documentation and long-form content with optimized typography and navigation trees.",
            icon: BookOpen,
            color: "emerald",
            href: "/dashboard/documentation",
            images: { light: "https://res.cloudinary.com/weburea/image/upload/v1783571722/documetation.png", dark: "https://res.cloudinary.com/weburea/image/upload/v1783571725/documetation_dark.png" }
          }
        ].map((layout, i) => (
          <div key={i} className="group relative bg-white dark:bg-[#150a2e] rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm transition-all hover:shadow-2xl hover:translate-y-[-4px] overflow-hidden duration-500">
             <div className="p-10 space-y-6">
               <div className="flex items-center justify-between">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-black/5 transition-transform group-hover:scale-110 group-hover:rotate-3",
                    layout.color === 'purple' && "bg-purple-50 text-purple-600 dark:bg-purple-500/20",
                    layout.color === 'blue' && "bg-blue-50 text-blue-600 dark:bg-blue-500/20",
                    layout.color === 'rose' && "bg-rose-50 text-rose-600 dark:bg-rose-500/20",
                    layout.color === 'emerald' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20",
                  )}>
                      <layout.icon className="w-7 h-7 stroke-[2.5px]" />
                  </div>
                  
                  <Link 
                    href={layout.href}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 hover:text-purple-600 group-hover:border-purple-200 dark:group-hover:border-purple-500/30 transition-all font-bold text-[10px] tracking-widest uppercase"
                  >
                     Visit <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
               </div>

               <div className="space-y-3">
                 <div className="flex items-center gap-2">
                   <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{layout.title}</h4>
                   <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-white/5 py-0.5 px-2 rounded-md border border-slate-100 dark:border-white/5">
                      {layout.type}
                   </span>
                 </div>
                 <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed tracking-tight">{layout.desc}</p>
               </div>
             </div>
             
             {/* Visual Preview with ComparisonSlider logic */}
             <div className="px-6 pb-6 mt-[-1rem]">
                <div className="h-64 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner group/preview relative">
                  <ComparisonSlider 
                    title="" 
                    description=""
                    height="256px"
                    lightLabel="Light"
                    darkLabel="Dark"
                    lightLayer={
                        <div className="w-full h-full relative">
                           <Image src={layout.images.light} alt={layout.title} fill className="object-cover" />
                        </div>
                    }
                    darkLayer={
                        <div className="w-full h-full relative">
                           <Image src={layout.images.dark} alt={layout.title} fill className="object-cover" />
                        </div>
                    }
                  />
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* 4. Technical Reference */}
      <section className="space-y-12">
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-900/10">
                 <Code2 className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Technical reference</h4>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Standard dashboard layout implementation</p>
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
                 <span>src/app/dashboard/layout.tsx</span>
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
{`"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0D0518]">
      {/* Sidebar - Fixed/Locked */}
      <Sidebar className="hidden lg:block w-64 fixed h-full z-50 overflow-y-auto border-r border-slate-200 dark:border-white/10" />

      {/* Main Content Area - Scrolled internally or via window */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <TopBar />
        <main className="flex-1 p-6 md:p-10 transition-all duration-300">
           {children}
        </main>
      </div>
    </div>
  );
}`}
              </pre>
           </div>
        </div>
      </section>

      {/* 5. Behavioral Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-10 rounded-[2.5rem] bg-indigo-50 dark:bg-white/[0.02] border border-indigo-100/50 dark:border-white/5 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg">
               <Layers className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Persistence strategy</h4>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed tracking-tight">
               By using Next.js <code className="bg-indigo-100/50 dark:bg-white/10 px-1 rounded">layout.tsx</code> files, the sidebar and topbar states (like search queries or scrolling) are maintained during client-side navigation.
            </p>
         </div>
         <div className="p-10 rounded-[2.5rem] bg-slate-900 border border-white/5 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shadow-lg">
               <Settings className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-xl font-black text-white tracking-tight leading-none">Contextual nesting</h4>
            <p className="text-sm font-medium text-slate-400 leading-relaxed tracking-tight">
               Deep-level modules like <code className="bg-white/10 px-1 rounded text-white">/settings</code> introduce their own layouts that wrap standard page content with specialized sub-navigation.
            </p>
         </div>
      </div>
    </div>
  )
}
