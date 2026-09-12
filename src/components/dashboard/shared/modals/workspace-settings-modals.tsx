"use client"

import { useState, useRef, useEffect } from "react"
import {
  X,
  ChevronRight,
  ShieldCheck,
  Users,
  Settings2,
  Plus,
  Trash2,
  Search,
  MessageSquare,
  ChevronDown,
  Globe,
  Phone,
  Upload,
  Image as ImageIcon,
  Loader2,
  Copy,
  Check,
  QrCode,
  AlertCircle,
  ShieldAlert,
  ArrowLeft,
  Key,
  Smartphone,
  Laptop,
  Tablet
} from "lucide-react"
import NextImage from "next/image"
import { cn } from "@/lib/utils"
import { useUser } from "@/context/user-context"

export type SettingsModalType = 'profile' | 'users' | 'security' | 'billing' | 'roles'

interface User {
  id: number;
  name: string;
  role: string;
  img: string;
  active: boolean;
}

interface PhoneCountry {
  name: string
  code: string
  phonePrefix: string
  flag: string
  regex: RegExp
  format: string
  maxLength: number
}

const PHONE_COUNTRIES: PhoneCountry[] = [
  { name: "United States", code: "US", phonePrefix: "+1", flag: "🇺🇸", regex: /^\d{10}$/, format: "10 digits: 202 555 0199", maxLength: 10 },
  { name: "Nigeria", code: "NG", phonePrefix: "+234", flag: "🇳🇬", regex: /^\d{10}$/, format: "10 digits: 803 123 4567", maxLength: 10 },
  { name: "United Kingdom", code: "GB", phonePrefix: "+44", flag: "🇬🇧", regex: /^\d{10}$/, format: "10 digits: 7911 123456", maxLength: 10 },
  { name: "Germany", code: "DE", phonePrefix: "+49", flag: "🇩🇪", regex: /^\d{10,11}$/, format: "10 or 11 digits: 170 1234567", maxLength: 11 },
  { name: "Switzerland", code: "CH", phonePrefix: "+41", flag: "🇨🇭", regex: /^\d{9}$/, format: "9 digits: 79 123 45 67", maxLength: 9 },
  { name: "Canada", code: "CA", phonePrefix: "+1", flag: "🇨🇦", regex: /^\d{10}$/, format: "10 digits: 202 555 0199", maxLength: 10 },
  { name: "France", code: "FR", phonePrefix: "+33", flag: "🇫🇷", regex: /^\d{9}$/, format: "9 digits: 6 1234 5678", maxLength: 9 },
  { name: "Australia", code: "AU", phonePrefix: "+61", flag: "🇦🇺", regex: /^\d{9}$/, format: "9 digits: 412 345 678", maxLength: 9 },
  { name: "India", code: "IN", phonePrefix: "+91", flag: "🇮🇳", regex: /^\d{10}$/, format: "10 digits: 98765 43210", maxLength: 10 },
  { name: "South Africa", code: "ZA", phonePrefix: "+27", flag: "🇿🇦", regex: /^\d{9}$/, format: "9 digits: 82 123 4567", maxLength: 9 },
  { name: "Kenya", code: "KE", phonePrefix: "+254", flag: "🇰🇪", regex: /^\d{9,10}$/, format: "9 or 10 digits: 712 345 678", maxLength: 10 },
  { name: "Ghana", code: "GH", phonePrefix: "+233", flag: "🇬🇭", regex: /^\d{9}$/, format: "9 digits: 24 123 4567", maxLength: 9 },
  { name: "Brazil", code: "BR", phonePrefix: "+55", flag: "🇧🇷", regex: /^\d{11}$/, format: "11 digits: 11 91234 5678", maxLength: 11 },
  { name: "China", code: "CN", phonePrefix: "+86", flag: "🇨🇳", regex: /^\d{11}$/, format: "11 digits: 139 1234 5678", maxLength: 11 },
  { name: "Japan", code: "JP", phonePrefix: "+81", flag: "🇯🇵", regex: /^\d{10}$/, format: "10 digits: 90 1234 5678", maxLength: 10 },
  { name: "Mexico", code: "MX", phonePrefix: "+52", flag: "🇲🇽", regex: /^\d{10}$/, format: "10 digits: 55 1234 5678", maxLength: 10 },
  { name: "Spain", code: "ES", phonePrefix: "+34", flag: "🇪🇸", regex: /^\d{9}$/, format: "9 digits: 612 345 678", maxLength: 9 },
  { name: "Italy", code: "IT", phonePrefix: "+39", flag: "🇮🇹", regex: /^\d{10}$/, format: "10 digits: 312 345 6789", maxLength: 10 },
  { name: "Netherlands", code: "NL", phonePrefix: "+31", flag: "🇳🇱", regex: /^\d{9}$/, format: "9 digits: 6 1234 5678", maxLength: 9 },
  { name: "Singapore", code: "SG", phonePrefix: "+65", flag: "🇸🇬", regex: /^\d{8}$/, format: "8 digits: 8123 4567", maxLength: 8 },
  { name: "United Arab Emirates", code: "AE", phonePrefix: "+971", flag: "🇦🇪", regex: /^\d{9}$/, format: "9 digits: 50 123 4567", maxLength: 9 },
]

