"use client"

import * as React from "react"
import Image from "next/image"
import { 
  Search, Bell, Settings, ArrowUpRight, 
  Layout, Navigation, Layers,
  ChevronDown, Moon, Sun, 
  Twitter, Linkedin, Github, Instagram,
  Copy, Check, Info, Code2
} from "lucide-react"
import { ComparisonSlider } from "../../components/ComparisonSlider"

export function GlobalBarsDoc() {
  const [mounted, setMounted] = React.useState(false)
  const [copied, setCopied] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [id]: true })
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [id]: false }))
    }, 2000)
  }

  if (!mounted) return null

  return (
    <div className="space-y-16 pb-20">
      {/* Header section */}
      <div className="space-y-4">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Global bars</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-3xl">
          Recura utilizes a standardized ecosystem of navigation bars and footers to ensure consistent access to global actions, search, and system configurations.
        </p>
      </div>

      {/* 1. Dashboard topbar section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                <Layout className="w-4 h-4 text-white" />
              </span>
              Dashboard topbar
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Primary dashboard utility bar for global search and notifications.</p>
          </div>
        </div>

        <ComparisonSlider 
          title="Dashboard visibility"
          description="The dashboard topbar utilizes a sticky backdrop-blur effect with highly responsive theme states."
          action={{
            label: "View live dashboard",
            href: "/dashboard"
          }}
          lightLabel="Light mode"
          darkLabel="Dark mode"
          height="120px"
          lightLayer={
            <div className="w-full h-full bg-white flex items-center px-8 border-b border-slate-100 relative overflow-hidden">
              <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex-1 max-w-md">
                   <div className="relative group">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium text-slate-400">
                        Search customers, subscriptions, invoice...
                     </div>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <Sun className="w-5 h-5" />
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <Bell className="w-5 h-5" />
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <Settings className="w-5 h-5" />
                   </div>
                  
                </div>
              </div>
            </div>
          }
          darkLayer={
            <div className="w-full h-full bg-[#0D0518] flex items-center px-8 border-b border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between w-full relative z-10 transition-colors">
                <div className="flex-1 max-w-md">
                   <div className="relative group">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                     <div className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium text-slate-500">
                        Search customers, subscriptions, invoice...
                     </div>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                      <Moon className="w-5 h-5" />
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                      <Bell className="w-5 h-5" />
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                      <Settings className="w-5 h-5" />
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 border border-white/10 shadow-lg hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
            </div>
          }
        />

        {/* Topbar technical references */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-900/10">
                <Code2 className="w-6 h-6 text-indigo-400" />
             </div>
             <div className="space-y-1">
               <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Technical reference</h4>
               <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Production ready topbar component</p>
             </div>
          </div>

          <div className="rounded-[3rem] bg-[#0A0D14] border border-white/5 shadow-2xl overflow-hidden relative group">
             <div className="px-4 py-3 md:px-8 md:py-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between gap-3">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                   <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                   <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="text-[13px] font-medium text-slate-400 flex items-center gap-2 truncate flex-1 justify-center">
                   <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                   <span>src/components/dashboard/top-bar.tsx</span>
                </div>
                <button 
                  onClick={() => handleCopy('topbar', `export function TopBar() {
  return (
    <header className="h-20 bg-white/80 dark:bg-[#0D0518]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search platform..."
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl py-2.5 pl-11 pr-4"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-8">
        <ThemeToggle />
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500">
          <Bell className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs font-medium"
                >
                  {copied['topbar'] ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied['topbar'] ? "Copied" : "Copy"}
                </button>
             </div>
             <div className="p-8 overflow-hidden">
                <pre className="text-[13px] font-medium text-slate-400 leading-relaxed custom-scrollbar max-h-[400px] overflow-y-auto pr-4">
{`export function TopBar() {
  return (
    <header className="h-20 bg-white/80 dark:bg-[#0D0518]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search platform..."
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl py-2.5 pl-11 pr-4"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-8">
        <ThemeToggle />
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#0D0518]" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}`}
                </pre>
             </div>
          </div>
        </section>
      </section>

      {/* 2. Marketing navbar section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Navigation className="w-4 h-4 text-white" />
              </span>
              Marketing navbar
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">High-conversion navigation bar for lead generation and product awareness.</p>
          </div>
        </div>

        <ComparisonSlider 
          title="Marketing visibility"
          description="Designed for maximum readability with a distinct aesthetic compared to the high-density dashboard UI."
          action={{
            label: "View live landing",
            href: "/"
          }}
          lightLabel="Daylight mode"
          darkLabel="Nocturnal mode"
          height="120px"
          lightLayer={
            <div className="w-full h-full bg-white/95 backdrop-blur-md px-10 border-b border-slate-100 relative overflow-hidden flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg" alt="Recura" width={100} height={24} className="h-6 w-auto object-contain" />
               </div>
               <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-slate-500 tracking-wider">
                  <div className="flex items-center gap-1 text-purple-600">
                     Dashboard <ChevronDown className="w-3 h-3" />
                  </div>
                  <span>Pricing</span>
                  <span>Integrations</span>
                  <span>About us</span>
                  <span>Documentation</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 text-slate-400">
                     <Sun className="w-4 h-4" />
                     <Search className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 ml-2">Sign in</span>
                  <span className="text-[10px] font-bold text-white px-6 py-2.5 bg-purple-600 rounded-xl shadow-lg shadow-purple-200 leading-none">Get started</span>
               </div>
            </div>
          }
          darkLayer={
            <div className="w-full h-full bg-[#0D0518]/90 backdrop-blur-md px-10 border-b border-white/5 relative overflow-hidden flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571835/logo.svg" alt="Recura" width={100} height={24} className="h-6 w-auto object-contain" />
               </div>
               <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-slate-400 tracking-wider">
                  <div className="flex items-center gap-1 text-purple-400">
                     Dashboard <ChevronDown className="w-3 h-3" />
                  </div>
                  <span>Pricing</span>
                  <span>Integrations</span>
                  <span>About us</span>
                  <span>Documentation</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 text-slate-500">
                     <Moon className="w-4 h-4" />
                     <Search className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-white ml-2">Sign in</span>
                  <span className="text-[10px] font-bold text-white px-6 py-2.5 bg-white/10 rounded-xl border border-white/10 leading-none">Get started</span>
               </div>
            </div>
          }
        />

        {/* Marketing technical references */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg border border-slate-100 dark:border-white/10">
                <Code2 className="w-6 h-6 text-indigo-400" />
             </div>
             <div className="space-y-1">
               <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Technical reference</h4>
               <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Production ready navbar component</p>
             </div>
          </div>

          <div className="rounded-[3rem] bg-[#0A0D14] border border-white/5 shadow-2xl overflow-hidden relative group">
             <div className="px-4 py-3 md:px-8 md:py-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between gap-3">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                   <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                   <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="text-[13px] font-medium text-slate-400 flex items-center gap-2 truncate flex-1 justify-center">
                   <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                   <span>src/components/marketing/navbar.tsx</span>
                </div>
                <button 
                  onClick={() => handleCopy('navbar', `export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-[#0D0518]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-white/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
           <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg" className="dark:hidden" />
           <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571835/logo.svg" className="hidden dark:block" />
        </Link>
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-slate-500 tracking-wider">
          <DashboardMegaMenu />
          <NavLink href="#pricing">Pricing</NavLink>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SearchIcon className="w-5 h-5" />
          <NavLink href="/sign-in">Sign in</NavLink>
          <NavLink href="/sign-up" variant="brand">Get started</NavLink>
        </div>
      </div>
    </nav>
  )
}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs font-medium"
                >
                  {copied['navbar'] ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied['navbar'] ? "Copied" : "Copy"}
                </button>
             </div>
             <div className="p-8 overflow-hidden">
                <pre className="text-[13px] font-medium text-slate-400 leading-relaxed custom-scrollbar max-h-[400px] overflow-y-auto pr-4">
{`export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-[#0D0518]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-white/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
           <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571838/logo_dark.svg" className="dark:hidden" />
           <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571835/logo.svg" className="hidden dark:block" />
        </Link>
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-slate-500 tracking-wider">
          <DashboardMegaMenu />
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#integrations">Integrations</NavLink>
          <NavLink href="#about">About us</NavLink>
          <NavLink href="/documentation">Documentation</NavLink>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SearchIcon className="w-5 h-5" />
          <NavLink href="/sign-in">Sign in</NavLink>
          <NavLink href="/sign-up" variant="brand">Get started</NavLink>
        </div>
      </div>
    </nav>
  )
}`}
                </pre>
             </div>
          </div>
        </section>
      </section>

      {/* 3. Footer ecosystem section */}
      <section className="space-y-16">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </span>
              Footer ecosystem
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Unified information architecture across different platform contexts.</p>
          </div>
        </div>

        {/* Dashboard Footer Visibility */}
        <div className="space-y-8">
          <ComparisonSlider 
            title="Dashboard footer visibility"
            description="A clean, utility-focused horizontal bar providing quick access to essential links and branding."
            height="100px"
            lightLabel="Dashboard light"
            darkLabel="Dashboard dark"
            lightLayer={
              <div className="w-full h-full bg-white flex items-center justify-between px-10 border-t border-slate-200">
                <div className="flex items-center gap-3">
                   <div className="relative w-10 h-6">
                      <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571840/logo_plan.svg" alt="Recura" fill className="object-contain" />
                   </div>
                   <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                   <span className="text-[11px] font-bold text-purple-600">Dashboard v1.0</span>
                   <span className="text-[11px] font-medium text-slate-400 ml-4">© 2026 Weburea. All rights reserved.</span>
                </div>
                <div className="flex items-center gap-8 text-[11px] font-bold text-slate-500">
                   <span>Support</span>
                   <span>Privacy policy</span>
                   <span>Terms of service</span>
                   <span>Documentation</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                   <Twitter className="w-4 h-4" />
                   <Linkedin className="w-4 h-4" />
                   <Github className="w-4 h-4" />
                </div>
              </div>
            }
            darkLayer={
              <div className="w-full h-full bg-[#0D0518] flex items-center justify-between px-10 border-t border-white/10">
                <div className="flex items-center gap-3">
                   <div className="relative w-10 h-6">
                      <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571840/logo_plan.svg" alt="Recura" fill className="object-contain brightness-110" />
                   </div>
                   <div className="h-4 w-[1px] bg-white/10 mx-1" />
                   <span className="text-[11px] font-bold text-purple-400">Dashboard v1.0</span>
                   <span className="text-[11px] font-medium text-slate-500 ml-4">© 2026 Weburea. All rights reserved.</span>
                </div>
                <div className="flex items-center gap-8 text-[11px] font-bold text-slate-400">
                   <span>Support</span>
                   <span>Privacy policy</span>
                   <span>Terms of service</span>
                   <span>Documentation</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                   <Twitter className="w-4 h-4" />
                   <Linkedin className="w-4 h-4" />
                   <Github className="w-4 h-4" />
                </div>
              </div>
            }
          />

          <section className="space-y-12">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-900/10">
                   <Code2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Technical reference</h4>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Production ready footer component</p>
                </div>
             </div>

             <div className="rounded-[3rem] bg-[#0A0D14] border border-white/5 shadow-2xl overflow-hidden relative group">
                <div className="px-4 py-3 md:px-8 md:py-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between gap-3">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                   </div>
                   <div className="text-[13px] font-medium text-slate-400 flex items-center gap-2 truncate flex-1 justify-center">
                      <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>src/components/dashboard/footer.tsx</span>
                   </div>
                   <button 
                     onClick={() => handleCopy('dash-footer', `export function DashboardFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0D0518] py-5 px-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571840/logo_plan.svg" width={48} height={24} />
          <span className="font-bold text-sm">Dashboard v1.0</span>
        </div>
        <div className="flex gap-8 text-sm font-bold text-slate-500">
          <Link href="/support">Support</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}`)}
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs font-medium"
                   >
                     {copied['dash-footer'] ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                     {copied['dash-footer'] ? "Copied" : "Copy"}
                   </button>
                </div>
                <div className="p-8 overflow-hidden">
                   <pre className="text-[13px] font-medium text-slate-400 leading-relaxed custom-scrollbar max-h-[400px] overflow-y-auto pr-4">
{`export function DashboardFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0D0518] py-5 px-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="https://res.cloudinary.com/weburea/image/upload/v1783571840/logo_plan.svg" width={48} height={24} />
          <span className="font-bold text-sm">Dashboard v1.0</span>
        </div>
        <div className="flex gap-8 text-sm font-bold text-slate-500">
          <Link href="/support">Support</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/documentation">Docs</Link>
        </div>
        <div className="flex gap-4">
          <Twitter className="w-5 h-5" />
          <Linkedin className="w-5 h-5" />
          <Github className="w-5 h-5" />
        </div>
      </div>
    </footer>
  )
}`}
                   </pre>
                </div>
             </div>
          </section>
        </div>

        {/* Marketing Footer Visibility */}
        <div className="space-y-8 pt-8 border-t border-slate-100 dark:border-white/5">
          <ComparisonSlider 
            title="Marketing footer visibility"
            description="High-fidelity branded gradient footer designed for impact and comprehensive navigation."
            height="200px"
            lightLabel="Branded light"
            darkLabel="Branded dark"
            lightLayer={
              <div className="w-full h-full bg-gradient-to-br from-[#E13F7C] via-[#9333EA] to-[#3B82F6] flex flex-col justify-center px-16 relative overflow-hidden">
                <div className="grid grid-cols-6 gap-8 relative z-10 text-white">
                   {[
                     { title: "Products", items: ["Features", "Pricing", "Dashboard"] },
                     { title: "Solutions", items: ["Small businesses", "SaaS startups", "Agencies"] },
                     { title: "Resources", items: ["Blog", "Help center", "Documentation"] },
                     { title: "Legal", items: ["Privacy policy", "Terms of service", "Cookie policy"] },
                     { title: "Support", items: ["Contact us", "Email support"] },
                     { title: "Socials", items: ["Twitter", "LinkedIn", "Instagram"] },
                   ].map((col, i) => (
                     <div key={i} className="space-y-3">
                        <h5 className="text-sm font-bold">{col.title}</h5>
                        <div className="space-y-1.5 opacity-80 text-[10px] font-medium">
                           {col.items.map((item, j) => <p key={j}>{item}</p>)}
                           {col.title === "Socials" && (
                              <div className="flex gap-3 pt-1">
                                 <Twitter className="w-3.5 h-3.5" />
                                 <Linkedin className="w-3.5 h-3.5" />
                                 <Instagram className="w-3.5 h-3.5" />
                              </div>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
                <div className="absolute bottom-6 right-16 text-[10px] text-white/60 font-medium italic">© 2026 Recura. All rights reserved.</div>
              </div>
            }
            darkLayer={
              <div className="w-full h-full bg-gradient-to-br from-[#1E0B36] via-[#0D0518] to-[#0A0514] flex flex-col justify-center px-16 relative overflow-hidden ring-1 ring-white/5">
                <div className="grid grid-cols-6 gap-8 relative z-10 text-white">
                   {[
                     { title: "Products", items: ["Features", "Pricing", "Dashboard"] },
                     { title: "Solutions", items: ["Small businesses", "SaaS startups", "Agencies"] },
                     { title: "Resources", items: ["Blog", "Help center", "Documentation"] },
                     { title: "Legal", items: ["Privacy policy", "Terms of service", "Cookie policy"] },
                     { title: "Support", items: ["Contact us", "Email support"] },
                     { title: "Socials", items: ["Twitter", "LinkedIn", "Instagram"] },
                   ].map((col, i) => (
                     <div key={i} className="space-y-3">
                        <h5 className="text-sm font-bold">{col.title}</h5>
                        <div className="space-y-1.5 opacity-60 text-[10px] font-medium text-slate-400">
                           {col.items.map((item, j) => <p key={j}>{item}</p>)}
                        </div>
                     </div>
                   ))}
                </div>
                <div className="absolute bottom-6 right-16 text-[10px] text-slate-500 font-medium">© 2026 Recura. All rights reserved.</div>
              </div>
            }
          />

          <section className="space-y-12">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg border border-slate-100 dark:border-white/10">
                   <Code2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Technical reference</h4>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Production ready branded footer</p>
                </div>
             </div>

             <div className="rounded-[3rem] bg-[#0A0D14] border border-white/5 shadow-2xl overflow-hidden relative group">
                <div className="px-4 py-3 md:px-8 md:py-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between gap-3">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                   </div>
                   <div className="text-[13px] font-medium text-slate-400 flex items-center gap-2 truncate flex-1 justify-center">
                      <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>src/components/marketing/footer.tsx</span>
                   </div>
                   <button 
                     onClick={() => handleCopy('mark-footer', `export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#E13F7C] via-[#9333EA] to-[#3B82F6] py-20">
      <div className="container mx-auto grid grid-cols-6 gap-8 px-6 text-white">
        <Col title="Products" links={products} />
        <Col title="Solutions" links={solutions} />
      </div>
    </footer>
  )
}`)}
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs font-medium"
                   >
                     {copied['mark-footer'] ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                     {copied['mark-footer'] ? "Copied" : "Copy"}
                   </button>
                </div>
                <div className="p-8 overflow-hidden">
                   <pre className="text-[13px] font-medium text-slate-400 leading-relaxed custom-scrollbar max-h-[400px] overflow-y-auto pr-4">
{`export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#E13F7C] via-[#9333EA] to-[#3B82F6] py-20">
      <div className="container mx-auto grid grid-cols-6 gap-8 px-6 text-white">
        <Col title="Products" links={products} />
        <Col title="Solutions" links={solutions} />
        <Col title="Resources" links={resources} />
        <Col title="Legal" links={legal} />
        <Col title="Support" links={support} />
        <Col title="Socials" iconLinks={socials} />
      </div>
      <div className="text-right px-6 mt-16 text-white/60 text-xs italic">
        © 2026 Recura. All rights reserved.
      </div>
    </footer>
  )
}`}
                   </pre>
                </div>
             </div>
          </section>
        </div>
      </section>

      {/* Helper context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-white dark:from-[#150a2e] dark:to-[#0D0518] border border-slate-100 dark:border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg">
                  <Navigation className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Navigation priority</h4>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed tracking-tight">
                  The topbar and sidebar have overlapping z-index strategies. Ensure that dropdowns leverage the portal pattern for overflow handling to avoid clipping issues.
              </p>
          </div>
          <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-indigo-700 text-white space-y-4 shadow-xl shadow-purple-500/20">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
                  <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-black text-white tracking-tight leading-none">Best practices</h4>
              <p className="text-sm font-medium text-white/80 leading-relaxed tracking-tight">
                  Always use the mounted state pattern when rendering theme-specific assets to prevent hydration mismatches during the server-side rendering cycle.
              </p>
          </div>
      </div>
    </div>
  )
}
