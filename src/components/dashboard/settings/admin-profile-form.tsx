"use client"

import * as React from "react"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { 
  Camera, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Laptop, 
  Tablet,
  CheckCircle2,
  Eye,
  EyeOff,
  Shield,
  Briefcase,
  Mail,
  Phone,
  Lock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Check,
  Building2,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@/context/user-context"
import { useTranslation } from "@/context/language-context"
import { StatusModal, StatusType } from "@/components/dashboard/shared/modals/status-modal"
import { TIMEZONES, getTimezoneInfo } from "@/lib/utils/timezone"
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages"

interface UserSession {
  id: string;
  browser: string;
  browserName?: string;
  os?: string;
  deviceType?: 'laptop' | 'mobile' | 'tablet';
  name?: string;
  location: string;
  ip?: string;
  time: string;
  isActive: boolean;
}

export function AdminProfileForm() {
  const { user, workspace, refreshUser, loading } = useUser()
  const { t, language: currentLangCode, setLanguage: setGlobalLanguage } = useTranslation()

  const [showStatus, setShowStatus] = useState(false)
  const [statusType, setStatusType] = useState<StatusType>("success")
  const [statusTitle, setStatusTitle] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  // Form Fields States
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneVal, setPhoneVal] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [timezone, setTimezone] = useState("America/New_York")
  const [language, setLanguageVal] = useState(currentLangCode || "en")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  
  // Real-time ticking clock for live timezone calculations
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 15000)
    return () => clearInterval(timer)
  }, [])

  // Save loading state
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Password States
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Password Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Active Sessions States
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)

  // Dropdown UI Toggles
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)

  const timezoneRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (timezoneRef.current && !timezoneRef.current.contains(e.target as Node)) {
        setIsTimezoneOpen(false)
      }
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setIsLanguageOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Populate form fields once user context is loaded
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "")
      setEmail(user.email || "")
      setPhoneVal(user.phone || "")
      setJobTitle(user.jobTitle || "")
      setTimezone(user.timezone || "America/New_York")
      if (user.language) {
        setLanguageVal(user.language)
        setGlobalLanguage(user.language)
      }
      setProfileImage(user.avatarUrl)
    }
  }, [user, setGlobalLanguage])

  // Fetch active database sessions
  const fetchSessions = useCallback(async () => {
    setIsLoadingSessions(true)
    try {
      const res = await fetch("/api/v1/auth/sessions?limit=4")
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          setActiveSessions(json.data || [])
        }
      }
    } catch (err) {
      console.error("Failed to load active sessions:", err)
    } finally {
      setIsLoadingSessions(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchSessions()
    }
  }, [user, fetchSessions])

  // Dynamic Profile Completion Calculation
  const completionScore = useMemo(() => {
    let score = 0
    if (profileImage) score += 15
    if (fullName.trim()) score += 15
    if (email.trim()) score += 20
    if (phoneVal.trim()) score += 15
    if (timezone) score += 10
    if (language) score += 10
    if (jobTitle.trim() || workspace?.name) score += 15
    return Math.min(score, 100)
  }, [profileImage, fullName, email, phoneVal, timezone, language, jobTitle, workspace?.name])

  // Niche-Adaptive Profile Title & Badge (Dynamically checks businessType and niche)
  const nicheRole = useMemo(() => {
    const rawNiche = (workspace?.businessType || workspace?.niche || 'other').toLowerCase()
    if (rawNiche.includes('agenc')) return { roleTitle: 'Agency Principal', badge: 'Agency & Retainers' }
    if (rawNiche.includes('social')) return { roleTitle: 'Marketing Lead', badge: 'Social Media' }
    if (rawNiche.includes('startup')) return { roleTitle: 'Startup Founder', badge: 'High-Growth Startup' }
    if (rawNiche.includes('market') || rawNiche.includes('commerce')) return { roleTitle: 'Store Owner', badge: 'E-Commerce' }
    if (rawNiche.includes('saas') || rawNiche.includes('software')) return { roleTitle: 'SaaS Founder', badge: 'SaaS Business' }
    return { roleTitle: 'Business Owner', badge: 'Custom Business' }
  }, [workspace?.businessType, workspace?.niche])

  // Current active timezone details
  const selectedTimezoneInfo = useMemo(() => {
    return getTimezoneInfo(timezone, currentDate)
  }, [timezone, currentDate])

  // Current active language details
  const selectedLanguageOption = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find(
        (l) => l.code.toLowerCase() === language.toLowerCase() || l.name.toLowerCase() === language.toLowerCase()
      ) || SUPPORTED_LANGUAGES[0]
    )
  }, [language])

  const renderSessionIcon = (session: UserSession) => {
    if (session.deviceType === 'tablet' || session.browser?.toLowerCase().includes('ipad') || session.browser?.toLowerCase().includes('tablet')) {
      return <Tablet className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    }
    if (session.deviceType === 'mobile' || session.browser?.toLowerCase().includes('iphone') || session.browser?.toLowerCase().includes('android')) {
      return <Smartphone className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    }
    return <Laptop className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
  };

  // Handles updating the profile fields (PUT)
  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      setStatusType("error")
      setStatusTitle("Validation Error")
      setStatusMessage("Full Name cannot be empty.")
      setShowStatus(true)
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/v1/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: phoneVal,
          jobTitle,
          timezone,
          language: selectedLanguageOption.code,
          avatarUrl: profileImage,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        await refreshUser()
        setGlobalLanguage(selectedLanguageOption.code)
        setStatusType("success")
        setStatusTitle(t("common.success", "Success"))
        setStatusMessage("Your personal account settings and preferences have been successfully updated.")
      } else {
        setStatusType("error")
        setStatusTitle("Update Failed")
        setStatusMessage(data.error || "An error occurred while saving your profile.")
      }
    } catch (err) {
      console.error(err)
      setStatusType("error")
      setStatusTitle("System Error")
      setStatusMessage("Could not connect to update servers.")
    } finally {
      setIsSaving(false)
      setShowStatus(true)
    }
  }

  // Handles changing or adding password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPassword) {
      setStatusType("error")
      setStatusTitle("Validation Error")
      setStatusMessage("Please enter a new password.")
      setShowStatus(true)
      return
    }

    if (newPassword.length < 8) {
      setStatusType("error")
      setStatusTitle("Weak Password")
      setStatusMessage("New password must be at least 8 characters long.")
      setShowStatus(true)
      return
    }

    if (newPassword !== confirmPassword) {
      setStatusType("error")
      setStatusTitle("Password Mismatch")
      setStatusMessage("New password and confirm password fields do not match.")
      setShowStatus(true)
      return
    }

    setIsUpdatingPassword(true)
    try {
      const res = await fetch("/api/v1/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: user?.hasPassword ? currentPassword : undefined,
          newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        await refreshUser()
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setStatusType("success")
        setStatusTitle("Password Updated")
        setStatusMessage("Your password has been successfully configured.")
      } else {
        setStatusType("error")
        setStatusTitle("Update Failed")
        setStatusMessage(data.error || "Incorrect current password or update failed.")
      }
    } catch (err) {
      console.error(err)
      setStatusType("error")
      setStatusTitle("System Error")
      setStatusMessage("Could not connect to update servers.")
    } finally {
      setIsUpdatingPassword(false)
      setShowStatus(true)
    }
  }

  // Terminate other active sessions
  const handleLogoutAllOtherSessions = async () => {
    try {
      const res = await fetch("/api/v1/auth/sessions", {
        method: "DELETE",
      })
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          await fetchSessions()
          setStatusType("success")
          setStatusTitle("Sessions Terminated")
          setStatusMessage("All other active device sessions have been securely logged out.")
          setShowStatus(true)
        }
      }
    } catch (err) {
      console.error("Failed to terminate other sessions:", err)
    }
  }

  // Image Upload handler (Cloudinary integration)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("niche", workspace?.niche || "general")

    try {
      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success && data.secure_url) {
          setProfileImage(data.secure_url)
          
          await fetch("/api/v1/auth/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ avatarUrl: data.secure_url }),
          })
          await refreshUser()

          setStatusType("success")
          setStatusTitle("Photo Uploaded")
          setStatusMessage("Your profile picture has been successfully updated.")
          setShowStatus(true)
        }
      } else {
        console.error("Upload failed")
      }
    } catch (err) {
      console.error("Error uploading to Cloudinary:", err)
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8 pb-10 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-white/5 rounded-xl w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <div className="h-64 bg-slate-200 dark:bg-white/5 rounded-2xl" />
            <div className="h-96 bg-slate-200 dark:bg-white/5 rounded-2xl" />
          </div>
          <div className="lg:col-span-1 space-y-6 lg:space-y-8">
            <div className="h-80 bg-slate-200 dark:bg-white/5 rounded-2xl" />
            <div className="h-60 bg-slate-200 dark:bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {t("settings.adminProfile", "Admin Profile")}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {t("settings.adminProfileSubtitle", "Manage your personal account settings and credentials")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column (Profile Overview, Personal Info) */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          
          {/* Profile Overview */}
          <div className="bg-white dark:bg-[#150a2e] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50/50 dark:bg-purple-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                {t("settings.profileOverview", "Profile Overview")}
              </h3>
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs font-bold border border-purple-100/50 dark:border-purple-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                {nicheRole.badge}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="relative w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center border-4 border-white dark:border-white/10 shadow-md overflow-hidden group">
                  {profileImage ? (
                    <Image src={profileImage} alt="Profile" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-2xl font-black">
                      {fullName ? fullName.slice(0, 2).toUpperCase() : "AU"}
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                </div>
                <label className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/20 rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer text-center relative overflow-hidden">
                  <span>{t("settings.uploadPhoto", "Upload Photo")}</span>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>

              {/* Basic Info */}
              <div className="flex-1 min-w-0 space-y-3 w-full">
                <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">{fullName || "Admin User"}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 text-[11px] font-black border border-purple-100 dark:border-purple-900/30 uppercase tracking-widest">
                      <Shield className="w-3 h-3" /> {t("common.owner", "OWNER")}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      • {jobTitle || nicheRole.roleTitle}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>
                  {workspace?.name && (
                    <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span className="truncate">{workspace.name}</span>
                      {Boolean((workspace?.metadata as Record<string, unknown> | null)?.website) && (
                        <a 
                          href={String((workspace?.metadata as Record<string, unknown> | null)?.website).startsWith('http') ? String((workspace?.metadata as Record<string, unknown> | null)?.website) : `https://${(workspace?.metadata as Record<string, unknown> | null)?.website}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5 font-bold shrink-0"
                        >
                          <span>{t("common.website", "Website")}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Clean Responsive Timezone & Live Clock Badge */}
                  <div className="pt-0.5">
                    <div 
                      className="inline-flex flex-wrap sm:flex-nowrap items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs shadow-xs max-w-full"
                      suppressHydrationWarning
                    >
                      <div className="flex items-center gap-1.5 min-w-0 truncate">
                        <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                          {timezone.replace(/_/g, " ")}
                        </span>
                      </div>
                      <span 
                        className="text-[11px] font-mono text-purple-700 dark:text-purple-300 font-bold bg-purple-100/70 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/40 px-2 py-0.5 rounded-md whitespace-nowrap ml-auto sm:ml-1 shrink-0"
                        suppressHydrationWarning
                      >
                        {selectedTimezoneInfo.time} ({selectedTimezoneInfo.offset})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Dynamic Completion */}
              <div className="w-full md:w-72 shrink-0 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-white/10">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{t("settings.accountStatus", "Account Status")}:</span>
                  <span className="flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t("common.active", "Active")}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-white/10">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{t("settings.authMethod", "Auth Method")}:</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">
                    {user?.providers && user.providers.length > 0 
                      ? user.providers.join(", ") 
                      : "Password"
                    }
                  </span>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t("settings.profileCompletion", "Profile Completion")}:</span>
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400">{completionScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full transition-all duration-500 relative"
                      style={{ width: `${completionScore}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full py-2 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSaving ? t("common.saving", "Saving...") : t("common.save", "Save Changes")}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information Form */}
          <div className="bg-white dark:bg-[#150a2e] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              {t("settings.personalInformation", "Personal Information")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t("settings.fullName", "FULL NAME")}</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Harmony Timenyin"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 focus:bg-white dark:focus:bg-[#150a2e] focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-medium text-slate-900 dark:text-white shadow-sm text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t("settings.emailAddress", "EMAIL ADDRESS")}</label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t("settings.phoneNumber", "PHONE NUMBER")}</span>
                </label>
                <input 
                  type="tel" 
                  value={phoneVal}
                  onChange={(e) => setPhoneVal(e.target.value)}
                  placeholder="+234 810 097 4728"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 focus:bg-white dark:focus:bg-[#150a2e] focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-medium text-slate-900 dark:text-white shadow-sm text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t("settings.jobTitle", "JOB TITLE / DESIGNATION")}</span>
                </label>
                <input 
                  type="text" 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder={nicheRole.roleTitle}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 focus:bg-white dark:focus:bg-[#150a2e] focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-medium text-slate-900 dark:text-white shadow-sm text-sm"
                />
              </div>

              {/* Timezone Custom Dropdown with Real-Time Offset & Clock */}
              <div className="space-y-2 relative" ref={timezoneRef}>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t("settings.timezone", "TIMEZONE")}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsTimezoneOpen(!isTimezoneOpen)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 hover:border-purple-300 text-left flex items-center justify-between transition-all font-medium text-slate-900 dark:text-white shadow-sm text-sm"
                >
                  <div className="flex items-center gap-2 truncate" suppressHydrationWarning>
                    <span className="font-semibold">{timezone}</span>
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-bold" suppressHydrationWarning>
                      • {selectedTimezoneInfo.time} ({selectedTimezoneInfo.offset})
                    </span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0", isTimezoneOpen && "rotate-180")} />
                </button>

                {isTimezoneOpen && (
                  <div className="absolute top-full left-0 w-full mt-1.5 bg-white dark:bg-[#150a2e] border border-gray-100 dark:border-white/10 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto py-1">
                    {TIMEZONES.map((tz) => {
                      const info = getTimezoneInfo(tz.value, currentDate);
                      const isSelected = timezone === tz.value;
                      return (
                        <button
                          key={tz.value}
                          type="button"
                          onClick={() => {
                            setTimezone(tz.value)
                            setIsTimezoneOpen(false)
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors",
                            isSelected ? "text-purple-600 bg-purple-50/60 dark:bg-purple-950/30" : "text-slate-700 dark:text-slate-300"
                          )}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold">{tz.value}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{tz.city} ({tz.region})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">
                              {info.time} • {info.offset}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Language Custom Dropdown with Flag Badges & Native Names */}
              <div className="space-y-2 relative" ref={languageRef}>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t("settings.language", "LANGUAGE")}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 hover:border-purple-300 text-left flex items-center justify-between transition-all font-medium text-slate-900 dark:text-white shadow-sm text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={selectedLanguageOption.flagUrl} 
                      alt={selectedLanguageOption.name} 
                      className="w-5 h-3.5 object-cover rounded-xs shadow-xs" 
                    />
                    <span className="font-semibold">{selectedLanguageOption.nativeName}</span>
                    <span className="text-xs text-slate-400 font-medium">({selectedLanguageOption.name})</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0", isLanguageOpen && "rotate-180")} />
                </button>

                {isLanguageOpen && (
                  <div className="absolute top-full left-0 w-full mt-1.5 bg-white dark:bg-[#150a2e] border border-gray-100 dark:border-white/10 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto py-1">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = selectedLanguageOption.code === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguageVal(lang.code)
                            setGlobalLanguage(lang.code)
                            setIsLanguageOpen(false)
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors",
                            isSelected ? "text-purple-600 bg-purple-50/60 dark:bg-purple-950/30" : "text-slate-700 dark:text-slate-300"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={lang.flagUrl} 
                              alt={lang.name} 
                              className="w-5 h-3.5 object-cover rounded-xs shadow-xs" 
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 dark:text-white">{lang.nativeName}</span>
                              <span className="text-[10px] text-slate-400">{lang.name}</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? t("common.saving", "Saving...") : t("common.save", "Save Changes")}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (Security & Active Sessions) */}
        <div className="lg:col-span-1 space-y-6 lg:space-y-8">
          
          {/* Security & Authentication */}
          <div className="bg-white dark:bg-[#150a2e] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
              {t("settings.securityAuth", "Security & Authentication")}
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Show Current Password field only if they already set a password hash */}
              {user?.hasPassword ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t("settings.currentPassword", "Current Password")}</label>
                    <Link href="/forgot-password" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
                      {t("settings.forgotPassword", "Forgot password?")}
                    </Link>
                  </div>
                  <div className="relative group">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                    <input 
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 focus:bg-white dark:focus:bg-[#150a2e] focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-medium text-slate-900 dark:text-white text-xs"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                    >
                      {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-xs font-medium text-purple-700 dark:text-purple-400">
                  {t("settings.oauthNotice", "You signed in via OAuth. Create a master password below to enable direct email login.")}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">{t("settings.newPassword", "New Password")}</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 focus:bg-white dark:focus:bg-[#150a2e] focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-medium text-slate-900 dark:text-white text-xs"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">{t("settings.confirmNewPassword", "Confirm New Password")}</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 focus:bg-white dark:focus:bg-[#150a2e] focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-medium text-slate-900 dark:text-white text-xs"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/10 mt-4 flex items-center justify-between">
                {user?.hasPassword ? (
                  <Link href="/forgot-password" className="text-[11px] font-bold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    {t("settings.resetViaEmail", "Reset via email code →")}
                  </Link>
                ) : <div />}
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-55"
                >
                  {isUpdatingPassword ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : user?.hasPassword ? (
                    t("settings.updatePassword", "Update Password")
                  ) : (
                    t("settings.createPassword", "Create Password")
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Active Sessions */}
          <div className="bg-white dark:bg-[#150a2e] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
              {t("settings.activeSessions", "Active Sessions")}
            </h3>

            <div className="space-y-3.5">
              {activeSessions.slice(0, 4).map((session, i) => (
                <div key={session.id || i} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#150a2e] border border-slate-200 dark:border-white/20 flex items-center justify-center shrink-0">
                    {renderSessionIcon(session)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{session.browser || session.name}</h4>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{session.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{session.location || session.ip}</span>
                      {session.isActive && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                          {t("common.current", "Current")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {activeSessions.length === 0 && !isLoadingSessions && (
                <div className="text-center py-6 text-xs text-slate-500 font-medium bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/20">
                  {t("settings.noOtherSessions", "No other active sessions.")}
                </div>
              )}
              {isLoadingSessions && (
                <div className="text-center py-6 text-xs text-slate-400 font-medium">
                  {t("settings.loadingSessions", "Loading sessions...")}
                </div>
              )}
            </div>

            <button 
              onClick={handleLogoutAllOtherSessions}
              disabled={activeSessions.length <= 1}
              className="w-full mt-5 py-2.5 px-4 bg-slate-50 dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-slate-700 dark:text-slate-300 hover:text-purple-600 border border-slate-200 dark:border-white/20 hover:border-purple-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer border-dashed disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("settings.logOutAllSessions", "Log Out All Other Sessions")}
            </button>
          </div>

        </div>
      </div>

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