interface WorkspaceSettingsModalsProps {
  type: SettingsModalType | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void

  // Data props (passed from parent state)
  profileData?: { name: string; email: string; phone: string; address: string; website: string; logoUrl: string; registrationNumber: string; country: string }
  setProfileData?: (data: { name: string; email: string; phone: string; address: string; website: string; logoUrl: string; registrationNumber: string; country: string }) => void
  profileErrors?: Record<string, string>

  selectedIndustry?: string

  users?: User[]
  deleteUser?: (id: number) => void

  activeSessions?: {
    id: number | string;
    name?: string;
    browser?: string;
    ip?: string;
    location?: string;
    time?: string;
    deviceType?: 'laptop' | 'mobile' | 'tablet';
    isActive?: boolean;
  }[]
  revokeSession?: (id: number | string) => void

  twoFactorEnabled?: boolean
  toggle2FA?: () => void

  activeProvider?: string
  setActiveProvider?: (provider: string) => void
  providersConfig?: Record<string, { enabled: boolean; apiKey?: string; secretKey?: string }>
  toggleProvider?: (provider: string) => void

  isAddingMember?: boolean
  setIsAddingMember?: (adding: boolean) => void
  newMember?: { name?: string; role?: string }
  setNewMember?: (member: { name?: string; role?: string }) => void

  editingUser?: User | null
  setEditingUser?: (user: User | null) => void

  userFilter?: 'active' | 'inactive'
  setUserFilter?: (filter: 'active' | 'inactive') => void

  isCreatingProvider?: boolean
  setIsCreatingProvider?: (creating: boolean) => void
}

