"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Building2,
  ChevronRight,
  ShieldCheck,
  Users,
  Bell,
  Layout,
  Download,
  Settings2,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import NextImage from "next/image"
import * as htmlToImage from 'html-to-image'
import { StatusModal, StatusType } from "@/components/dashboard/shared/modals/status-modal"
import { BillingSummaryModal } from "@/components/dashboard/shared/modals/billing-summary-modal"
import { WorkspaceSettingsModals, SettingsModalType } from "@/components/dashboard/shared/modals/workspace-settings-modals"

interface User {
  id: number;
  name: string;
  role: string;
  img: string;
  active: boolean;
}

export function WorkspaceOverview() {
  // Navigation State
  const [activeModal, setActiveModal] = useState<SettingsModalType | null>(null);

  // Billing & Proration State
  const [autobilling, setAutobilling] = useState(true);
  const [prorationRange, setProrationRange] = useState(70);

  // PDF Download State
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isPreviewingPDF, setIsPreviewingPDF] = useState(false);
  const [invoiceData, setInvoiceData] = useState({ id: '', date: '' });

  // Feedback & Status State
  const [showStatus, setShowStatus] = useState(false);
  const [statusType, setStatusType] = useState<StatusType>("success");
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Security & Billing Config State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string>('stripe');
  const [providersConfig, setProvidersConfig] = useState<Record<string, { enabled: boolean; apiKey: string; secretKey?: string }>>({
    stripe: { enabled: true, apiKey: 'sk_live_••••••••••••••••' },
    flutterwave: { enabled: false, apiKey: '' },
    paystack: { enabled: false, apiKey: '' },
    paypal: { enabled: false, apiKey: '' },
  });

  const isAutobillingEnabled = Object.values(providersConfig).some(p => p.enabled);

  // User Management State
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Admin User', role: 'Owner', img: 'https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png', active: true },
    { id: 2, name: 'Sarah Wilson', role: 'Admin', img: 'https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png', active: true },
    { id: 3, name: 'John Doe', role: 'Editor', img: 'https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png', active: true },
    { id: 4, name: 'Emily Chen', role: 'Manager', img: 'https://res.cloudinary.com/weburea/image/upload/v1783571691/59%201.png', active: false },
    { id: 5, name: 'Alex Rivera', role: 'Developer', img: 'https://res.cloudinary.com/weburea/image/upload/v1783571692/60%201.png', active: false },
    { id: 6, name: 'Mark Zuckerberg', role: 'CEO', img: 'https://res.cloudinary.com/weburea/image/upload/v1783571696/61%201.png', active: true },
  ]);
  const [userFilter, setUserFilter] = useState<'active' | 'inactive'>('active');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState<{name?: string, role?: string}>({ name: '', role: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Creation State
  const [isCreatingProvider, setIsCreatingProvider] = useState(false);

  // Industry State
  const [selectedIndustry, setSelectedIndustry] = useState("SaaS & Software");
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);

  const [activeSessions, setActiveSessions] = useState([
    { id: 1, name: 'Chrome on macOS', ip: '192.168.1.1' },
    { id: 2, name: 'Safari on iPhone', ip: '10.0.0.5' },
  ]);

  // Company Profile State
  const [profileData, setProfileData] = useState({
    name: 'Business Owner Inc.',
    email: 'contact@business.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, Suite 100, New York, NY 10001',
    website: 'www.business.com'
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Handlers
  const handleSave = () => {
    // Validation for Company Profile
    if (activeModal === 'profile') {
      const newErrors: Record<string, string> = {};
      
      if (!profileData.name.trim()) newErrors.name = "Company name is required";
      if (!profileData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!profileData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[+\d\s()-]+$/.test(profileData.phone)) {
        newErrors.phone = "Invalid phone format";
      }
      if (!profileData.address.trim()) newErrors.address = "Address is required";
      if (!profileData.website.trim()) newErrors.website = "Website is required";

      if (Object.keys(newErrors).length > 0) {
        setProfileErrors(newErrors);
        setStatusType("error");
        setStatusTitle("Validation Failed");
        setStatusMessage("Please correct the errors in the form before saving.");
        setShowStatus(true);
        return;
      }
      setProfileErrors({});
    }

    // Dynamic messaging based on current active modal
    let successTitle = "Changes Saved";
    let successMessage = "Your workspace settings have been updated successfully.";

    if (activeModal === 'users') {
      successTitle = "Team Updated";
      successMessage = "Team member configuration has been saved successfully.";
    } else if (activeModal === 'roles') {
      successTitle = "Roles Updated";
      successMessage = "Workspace roles and permissions have been updated.";
    } else if (activeModal === 'security') {
      successTitle = "Security Updated";
      successMessage = "Workspace security protocols have been reinforced.";
    } else if (activeModal === 'billing') {
      successTitle = "Billing Updated";
      successMessage = "Payment provider and billing controls updated.";
    }

    setStatusType("success");
    setStatusTitle(successTitle);
    setStatusMessage(successMessage);
    setShowStatus(true);
    setActiveModal(null);
    setEditingUser(null);
  };

  const handleDownload = () => {
    setInvoiceData({
      id: `#BS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toLocaleDateString()
    });
    setIsPreviewingPDF(true);
  };

  const executeDownload = async () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;

    setIsDownloading(true);
    setDownloadProgress(30);

    try {
      // html-to-image is much better with modern CSS (oklch, lab, etc.)
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '0px',
          transform: 'scale(1)',
          boxShadow: 'none',
        },
        filter: (node: HTMLElement) => {
          // Exclude the footer actions (buttons)
          return !node.classList?.contains('no-export');
        }
      });
      
      setDownloadProgress(70);
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Recura-Invoice-${invoiceData.id || 'SUMMARY'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadProgress(100);
      setTimeout(() => {
        setIsDownloading(false);
        setIsPreviewingPDF(false);
        setStatusType("success");
        setStatusTitle("Image Saved");
        setStatusMessage("Your billing summary snippet has been saved as a high-quality PNG image.");
        setShowStatus(true);
      }, 500);
    } catch (error) {
      console.error("Export failed:", error);
      setIsDownloading(false);
      setStatusType("error");
      setStatusTitle("Export Failed");
      setStatusMessage("Failed to generate the image snippet. Modern CSS features may be conflicting.");
      setShowStatus(true);
    }
  };

  const toggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const toggleProvider = (provider: string) => {
    setProvidersConfig(prev => {
      const isCurrentlyEnabled = prev[provider].enabled;
      // If we are enabling one, disable all others
      if (!isCurrentlyEnabled) {
        const newConfig = { ...prev };
        Object.keys(newConfig).forEach(key => {
          newConfig[key] = { ...newConfig[key], enabled: key === provider };
        });
        return newConfig;
      } else {
        // Just disable it
        return {
          ...prev,
          [provider]: { ...prev[provider], enabled: false }
        };
      }
    });
  };

  const revokeSession = (id: number) => {
    setActiveSessions(prev => prev.filter(s => s.id !== id));
    setStatusType("success");
    setStatusTitle("Session Revoked");
    setStatusMessage("The selected session has been successfully logged out.");
    setShowStatus(true);
  };

  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    handleSave();
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Top Grid - Main management cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Company Details Card */}
        <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10">
              <Building2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Company Details</h3>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Industry</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedIndustry}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Phone No</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Website</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">{profileData.website}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Address</span>
              <span className="text-[10px] font-bold text-slate-900 dark:text-white text-right leading-tight max-w-[140px]">
                {profileData.address}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-white/5">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Members</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">8 members</span>
            </div>
          </div>
          <button 
            onClick={() => setActiveModal('profile')}
            className="w-full mt-6 py-2.5 rounded-xl bg-purple-600 text-white border border-gray-100 font-bold text-sm tracking-tight hover:bg-purple-700 transition-colors"
          >
            Manage
          </button>
        </div>

        {/* Billing & Payments Card */}
        <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10">
                <Layout className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Billing & Payments</h3>
            </div>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white capitalize">{activeProvider}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    providersConfig[activeProvider].enabled ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                  <span className={cn(
                    "text-[10px] font-bold tracking-tight",
                    providersConfig[activeProvider].enabled ? "text-emerald-600" : "text-slate-400 dark:text-slate-500"
                  )}>
                    {providersConfig[activeProvider].enabled ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Autobilling</span>
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg",
                isAutobillingEnabled ? "bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400" : "bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500"
              )}>
                {isAutobillingEnabled ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Enabled
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    Disabled
                  </>
                )}
              </div>
            </div>
            <div className="pt-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">$12,378.25</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-2">revenue</span>
            </div>
          </div>
          <button 
            onClick={() => setActiveModal('billing')}
            className="w-full mt-6 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-bold text-sm tracking-tight hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            Manage
          </button>
        </div>

        {/* Security Card */}
        <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10">
              <ShieldCheck className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Security</h3>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">2FA:</span>
              <span className={cn(
                "px-3 py-1 text-xs font-bold rounded-lg",
                twoFactorEnabled ? "bg-purple-50 text-purple-600" : "bg-slate-100 text-slate-400"
              )}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">{activeSessions.length} Session{activeSessions.length !== 1 ? 's' : ''} Active</span>
                <span className="text-[10px] font-medium text-slate-400 leading-none">Last: {activeSessions[0]?.ip || 'None'}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setActiveModal('security')}
            className="w-full mt-6 py-2.5 rounded-xl border border-gray-100 bg-slate-50 text-slate-900 font-bold text-sm tracking-tight hover:bg-slate-100 transition-colors"
          >
            Manage
          </button>
        </div>

        {/* Users & Permissions Card */}
        <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 flex flex-col h-full lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10">
              <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Users & Permissions</h3>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-slate-900 dark:text-white">{users.filter(u => u.active).length} Active Users</h4>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">{users.filter(u => !u.active).length} Inactive</p>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <div className="flex -space-x-2">
              {users.slice(0, 3).map((user) => (
                <NextImage key={user.id} src={user.img} width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#150a2e] object-cover" alt={user.name} />
              ))}
              {users.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 border-2 border-white dark:border-[#150a2e] flex items-center justify-center text-[10px] font-black text-slate-400 dark:text-slate-500">+{users.length - 3}</div>
              )}
            </div>
          <button 
              onClick={() => setActiveModal('roles')}
              className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm tracking-tight hover:bg-purple-700 transition-colors"
            >
              Manage
            </button>
          </div>
        </div>

        {/* Team Roles Card */}
        <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 flex flex-col h-full lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10">
              <ShieldCheck className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Team Roles</h3>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">4 Admins</h4>
              <span className="text-slate-400 dark:text-slate-500 font-medium">/</span>
              <span className="text-lg font-bold text-slate-500 dark:text-slate-400">2 Mgrs</span>
            </div>
          </div>
          <div className="mt-6">
             <button 
                onClick={() => setActiveModal('users')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-bold text-sm tracking-tight hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
              Permission Groups
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 flex flex-col h-full lg:col-span-1">
           <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white underline underline-offset-4 decoration-purple-600/30">System Alerts</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center">
                 <Settings2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
               </div>
               <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Active Channels</span>
               <div className="flex -space-x-1 ml-auto">
                 <div className="w-4 h-4 rounded-full bg-emerald-400 border border-white dark:border-[#150a2e]" />
                 <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-white/20 border border-white dark:border-[#150a2e]" />
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* Activity Logs & Billing Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Activity Logs */}
        <div className="lg:col-span-3 bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Activity Logs</h3>
            <button className="text-purple-600 dark:text-purple-400 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[ 
              { type: 'error', title: 'Payment failed for Invoice #INV-00342', time: '5 min ago', details: '192.168.1.1 0' },
              { type: 'success', title: 'Payment succeeded - Acme Inc. ($549.00)', time: '30 mins', details: '192.168.1.112' },
              { type: 'error', title: 'Payment failed for Invoice #INV-00341', time: '1 hour ago', details: '192.168.1.17' },
            ].map((log, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-50 dark:border-white/5 group hover:border-gray-100 dark:hover:border-white/10 transition-all">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                  log.type === 'error' ? "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-500" : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-500"
                )}>
                  {log.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{log.title}</h4>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">{log.time}</span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wide uppercase">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Preview */}
        <div className="lg:col-span-1 bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Billing Preview</h3>
          <div className="bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-5 space-y-6">
            <div className="flex justify-between items-start">
               <div>
                 <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Invoice #INV-00342</p>
                 <h4 className="text-xs font-black text-slate-900 dark:text-white mt-1">Acme Inc.</h4>
                 <p className="text-[8px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">123 Street Inc.</p>
               </div>
               <div className="flex items-center gap-1.5 grayscale opacity-50 dark:opacity-40">
                 <div className="w-4 h-4 bg-purple-600 rounded-sm" />
                 <span className="text-[10px] font-black text-slate-900 dark:text-white">Recura</span>
               </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-bold text-slate-900 dark:text-white pb-1 border-b border-gray-200 dark:border-white/10 uppercase">
                <span>Services</span>
                <span>Total</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200">Invoice</span>
                <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200">$120.00</span>
              </div>
            </div>

            <div className="pt-2 space-y-1.5 border-t border-gray-200 dark:border-white/10">
              <div className="flex justify-between text-[9px] font-medium text-slate-400 dark:text-slate-500">
                <span>Subtotal (7.5%)</span>
                <span className="text-slate-900 dark:text-white font-bold">$120.00</span>
              </div>
              <div className="flex justify-between text-[9px] font-medium text-slate-400 dark:text-slate-500">
                <span>Tax (8.5%)</span>
                <span className="text-slate-900 dark:text-white font-bold">$9.00</span>
              </div>
              <div className="flex justify-between text-xs font-black text-slate-900 dark:text-white pt-1">
                <span>Total</span>
                <span>$129.00 USD</span>
              </div>
            </div>

            <div className="relative">
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs tracking-tight hover:bg-purple-700 transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-50 overflow-hidden relative"
              >
                {isDownloading ? (
                  <>
                    <div 
                      className="absolute left-0 top-0 h-full bg-purple-700/50 transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                    <Loader2 className="w-3.5 h-3.5 animate-spin relative z-10" />
                    <span className="relative z-10">Generating {downloadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Save as Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Providers & Billing Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payment Providers */}
        <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Payment Providers</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['stripe', 'flutterwave', 'paystack', 'paypal'].map((key) => {
                const config = providersConfig[key];
                return (
                  <div 
                    key={key} 
                    className={cn(
                      "p-3 rounded-xl border-dotted flex flex-row items-center justify-between gap-3 group transition-all cursor-pointer",
                      config.enabled 
                        ? "border-2 border-purple-600 bg-purple-50/5 dark:bg-purple-500/5" 
                        : "border border-purple-200 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-500"
                    )}
                    onClick={() => toggleProvider(key)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 flex items-center justify-center font-bold text-[8px] uppercase shrink-0 dark:text-white">
                        {key[0]}
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white capitalize truncate">{key}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        config.enabled ? "bg-purple-600 animate-pulse" : "bg-slate-300 dark:bg-white/20"
                      )} />
                      <span className={cn(
                        "text-[10px] font-bold whitespace-nowrap",
                        config.enabled ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-500"
                      )}>
                        {config.enabled ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Billing Controls */}
        <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Billing Controls</h3>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Manage automation and proration settings</p>
            </div>
            <button 
              onClick={() => setAutobilling(!autobilling)}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative flex items-center px-1",
                autobilling ? "bg-purple-600" : "bg-slate-200 dark:bg-white/10"
              )}
            >
              <div className={cn(
                "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                autobilling ? "translate-x-6" : "translate-x-0"
              )} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Proration Logic</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-gray-100 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-black text-slate-600 dark:text-slate-400">{prorationRange}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={prorationRange}
                onChange={(e) => setProrationRange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600" 
              />
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Layout className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-900">Invoice Numbering</span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-100 bg-slate-50 text-slate-900 text-xs font-bold">
                #INV-0001
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between bg-white dark:bg-[#150a2e] border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-xl shadow-slate-900/[0.02]">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
          <CheckCircle2 className="w-4 h-4" />
          Saved
        </div>
        <button 
          onClick={handleSave}
          className="px-10 py-3 rounded-xl bg-purple-600 text-white font-black text-sm tracking-tight hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/30"
        >
          Save Changes
        </button>
      </div>

      {/* Workspace Settings Modals (Refactored) */}
      <WorkspaceSettingsModals 
        type={activeModal}
        isOpen={!!activeModal}
        onClose={() => { setActiveModal(null); setEditingUser(null); }}
        onSave={handleSave}
        profileData={profileData}
        setProfileData={setProfileData}
        profileErrors={profileErrors}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        isIndustryOpen={isIndustryOpen}
        setIsIndustryOpen={setIsIndustryOpen}
        users={users}
        deleteUser={deleteUser}
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
        isCreatingProvider={isCreatingProvider}
        setIsCreatingProvider={setIsCreatingProvider}
      />

      <StatusModal 
        isOpen={showStatus}
        onClose={() => setShowStatus(false)}
        type={statusType}
        title={statusTitle}
        message={statusMessage}
      />

      {/* Billing Preview Modal */}
      <BillingSummaryModal 
        isOpen={isPreviewingPDF}
        onClose={() => setIsPreviewingPDF(false)}
        invoiceData={invoiceData}
        companyDetails={{
          name: profileData.name,
          industry: selectedIndustry,
          members: "8 Active Members",
          phone: profileData.phone,
          website: profileData.website,
          address: profileData.address
        }}
        activeProvider={activeProvider}
        isAutobillingEnabled={isAutobillingEnabled}
        prorationRange={prorationRange}
        twoFactorEnabled={twoFactorEnabled}
        activeSessionsCount={activeSessions.length}
        onDownload={executeDownload}
        isDownloading={isDownloading}
        downloadProgress={downloadProgress}
      />

    </div>
  )
}
