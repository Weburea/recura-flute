"use client"

import { useState, useMemo } from "react"
import { useUser } from "@/context/user-context"
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


const getCurrencySymbol = (currency: string) => {
  switch (currency?.toUpperCase()) {
    case 'NGN': return '₦';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'USDC': return 'USDC ';
    default: return '$';
  }
};

export function WorkspaceOverview() {
  const { user, workspace, refreshUser } = useUser()
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
  const [local2FAEnabled, setLocal2FAEnabled] = useState<boolean | null>(null);
  const twoFactorEnabled = local2FAEnabled !== null ? local2FAEnabled : Boolean(user?.twoFactorEnabled);
  const [activeProvider, setActiveProvider] = useState<string>('flutterwave');
  const [providersConfig, setProvidersConfig] = useState<Record<string, { enabled: boolean; apiKey: string; secretKey?: string }>>({
    flutterwave: { enabled: true, apiKey: 'flw_live_••••••••••••••••' },
    paystack: { enabled: false, apiKey: '' },
    monnify: { enabled: false, apiKey: '' },
  });

  const isAutobillingEnabled = Object.values(providersConfig).some(p => p.enabled);

  // User Management State
  const [localUsers, setLocalUsers] = useState<User[] | null>(null);

  const teamSize = Number(workspace?.metadata?.teamSize || workspace?.metadata?.team_size || 6);
  const activeCustomers = Number(workspace?.metadata?.activeClients || workspace?.metadata?.activeCustomers || workspace?.metadata?.payingCustomers || 150);

  const usersList = useMemo(() => {
    if (localUsers !== null) return localUsers;
    const primaryUser: User = {
      id: 1,
      name: user?.fullName || "Admin User",
      role: "Owner",
      img: user?.avatarUrl || 'https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png',
      active: true
    };
    return [primaryUser];
  }, [localUsers, user]);

  const activityLogs = useMemo(() => {
    const isEnabled = providersConfig[activeProvider]?.enabled;
    if (activeProvider === 'paystack') {
      return [
        { type: isEnabled ? 'success' : 'error', title: isEnabled ? 'Paystack Charge succeeded - Acme Inc. ($549.00)' : 'Paystack API Connection inactive', time: '5 min ago', details: '192.168.1.100' },
        { type: 'success', title: 'Paystack webhook received successfully', time: '30 mins ago', details: '192.168.1.112' },
        { type: 'error', title: 'Paystack Charge failed - Insufficient funds', time: '1 hour ago', details: '192.168.1.17' },
      ];
    } else if (activeProvider === 'flutterwave') {
      return [
        { type: isEnabled ? 'success' : 'error', title: isEnabled ? 'Flutterwave Charge succeeded - Acme Inc. ($549.00)' : 'Flutterwave API Connection inactive', time: '2 min ago', details: '192.168.1.102' },
        { type: 'success', title: 'Flutterwave webhook received successfully', time: '15 mins ago', details: '192.168.1.112' },
        { type: 'error', title: 'Flutterwave Card validation failed', time: '2 hours ago', details: '192.168.1.15' },
      ];
    } else {
      return [
        { type: isEnabled ? 'success' : 'error', title: isEnabled ? 'Monnify Virtual Account Transfer received ($549.00)' : 'Monnify API Connection inactive', time: '10 min ago', details: '192.168.1.105' },
        { type: 'success', title: 'Monnify webhook received successfully', time: '45 mins ago', details: '192.168.1.112' },
        { type: 'error', title: 'Monnify virtual account creation failed', time: '3 hours ago', details: '192.168.1.20' },
      ];
    }
  }, [activeProvider, providersConfig]);

  const [userFilter, setUserFilter] = useState<'active' | 'inactive'>('active');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState<{name?: string, role?: string}>({ name: '', role: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Creation State
  const [isCreatingProvider, setIsCreatingProvider] = useState(false);
  const [activeChannelsEnabled, setActiveChannelsEnabled] = useState(true);

  // Industry (derived from workspace)
  const selectedIndustry = workspace?.niche || "SaaS & Software";

  const [activeSessions, setActiveSessions] = useState([
    { id: 1, name: 'Chrome on macOS', ip: '192.168.1.1' },
    { id: 2, name: 'Safari on iPhone', ip: '10.0.0.5' },
  ]);

  // Company Profile State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    logoUrl: '',
    registrationNumber: '',
    country: ''
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Handlers
  const handleSave = async () => {
    // Validation for Company Profile
    if (activeModal === 'profile') {
      const newErrors: Record<string, string> = {};
      
      if (!profileData.name.trim()) newErrors.name = "Company name is required";
      if (!profileData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
        newErrors.email = "Invalid email format";
      }
      
      const PHONE_COUNTRIES_VAL = [
        { prefix: "+1", regex: /^\d{10}$/, format: "10 digits: 202 555 0199" },
        { prefix: "+234", regex: /^\d{10}$/, format: "10 digits: 803 123 4567" },
        { prefix: "+44", regex: /^\d{10}$/, format: "10 digits: 7911 123456" },
        { prefix: "+49", regex: /^\d{10,11}$/, format: "10 or 11 digits: 170 1234567" },
        { prefix: "+41", regex: /^\d{9}$/, format: "9 digits: 79 123 45 67" },
        { prefix: "+33", regex: /^\d{9}$/, format: "9 digits: 6 1234 5678" },
        { prefix: "+61", regex: /^\d{9}$/, format: "9 digits: 412 345 678" },
        { prefix: "+91", regex: /^\d{10}$/, format: "10 digits: 98765 43210" },
        { prefix: "+27", regex: /^\d{9}$/, format: "9 digits: 82 123 4567" },
        { prefix: "+254", regex: /^\d{9,10}$/, format: "9 or 10 digits: 712 345 678" },
        { prefix: "+233", regex: /^\d{9}$/, format: "9 digits: 24 123 4567" },
        { prefix: "+55", regex: /^\d{11}$/, format: "11 digits: 11 91234 5678" },
        { prefix: "+86", regex: /^\d{11}$/, format: "11 digits: 139 1234 5678" },
        { prefix: "+81", regex: /^\d{10}$/, format: "10 digits: 90 1234 5678" },
        { prefix: "+52", regex: /^\d{10}$/, format: "10 digits: 55 1234 5678" },
        { prefix: "+34", regex: /^\d{9}$/, format: "9 digits: 612 345 678" },
        { prefix: "+39", regex: /^\d{10}$/, format: "10 digits: 312 345 6789" },
        { prefix: "+31", regex: /^\d{9}$/, format: "9 digits: 6 1234 5678" },
        { prefix: "+65", regex: /^\d{8}$/, format: "8 digits: 8123 4567" },
        { prefix: "+971", regex: /^\d{9}$/, format: "9 digits: 50 123 4567" },
      ];

      if (!profileData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else {
        const country = PHONE_COUNTRIES_VAL.find(c => profileData.phone.startsWith(c.prefix));
        if (country) {
          const suffix = profileData.phone.slice(country.prefix.length).replace(/[^0-9]/g, "");
          if (!country.regex.test(suffix)) {
            newErrors.phone = `Invalid number. Expected: ${country.format}`;
          }
        }
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

      try {
        const res = await fetch("/api/v1/workspaces/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profileData.name,
            industry: selectedIndustry,
            email: profileData.email,
            phone: profileData.phone,
            address: profileData.address,
            website: profileData.website,
            logoUrl: profileData.logoUrl,
            registrationNumber: profileData.registrationNumber,
            country: profileData.country,
          }),
        });

        const data = await res.json();
        if (data.success) {
          refreshUser();
          setStatusType("success");
          setStatusTitle("Profile Updated");
          setStatusMessage("Your company information has been successfully updated and saved.");
        } else {
          setStatusType("error");
          setStatusTitle("Update Failed");
          setStatusMessage(data.error || "An error occurred while saving your company settings.");
          setShowStatus(true);
          return;
        }
      } catch (err) {
        console.error(err);
        setStatusType("error");
        setStatusTitle("System Error");
        setStatusMessage("Could not connect to update servers.");
        setShowStatus(true);
        return;
      }
    } else {
      // Dynamic messaging based on current active modal
      let successTitle = "Changes Saved";
      let successMessage = "Your workspace settings have been updated successfully.";

      if (activeModal === 'users') {
        if (newMember?.name) {
          const newUser: User = {
            id: usersList.length + 1,
            name: newMember.name,
            role: newMember.role || "Member",
            img: `https://res.cloudinary.com/weburea/image/upload/v1783571692/${60 + (usersList.length % 5)}%201.png`,
            active: true
          };
          setLocalUsers([...usersList, newUser]);
          setNewMember({ name: '', role: '' });
        }
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
    }

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
    setLocal2FAEnabled(!twoFactorEnabled);
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
    setLocalUsers(usersList.filter(u => u.id !== id));
    handleSave();
  };

  const adminCount = usersList.filter(u => u.role.toLowerCase() === 'owner' || u.role.toLowerCase() === 'admin').length;
  const managerCount = usersList.filter(u => u.role.toLowerCase() === 'manager' || u.role.toLowerCase() === 'editor' || u.role.toLowerCase() === 'developer' || u.role.toLowerCase() === 'member').length;

  const activeCurrency = (workspace?.metadata?.currency as string) || "USD";
  const currencySymbol = getCurrencySymbol(activeCurrency);

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
              <span className="text-sm font-bold text-slate-900 dark:text-white">{workspace?.niche || "SaaS & Software"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Phone No</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{(workspace?.metadata?.phone as string) || "+1 (555) 123-4567"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Website</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">{(workspace?.metadata?.website as string) || "www.business.com"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Address</span>
              <span className="text-[10px] font-bold text-slate-900 dark:text-white text-right leading-tight max-w-[140px]">
                {(workspace?.metadata?.address as string) || "123 Business Street, Suite 100, New York, NY 10001"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-white/5">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Customers</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{activeCustomers} customers</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Members</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{usersList.length} member{usersList.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <button 
            onClick={() => {
              if (workspace) {
                setProfileData({
                  name: workspace.name || "",
                  email: (workspace.metadata?.email as string) || "",
                  phone: (workspace.metadata?.phone as string) || "",
                  address: (workspace.metadata?.address as string) || "",
                  website: (workspace.metadata?.website as string) || "",
                  logoUrl: (workspace.metadata?.logoUrl as string) || "",
                  registrationNumber: (workspace.metadata?.registrationNumber as string) || "",
                  country: (workspace.metadata?.country as string) || "",
                });
              }
              setActiveModal('profile');
            }}
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
            <h4 className="text-xl font-black text-slate-900 dark:text-white">{usersList.filter(u => u.active).length} Active Users</h4>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">{usersList.filter(u => !u.active).length} Inactive</p>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <div className="flex -space-x-2">
              {usersList.slice(0, 3).map((user) => (
                <NextImage key={user.id} src={user.img} width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#150a2e] object-cover" alt={user.name} />
              ))}
              {usersList.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 border-2 border-white dark:border-[#150a2e] flex items-center justify-center text-[10px] font-black text-slate-400 dark:text-slate-500">+{usersList.length - 3}</div>
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
               <h4 className="text-xl font-black text-slate-900 dark:text-white">{adminCount} Admin{adminCount !== 1 ? 's' : ''}</h4>
               <span className="text-slate-400 dark:text-slate-500 font-medium">/</span>
               <span className="text-lg font-bold text-slate-500 dark:text-slate-400">{managerCount} Mgr{managerCount !== 1 ? 's' : ''}</span>
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
               <button 
                  onClick={() => setActiveChannelsEnabled(!activeChannelsEnabled)}
                  className={cn(
                    "w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ml-auto shrink-0",
                    activeChannelsEnabled ? "bg-[#10b981]" : "bg-slate-200 dark:bg-white/10"
                  )}
               >
                 <div className={cn(
                   "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                   activeChannelsEnabled ? "translate-x-5" : "translate-x-0"
                 )} />
               </button>
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
            {activityLogs.map((log, idx) => (
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
                <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200">{currencySymbol}{isAutobillingEnabled ? "120.00" : "0.00"}</span>
              </div>
            </div>

            <div className="pt-2 space-y-1.5 border-t border-gray-200 dark:border-white/10">
              <div className="flex justify-between text-[9px] font-medium text-slate-400 dark:text-slate-500">
                <span>Subtotal (7.5%)</span>
                <span className="text-slate-900 dark:text-white font-bold">{currencySymbol}{isAutobillingEnabled ? "120.00" : "0.00"}</span>
              </div>
              <div className="flex justify-between text-[9px] font-medium text-slate-400 dark:text-slate-500">
                <span>Tax (8.5%)</span>
                <span className="text-slate-900 dark:text-white font-bold">{currencySymbol}{isAutobillingEnabled ? "9.00" : "0.00"}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-slate-900 dark:text-white pt-1">
                <span>Total</span>
                <span>{currencySymbol}{isAutobillingEnabled ? "129.00" : "0.00"} {activeCurrency}</span>
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
              {['flutterwave', 'paystack', 'monnify'].map((key) => {
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
        users={usersList}
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
          members: `${teamSize} Active Members`,
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
