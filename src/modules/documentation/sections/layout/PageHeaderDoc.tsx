"use client"

import * as React from "react"
import Image from "next/image"
import { 
  Code2, 
  Info, 
  Copy, 
  Check, 
  Rocket,
  Search,
  MessageCircle,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ComparisonSlider } from "../../components/ComparisonSlider"

export function PageHeaderDoc() {
  const [copied, setCopied] = React.useState<Record<string, boolean>>({})

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [id]: true })
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [id]: false }))
    }, 2000)
  }

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Marketing Hero Section */}
      <section className="space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Rocket className="w-6 h-6 text-white" />
             </div>
             <div className="space-y-1">
               <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Marketing hero</h3>
               <p className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-widest">High-impact landing orchestration</p>
             </div>
          </div>
        </div>

        <ComparisonSlider 
          title="Landing visibility"
          description="The primary conversion engine of the marketing site, utilizing complex typography gradients and high-fidelity dashboard previews."
          height="450px"
          lightLabel="Light mode"
          darkLabel="Dark mode"
          action={{
            label: "View live landing",
            href: "/"
          }}
          lightLayer={
            <div className="w-full h-full p-4 md:p-10 flex items-center justify-center bg-slate-50">
               <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
                  <Image 
                    src="https://res.cloudinary.com/weburea/image/upload/v1783571734/homepage_white.png" 
                    alt="Hero Light" 
                    fill 
                    className="object-cover"
                  />
               </div>
            </div>
          }
          darkLayer={
            <div className="w-full h-full p-4 md:p-10 flex items-center justify-center bg-[#080312]">
               <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                  <Image 
                    src="https://res.cloudinary.com/weburea/image/upload/v1783571730/homepage_dark.png" 
                    alt="Hero Dark" 
                    fill 
                    className="object-cover"
                  />
               </div>
            </div>
          }
        />

        {/* Hero Technical Reference */}
        <div className="rounded-[3rem] bg-[#0A0D14] border border-white/5 shadow-2xl overflow-hidden relative group">
           <div className="px-4 py-3 md:px-8 md:py-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                 <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                 <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="text-[13px] font-medium text-slate-400 flex items-center gap-2 truncate flex-1 justify-center px-2">
                 <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                 <span>src/components/marketing/hero.tsx</span>
              </div>
              <button 
                onClick={() => handleCopy('hero', `export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
        <span className="text-gradient">Manage Subscriptions...</span>
        <span className="text-gradient-bold">From One Dashboard</span>
      </h1>
      <div className="flex gap-4 mb-16 px-4 justify-center">
        <Button variant="brand">Start free trial</Button>
        <Button variant="outline-brand">Request Demo</Button>
      </div>
      <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571764/hero-dashboard.png" width={1300} height={800} />
    </section>
  )
}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs font-medium"
              >
                {copied['hero'] ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied['hero'] ? "Copied" : "Copy"}
              </button>
           </div>
           <div className="p-8 overflow-hidden">
              <pre className="text-[13px] font-medium text-slate-400 leading-relaxed custom-scrollbar max-h-[400px] overflow-y-auto pr-4">
{`export function Hero() {
  return (
    <section className="relative bg-white dark:bg-transparent pt-32 pb-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571817/line_bg.png" fill className="object-cover opacity-80 dark:opacity-30" />
      </div>
      
      <div className="container relative z-10 mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          <span className="text-gradient">Manage Subscriptions, Billings, And <br /></span>
          <span className="text-gradient-bold">Inventory From One Dashboard</span>
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button variant="brand" className="px-8 py-6 text-lg">Start your free trial</Button>
          <Button variant="outline-brand" className="px-8 py-6 text-lg">Request Demo</Button>
        </div>

        <div className="relative mx-auto mt-16 w-full max-w-[1400px]">
          <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571764/hero-dashboard.png" width={1300} height={800} priority />
        </div>
      </div>
    </section>
  )
}`}
              </pre>
           </div>
        </div>
      </section>

      {/* 2. Help/Support Header Section */}
      <section className="space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-white/5 flex items-center justify-center shadow-lg border border-slate-100 dark:border-white/10">
                <Search className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
             </div>
             <div className="space-y-1">
               <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Status & Support header</h3>
               <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Contextual help orchestration</p>
             </div>
          </div>
        </div>

        <ComparisonSlider 
          title="Knowledge base visibility"
          description="A specialized header designed for rapid problem solving, featuring a prominent search engine and live fallback support options."
          height="450px"
          lightLabel="Help Light"
          darkLabel="Help Dark"
          action={{
            label: "Explore support center",
            href: "/dashboard/help"
          }}
          lightLayer={
            <div className="w-full h-full p-4 md:p-10 flex items-center justify-center bg-slate-50">
               <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
                  <Image 
                    src="https://res.cloudinary.com/weburea/image/upload/v1783571728/help_white.png" 
                    alt="Help Light" 
                    fill 
                    className="object-cover"
                  />
               </div>
            </div>
          }
          darkLayer={
            <div className="w-full h-full p-4 md:p-10 flex items-center justify-center bg-[#080312]">
               <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                  <Image 
                    src="https://res.cloudinary.com/weburea/image/upload/v1783571727/help_dark.png" 
                    alt="Help Dark" 
                    fill 
                    className="object-cover"
                  />
               </div>
            </div>
          }
        />

        {/* Help Technical Reference */}
        <div className="rounded-[3rem] bg-[#0A0D14] border border-white/5 shadow-2xl overflow-hidden relative group">
           <div className="px-4 py-3 md:px-8 md:py-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                 <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                 <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="text-[13px] font-medium text-slate-400 flex items-center gap-2 truncate flex-1 justify-center px-2">
                 <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                 <span>src/components/dashboard/help/help-center.tsx</span>
              </div>
              <button 
                onClick={() => handleCopy('help', `export function HelpCenterContent() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100/50 mb-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-xs font-bold text-purple-700 tracking-wide uppercase">Support Center</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">How can we help you today?</h1>
        <div className="relative max-w-xl mx-auto mt-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search for articles..." className="w-full pl-14 pr-6 py-4 rounded-2xl border bg-white dark:bg-slate-800 focus:border-purple-600 transition-all font-medium text-slate-900 dark:text-white" />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold">Search</button>
        </div>
      </div>
    </div>
  )
}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs font-medium"
              >
                {copied['help'] ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied['help'] ? "Copied" : "Copy"}
              </button>
           </div>
           <div className="p-8 overflow-hidden">
              <pre className="text-[13px] font-medium text-slate-400 leading-relaxed custom-scrollbar max-h-[400px] overflow-y-auto pr-4">
{`export function HelpCenterContent() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm text-center">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-60" />
      
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100/50 mb-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-xs font-bold text-purple-700 tracking-wide uppercase">Support Center</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How can we help you today?
        </h1>
        
        <div className="relative max-w-xl mx-auto mt-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for articles, guides, or questions..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 transition-all font-medium text-slate-900 dark:text-white px-2 shadow-xl shadow-slate-200/20 dark:shadow-none text-base"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
            Search
          </button>
        </div>
      </div>
    </div>
  )
}`}
              </pre>
           </div>
        </div>
      </section>

      {/* 3. Global Header Guidelines */}
      <section className="space-y-8">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Design guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
             { 
               title: "Visual Hierarchy", 
               desc: "Landing pages must prioritize the hero headline with bold tracking and gradients. Dashboard headers must maintain high data density while using standard system colors.",
               icon: Rocket
             },
             { 
               title: "Contextual Interaction", 
               desc: "Headers in support modules must feature an active search state. Dashboard modules should focus on primary action triggers like 'Create' or 'Export'.",
               icon: Search
             }
           ].map((item, i) => (
             <div key={i} className="p-10 rounded-[3rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg">
                   <item.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h6 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">{item.title}</h6>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed tracking-tight">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>
    </div>
  )
}
