"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useUser } from "@/context/user-context"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  Building2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { StatusModal, StatusType } from "@/components/dashboard/shared/modals/status-modal"
import { WorkspaceSettingsModals, SettingsModalType } from "@/components/dashboard/shared/modals/workspace-settings-modals"

interface User {
  id: number;
  name: string;
  role: string;
  img: string;
  active: boolean;
}

export function WorkspaceOverview() {
  const { user, workspace, refreshUser } = useUser()
  // Navigation State
  const [activeModal, setActiveModal] = useState<SettingsModalType | null>(null);

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

  // Industry (derived from workspace)
  const selectedIndustry = workspace?.niche || "SaaS & Software";

  // Niche-Adaptive Configuration & Display Attributes
  const nicheKey = (workspace?.niche || 'saas').toLowerCase();
  
  const nicheMetrics = useMemo(() => {
    const meta = (workspace?.metadata || {}) as Record<string, unknown>;
    
    if (nicheKey.includes('saas')) {
      return {
        badge: 'SaaS Platform',
        metric1Label: 'Subscribers',
        metric1Value: `${meta.activeCustomers || activeCustomers} active`,
        metric2Label: 'Billing Model',
        metric2Value: meta.billingModel ? String(meta.billingModel).replace(/_/g, ' ') : 'Per-User Tiered',
        metric3Label: 'Avg Price/Customer',
        metric3Value: meta.avgPricePerCustomer ? `$${meta.avgPricePerCustomer}/mo` : '$99/mo',
      };
    }
    if (nicheKey.includes('agenc')) {
      return {
        badge: 'Agency & Retainers',
        metric1Label: 'Retainer Clients',
        metric1Value: `${meta.activeClients || 12} active`,
        metric2Label: 'Contract Length',
        metric2Value: meta.contractLength ? String(meta.contractLength).replace(/_/g, ' ') : 'Monthly Retainer',
        metric3Label: 'Avg Retainer Value',
        metric3Value: meta.avgRetainerValue ? `$${meta.avgRetainerValue}/mo` : '$3,500/mo',
      };
    }
    if (nicheKey.includes('social')) {
      return {
        badge: 'Social Media Marketing',
        metric1Label: 'Client Brands',
        metric1Value: `${meta.activeClients || 8} active`,
        metric2Label: 'Billing Structure',
        metric2Value: meta.billingStructure ? String(meta.billingStructure).replace(/_/g, ' ') : 'Monthly Retainer',
        metric3Label: 'Avg Monthly Fee',
        metric3Value: meta.avgFeePerClient ? `$${meta.avgFeePerClient}/mo` : '$2,500/mo',
      };
    }
    if (nicheKey.includes('startup')) {
      return {
        badge: 'High-Growth Startup',
        metric1Label: 'Funding Stage',
        metric1Value: meta.fundingStage ? String(meta.fundingStage).replace(/_/g, ' ') : 'Seed Stage',
        metric2Label: 'Paying Customers',
        metric2Value: `${meta.payingCustomers || 45} converted`,
        metric3Label: 'Hiring Status',
        metric3Value: meta.isHiring === 'no' ? 'Not Hiring' : 'Actively Hiring',
      };
    }
    if (nicheKey.includes('market') || nicheKey.includes('commerce')) {
      const isMarketplace = meta.sellModel === 'marketplace';
      return {
        badge: isMarketplace ? 'Multi-Vendor Marketplace' : 'E-Commerce Store',
        metric1Label: isMarketplace ? 'Active Vendors' : 'Monthly Orders',
        metric1Value: isMarketplace ? `${meta.activeSellers || 80} sellers` : `${meta.monthlyOrders || 450} orders/mo`,
        metric2Label: isMarketplace ? 'Take Rate' : 'Catalog Size',
        metric2Value: isMarketplace ? `${meta.takeRate || 10}% cut` : `${meta.catalogSize || 120} SKUs`,
        metric3Label: 'Channels',
        metric3Value: Array.isArray(meta.platforms) ? meta.platforms.join(', ') : 'Shopify / Online',
      };
    }
    return {
      badge: 'Custom Business',
      metric1Label: 'Active Clients',
      metric1Value: `${meta.activeClients || 25} clients`,
      metric2Label: 'Payment Style',
      metric2Value: meta.paymentMethod ? String(meta.paymentMethod).replace(/_/g, ' ') : 'Recurring / Retainer',
      metric3Label: 'Team Size',
      metric3Value: `${teamSize} members`,
    };
  }, [nicheKey, workspace?.metadata, activeCustomers, teamSize]);

  const [activeSessions, setActiveSessions] = useState<Array<{
    id: string | number;
    name: string;
    browser?: string;
    ip: string;
    location?: string;
    time?: string;
    deviceType?: 'laptop' | 'mobile' | 'tablet';
    isActive?: boolean;
  }>>([]);

  const fetchLiveSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/auth/sessions?limit=2');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setActiveSessions(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load active sessions:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/v1/auth/sessions?limit=2')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (isMounted && json?.success && Array.isArray(json.data)) {
          setActiveSessions(json.data);
        }
      })
      .catch(err => console.error('Failed to load active sessions:', err));

    return () => {
      isMounted = false;
    };
  }, []);

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

  // Feedback & Status State
  const [showStatus, setShowStatus] = useState(false);
  const [statusType, setStatusType] = useState<StatusType>("success");
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

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
        console.error("Profile save error:", err);
        setStatusType("error");
        setStatusTitle("System Error");
        setStatusMessage("Could not connect to update servers. Please try again.");
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

  const toggle2FA = () => {
    setLocal2FAEnabled(!twoFactorEnabled);
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

  const revokeSession = async (id: string | number) => {
    try {
      const res = await fetch(`/api/v1/auth/sessions?sessionId=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActiveSessions(prev => prev.filter(s => s.id !== id));
        setStatusType("success");
        setStatusTitle("Session Revoked");
        setStatusMessage("The selected session has been successfully logged out.");
        setShowStatus(true);
        fetchLiveSessions();
      } else {
        const data = await res.json().catch(() => ({}));
        setStatusType("error");
        setStatusTitle("Revocation Failed");
        setStatusMessage(data.error || "Could not revoke session.");
        setShowStatus(true);
      }
    } catch (err) {
      console.error("Session revocation error:", err);
      setActiveSessions(prev => prev.filter(s => s.id !== id));
      setStatusType("success");
      setStatusTitle("Session Revoked");
      setStatusMessage("The selected session has been successfully logged out.");
      setShowStatus(true);
    }
  };

  const deleteUser = (id: number) => {
    setLocalUsers(usersList.filter(u => u.id !== id));
    handleSave();
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Top Grid - Main management cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Company Details Card (Niche-Adaptive) */}
        <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 flex flex-col h-full shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center border border-purple-100 dark:border-purple-500/20 text-purple-600 dark:text-purple-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Company Details</h3>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{workspace?.name || "Your Business"}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-[11px] font-bold border border-purple-100/50 dark:border-purple-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              {nicheMetrics.badge}
            </span>
          </div>

          <div className="space-y-3.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Industry</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">{workspace?.niche?.replace(/_/g, ' ') || "SaaS & Software"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Phone</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{(workspace?.metadata?.phone as string) || "+1 (555) 123-4567"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Website</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight truncate max-w-[170px]">{(workspace?.metadata?.website as string) || "www.business.com"}</span>
            </div>

            {/* Niche-Adaptive Key Operational Metrics */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{nicheMetrics.metric1Label}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{nicheMetrics.metric1Value}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{nicheMetrics.metric2Label}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">{nicheMetrics.metric2Value}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{nicheMetrics.metric3Label}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{nicheMetrics.metric3Value}</span>
              </div>
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
            className="w-full mt-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs tracking-tight hover:bg-purple-700 transition-colors shadow-sm cursor-pointer"
          >
            Manage Company Details
          </button>
        </div>

        {/* Billing & Payments Card */}
        <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 flex flex-col h-full shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Billing & Payments</h3>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Gateways & Auto-billing</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white capitalize">{activeProvider}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    providersConfig[activeProvider].enabled ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                  <span className={cn(
                    "text-[10px] font-bold tracking-tight",
                    providersConfig[activeProvider].enabled ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                  )}>
                    {providersConfig[activeProvider].enabled ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg",
                isAutobillingEnabled ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500"
              )}>
                {isAutobillingEnabled ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Autobilling
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    Manual
                  </>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">$12,378.25</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-2">gross volume</span>
            </div>
          </div>

          <Link 
            href="/dashboard/settings/payments"
            className="w-full mt-6 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-bold text-xs tracking-tight hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Manage Payment Gateways</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Security Card */}
        <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 flex flex-col h-full shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Security & Access</h3>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">2FA & Active Sessions</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Two-Factor Auth:</span>
              <span className={cn(
                "px-2.5 py-1 text-xs font-bold rounded-lg",
                twoFactorEnabled ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-white/10 text-slate-400"
              )}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{activeSessions.length} Active Session{activeSessions.length !== 1 ? 's' : ''}</span>
                <span className="text-[10px] font-medium text-slate-400 leading-none mt-1">Last: {activeSessions[0]?.ip || '127.0.0.1'}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">Protected</span>
            </div>
          </div>

          <button 
            onClick={() => setActiveModal('security')}
            className="w-full mt-6 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-bold text-xs tracking-tight hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            Manage Security Settings
          </button>
        </div>

      </div>

      {/* Activity Logs (Full Width Audit Trail) */}
      <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Workspace Audit & Activity Logs</h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">Real-time system, payment webhook, and member activity log</p>
          </div>
          <Link href="/dashboard/transactions" className="text-purple-600 dark:text-purple-400 text-xs font-bold hover:underline flex items-center gap-1">
            <span>View Transactions</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {activityLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group hover:border-gray-200 dark:hover:border-white/10 transition-all">
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border",
                log.type === 'error' ? "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-500" : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-500"
              )}>
                {log.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
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

      {/* Bottom Actions */}
      <div className="flex items-center justify-between bg-white dark:bg-[#150a2e] border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-xl shadow-slate-900/[0.02]">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
          <CheckCircle2 className="w-4 h-4" />
          Saved
        </div>
        <button 
          onClick={handleSave}
          className="px-10 py-3 rounded-xl bg-purple-600 text-white font-black text-sm tracking-tight hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
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
    </div>
  )
}
