"use client"

import * as React from "react"
import { useState, useEffect } from "react"
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
  Trash2,
  ChevronRight,
  Eye,
  EyeOff,
  Shield,
  Briefcase,
  AlertTriangle,
  Mail,
  Phone,
  Lock
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@/context/user-context"
import { StatusModal, StatusType } from "@/components/dashboard/shared/modals/status-modal"
import { useRouter } from "next/navigation"

export function AdminProfileForm() {
  const { user, workspace, refreshUser, loading } = useUser()
  const router = useRouter()

  const [showStatus, setShowStatus] = useState(false)
  const [statusType, setStatusType] = useState<StatusType>("success")
  const [statusTitle, setStatusTitle] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  // Form Fields States
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneVal, setPhoneVal] = useState("")
  const [timezone, setTimezone] = useState("America/New_York")
  const [language, setLanguage] = useState("English")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  
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

  const renderSessionIcon = (session: UserSession) => {
    if (session.deviceType === 'tablet' || session.browser?.toLowerCase().includes('ipad') || session.browser?.toLowerCase().includes('tablet')) {
      return <Tablet className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    }
    if (session.deviceType === 'mobile' || session.browser?.toLowerCase().includes('iphone') || session.browser?.toLowerCase().includes('android')) {
      return <Smartphone className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    }
    return <Laptop className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
  };

  // Active Sessions States
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)

  // Dropdown UI Toggles
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)

  // Constant list collections
  const timezones = ["Africa/Lagos", "America/New_York", "Europe/London", "Asia/Tokyo"]
  const languages = ["English", "French", "Spanish", "German"]

  // Populate form fields once user context is loaded
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "")
      setEmail(user.email || "")
      setPhoneVal(user.phone || "")
      setTimezone(user.timezone || "America/New_York")
      setLanguage(user.language || "English")
      setProfileImage(user.avatarUrl)
    }
  }, [user])

  // Fetch active database sessions
  const fetchSessions = React.useCallback(async () => {
    setIsLoadingSessions(true)
    try {
      const res = await fetch("/api/v1/auth/sessions")
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
          jobTitle: user?.jobTitle || "",
          timezone,
          language,
          avatarUrl: profileImage,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        await refreshUser() // Refresh global user context
        setStatusType("success")
        setStatusTitle("Profile Updated")
        setStatusMessage("Your personal account settings have been successfully updated.")
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

  // Handles updating the password (PUT)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 8) {
      setStatusType("error")
      setStatusTitle("Password Constraint")
      setStatusMessage("New password must be at least 8 characters long.")
      setShowStatus(true)
      return
    }

    if (newPassword !== confirmPassword) {
      setStatusType("error")
      setStatusTitle("Matching Error")
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
          
          // Auto-save the updated avatar directly to DB for instant feedback
          await fetch("/api/v1/auth/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ avatarUrl: data.secure_url }),
          })
          await refreshUser()

          setStatusType("success")
          setStatusTitle("Photo Uploaded")
          setStatusMessage("Your profile picture has been successfully uploaded to Cloudinary.")
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

  // Irreversible Delete Account Action
  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure you want to delete your account? This action is irreversible.")) {
      return
    }

    try {
      const res = await fetch("/api/v1/auth/profile", {
        method: "DELETE",
      })

      if (res.ok) {
        setStatusType("success")
        setStatusTitle("Account Deleted")
        setStatusMessage("Your account has been deleted. Redirecting...")
        setShowStatus(true)
        setTimeout(() => {
          router.push("/sign-in")
        }, 2000)
      } else {
        setStatusType("error")
        setStatusTitle("Deletion Failed")
        setStatusMessage("Unable to delete account at this time.")
        setShowStatus(true)
      }
    } catch (err) {
      console.error(err)
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Admin Profile
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Manage your personal account settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column (Profile & Personal Info) */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          
          {/* Profile Overview */}
          <div className="bg-white dark:bg-[#150a2e] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                Profile Overview
              </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="relative w-28 h-28 rounded-full bg-purple-100 flex items-center justify-center border-4 border-white dark:border-white/10 shadow-lg overflow-hidden group">
                  {profileImage ? (
                    <Image src={profileImage} alt="Profile" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-3xl font-black">
                      {fullName ? fullName.slice(0, 2).toUpperCase() : "AU"}
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                  </button>
                </div>
                <label className="px-4 py-1.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/20 rounded-lg text-xs font-bold transition-colors w-full shadow-sm cursor-pointer text-center relative overflow-hidden">
                  <span>Upload Photo</span>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-5 w-full">
                <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{fullName || "Admin User"}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 text-[11px] font-black border border-purple-100 dark:border-purple-900/30 uppercase tracking-widest">
                      <Shield className="w-3 h-3" /> Owner
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span className="font-medium text-slate-600 dark:text-slate-300">{email}</span>
                  </div>
                </div>
              </div>

              {/* Status & Verification */}
              <div className="flex-1 w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/10">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-white/10">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Account Status:</span>
                  <span className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Auth Method:</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 capitalize">
                    {user?.providers && user.providers.length > 0 
                      ? user.providers.join(", ") 
                      : "Password Credentials"
                    }
                  </span>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Profile Completion: <span className="text-slate-900 dark:text-white">90%</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[90%] rounded-full relative">
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -translate-x-full" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 flex justify-end">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black transition-all border border-emerald-100 shadow-sm cursor-pointer disabled:opacity-55"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-[#150a2e] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border bg-white dark:bg-[#150a2e] focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all text-sm sm:text-base text-slate-900 dark:text-white font-medium border-gray-200 dark:border-white/10 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border bg-white dark:bg-[#150a2e] focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all text-sm sm:text-base text-slate-900 dark:text-white font-medium border-gray-200 dark:border-white/10 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight ml-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 803 123 4567"
                  value={phoneVal}
                  onChange={(e) => setPhoneVal(e.target.value.replace(/[^0-9+]/g, ""))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border bg-white dark:bg-[#150a2e] focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all text-sm sm:text-base text-slate-900 dark:text-white font-medium border-gray-200 dark:border-white/10 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2 relative">
                 <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight ml-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Timezone</label>
                 <button 
                   type="button"
                   onClick={() => setIsTimezoneOpen(!isTimezoneOpen)}
                   className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 bg-white dark:bg-[#150a2e] text-sm sm:text-base text-slate-900 dark:text-white font-medium flex items-center justify-between group h-[40px] sm:h-[48px] cursor-pointer"
                 >
                    <span className="truncate">{timezone}</span>
                    <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform shrink-0", isTimezoneOpen ? "rotate-90" : "")} />
                 </button>
                 {isTimezoneOpen && (
                   <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-[#150a2e] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                      {timezones.map((tz) => (
                        <button
                          key={tz}
                          type="button"
                          onClick={() => {
                            setTimezone(tz);
                            setIsTimezoneOpen(false);
                          }}
                          className={cn(
                            "w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer",
                            timezone === tz ? "text-purple-600 bg-purple-50/50" : "text-slate-600 dark:text-slate-300"
                          )}
                        >
                          {tz}
                        </button>
                      ))}
                   </div>
                 )}
              </div>

              <div className="space-y-1.5 sm:space-y-2 relative">
                 <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight ml-1 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Language</label>
                 <button 
                   type="button"
                   onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                   className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-purple-600 bg-white dark:bg-[#150a2e] text-sm sm:text-base text-slate-900 dark:text-white font-medium flex items-center justify-between group h-[40px] sm:h-[48px] cursor-pointer"
                 >
                    <span className="truncate">{language}</span>
                    <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform shrink-0", isLanguageOpen ? "rotate-90" : "")} />
                 </button>
                 {isLanguageOpen && (
                   <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-[#150a2e] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setLanguage(lang);
                            setIsLanguageOpen(false);
                          }}
                          className={cn(
                            "w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer",
                            language === lang ? "text-purple-600 bg-purple-50/50" : "text-slate-600 dark:text-slate-300"
                          )}
                        >
                          {lang}
                        </button>
                      ))}
                   </div>
                 )}
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-6 border-t border-slate-100 dark:border-white/10">
              <button 
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer disabled:opacity-55"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Security & Auth) */}
        <div className="lg:col-span-1 space-y-6 lg:space-y-8">
          
          {/* Security & Authentication */}
          <div className="bg-white dark:bg-[#150a2e] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl -z-10" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
              Security & Authentication
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              {/* Show Current Password field only if they already set a password hash */}
              {user?.hasPassword ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Password</label>
                    <Link href="/forgot-password" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
                      Forgot password?
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
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 focus:bg-white dark:bg-[#150a2e] focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-medium text-slate-900 dark:text-white shadow-sm text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-xs font-medium text-purple-700 dark:text-purple-400">
                  You signed in via OAuth. Create a password below to allow direct email sign-in.
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 focus:bg-white dark:bg-[#150a2e] focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-medium text-slate-900 dark:text-white shadow-sm text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Confirm New Password</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 focus:bg-white dark:bg-[#150a2e] focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-medium text-slate-900 dark:text-white shadow-sm text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 mt-6 flex items-center justify-between">
                {user?.hasPassword ? (
                  <Link href="/forgot-password" className="text-[11px] font-bold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Reset via email code →
                  </Link>
                ) : <div />}
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-55"
                >
                  {isUpdatingPassword ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : user?.hasPassword ? (
                    "Update Password"
                  ) : (
                    "Create Password"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Active Sessions */}
          <div className="bg-white dark:bg-[#150a2e] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
              Active Sessions
            </h3>

            <div className="space-y-4">
              {activeSessions.slice(0, 4).map((session, i) => (
                <div key={session.id || i} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#150a2e] border border-slate-200 dark:border-white/20 flex items-center justify-center shrink-0">
                    {renderSessionIcon(session)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{session.browser || session.name}</h4>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{session.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{session.location || session.ip}</span>
                      {session.isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {activeSessions.length === 0 && !isLoadingSessions && (
                <div className="text-center py-6 text-sm text-slate-500 font-medium bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/20">
                  No other active sessions.
                </div>
              )}
              {isLoadingSessions && (
                <div className="text-center py-6 text-sm text-slate-400 font-medium">
                  Loading sessions...
                </div>
              )}
            </div>

            <button 
              onClick={handleLogoutAllOtherSessions}
              disabled={activeSessions.length <= 1}
              className="w-full mt-6 py-3 px-4 bg-slate-50 dark:bg-white/5 hover:bg-purple-50 text-slate-700 dark:text-slate-300 hover:text-purple-600 border border-slate-200 dark:border-white/20 hover:border-purple-200 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer border-dashed disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log Out All Other Sessions
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-50/30 p-6 md:p-8 rounded-2xl border border-rose-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold text-rose-700 tracking-tight">
                Danger Zone
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-rose-100 bg-white dark:bg-[#150a2e]">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Transfer Workspace Ownership</span>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setStatusType("success")
                    setStatusTitle("Workspace Transfer Initiated")
                    setStatusMessage("Instructions to transfer ownership have been sent to your email.")
                    setShowStatus(true)
                  }}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Transfer
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-rose-100 bg-white dark:bg-[#150a2e]">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-bold text-rose-600">Delete Account</span>
                </div>
                <button 
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
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