export function WorkspaceSettingsModals({
  type,
  isOpen,
  onClose,
  onSave,
  profileData,
  setProfileData,
  profileErrors = {},
  selectedIndustry,
  users = [],
  // setUsers, // Removed: Unused
  deleteUser,
  activeSessions = [],
  revokeSession,
  twoFactorEnabled,
  toggle2FA,
  activeProvider,
  setActiveProvider,
  providersConfig,
  toggleProvider,
  isAddingMember,
  setIsAddingMember,
  newMember,
  setNewMember,
  editingUser,
  setEditingUser,
  userFilter,
  setUserFilter,
  isCreatingProvider,
  setIsCreatingProvider
}: WorkspaceSettingsModalsProps) {
  const { user, refreshUser } = useUser();
  const effective2FAEnabled = twoFactorEnabled !== undefined ? twoFactorEnabled : Boolean(user?.twoFactorEnabled);

  // 2FA Management & Setup States
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [twoFactorSecret, setTwoFactorSecret] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState<string>('');
  const [twoFactorSuccess, setTwoFactorSuccess] = useState<string>('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [isConfirmingDisable, setIsConfirmingDisable] = useState(false);

  const handleStart2FASetup = async () => {
    setIs2FALoading(true);
    setTwoFactorError('');
    setTwoFactorSuccess('');
    setOtpCode('');
    try {
      const res = await fetch('/api/v1/auth/2fa/setup', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setTwoFactorSecret(data.secret);
        setQrCodeDataUrl(data.qrCodeDataUrl);
        setIsSettingUp2FA(true);
        setIsConfirmingDisable(false);
      } else {
        setTwoFactorError(data.error || 'Failed to initialize 2FA setup.');
      }
    } catch {
      setTwoFactorError('Could not connect to the security server.');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleVerifyAndEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setTwoFactorError('Please enter the 6-digit code from your authenticator app.');
      return;
    }
    setIs2FALoading(true);
    setTwoFactorError('');
    try {
      const res = await fetch('/api/v1/auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: twoFactorSecret,
          code: otpCode.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshUser();
        setIsSettingUp2FA(false);
        setOtpCode('');
        setTwoFactorSuccess('Two-Factor Authentication is now active!');
        toggle2FA?.();
      } else {
        setTwoFactorError(data.error || 'Invalid verification code. Please check and try again.');
      }
    } catch {
      setTwoFactorError('Failed to enable 2FA. Please try again.');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setIs2FALoading(true);
    setTwoFactorError('');
    try {
      const res = await fetch('/api/v1/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshUser();
        setIsConfirmingDisable(false);
        setTwoFactorSuccess('Two-Factor Authentication has been disabled.');
        toggle2FA?.();
      } else {
        setTwoFactorError(data.error || 'Failed to disable 2FA.');
      }
    } catch {
      setTwoFactorError('Could not disable 2FA. Please try again.');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleCopySecret = () => {
    if (!twoFactorSecret) return;
    navigator.clipboard.writeText(twoFactorSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2500);
  };

  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !profileData || !setProfileData) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setProfileData({ ...profileData, logoUrl: data.secure_url });
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profileData || !setProfileData) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setProfileData({ ...profileData, logoUrl: data.secure_url });
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryRef = useRef<HTMLDivElement>(null);

  const [isPhonePrefixOpen, setIsPhonePrefixOpen] = useState(false);
  const prefixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
      if (prefixRef.current && !prefixRef.current.contains(event.target as Node)) {
        setIsPhonePrefixOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCountry = profileData?.phone
    ? PHONE_COUNTRIES.find(c => profileData.phone.startsWith(c.phonePrefix)) || PHONE_COUNTRIES[0]
    : PHONE_COUNTRIES[0];

  const handlePrefixSelect = (prefix: string) => {
    if (!profileData || !setProfileData) return;
    const currentVal = profileData.phone || "";
    const currentPrefix = activeCountry.phonePrefix;
    const suffix = currentVal.startsWith(currentPrefix) 
      ? currentVal.slice(currentPrefix.length) 
      : currentVal;
    setProfileData({ ...profileData, phone: prefix + suffix });
    setIsPhonePrefixOpen(false);
  };

  const filteredCountries = PHONE_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  if (!isOpen || !type) return null


  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#150a2e] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-100 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white capitalize tracking-tight">
            {type === 'profile' ? 'Company Profile' : type === 'users' ? 'User Management' : type === 'roles' ? 'Team Roles' : type === 'security' ? 'Security Settings' : 'Payment Settings'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
             <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          {/* Profile Modal */}
          {type === 'profile' && profileData && (
            <div className="space-y-6">
              {/* Logo Section */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Company Logo Image</label>
                <div className="flex gap-4 items-center">
                  {profileData.logoUrl ? (
                    <div className="border border-purple-250 dark:border-purple-800/60 rounded-2xl p-4 bg-purple-50/40 dark:bg-purple-950/30 flex items-center justify-between gap-4 w-full">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-1 overflow-hidden shrink-0 flex items-center justify-center">
                          <NextImage src={profileData.logoUrl} alt="Preview" fill className="object-contain rounded-lg" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Image uploaded</p>
                          <p className="text-[11px] text-purple-650 dark:text-purple-400 font-medium">Ready to save</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProfileData?.({ ...profileData, logoUrl: "" })}
                        className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 w-full">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                          "border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group flex flex-col items-center justify-center w-full",
                          isUploading 
                            ? "border-purple-400 bg-purple-50/20 dark:bg-purple-950/20"
                            : isDragging
                              ? "border-purple-500 bg-purple-50/20 dark:bg-purple-950/20"
                              : "border-slate-200 dark:border-white/10 bg-slate-50/20 dark:bg-white/5 hover:border-purple-400 hover:bg-purple-50/10"
                        )}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin text-purple-600 mb-2" />
                            <p className="text-xs font-bold text-slate-500">Uploading to Cloudinary...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors mb-2" />
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-350">Click to select or drag logo file here</p>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 font-medium">SVG, PNG, JPG or GIF (max 2MB)</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-1.5 sm:space-y-2">
                   <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight sm:tracking-normal">Company Name</label>
                   <input 
                     type="text" 
                     value={profileData.name} 
                     onChange={(e) => setProfileData?.({...profileData, name: e.target.value})}
                     className={cn(
                       "w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all text-sm sm:text-base text-slate-900 dark:text-white font-medium",
                       profileErrors.name ? "border-red-500 focus:border-red-500" : "border-gray-200 dark:border-white/10 focus:border-purple-600 dark:focus:border-purple-500"
                     )}
                     placeholder="Company Name"
                   />
                   {profileErrors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{profileErrors.name}</p>}
                </div>

                 {/* Industry */}
                 <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-[0.05em]">Industry</label>
                    <input 
                      type="text" 
                      value={selectedIndustry} 
                      disabled
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium cursor-not-allowed"
                    />
                 </div>

                {/* CAC Registration Number */}
                <div className="space-y-1.5 sm:space-y-2">
                   <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight sm:tracking-normal">CAC Registration No</label>
                   <input 
                     type="text" 
                     value={profileData.registrationNumber || ""} 
                     onChange={(e) => setProfileData?.({...profileData, registrationNumber: e.target.value})}
                     className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 bg-white dark:bg-white/5 text-sm sm:text-base text-slate-900 dark:text-white font-medium"
                     placeholder="e.g. RC-123456"
                   />
                </div>

                {/* Country registered on */}
                <div className="space-y-1.5 sm:space-y-2 relative" ref={countryRef}>
                   <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight ml-1 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Registration Country</label>
                   <button 
                     type="button"
                     onClick={() => setIsCountryOpen(!isCountryOpen)}
                     className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 bg-white dark:bg-[#150a2e] text-sm sm:text-base text-slate-900 dark:text-white font-medium flex items-center justify-between group h-[40px] sm:h-[48px] cursor-pointer"
                   >
                      <span className="truncate">{profileData.country || "Select Country"}</span>
                      <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform shrink-0", isCountryOpen ? "rotate-90" : "")} />
                   </button>
                   {isCountryOpen && (
                     <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-[#150a2e] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-60 overflow-hidden">
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-white/10">
                          <input 
                            type="text"
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium"
                          />
                        </div>
                        <div className="overflow-y-auto custom-scrollbar flex-1 py-1">
                          {filteredCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setProfileData?.({...profileData, country: c.name});
                                setIsCountryOpen(false);
                                setCountrySearch("");
                              }}
                              className={cn(
                                "w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer flex items-center gap-2",
                                profileData.country === c.name ? "text-purple-600 bg-purple-50/50" : "text-slate-600 dark:text-slate-300"
                              )}
                            >
                              <span>{c.flag}</span>
                              <span className="truncate">{c.name}</span>
                            </button>
                          ))}
                        </div>
                     </div>
                   )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5 sm:space-y-2 relative" ref={prefixRef}>
                   <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight ml-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</label>
                   <div className="flex rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden focus-within:ring-2 focus-within:ring-purple-600/20 focus-within:border-purple-600">
                     <button
                       type="button"
                       onClick={() => setIsPhonePrefixOpen(!isPhonePrefixOpen)}
                       className="px-3 border-r border-gray-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-1 shrink-0 text-sm font-medium text-slate-750"
                     >
                       <span>{activeCountry.flag}</span>
                       <span>{activeCountry.phonePrefix}</span>
                       <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                     </button>
                     <input 
                       type="tel" 
                       value={profileData.phone ? profileData.phone.replace(activeCountry.phonePrefix, "") : ""} 
                       onChange={(e) => setProfileData?.({...profileData, phone: activeCountry.phonePrefix + e.target.value.replace(/[^0-9]/g, "")})}
                       className="w-full px-3 py-2 bg-transparent focus:outline-none text-sm sm:text-base text-slate-900 dark:text-white font-medium"
                       placeholder="e.g. 803 123 4567"
                     />
                   </div>
                   {isPhonePrefixOpen && (
                     <div className="absolute top-[calc(100%+4px)] left-0 w-48 bg-white dark:bg-[#150a2e] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-20 py-2 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
                        {PHONE_COUNTRIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handlePrefixSelect(c.phonePrefix)}
                            className="w-full px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                          >
                            <span>{c.flag}</span>
                            <span className="text-slate-900 dark:text-white font-semibold">{c.phonePrefix}</span>
                            <span className="text-slate-400 text-xs truncate">({c.name})</span>
                          </button>
                        ))}
                     </div>
                   )}
                   {profileErrors.phone && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{profileErrors.phone}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 sm:space-y-2">
                   <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight sm:tracking-normal">Business Email</label>
                   <input 
                     type="email" 
                     value={profileData.email} 
                     onChange={(e) => setProfileData?.({...profileData, email: e.target.value})}
                     className={cn(
                       "w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all text-sm sm:text-base text-slate-900 dark:text-white font-medium",
                       profileErrors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 dark:border-white/10 focus:border-purple-600 dark:focus:border-purple-500"
                     )}
                     placeholder="email@example.com"
                   />
                   {profileErrors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{profileErrors.email}</p>}
                </div>

                {/* Address */}
                <div className="space-y-1.5 sm:space-y-2">
                   <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight sm:tracking-normal">Address</label>
                   <input 
                     type="text" 
                     value={profileData.address} 
                     onChange={(e) => setProfileData?.({...profileData, address: e.target.value})}
                     className={cn(
                       "w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all text-sm sm:text-base text-slate-900 dark:text-white font-medium",
                       profileErrors.address ? "border-red-500 focus:border-red-500" : "border-gray-200 dark:border-white/10 focus:border-purple-600 dark:focus:border-purple-500"
                     )}
                     placeholder="Enter company address"
                   />
                   {profileErrors.address && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{profileErrors.address}</p>}
                </div>

                {/* Website */}
                <div className="space-y-1.5 sm:space-y-2">
                   <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight sm:tracking-normal">Website</label>
                   <input 
                     type="text" 
                     value={profileData.website} 
                     onChange={(e) => setProfileData?.({...profileData, website: e.target.value})}
                     className={cn(
                       "w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all text-sm sm:text-base text-slate-900 dark:text-white font-medium",
                       profileErrors.website ? "border-red-500 focus:border-red-500" : "border-gray-200 dark:border-white/10 focus:border-purple-600 dark:focus:border-purple-500"
                     )}
                     placeholder="www.example.com"
                   />
                   {profileErrors.website && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{profileErrors.website}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Users Modal */}
          {type === 'users' && (
            <div className="space-y-6">
               {isAddingMember ? (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                     <button onClick={() => setIsAddingMember?.(false)} className="text-purple-600 text-sm font-bold flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 rotate-180" /> Back to List
                     </button>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Full Name</label>
                           <input 
                             type="text" 
                             placeholder="Enter member name"
                             value={newMember?.name}
                             onChange={(e) => setNewMember?.({...newMember, name: e.target.value})}
                             className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Role / Designation</label>
                           <input 
                             type="text" 
                             placeholder="e.g. Designer, Developer"
                             value={newMember?.role}
                             onChange={(e) => setNewMember?.({...newMember, role: e.target.value})}
                             className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium" 
                           />
                        </div>
                        <div className="pt-2">
                           <button 
                             onClick={() => {
                               setIsAddingMember?.(false);
                               onSave();
                             }}
                             className="w-full py-3 rounded-xl bg-purple-600 text-white font-black text-sm tracking-tight hover:bg-purple-700 transition-all"
                           >
                             Add Team Member
                           </button>
                        </div>
                     </div>
                  </div>
               ) : editingUser ? (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                     <button onClick={() => setEditingUser?.(null)} className="text-purple-600 text-sm font-bold flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 rotate-180" /> Back to List
                     </button>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Full Name</label>
                           <input type="text" defaultValue={editingUser?.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Role / Designation</label>
                           <input type="text" defaultValue={editingUser?.role} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium" />
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                           <button onClick={() => setEditingUser?.(null)} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-black text-sm tracking-tight hover:bg-purple-700 transition-all">
                             Update User
                           </button>
                        </div>
                     </div>
                  </div>
               ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search members..."
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 focus:border-purple-200 focus:ring-4 focus:ring-purple-600/5 transition-all text-sm font-medium"
                      />
                    </div>
                    <button 
                      onClick={() => setIsAddingMember?.(true)}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs tracking-tight hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Member
                    </button>
                  </div>

                  {/* Users Filter Tabs */}
                  <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit">
                    <button 
                      onClick={() => setUserFilter?.('active')}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-bold transition-all",
                        userFilter === 'active' ? "bg-white dark:bg-white/10 text-purple-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      Active
                    </button>
                    <button 
                      onClick={() => setUserFilter?.('inactive')}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-bold transition-all",
                        userFilter === 'inactive' ? "bg-white dark:bg-white/10 text-purple-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      Inactive
                    </button>
                  </div>

                  {/* Users List */}
                  <div className="space-y-3">
                    {users.filter(u => userFilter === 'active' ? u.active : !u.active).map((user: User) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-50 dark:border-white/5 group shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm relative">
                            <NextImage src={user.img} width={48} height={48} className="w-full h-full object-cover" alt={user.name} />
                            <div className={cn(
                              "absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#150a2e]",
                              user.active ? "bg-emerald-500" : "bg-slate-300"
                            )} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</h4>
                              <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[9px] font-black uppercase tracking-widest">{user.role}</span>
                            </div>
                            <p className="text-[10px] font-medium text-slate-400 lowercase tracking-tight">{user.name.split(' ')[0].toLowerCase()}@recura.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setEditingUser?.(user)}
                            className="p-2 text-slate-300 hover:text-purple-600 transition-colors"
                          >
                            <Settings2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteUser?.(user.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
               )}
            </div>
          )}

          {/* Roles Modal */}
          {type === 'roles' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Super Admin', permissions: 'Full Access', count: 2, icon: ShieldCheck, color: 'text-purple-600 bg-purple-50' },
                    { title: 'Team Manager', permissions: 'User Mgmt, Billing', count: 4, icon: Users, color: 'text-blue-600 bg-blue-50' },
                    { title: 'Support Agent', permissions: 'Read Only', count: 8, icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50' },
                    { title: 'Custom Role', permissions: 'Limited Access', count: 1, icon: Plus, color: 'text-slate-400 bg-slate-50' },
                  ].map((role, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group hover:border-purple-200 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", role.color)}>
                          <role.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role.count} Users</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{role.title}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        {role.permissions}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10">
                  <button 
                    onClick={() => {
                      // Fallback for documentation preview if prop not passed
                      console.log("Create role clicked");
                    }}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-purple-600 text-white font-black text-sm tracking-tight hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/30"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Role
                  </button>
                </div>
              </div>
            )}

          {/* Security Modal */}
          {type === 'security' && (
            <div className="space-y-6 py-4">
              {/* Success Notification */}
              {twoFactorSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p>{twoFactorSuccess}</p>
                </div>
              )}

              {/* 2FA Setup View */}
              {isSettingUp2FA ? (
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-purple-200 dark:border-purple-800/50 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <button 
                      type="button"
                      onClick={() => setIsSettingUp2FA(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      Step-by-Step Setup
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-purple-600" />
                      Set Up Authenticator App
                    </h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Scan the QR code with Google Authenticator, Microsoft Authenticator, Apple Passwords, or 1Password.
                    </p>
                  </div>

                  {/* QR Code Container */}
                  {qrCodeDataUrl ? (
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                      <NextImage 
                        src={qrCodeDataUrl} 
                        alt="2FA QR Code" 
                        width={180} 
                        height={180} 
                        className="w-44 h-44 rounded-xl object-contain"
                        unoptimized
                      />
                      <p className="text-[11px] font-semibold text-slate-500 mt-2">
                        Point your authenticator camera at this QR code
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-44 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                    </div>
                  )}

                  {/* Manual Key Display */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 ml-1 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      Or enter this secret key manually:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-xs font-bold text-slate-900 dark:text-white tracking-wider truncate select-all">
                        {twoFactorSecret || "••••••••••••••••"}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopySecret}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border",
                          copiedSecret 
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border-emerald-200 dark:border-emerald-800" 
                            : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
                        )}
                      >
                        {copiedSecret ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedSecret ? "Copied!" : "Copy Key"}
                      </button>
                    </div>
                  </div>

                  {/* Code Input Form */}
                  <form onSubmit={handleVerifyAndEnable2FA} className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 ml-1">
                        Enter 6-digit Verification Code
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="000000"
                        value={otpCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setOtpCode(val);
                          if (twoFactorError) setTwoFactorError('');
                        }}
                        className="w-full text-center tracking-[0.4em] font-mono text-xl font-extrabold py-3 px-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-all"
                        autoFocus
                      />
                    </div>

                    {twoFactorError && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{twoFactorError}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsSettingUp2FA(false)}
                        className="w-1/3 py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={is2FALoading || otpCode.length !== 6}
                        className="w-2/3 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {is2FALoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        <span>Verify & Enable 2FA</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : isConfirmingDisable ? (
                /* Confirm Disable View */
                <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 text-rose-700 dark:text-rose-400">
                    <ShieldAlert className="w-6 h-6 shrink-0" />
                    <div>
                      <h4 className="text-sm font-extrabold">Disable Two-Factor Authentication?</h4>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                        This will reduce account security. You can re-enable TOTP at any time.
                      </p>
                    </div>
                  </div>

                  {twoFactorError && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold">
                      {twoFactorError}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDisable(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={is2FALoading}
                      onClick={handleDisable2FA}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {is2FALoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Disable 2FA
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Security Card */
                <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center">
                      <ShieldCheck className={cn("w-6 h-6", effective2FAEnabled ? "text-purple-600" : "text-slate-400 dark:text-slate-500")} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h4>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                          effective2FAEnabled 
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" 
                            : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10"
                        )}>
                          {effective2FAEnabled ? "Active" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                        {effective2FAEnabled 
                          ? "Secured with TOTP Authenticator app verification" 
                          : "Protect your account with Google Authenticator or 1Password"}
                      </p>
                    </div>
                  </div>

                  {effective2FAEnabled ? (
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDisable(true)}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={is2FALoading}
                      onClick={handleStart2FASetup}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {is2FALoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Set Up 2FA</span>
                    </button>
                  )}
                </div>
              )}
               
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Session Timeout</h4>
                      <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Automatic logout after inactivity period</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-xs font-bold">
                    30 Mins
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Active Sessions (Recent 2)</h4>
                  <span className="text-[10px] font-bold text-slate-400">Max 2 shown</span>
                </div>
                <div className="space-y-2">
                  {(activeSessions || []).slice(0, 2).map(session => {
                    const str = `${session.browser || ''} ${session.name || ''}`.toLowerCase();
                    const isTablet = session.deviceType === 'tablet' || str.includes('ipad') || str.includes('tablet');
                    const isMobile = session.deviceType === 'mobile' || str.includes('iphone') || str.includes('android');

                    return (
                      <div key={session.id} className="p-4 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-white/5 hover:border-gray-200 dark:hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-center shrink-0">
                            {isTablet ? (
                              <Tablet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            ) : isMobile ? (
                              <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            ) : (
                              <Laptop className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{session.name || session.browser}</p>
                              {session.isActive && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{session.ip || session.location || 'Localhost'} • {session.time || 'Active Now'}</p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => revokeSession?.(session.id)}
                          className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          Revoke
                        </button>
                      </div>
                    );
                  })}
                  {(!activeSessions || activeSessions.length === 0) && (
                    <div className="p-4 text-center text-xs font-semibold text-slate-400 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                      No active sessions found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Billing Modal */}
          {type === 'billing' && providersConfig && (activeProvider) && (
             <div className="space-y-8 py-4">
                {isCreatingProvider ? (
                   <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                      <button onClick={() => setIsCreatingProvider?.(false)} className="text-purple-600 text-sm font-bold flex items-center gap-2">
                         <ChevronRight className="w-4 h-4 rotate-180" /> Back to Providers
                      </button>
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Gateway Name</label>
                            <input type="text" placeholder="e.g. Stripe, PayPal" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Live API Key</label>
                            <input type="password" placeholder="sk_live_••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium" />
                         </div>
                         <button 
                           onClick={() => {
                             setIsCreatingProvider?.(false);
                             onSave();
                           }}
                           className="w-full py-4 rounded-xl bg-purple-600 text-white font-black text-sm tracking-tight hover:bg-purple-700 transition-all mt-2"
                         >
                            Connect Gateway
                         </button>
                      </div>
                   </div>
                ) : (
                   <div className="space-y-6">
                      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl">
                          {['flutterwave', 'paystack', 'monnify'].map((p) => (
                            <button 
                              key={p}
                              onClick={() => setActiveProvider?.(p)}
                              className={cn(
                                "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                activeProvider === p ? "bg-white dark:bg-white/10 text-purple-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                              )}
                            >
                              {p}
                            </button>
                          ))}
                       </div>

                       <div className="space-y-6">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10 overflow-hidden relative shrink-0 p-1.5">
                                    <NextImage 
                                      src={
                                        activeProvider === 'paystack'
                                          ? 'https://res.cloudinary.com/weburea/image/upload/v1785123705/images/payment-icons/paystack.png'
                                          : activeProvider === 'flutterwave'
                                          ? 'https://res.cloudinary.com/weburea/image/upload/v1785123774/images/payment-icons/flutterwave.png'
                                          : 'https://res.cloudinary.com/weburea/image/upload/v1785123800/images/payment-icons/monnify.png'
                                      } 
                                      alt={activeProvider || ''} 
                                      width={28} 
                                      height={28} 
                                      className="object-contain" 
                                    />
                                 </div>
                                <div>
                                   <h4 className="font-bold text-slate-900 dark:text-white capitalize">{activeProvider} Configuration</h4>
                                   <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Configure your payment gateway credentials</p>
                                </div>
                             </div>
                              <button 
                                 onClick={() => toggleProvider?.(activeProvider || '')}
                                 className={cn(
                                   "w-12 h-6 rounded-full transition-colors relative flex items-center px-1",
                                   providersConfig[activeProvider || '']?.enabled ? "bg-purple-600" : "bg-slate-200 dark:bg-white/10"
                                 )}
                              >
                                <div className={cn(
                                  "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                                  providersConfig[activeProvider || '']?.enabled ? "translate-x-6" : "translate-x-0"
                                )} />
                             </button>
                          </div>

                          {/* Gateway Benefits Card */}
                          <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-xs text-slate-600 dark:text-slate-300 space-y-2 mt-4 animate-in fade-in duration-200">
                             <p className="font-black text-slate-900 dark:text-white capitalize tracking-wide">{activeProvider} Key Benefits:</p>
                             <ul className="list-disc pl-5 space-y-1.5 font-medium">
                               {activeProvider === 'paystack' && (
                                 <>
                                   <li>Industry-leading transaction success rates with smart dynamic routing</li>
                                   <li>Accepts secure payments through Cards, direct Bank Transfers, and USSD codes</li>
                                   <li>Provides instant settlement options and custom-tailored checkout dashboards</li>
                                 </>
                               )}
                               {activeProvider === 'flutterwave' && (
                                 <>
                                   <li>Allows global payment processing in multi-currency across 30+ African nations</li>
                                   <li>Direct integration with Mobile Money, Card payments, and Bank accounts</li>
                                   <li>Built-in active fraud detection systems keeping transactions safe</li>
                                 </>
                               )}
                               {activeProvider === 'monnify' && (
                                 <>
                                   <li>Best-in-class automated virtual accounts mapping for immediate bank transfers</li>
                                   <li>Low cost transaction fees with automated webhook event triggers</li>
                                   <li>End-to-end reconciliation system built for enterprise scale operations</li>
                                 </>
                               )}
                             </ul>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/10">
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                                   Live API Key
                                </label>
                                <input 
                                   type="password" 
                                   placeholder="sk_live_••••••••••••••••"
                                   className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium" 
                                 />
                             </div>
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Webhook Secret</label>
                                <input type="text" defaultValue="whsec_••••••••••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-mono text-sm" />
                             </div>
                             <button onClick={onSave} className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white/10 text-white dark:text-slate-200 font-black text-sm tracking-tight hover:bg-slate-800 dark:hover:bg-white/20 transition-all mt-4 border border-transparent dark:border-white/10">
                               Update {activeProvider?.charAt(0).toUpperCase() || ''}{activeProvider?.slice(1) || ''} Credentials
                             </button>
                             <p className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 leading-relaxed mt-3 text-center px-4">
                               Please handle your live credentials with care. Ensure you input the correct Live API Key and Webhook Secret from your {activeProvider?.charAt(0).toUpperCase() || ''}{activeProvider?.slice(1) || ''} dashboard to avoid billing integration failures.
                             </p>
                          </div>
                      </div>
                   </div>
                )}
             </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-slate-400 dark:text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            className="px-8 py-2.5 rounded-xl bg-purple-600 text-white font-black text-sm tracking-tight hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
