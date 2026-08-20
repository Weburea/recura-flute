"use client"

import * as React from "react"
import { 
  SquareStack, 
  Building2, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  Shield,
  Eye,
  Plus,
  Info,
  Cpu,
  Database,
  Layout,
  Zap,
  ArrowRight,
  Rocket
} from "lucide-react"
import { cn } from "@/lib/utils"
import { WorkspaceSettingsModals, SettingsModalType } from "@/components/dashboard/shared/modals/workspace-settings-modals"
import { StatusModal, StatusType } from "@/components/dashboard/shared/modals/status-modal"
import { WelcomeModal } from "@/components/dashboard/shared/modals/welcome-modal"

export default function ModalsDocPage() {
  const [activeModal, setActiveModal] = React.useState<SettingsModalType | null>(null)
  const [welcomeOpen, setWelcomeOpen] = React.useState(false)
  
  // Status Modal State
  const [status, setStatus] = React.useState<{
    show: boolean;
    type: StatusType;
    title: string;
    message: string;
  }>({
    show: false,
    type: "success",
    title: "",
    message: ""
  })

  const showStatus = (type: StatusType, title: string, message: string) => {
    setStatus({ show: true, type, title, message })
  }

  // Company Profile State (Mock Data)
  const [profileData, setProfileData] = React.useState({
    name: 'Business Owner Inc.',
    email: 'contact@business.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, Suite 100, New York, NY 10001',
    website: 'www.business.com'
  });

  // Security & Billing Config State (Mock Data)
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [activeProvider, setActiveProvider] = React.useState<string>('stripe');
  const [providersConfig, setProvidersConfig] = React.useState<Record<string, { enabled: boolean; apiKey: string; secretKey?: string }>>({
    stripe: { enabled: true, apiKey: 'sk_live_••••••••••••••••' },
    flutterwave: { enabled: false, apiKey: '' },
    paystack: { enabled: false, apiKey: '' },
    paypal: { enabled: false, apiKey: '' },
  });

  const [activeSessions, setActiveSessions] = React.useState([
    { id: 1, name: 'Chrome on macOS', ip: '192.168.1.1' },
    { id: 2, name: 'Safari on iPhone', ip: '10.0.0.5' },
    { id: 3, name: 'Edge on Windows', ip: '172.16.0.40' },
  ]);

  const [users] = React.useState([
    { id: 1, name: 'Admin User', role: 'Owner', img: 'https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png', active: true },
    { id: 2, name: 'Sarah Wilson', role: 'Admin', img: 'https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png', active: true },
    { id: 3, name: 'John Doe', role: 'Editor', img: 'https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png', active: true },
    { id: 4, name: 'Emily Chen', role: 'Manager', img: 'https://res.cloudinary.com/weburea/image/upload/v1783571691/59%201.png', active: false },
  ]);

  const [userFilter, setUserFilter] = React.useState<'active' | 'inactive'>('active');
  const [isAddingMember, setIsAddingMember] = React.useState(false);
  const [newMember, setNewMember] = React.useState<{ name?: string; role?: string }>({ name: '', role: '' });
  const [editingUser, setEditingUser] = React.useState<{ id: number; name: string; role: string; img: string; active: boolean } | null>(null);

  const [selectedIndustry, setSelectedIndustry] = React.useState("SaaS & Software");
  const [isIndustryOpen, setIsIndustryOpen] = React.useState(false);

  // Handlers
  const toggle2FA = () => setTwoFactorEnabled(!twoFactorEnabled);
  
  const revokeSession = (id: number) => {
    setActiveSessions(prev => prev.filter(s => s.id !== id));
    showStatus("success", "Session Revoked", "The selected session has been logged out.");
  };

  const toggleProvider = (provider: string) => {
    setProvidersConfig(prev => {
      const isCurrentlyEnabled = prev[provider].enabled;
      if (!isCurrentlyEnabled) {
        const newConfig = { ...prev };
        Object.keys(newConfig).forEach(key => {
          newConfig[key] = { ...newConfig[key], enabled: key === provider };
        });
        return newConfig;
      } else {
        return {
          ...prev,
          [provider]: { ...prev[provider], enabled: false }
        };
      }
    });
  };

  const modalVariants = [
    {
      id: "profile",
      title: "Company Profile",
      description: "Business identity and contact management with industrial sector categorization.",
      icon: Building2,
      color: "bg-blue-600",
      type: "profile" as SettingsModalType
    },
    {
      id: "users",
      title: "User Management",
      description: "Comprehensive team administration including role assignment and status filtering.",
      icon: Users,
      color: "bg-purple-600",
      type: "users" as SettingsModalType
    },
    {
      id: "roles",
      title: "Team Roles",
      description: "Interface for defining granular workspace access levels and custom roles.",
      icon: Shield,
      color: "bg-emerald-600",
      type: "roles" as SettingsModalType
    },
    {
      id: "security",
      title: "Security & 2FA",
      description: "Advanced protocol management for account integrity and session revocation.",
      icon: ShieldCheck,
      color: "bg-amber-600",
      type: "security" as SettingsModalType
    },
    {
      id: "billing",
      title: "Payment Setup",
      description: "Modular gateway configuration supporting multi-provider credential validation.",
      icon: CreditCard,
      color: "bg-rose-600",
      type: "billing" as SettingsModalType
    }
  ]

  return (
    <div className="space-y-12">
      {/* 1. Technical Header - Redesigned to be Premium, No Italics */}
      <div className="relative p-12 md:p-20 rounded-[3.5rem] bg-slate-900 border border-white/10 overflow-hidden shadow-2xl group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full -mr-48 -mt-48 transition-colors duration-1000 group-hover:bg-purple-600/20" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/20">
                <SquareStack className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter leading-none">Management Modals</h1>
                <p className="text-lg text-slate-400 font-medium mt-2">Unified workspace architecture & security protocols.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
               {[
                 { label: "Atomic Components", color: "text-purple-400" },
                 { label: "Typed Parameters", color: "text-blue-400" },
                 { label: "State Synchronization", color: "text-emerald-400" }
               ].map((tag) => (
                 <span key={tag.label} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.15em] text-white">
                    <span className={cn("inline-block w-1.5 h-1.5 rounded-full mr-2", tag.color.replace('text', 'bg'))} />
                    {tag.label}
                 </span>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-1/3">
             {[
               { icon: Cpu, title: "Modular Logic", value: "Unified implementation for 5+ contexts", color: "purple" },
               { icon: Database, title: "Persistence", value: "Instant dashboard store updates", color: "blue" },
               { icon: Layout, title: "Visual Rigor", value: "32px gutter & sm-mask logic", color: "emerald" },
               { icon: Zap, title: "Interactions", value: "Framer-motion height smoothing", color: "amber" }
             ].map((card) => (
               <div key={card.title} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-md space-y-3 hover:bg-white/[0.08] transition-colors group/card">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover/card:scale-110",
                    card.color === 'purple' && "bg-purple-500/20 text-purple-400",
                    card.color === 'blue' && "bg-blue-500/20 text-blue-400",
                    card.color === 'emerald' && "bg-emerald-500/20 text-emerald-400",
                    card.color === 'amber' && "bg-amber-500/20 text-amber-400"
                  )}>
                     <card.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.title}</h4>
                     <p className="text-xs font-bold text-white leading-tight">{card.value}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* 2. Unified State Management Warning - Professional Upgrade */}
      <div className="p-10 rounded-[3rem] bg-indigo-50/50 dark:bg-white/[0.02] border border-indigo-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-10">
         <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center shrink-0 shadow-xl shadow-indigo-600/20">
            <Info className="w-8 h-8 text-white" />
         </div>
         <div className="flex-1 space-y-4">
            <div className="space-y-1">
               <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Implementation logic</h3>
               <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Reactive state controllers for enterprise configurations</p>
            </div>
            <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
               These modals utilize the <code className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-white/5 text-indigo-600 dark:text-indigo-400 font-bold">WorkspaceSettingsModals</code> primitive. 
               It handles context switching, input validation, and layout animations globally to maintain operational consistency across all platform settings.
            </p>
         </div>
         <button className="px-8 py-4 rounded-[1.5rem] bg-white border border-slate-200 text-slate-900 font-black text-xs uppercase tracking-widest hover:border-purple-600 hover:text-purple-600 transition-all shadow-sm">
            Check API
            <ArrowRight className="w-4 h-4 ml-2 inline" />
         </button>
      </div>

      {/* 3. Live Variants Registry */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modalVariants.map((item) => (
          <div key={item.id} className="group relative bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-[2.5rem] p-10 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-8px]">
             <div className="flex items-start justify-between mb-8">
                <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110", item.color)}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-500 animate-pulse" />
                   <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active</span>
                </div>
             </div>
             <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter leading-none">{item.title}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
                  {item.description}
                </p>
             </div>
             <button 
               onClick={() => setActiveModal(item.type)}
               className="w-full h-16 flex items-center justify-center gap-3 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-sm"
             >
                <Eye className="w-4 h-4" />
                Open Live Preview
             </button>
          </div>
        ))}

        {/* Welcome Modal Preview Card */}
        <div className="group relative bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-[2.5rem] p-10 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-8px]">
           <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center bg-[#8400DB] shadow-lg transition-transform group-hover:scale-110">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active</span>
              </div>
           </div>
           <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter leading-none">Welcome Modal</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
                Siri-style glassmorphic welcome card with a checklist, greeting users on their first dashboard access.
              </p>
           </div>
           <button 
             onClick={() => setWelcomeOpen(true)}
             className="w-full h-16 flex items-center justify-center gap-3 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-sm"
           >
              <Eye className="w-4 h-4" />
              Open Live Preview
           </button>
        </div>

        {/* Add Component Controller */}
        <div className="group relative bg-slate-50/50 dark:bg-white/[0.02] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 dark:border-white/20 flex items-center justify-center mb-6">
              <Plus className="w-8 h-8 text-slate-300" />
            </div>
            <h4 className="font-bold text-slate-500 dark:text-slate-400 text-lg mb-2">Extended Modules</h4>
            <p className="text-[13px] font-medium text-slate-400 dark:text-slate-500 max-w-[200px]">Custom workflow components can be added to the controller system.</p>
        </div>
      </div>

      {/* 4. Technical Blueprint Summary */}
      <div className="bg-[#0D0518] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl mt-8">
         <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/40" />
               <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
               <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
             </div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] ml-4">Blueprint Controller Implementation</span>
           </div>
           <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 uppercase tracking-widest">TypeScript Ready</span>
         </div>
         <div className="p-10">
<pre className="text-sm font-mono text-blue-400/80 leading-relaxed scrollbar-none overflow-x-auto">
{`// Modular Setting Controller Architecture
<WorkspaceSettingsModals 
  type={activeModal}      // Context identification ('profile', 'users', etc.)
  isOpen={!!activeModal}  // Global presence state
  onClose={resetModal}    // State cleanup function
  onSave={persistData}    // CRUD data synchronization handler
  
  // Reactive Data Props
  profileData={currentWorkspaceData}
  users={teamMemberCollection}
  activeSessions={platformSessions}
/>`}
</pre>
         </div>
      </div>

      {/* Live Mount Contexts */}
      <WorkspaceSettingsModals 
        type={activeModal}
        isOpen={!!activeModal}
        onClose={() => {
          setActiveModal(null)
          setEditingUser(null)
        }}
        onSave={() => {
          setActiveModal(null)
          showStatus("success", "Changes Saved", "Workspace configuration has been updated successfully.")
        }}
        profileData={profileData}
        setProfileData={setProfileData}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        isIndustryOpen={isIndustryOpen}
        setIsIndustryOpen={setIsIndustryOpen}
        users={users}
        activeSessions={activeSessions}
        revokeSession={revokeSession}
        twoFactorEnabled={twoFactorEnabled}
        toggle2FA={toggle2FA}
        activeProvider={activeProvider}
        setActiveProvider={setActiveProvider}
        providersConfig={providersConfig}
        toggleProvider={toggleProvider}
        isAddingMember={isAddingMember}
        setIsAddingMember={setIsAddingMember}
        newMember={newMember}
        setNewMember={setNewMember}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        userFilter={userFilter}
        setUserFilter={setUserFilter}
      />

      <StatusModal 
        isOpen={status.show}
        onClose={() => setStatus(prev => ({ ...prev, show: false }))}
        type={status.type}
        title={status.title}
        message={status.message}
      />

      <WelcomeModal 
        isOpen={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
      />
    </div>
  )
}
